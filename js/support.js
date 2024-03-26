import { getArticles } from "./funcs/shared.js"

window.addEventListener('load', () => {
    const generalArticles = document.querySelector('#general-articles')
    getArticles().then(data => {
        console.log(data);

      const generalCategory = data.data.categories.find(category => category.name === "عمومی");
          
        generalCategory.articles.map(article => {
            generalArticles.insertAdjacentHTML('beforeend', `
                <a href="article.html?${article._id}" class="article">
                            <p>${article.title}</p>
                            <span>${article.body.slice(0,155)}...</span>
                            <div>
                                <i class="bi bi-arrow-left"></i>
                                <p> ادامه مقاله</p>
                            </div>
                        </a> 
                `)
        })
    })
})

