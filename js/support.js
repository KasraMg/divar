import { getArticles } from "./funcs/shared.js"

window.addEventListener('load', () => {
    const generalArticles = document.querySelector('#general-articles')
    const articlesContainer = document.querySelector('#categories-container')
    getArticles().then(data => {
        console.log(data);

        const popularCategory = data.data.categories.find(category => category.shortName === "popular_articles");

        popularCategory.articles.map(article => {
            generalArticles.insertAdjacentHTML('beforeend', `
                <a href="article.html?${article._id}" class="article">
                            <p>${article.title}</p>
                            <span>${article.body.slice(0, 155)}...</span>
                            <div>
                                <i class="bi bi-arrow-left"></i>
                                <p> ادامه مقاله</p>
                            </div>
                        </a> 
                `)
        })

        data.data.categories.map(category => {
            articlesContainer.insertAdjacentHTML('beforeend', `
            <a href="articles.html?id=${category._id}">
            <img src="https://divarapi.liara.run/${category.pic.path}" width="64" height="64" alt="">
            <div>
                <p>${category.name}</p>
                <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از </span>
            </div>
            <i class="bi bi-chevron-left"></i>
        </a>  
            `)
        })
    })
})

