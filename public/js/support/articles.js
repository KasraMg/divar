import { getArticles } from "../../../utlis/shared.js"
import { baseUrl, getUrlParam } from "../../../utlis/utils.js"

window.addEventListener('load', async () => {

    const breadcrumbSpan = document.querySelector('#breadcrumb span')
    const categoryInfo = document.querySelector('#category-info')
    const articles = document.querySelector('#articles')
    const loading = document.querySelector('#loading-container')
    const categoryId = getUrlParam('id')

    getArticles().then(data => {
        loading.style.display='none'
        const category = data.find(category => category._id == categoryId)
        console.log(category);
        breadcrumbSpan.innerHTML = category.name
        document.title = category.name
        categoryInfo.insertAdjacentHTML('beforeend', `
        <img class="category-info-icon"
        src="${baseUrl}/${category.pic.path}"
        alt>
    <p class="category-info-title">${category.name}</p>
        `)

        category.articles.map(article=>{
            articles.insertAdjacentHTML('beforeend', `
            <a href="/pages/support/article.html?id=${article._id}">
            <div>
                <p>${article.title}</p>
                <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش
                    بازدید، استفاده از </span>
            </div>
            <i class="bi bi-chevron-left"></i>
        </a>
            `)
        })
      


    })

})