import { getAndShowPostCategories, getAndShowPosts } from "../../utlis/shared.js";
import { addParamToUrl, getFromLocalStorage, getUrlParam, removeParameterFromURL, baseUrl, calculateTimeDifference, paginateItems } from "../../utlis/utils.js";

window.addEventListener('load', async () => {
    const paginateParentElem = document.querySelector('.pagination-items')
    const categoryId = getUrlParam('categoryId');
    const cityParam = getUrlParam('city');
    const searchValue = getUrlParam('value');
    const cities = getFromLocalStorage('cities')
    let cityIds = cities?.map(obj => obj.id).join('|');

    let posts = null;
    let backupPosts = null;
    let appliedFilters = {};
    let page = getUrlParam('page')
    !page ? page = 1 : null

    const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')

    if (searchValue) {
        const searchInput = document.querySelector('#global_search_input')
        searchInput.value = searchValue
        removeSearchValueIcon.style.display = 'block'
    }

    removeSearchValueIcon.addEventListener('click', () => {
        removeParameterFromURL('value')
    })

    if (!cityParam) {
        if (cities) {
            document.title = `دیوار ${cities[0].title}: مرجع انواع آگهی های نو و دست دوم`
        } else {
            document.title = `دیوار :تهران مرجع انواع آگهی های نو و دست دوم`
        }
    } else {
        document.title = `دیوار ${cities[0].title}: مرجع انواع آگهی های نو و دست دوم`
    }

    const minPriceSelectbox = document.querySelector('#min-price-selectbox');
    const maxPriceSelectbox = document.querySelector('#max-price-selectbox');
    const exchangeControllBtn = document.querySelector('#exchange_controll')
    const justPhotoControllBtn = document.querySelector('#just_photo_controll')
    const loading = document.querySelector('#loading-container')

    function applyFilters(posts) {
        let filteredPosts = backupPosts
        if (posts) {
            filteredPosts = posts;
        }
 
        for (const slug in appliedFilters) {
            filteredPosts = filteredPosts.filter(post => post.dynamicFields.some(fields => fields.slug === slug && fields.data === appliedFilters[slug]));
        }
        posts = filteredPosts;

        const minPrice = minPriceSelectbox.value;
        const maxPrice = maxPriceSelectbox.value;
        if (maxPrice !== 'default') {
            if (minPrice !== 'default') {
                filteredPosts = filteredPosts.filter(post => post.price >= minPrice && post.price <= maxPrice);
            } else {
                filteredPosts = filteredPosts.filter(post => post.price <= maxPrice);
            }
        } else { 
            if (minPrice !== 'default') {
                filteredPosts = filteredPosts.filter(post => post.price >= minPrice);
            }
        }

        if (justPhotoControllBtn.checked) {
            filteredPosts = filteredPosts.filter(post => post.pics.length);
        }
        if (exchangeControllBtn.checked) {
            filteredPosts = filteredPosts.filter(post => post.exchange == true);
        }
        generatePosts(filteredPosts);
    }

    function findSubCategoryById(categories, categoryId) {
        const allSubCategories = categories.flatMap(category => category.subCategories);
        return allSubCategories.find(subCategory => subCategory._id === categoryId);
    }
 
    function createSubCategoryHTML(subCategory) {
        return `
            <li class="${categoryId == subCategory._id ? 'active-subCategory' : ''}" 
                onclick="categoryItemClickHandler('${subCategory._id}')">
                ${subCategory.title}
            </li>
        `;
    }
 
    window.categoryItemClickHandler = (categoryId) => {
        addParamToUrl('categoryId', categoryId);
    };
 
    window.backToAllCategories = () => {
        removeParameterFromURL('categoryId');
        location.reload();
    };
 
    window.selectboxFilterHandler = function (value, slug) { 
        appliedFilters[slug] = value;
        applyFilters();
    };

    const filtersGenerator = (filter) => {
        console.log(filter);
        const sidebarFilters = document.querySelector('#sidebar-filters')
        sidebarFilters.insertAdjacentHTML("beforebegin", `
        ${filter.type == 'checkbox' ? (
                `  <div class="sidebar__filter">
           <label class="switch">  
           <input  onchange="selectboxFilterHandler(event.target.checked,'${filter.slug}')" id="exchange_controll" class="icon-controll" type="checkbox">
               <span class="slider round"></span>
             </label>
             <p>${filter.name}</p>
         </div>
           `
            ) : ''}
        ${filter.type == "selectbox" ? (
                `  
           <div class="accordion accordion-flush" id="accordionFlushExample">
                           <div class="accordion-item">
                             <h2 class="accordion-header" id="accordion-${filter.name}">
                               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-${filter.slug}" aria-expanded="false" aria-controls="accordion-${filter.name}">
                                  <span class="sidebar__filter-title">${filter.name}</span>
                               </button>
                             </h2>
                             <div id="accordion-${filter.slug}" class="accordion-collapse collapse" aria-labelledby="accordion-${filter.name}" data-bs-parent="#accordionFlushExample" style="">
                               <div class="accordion-body">  
                               <select onchange="selectboxFilterHandler(event.target.value,'${filter.slug}')"   class="selectbox" id="">
                               ${filter.options.map(option => (
                    `   <option value="${option}">${option}</option>`
                ))} 
                           </select>
                               </div>
                             </div>
                           </div>  
                           </div>  
           `
            ) : ''}
           `)
    }
  
    getAndShowPostCategories().then(categories => {
        const categoriesContainer = document.querySelector('#categories-container');
        loading.style.display = 'none'       
        window.backToAllCategories = () => {
            removeParameterFromURL('categoryId');
            location.reload();
        };
 
        window.categoryItemClickHandler = (categoryId) => {
            addParamToUrl('categoryId', categoryId);
        };

        if (categoryId) {
            const categoryInfoes = categories.filter(category => category._id == categoryId);
            if (!categoryInfoes.length) {
                const subCategory = findSubCategoryById(categories, categoryId);
                if (subCategory) { 
                    subCategory.filters.map(filter => {
                        filtersGenerator(filter)
                    })

                    categoriesContainer.insertAdjacentHTML('beforeend', `
                    <div class="all-categories" onclick="backToAllCategories()"> 
                        <p>همه اگهی ها</p> 
                        <i class="bi bi-arrow-right"></i> 
                    </div> 
                    <div class="sidebar__category-link active-category" id="category-${subCategory._id}" href="#"> 
                        <div class="sidebar__category-link_details"> 
                            <i class="sidebar__category-icon bi bi-house"></i> 
                            <p>${subCategory.title}</p> 
                        </div>  
                        <ul class="subCategory-list"> 
                            ${subCategory.subCategories ? subCategory.subCategories.map(createSubCategoryHTML).join('') : ''}
                        </ul> 
                    </div>
                `);
                } 
                else {
                    let filteredObjects = null;
                    function findObjects(categoryObj, categoryId) {
                        if (categoryObj._id === categoryId) { 
                            filteredObjects = categoryObj
                        }
                        if (categoryObj.subCategories) {
                            categoryObj.subCategories.forEach(subObj => findObjects(subObj, categoryId));
                        }
                    }

                    categories.forEach(categoryObj => findObjects(categoryObj, categoryId)); 
                    const subCategory = findSubCategoryById(categories, filteredObjects.parent); 
                    filteredObjects.filters.map(filter => {
                        filtersGenerator(filter)
                    })

                    categoriesContainer.insertAdjacentHTML('beforeend', `
                    <div class="all-categories" onclick="backToAllCategories()">
                        <p>همه اگهی ها</p>
                        <i class="bi bi-arrow-right"></i>
                    </div>
                    <div class="sidebar__category-link active-category" id="category-${subCategory._id}" href="#">
                        <div onclick="categoryItemClickHandler('${subCategory._id}')" class="sidebar__category-link_details">
                            <i class="sidebar__category-icon bi bi-house"></i>
                            <p>${subCategory.title}</p>
                        </div>
                        <ul class="subCategory-list">
                            ${subCategory.subCategories.map(createSubCategoryHTML).join('')}
                        </ul>
                    </div>
                `);
                }
            } else { 
                categoryInfoes[0].filters?.map(filter => {
                    filtersGenerator(filter)
                })

                categoryInfoes.forEach(category => {
                    categoriesContainer.insertAdjacentHTML('beforeend', `
                    <div class="all-categories" onclick="backToAllCategories()">
                        <p>همه اگهی ها</p>
                        <i class="bi bi-arrow-right"></i>
                    </div>
                    <div class="sidebar__category-link active-category" id="category-${category._id}" href="#">
                        <div class="sidebar__category-link_details">
                            <i class="sidebar__category-icon bi bi-house"></i>
                            <p>${category.title}</p>
                        </div>
                        <ul class="subCategory-list">
                            ${category.subCategories.map(createSubCategoryHTML).join('')}
                        </ul>
                    </div>
                `);
                });
            }
        } else {
            categoriesContainer.innerHTML = '';
            categories.forEach(category => {
                categoriesContainer.insertAdjacentHTML('beforeend', `
                <div class="sidebar__category-link" id="category-${category._id}" href="#">
                    <div onclick="categoryItemClickHandler('${category._id}')" class="sidebar__category-link_details">
                        <i class="sidebar__category-icon bi bi-house"></i>
                        <p>${category.title}</p>
                    </div>
                </div>
            `);
            });
        }
    });
 
    getAndShowPosts(cityIds,page).then(data => {  
        paginateItems('/pages/posts.html', paginateParentElem, page, data.data.pagination.totalPosts, 9)
        posts = data.data.posts;
        backupPosts = data.data.posts;
        generatePosts(posts);
    });

 
    const generatePosts = (posts) => {
        const postsContainer = document.querySelector('#posts-container');
        postsContainer.innerHTML = '';
        if (posts.length) {
            posts.forEach(post => {
                const date = calculateTimeDifference(post.createdAt)
                postsContainer.insertAdjacentHTML('beforeend', `
                <div class="col-4">
                    <a href="post.html?id=${post._id}" class="product-card">
                        <div class="product-card__right">
                            <div class="product-card__right-top">
                                <p class="product-card__link">${post.title}</p>
                            </div>
                            <div class="product-card__right-bottom">
                                <span class="product-card__condition">${post.dynamicFields[0].data}</span>
                                <span class="product-card__price">${post.price == 0 ? "توافقی" : post.price.toLocaleString() + "تومان"} </span>
                                <span class="product-card__time">${date}</span>
                            </div>
                        </div>
                        <div class="product-card__left"> 
                            ${post.pics.length ? (
                        `<img class="product-card__img img-fluid" src="${baseUrl}/${post.pics[0].path}"></img>`
                    ) : (
                        `<img class="product-card__img img-fluid" src="/public/images/main/noPicture.PNG"></img>`
                    )}
                        </div>
                    </a>
                </div>
            `);
            });
        } else {
            postsContainer.insertAdjacentHTML("beforeend", `
            '<div class="empty">
            <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg"/>
           <p>نتیجه‌ای با مشخصات مورد نظر شما پیدا نشد.</p>
            <button onclick="location.reload()">حذف فیلتر ها</button>
            </div>'
            `);
        }
    };
 
    minPriceSelectbox.addEventListener('change', event => {
        applyFilters(posts)
    });
 
    maxPriceSelectbox.addEventListener('change', event => {
        applyFilters(posts)
    });

 
    justPhotoControllBtn.addEventListener('click', () => {
        applyFilters(posts)
    });
 
    exchangeControllBtn.addEventListener('click', () => {
        applyFilters(posts)
    });
});