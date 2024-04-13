import { baseUrl, getUrlParam } from "../../../utlis/utils.js"

window.addEventListener('load', async () => {
    const loading = document.querySelector('#loading-container')
    const key = getUrlParam('key')
    const res = await fetch(`${baseUrl}/v1/support/articles/search?s=${key}`)
    const data = await res.json() 
    loading.style.display='none'
    const searchResults = document.querySelector('#search-results')
    const searchTitleSpan = document.querySelector('.search-title span')
    searchTitleSpan.innerHTML=`«${key}»`

    if (data.data.articles.length) {
        data.data.articles.map(article => {
            searchResults.insertAdjacentHTML('beforeend', `
            <a href="/pages/support/article.html?id=${article._id}">
            <div>
                <p>${article.title}</p> 
            </div>
            <i class="bi bi-chevron-left"></i>
        </a>
            `)
        })
    } else {
        searchResults.insertAdjacentHTML('beforeend', `
        <img
        src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg"
        alt>
    <p>نتیجه ای برای جستجو شما پیدا نشد.</p>
    <span> پیشنهاد میکنیم:</span>
    <span>نگارش کلمات خود را بررسی کنید؛</span>
    <span>کلمات کلیدی دیگری را انتخاب کنید؛</span> 
        `)
    }

})