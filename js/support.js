import { getArticles } from "./funcs/shared.js"

window.addEventListener('load', () => {

    getArticles().then(categories => {
        console.log(categories);
        const generalArticles = document.querySelector('#general-articles')
        const articlesContainer = document.querySelector('#categories-container')
        const popularCategory = categories.find(category => category.shortName === "popular_articles");

        popularCategory.articles.map(article => {
            generalArticles.insertAdjacentHTML('beforeend', `
                <a href="/support/article.html?id=${article._id}" class="article">
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
            <a href="/support/articles.html?id=${category._id}">
            <img src="https://divarapi.liara.run/${category.pic.path}" width="64" height="64" alt="">
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
                let filteredResult = articlesArray.filter(article => article.title.includes(event.target.value))
                searchResult.classList.add('active')
                removeIcon.classList.add('active')
                if (filteredResult.length) {
                    searchResult.innerHTML = '' 
                    filteredResult.map(result => {
                        searchResult.insertAdjacentHTML("beforeend", `
                            <a href="/support/article.html?id=${result._id}">
                            <i class="bi bi-card-text"></i>
                            ${result.title}
                            </a>
                            `)
                    }) 
                } else {
                    searchResult.innerHTML = '<p class="empty">مقاله ای یافت نشد</p>'
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

