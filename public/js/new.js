import { baseUrl, isLogin } from "../../utlis/utils.js"


window.addEventListener('load', async () => {
    const searchResultContainer = document.querySelector('#result-container')
    const searchInput = document.querySelector('#search-input')
    const removeIcon = document.querySelector('#remove-icon')
    const showCategoies = document.querySelector('#show-categoies')
    const categoriesContainer = document.querySelector('#categories-container')
    const guideContainer = document.querySelector('#guide-container') 
    const categories = document.querySelector('#categories')
    const descriptionCheckbox = document.querySelector('#description-checkbox')

    const isUserLogin = await isLogin()
    if (!isUserLogin) {
        location.href = '/pages/posts.html'
    }


    showCategoies.addEventListener('click', () => {
        categoriesContainer.classList.add('active')
        showCategoies.classList.remove('active')
    })


    window.backToAllCategories = () => {
        generateItem(categoriesData.data.categories)
        guideContainer.style.display = 'flex'
    }
 

    const generateItem = (categoriesData, title, id) => {
        categories.innerHTML = '' 
        if (title) {
            categories.insertAdjacentHTML('beforeend', `
                <div class="back" onclick="${id ? `itemClickHandler('${id}')` : `backToAllCategories()`}">
                <i class="bi bi-arrow-right"></i>
                <p> بازگشت به ${title} </p>
                </div>
            `)
        }

        categoriesData.map(category => {
            categories.insertAdjacentHTML('beforeend', `
            <div class="box" onclick="itemClickHandler('${category._id}')">
            <div class="details">
            <div>
            <i class="bi bi-house-door"></i>
            <p>${category.title}</p>
            </div>
            ${descriptionCheckbox.checked ? (`
            <span>${category.description}</span> 
            `) : ""}
            </div>
            <i class="bi bi-chevron-left"></i> 
            </div> 
           
            `)
        })

    }

    window.itemClickHandler = (categoryId) => {
        categoryId = categoryId
        guideContainer.style.display = 'none'
        const category = categoriesData.data.categories.find(category => category._id == categoryId)
        if (category) {
            generateItem(category.subCategories, 'همه دسته ها', null)
        } else {
            const allSubCategories = categoriesData.data.categories.flatMap(category => category.subCategories);
            const subcategory = allSubCategories.find(subCategory => subCategory._id === categoryId);
            if (subcategory) {
                generateItem(subcategory.subCategories, subcategory.title, subcategory.parent)
            } else {
                location.href = `/pages/new/registerPost.html?subCategoryId=${categoryId}`
            }
        }

    }

    const categoriesRes = await fetch(`${baseUrl}/v1/category/`)
    const categoriesData = await categoriesRes.json()
    generateItem(categoriesData.data.categories)


    descriptionCheckbox.addEventListener('click', () => {
        generateItem(categoriesData.data.categories)

    })


    const subCategoriesRes = await fetch(`${baseUrl}/v1/category/sub`)
    const subCategoriesData = await subCategoriesRes.json()
    console.log(subCategoriesData);

    searchInput.addEventListener('keyup', (event) => {
        if (event.target.value.length) {
           console.log(subCategoriesData.data.categories);
            let filteredResult = subCategoriesData.data.categories.filter(subCategory => subCategory.title.includes(event.target.value))
            searchResultContainer.classList.add('active')
            removeIcon.classList.add('active')
            if (filteredResult.length) {
                searchResultContainer.innerHTML = '' 
                filteredResult.map(result => {
                    searchResultContainer.insertAdjacentHTML("beforeend", ` 
                        <a href="/pages/new/registerPost.html?subCategoryId=${result._id}" class="search-result">
                        <p>${result.title}</p> 
                        <i class="bi bi-chevron-left"></i> 
                        </a> 
                        `)
                })
            } else {
                searchResultContainer.innerHTML = ''
                searchResultContainer.insertAdjacentHTML('beforeend', `
          <div class="empty">
          <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" >
          <p>نتیجه‌ای برای جستجوی شما پیدا نشد.</p>
          </div>
                `)
            }
        } else {
            searchResultContainer.classList.remove('active')
            removeIcon.classList.remove('active')
            searchResultContainer.innerHTML = ''
        }

    })
    removeIcon.addEventListener('click', () => {
        searchInput.value = ''
        searchResultContainer.classList.remove('active')
        removeIcon.classList.remove('active')

    })


})