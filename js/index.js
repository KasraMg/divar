import { getAllCitiesHandler } from "./funcs/shared.js"
import { saveIntoLocalStorage } from "./funcs/utils.js"

window.addEventListener('load', () => {
    const loading = document.querySelector('#loading-container')
   
    getAllCitiesHandler().then(data => {
        loading.style.display='none'
        const searchInput = document.querySelector('#search-input')
        const searchResult = document.querySelector('.search-result-cities')
        const popularCitiesContainer = document.querySelector('#popular-cities')
        searchInput.addEventListener('keyup', (event) => {
            if (event.target.value.length) {
                searchResult.classList.add('active')

                let filteredResult = data.data.cities.filter(city => city.name.includes(event.target.value))
                if (filteredResult.length) {
                    searchResult.innerHTML = ''
                    filteredResult.map(result => {
                        searchResult.innerHTML += `<li onclick="cityItemClickHandler('${result.name}','${result.id}')">${result.name}</li>`
                    })
                } else {
                    searchResult.innerHTML = ''
                    searchResult.insertAdjacentHTML('beforeend', `
                    <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" >
                    <p class="empty">نتیجه‌ای برای جستجوی شما پیدا نشد.</p>
                    `)
                }
            } else {
                searchResult.classList.remove('active')
            }
        }) 
        const popularCities = data.data.cities.filter(city => city.popular)
        console.log(popularCities);
        popularCities.map(city => {
            popularCitiesContainer.insertAdjacentHTML('beforeend', `
            <li class="main__cities-item">
            <p  onclick="cityItemClickHandler('${city.name}','${city.id}')" class="main__cities-link">${city.name}</p>
          </li>
            `)
        })

        window.cityItemClickHandler = function (cityName, cityId) {
            saveIntoLocalStorage('cities', [{ title: cityName, id: cityId }])
            location.href = '/posts.html'
        }
    })
})