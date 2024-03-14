import { getAndShowCategories, getAndShowCategoryPosts } from "./funcs/shared.js"
import { addParamToUrl, getFromLocalStorage, getUrlParam, removeParameterFromURL, saveIntoLocalStorage } from "./funcs/utils.js"

window.addEventListener('load', () => {
    const categoryId = getUrlParam('categoryId');
function findSubCategoryById(categories, categoryId) {
    const allSubCategories = categories.flatMap(category => category.subCategories);
    return allSubCategories.find(subCategory => subCategory._id === categoryId);
}

// تابعی برای ایجاد HTML برای زیردسته‌ها
function createSubCategoryHTML(subCategory) {
    return `
        <li class="${categoryId == subCategory._id ? 'active-subCategory' : ''}" 
            onclick="subCategoryItemClickHandler('${subCategory._id}')">
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

    // تابعی برای باز کردن یک دسته بندی
    window.categoryItemClickHandler = (categoryId) => {
        addParamToUrl('categoryId', categoryId);
    };

    // تابعی برای باز کردن یک زیردسته
    window.subCategoryItemClickHandler = (subCategoryId) => {
        addParamToUrl('categoryId', subCategoryId);
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
                        <div onclick="subCategoryItemClickHandler('${subSubCategory._id}')" class="sidebar__category-link_details">
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
        const postsContainer = document.querySelector('#posts-container')
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
                                        <span class="product-card__price">${post.price} تومان</span>
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

    })
})