import { getArticleById, getArticlesByCategory } from "./funcs/shared.js"
import { getUrlParam } from "./funcs/utils.js"

window.addEventListener('load', async () => {
    const articleId = getUrlParam('id')

    const breadcumbSpan = document.querySelector('#breadcumb span')
    const articleTitle = document.querySelector('#article-title')
    const articleBody = document.querySelector('#article-body')
    const sameArticles = document.querySelector('#same-articles')


    getArticleById(articleId).then(article => {
        document.title = article.title
        breadcumbSpan.innerHTML = article.title
        articleTitle.innerHTML = article.title
        articleBody.innerHTML = article.body
        getArticlesByCategory(article.categories[0]).then(articles => {
            articles.map(article => {
                sameArticles.innerHTML += `<a href="article.html?id=${article._id}">${article.title}</a>`
            })
        })
    })


})