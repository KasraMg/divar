import { getAndShowSocialMedia, showPannelLinksToUser } from './funcs/shared.js'
import { hideModal, showModal } from "./funcs/utils.js"
import { SubmitNumber, getMe, verifyNumber, requestNewCode, logout } from './funcs/auth.js'


window.addEventListener('load', () => {
    getAndShowSocialMedia()
    showPannelLinksToUser()



    const submitPhoneNumberBtn = document.querySelector('.submit_phone_number_btn')
    const loginBtn = document.querySelector('.login_btn')
    const requestNewCodeBtn = document.querySelector('.req_new_code_btn')
    const globalSearchInput = document.querySelector('#global_search_input')
    const mostSearchedContainer = document.querySelector('#most_searched')

    const mostSearchedArr = ['خودرو سواری', 'فروش آپارتمان', 'موبایل', 'حیوانات', 'تلویزیون']
    globalSearchInput?.addEventListener("keydown", event => {
        if (event.keyCode == 13) {
            event.preventDefault();
            if (event.target.value.length) {
                location.href = `posts.html?city=tehran&value=${globalSearchInput.value.trim()}`;
            }
        }

    });
    mostSearchedArr.map(value=>{
        mostSearchedContainer?.insertAdjacentHTML('beforeend', `
        <li class="header__searchbar-dropdown-item">
        <a class="header__searchbar-dropdown-link" href="${`posts.html?city=tehran&value=${value}`}">${value}</a>
    </li>
        `)
    })
 
    submitPhoneNumberBtn?.addEventListener('click', event => {
        event.preventDefault()
        SubmitNumber()
    })
    loginBtn?.addEventListener('click', event => {
        event.preventDefault()
        verifyNumber()
    })

    requestNewCodeBtn?.addEventListener('click', event => {
        event.preventDefault()
        requestNewCode()

    })

    getMe().then(data => {
        if (data.status == 200) {
            const logoutUserBtn = document.querySelector(".logout-link");
            logoutUserBtn?.addEventListener("click", (event) => {
                event.preventDefault();
                logout()
            })
        }
    })


    const cityModalOverlay = document.querySelector('.city-modal__overlay')
    const headerCityBtn = document.querySelector('.header__city')
    const cityModalCloseBtn = document.querySelector('.city-modal__close')
    const headerCategoryBtn = document.querySelector('.header__category-btn')
    const categoryModalOverlay = document.querySelector('.category_modal_overlay')
    const SearchBox = document.querySelector('.header__form-input')
    const searchBoxModalOverlay = document.querySelector('.searchbar__modal-overlay')
    const loginDropdownLink = document.querySelector('.login_dropdown_link')
    const loginModalOverlay = document.querySelector('.login_modal_overlay')
    const createPostBtn = document.querySelector('.create_post_btn')

    createPostBtn?.addEventListener('click', () => {
        getMe().then(data => {
            if (data.status === 200) {
                location.href = '/new.html'
            } else {
                showModal('login-modal', 'login-modal--active')
                hideModal('header__category-menu', 'header__category-menu--active')
            }
        })
    })
    headerCityBtn?.addEventListener('click', () => {
        showModal('city-modal', 'city-modal--active')
        hideModal('header__category-menu', 'header__category-menu--active')
    })

    cityModalCloseBtn?.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active') 
    })

    headerCategoryBtn?.addEventListener('click', () => {
        showModal('header__category-menu', 'header__category-menu--active') 
    })
    loginDropdownLink?.addEventListener('click', () => {
        showModal('login-modal', 'login-modal--active')
        hideModal('header__category-menu', 'header__category-menu--active')
    })


    SearchBox?.addEventListener('click', () => {
        showModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
        hideModal('header__category-menu', 'header__category-menu--active')
    })


    searchBoxModalOverlay?.addEventListener('click', () => {
        hideModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
    })
    cityModalOverlay?.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active')
    })
    categoryModalOverlay?.addEventListener('click', () => {
        hideModal('header__category-menu', 'header__category-menu--active')
    })

    loginModalOverlay?.addEventListener('click', () => {
        hideModal('login-modal', 'login-modal--active')
    })

})