
import { getMe } from "./auth.js"
import { baseUrl, getFromLocalStorage, getToken, getUrlParam, isLogin, saveIntoLocalStorage, showModal } from "./utils.js";

const token = getToken()

const getAndShowSocialMedia = async () => {
    const SocialMediaContainer = document.querySelector('#footer__social-media')
    const res = await fetch(`${baseUrl}/v1/social/`);
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
    const userLogin = await isLogin();
    if (dropDown) {
        if (userLogin) {
            getMe().then((data) => { 
                dropDown.innerHTML = ''
                dropDown.insertAdjacentHTML('beforeend', ` 
                        <li class="header__left-dropdown-item header_dropdown-item_account">
                            <a href="/pages/userPanel/posts.html" class="header__left-dropdown-link login_dropdown_link"> 
                               <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                               <div> 
                               <span>کاربر دیوار </span>
                               <p> تلفن ${data.phone}</p> 
                               </div>
                            </a>
                          
                        </li>
                        <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="/pages/userPanel/verify.html">
                            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                            تایید هویت
                        </a>
                    </li>
                        <li class="header__left-dropdown-item">
                            <a class="header__left-dropdown-link" href="/pages/userPanel/bookmarks.html">
                                <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                                نشان ها
                            </a>
                        </li>
                        <li class="header__left-dropdown-item">
                            <a class="header__left-dropdown-link" href="/pages/userPanel/notes.html">
                                <i class="header__left-dropdown-icon bi bi-journal"></i>
                                یادداشت ها
                            </a>
                        </li>  
                        <li class="header__left-dropdown-item logout-link" id="login_btn">
                        <p class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-shop"></i>
                            خروج
                        </p>
                    </li> 
                      `)

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
                <div class="header__left-dropdown-link" href="#">
                    <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                    نشان ها
                </div>
            </li>
            <li class="header__left-dropdown-item">
                <div class="header__left-dropdown-link" href="#">
                    <i class="header__left-dropdown-icon bi bi-journal"></i>
                    یادداشت ها
                </div>
            </li>
            <li class="header__left-dropdown-item">
                <div class="header__left-dropdown-link" href="#">
                    <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                    بازدید های اخیر
                </div>
            </li> 
          `);
            dropDown.addEventListener('click', () => {
                showModal('login-modal', 'login-modal--active')
            })
        }
    }

};

const getAndShowPostCategories = async () => {
    const res = await fetch(`${baseUrl}/v1/category/`)
    const data = await res.json()
    return data.data.categories
}

const getAndShowArticleCategories = async () => {
    const res = await fetch(`${baseUrl}/v1/support/categories`)
    const categories = await res.json()
    return categories
}

const getAndShowPosts = async (cityIds) => { 
    const categoryId = getUrlParam('categoryId');
    const searchValue = getUrlParam('value')

    let url = `${baseUrl}/v1/post/?city=${cityIds}`;
    if (categoryId) {
        url += `&categoryId=${categoryId};`
    }
    if (searchValue) {
        url += `&search=${searchValue};`
    }
    const res = await fetch(url);
    const data = await res.json(); 
    return data.data.posts;
};

const getAllCitiesHandler = async () => {
    const res = await fetch(`${baseUrl}/v1/location/`);
    const data = await res.json(); 
    return data.data
}

const getAndShowHeaderCityTitle = () => {
    const headerCityModalTitle = document.querySelector('#header-city-title')
    const cities = getFromLocalStorage('cities')
    if (headerCityModalTitle) {
        if (!cities) {
            saveIntoLocalStorage('cities', [{ title: 'تهران', id: 301 }])
            const cities = getFromLocalStorage('cities')
            headerCityModalTitle.innerHTML = cities[0].title
        } else {
            if (cities.length == 1) {
                headerCityModalTitle.innerHTML = cities[0].title
            } else {
                headerCityModalTitle.innerHTML = `${cities.length} شهر`
            }
        }
    }

}

const getArticles = async () => {
    const res = await fetch(`${baseUrl}/v1/support/category-articles`)
    const data = await res.json()
    return data.data.categories
}

const getPostDetails = async () => {
    const postId = getUrlParam('id')
    let headers = {
        "Content-Type": "application/json"
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/v1/post/${postId}`, { 
        headers
    })
    const data = await res.json()
    return data.data.post

}

const getUserBookmarks = async (token) => {
    const res = await fetch(`${baseUrl}/v1/user/bookmarks`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    return data
}

const getArticlesByCategory = async (categoryId) => {
    const res = await fetch(`${baseUrl}/v1/support/categories/${categoryId}/articles`)
    const data = await res.json()
    return data.data.articles
}

const getArticleById = async (articleId) => {
    const res = await fetch(`${baseUrl}/v1/support/articles/${articleId}`)
    const data = await res.json()
    return data.data.article
}

export {
    getAndShowSocialMedia,
    showPannelLinksToUser,
    getArticlesByCategory,
    getAndShowPostCategories,
    getArticleById,
    getUserBookmarks,
    getArticles,
    getAndShowPosts,
    getAndShowArticleCategories,
    getAllCitiesHandler,
    getAndShowHeaderCityTitle,
    getPostDetails
};
