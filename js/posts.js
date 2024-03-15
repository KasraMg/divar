import { getAndShowCategories, getAndShowCategoryPosts } from "./funcs/shared.js"
import { addParamToUrl, getFromLocalStorage, getUrlParam, removeParameterFromURL, saveIntoLocalStorage } from "./funcs/utils.js"

window.addEventListener('load', () => {
    const categoryId = getUrlParam('categoryId');
    const searchValue = getUrlParam('value')
    const priceValue = getUrlParam('price')
    // const citySelect = getFromLocalStorage("cities")

    // let ids = citySelect.map(obj => obj.id).join('|'); 
    // addParamToUrl('city',ids)

    if (searchValue) {
        const searchInput = document.querySelector('#global_search_input')
        searchInput.value = searchValue
    }

    function findSubCategoryById(categories, categoryId) {
        const allSubCategories = categories.flatMap(category => category.subCategories);
        return allSubCategories.find(subCategory => subCategory._id === categoryId);
    }

    // تابعی برای ایجاد HTML برای زیردسته‌ها
    function createSubCategoryHTML(subCategory) {
        return `
        <li class="${categoryId == subCategory._id ? 'active-subCategory' : ''}" 
            onclick="categoryItemClickHandler('${subCategory._id}')">
            ${subCategory.title}
        </li>
    `;
    }

    getAndShowCategories().then(data => {
        const categoriesContainer = document.querySelector('#categories-container');

        // تابعی برای بازگشت به تمام دسته‌بندی‌ها
        window.backToAllCategories = () => {
            removeParameterFromURL('categoryId');
            location.reload();
        };

        // تابعی برای ست کردن ایدی کتگوری یا ساب کتگوری در url
        window.categoryItemClickHandler = (categoryId) => {
            addParamToUrl('categoryId', categoryId);
        };



        if (location.href.includes('categoryId')) {
            const categoryInfoes = data.data.categories.filter(category => category._id == categoryId);
            if (!categoryInfoes.length) {
                const subCategory = findSubCategoryById(data.data.categories, categoryId);
                if (subCategory) {
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
                } else {
                    const filteredObjects = [];
                    function findObjects(categoryObj, categoryId) {
                        if (categoryObj._id === categoryId) {
                            filteredObjects.push(categoryObj);
                        }
                        if (categoryObj.subCategories) {
                            categoryObj.subCategories.forEach(subObj => findObjects(subObj, categoryId));
                        }
                    }
                    data.data.categories.forEach(categoryObj => findObjects(categoryObj, categoryId));
                    const subSubCategory = findSubCategoryById(data.data.categories, filteredObjects[0].parent);
                    categoriesContainer.insertAdjacentHTML('beforeend', `
                    <div class="all-categories" onclick="backToAllCategories()">
                        <p>همه اگهی ها</p>
                        <i class="bi bi-arrow-right"></i>
                    </div>
                    <div class="sidebar__category-link active-category" id="category-${subSubCategory._id}" href="#">
                        <div onclick="categoryItemClickHandler('${subSubCategory._id}')" class="sidebar__category-link_details">
                            <i class="sidebar__category-icon bi bi-house"></i>
                            <p>${subSubCategory.title}</p>
                        </div>
                        <ul class="subCategory-list">
                            ${subSubCategory.subCategories.map(createSubCategoryHTML).join('')}
                        </ul>
                    </div>
                `);
                }
            } else {
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
            data.data.categories.forEach(category => {
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




    getAndShowCategoryPosts().then(data => {
        console.log(data);
        const postsContainer = document.querySelector('#posts-container')

        if (data.data.posts.length) {
            data.data.posts.map(post => { 
                postsContainer.insertAdjacentHTML('beforeend', `
                <div class="col-4">
                                <a href="post.html?id=${post._id}" class="product-card">
                                    <div class="product-card__right">
                                        <div class="product-card__right-top">
                                            <p class="product-card__link">${post.title}</p>
                                        </div>
                                        <div class="product-card__right-bottom">
                                            <span class="product-card__condition">در حد نو</span>
                                            <span class="product-card__price">${post.price.toLocaleString()} تومان</span>
                                            <span class="product-card__time">لحظاتی پیش</span>
                                        </div>
                                    </div>
                                    <div class="product-card__left"> 
                                        <img class="product-card__img img-fluid" src="https://divarapi.liara.run/${post.pics[0].path}"></img>
                                    </div>
                                </a>
                            </div>
            
                `)
            })
        } else {
            postsContainer.innerHTML = '<p class="empty">آگهی یافت نشد</p>'
        }


    })

    const minPriceSelectbox = document.querySelector('#min-price-selectbox')
    const maxPriceSelectbox = document.querySelector('#max-price-selectbox')
    console.log(priceValue);
    if (priceValue) {
        let priceArray = priceValue.split("-");
        let price1 = parseInt(priceArray[0]);
        let price2 = parseInt(priceArray[1]);
        console.log(price2);
        if (price1) {
            minPriceSelectbox.value = price1
        }
        if (price2) {
            maxPriceSelectbox.value = price2
        }

    }


    minPriceSelectbox.addEventListener('change', event => {
        const maxPrice = maxPriceSelectbox.value !== 'default' ? maxPriceSelectbox.value : '';
        addParamToUrl('price', `${event.target.value}-${maxPrice}`);
    });

    maxPriceSelectbox.addEventListener('change', event => {
        const minPrice = minPriceSelectbox.value !== 'default' ? minPriceSelectbox.value : '';
        addParamToUrl('price', `${minPrice}-${event.target.value}`);
    });
})

 