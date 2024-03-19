
import { getMe } from "../funcs/auth.js"
import { getFromLocalStorage, getUrlParam, isLogin, saveIntoLocalStorage } from "./utils.js";

const getAndShowSocialMedia = async () => {
    const SocialMediaContainer = document.querySelector('#footer__social-media')
    const res = await fetch(`https://divarapi.liara.run/v1/social/`);
    const social = await res.json();
    social.data.socials.map(data => {
        SocialMediaContainer?.insertAdjacentHTML("beforeend", `
        <a class="sidebar__icon-link" href="${data.link}">
        <img width="18px" height="18px" src="${data.icon}" class="sidebar__icon bi bi-twitter"></img>
        </a>
        `)
    })


}

const showPannelLinksToUser = async () => {
    const dropDown = document.querySelector(".header_dropdown_menu");
    const isUserLogin = isLogin();
    if (isUserLogin) {
        getMe().then((data) => {
            if (data.status == 200) {
                dropDown.innerHTML = ''
                dropDown.insertAdjacentHTML('beforeend', ` 
                    <li class="header__left-dropdown-item header_dropdown-item_account">
                        <div class="header__left-dropdown-link login_dropdown_link"> 
                           <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                           <div> 
                           <span>کاربر دیوار </span>
                           <p> تلفن 09046417084</p> 
                           </div>
                        </div>
                      
                    </li>
                    <li class="header__left-dropdown-item">
                    <a class="header__left-dropdown-link" href="#">
                        <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                        تایید هویت
                    </a>
                </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                            نشان ها
                        </a>
                    </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-journal"></i>
                            یادداشت ها
                        </a>
                    </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                            بازدید های اخیر
                        </a>
                    </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-shop"></i>
                            دیوار برای کسب و کارها
                        </a>
                    </li>
                    <li class="header__left-dropdown-item logout-link login_btn">
                    <p class="header__left-dropdown-link" href="#">
                        <i class="header__left-dropdown-icon bi bi-shop"></i>
                        خروج
                    </p>
                </li> 
                  `)
            }
        });
    } else {
        dropDown.insertAdjacentHTML('beforeend', ` 
    
        <li class="header__left-dropdown-item">
            <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
                <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                ورود
            </span>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                نشان ها
            </a>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-journal"></i>
                یادداشت ها
            </a>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                بازدید های اخیر
            </a>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-shop"></i>
                دیوار برای کسب و کارها
            </a>
        </li> 
      `);
    }
};

const getAndShowPostCategories = async () => {
    const res = await fetch("https://divarapi.liara.run/v1/category/")
    const categories = await res.json()
    return categories
}
const getAndShowArticleCategories = async () => {
    const res = await fetch("https://divarapi.liara.run/v1/support/categories")
    const categories = await res.json()
    return categories
}
const getAndShowPosts = async () => {
    const cityId = getUrlParam("city");
    const categoryId = getUrlParam('categoryId');
    const searchValue = getUrlParam('value')
    const priceValue = getUrlParam('price')

    let url = `https://divarapi.liara.run/v1/post/?city=${cityId}`;
    if (categoryId) {
        url += `&categoryId=${categoryId};`
    }
    if (searchValue) {
        url += `&search=${searchValue};`
    }
    if (priceValue) {
        url += `&price=${priceValue};`
    }
    const res = await fetch(url);
    const posts = await res.json();
    return posts;
};

const getAllCitiesHandler = async () => {
    const res = await fetch(`https://divarapi.liara.run/v1/location/`);
    const cities = await res.json();
    return cities
}

const getAndShowHeaderCityTitle = () => {
    const headerCityTitle = document.querySelector('#header-city-title')
    const cities = getFromLocalStorage('cities')
    if (headerCityTitle) {
        if (!cities) {
            saveIntoLocalStorage('cities', [{ title: 'تهران', id: 301 }])
            const cities = getFromLocalStorage('cities')
            headerCityTitle.innerHTML = cities[0].title
        } else {
            if (cities.length == 1) {
                headerCityTitle.innerHTML = cities[0].title
            } else {
                headerCityTitle.innerHTML = `${cities.length} شهر`
            }
        }
    }

}

const getCourseDetails = async () => {
    const productId = getUrlParam('id')
    const res = await fetch(`https://divarapi.liara.run/v1/post/${productId}`)
    const data = await res.json()
    console.log(data);
}


export {
    getAndShowSocialMedia,
    showPannelLinksToUser,
    getAndShowPostCategories,
    getAndShowPosts,
    getAndShowArticleCategories,
    getAllCitiesHandler,
    getAndShowHeaderCityTitle,
    getCourseDetails
};
