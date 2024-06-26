import { getArticles } from "../../utlis/shared.js"
import { baseUrl } from "../../utlis/utils.js";

window.addEventListener('load', () => {
    const loading = document.querySelector('#loading-container')
    getArticles().then(categories => {
        loading.style.display='none' 
        const  popularArticles = document.querySelector('#popular-articles')
        const articlesContainer = document.querySelector('#categories-container')
        const popularCategory = categories.find(category => category.shortName === "popular_articles");

        popularCategory.articles.map(article => {
             popularArticles.insertAdjacentHTML('beforeend', `
                <a href="/pages/support/article.html?id=${article._id}" class="article">
                            <p>${article.title}</p>
                            <span>${article.body.slice(0, 155)}...</span>
                            <div>
                                <i class="bi bi-arrow-left"></i>
                                <p> ادامه مقاله</p>
                            </div>
                        </a> 
                `)
        })

        categories.map(category => {
            articlesContainer.insertAdjacentHTML('beforeend', `
            <a href="/pages/support/articles.html?id=${category._id}">
            <img src="${baseUrl}/${category.pic.path}" width="64" height="64" alt="">
            <div>
                <p>${category.name}</p>
                <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از </span>
            </div>
            <i class="bi bi-chevron-left"></i>
        </a>  
            `)
        })



        let articlesArray = [];

        categories.forEach(category => {
            let articles = category.articles;
            articlesArray.push(...articles);
        });

        const searchInput = document.querySelector('#search-input')
        const searchResult = document.querySelector('#search-result')
        const removeIcon = document.querySelector('#remove-icon')

        searchInput.addEventListener('keyup', (event) => {
            if (event.target.value.length) {
                if (event.keyCode == 13) {
                    location.href=`/pages/support/search.html?key=${event.target.value}`
                }
                let filteredResult = articlesArray.filter(article => article.title.includes(event.target.value))
                searchResult.classList.add('active')
                removeIcon.classList.add('active')
                if (filteredResult.length) {
                    searchResult.innerHTML = ''
                    searchResult.innerHTML = `<a href="/pages/support/search.html?key=${event.target.value}" > <i class="bi bi-search"></i> ${event.target.value}</a>`
                    filteredResult.map(result => {
                        searchResult.insertAdjacentHTML("beforeend", `
                            <a href="/pages/support/article.html?id=${result._id}">
                            <i class="bi bi-card-text"></i>
                            ${result.title}
                            </a>
                            `)
                    })
                } else {
                    searchResult.innerHTML = `<a href="/pages/support/search.html?key=${event.target.value}" >   <i class="bi bi-search"></i> ${event.target.value}</a>`
                }
            } else {
                searchResult.classList.remove('active')
                removeIcon.classList.remove('active')
                searchResult.innerHTML = ''
            }

        })
        removeIcon.addEventListener('click', () => {
            searchInput.value = ''
            searchResult.classList.remove('active')
            removeIcon.classList.remove('active')

        })

    })



})

