import { getArticles } from "../funcs/shared.js"
import { getUrlParam } from "../funcs/utils.js"

window.addEventListener('load', async () => {

    const breadcrumbSpan = document.querySelector('#breadcrumb span')
    const categoryInfo = document.querySelector('#category-info')
    const articles = document.querySelector('#articles')

    const categoryId = getUrlParam('id')

    getArticles().then(data => {
        const category = data.data.categories.find(category => category._id == categoryId)
        console.log(category);
        breadcrumbSpan.innerHTML = category.name
        document.title = category.name
        categoryInfo.insertAdjacentHTML('beforeend', `
        <img class="category-info-icon"
        src="https://divarapi.liara.run/${category.pic.path}"
        alt>
    <p class="category-info-title">${category.name}</p>
        `)

        category.articles.map(article=>{
            articles.insertAdjacentHTML('beforeend', `
            <a href="/support/article.html?id=${article._id}">
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