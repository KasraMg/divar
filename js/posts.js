import { hideModal, showModal } from "./funcs/utils.js"

const cityModalOverlay = document.querySelector('.city-modal__overlay')
const headerCityBtn = document.querySelector('.header__city')
const cityModalCloseBtn = document.querySelector('.city-modal__close') 
const headerCategoryBtn = document.querySelector('.header__category-btn') 
const categoryModalOverlay = document.querySelector('.category_modal_overlay')
const SearchBox =document.querySelector('.header__form-input')
const searchBoxModalOverlay =document.querySelector('.searchbar__modal-overlay')
const loginDropdownLink =document.querySelector('.login_dropdown_link')
const loginModalOverlay =document.querySelector('.login_modal_overlay')

headerCityBtn.addEventListener('click', () => {
    showModal('city-modal', 'city-modal--active')
})

cityModalCloseBtn.addEventListener('click', () => {
    hideModal('city-modal', 'city-modal--active')
})
 
headerCategoryBtn.addEventListener('click', () => { 
    showModal('header__category-menu', 'header__category-menu--active')
})
loginDropdownLink.addEventListener('click', () => {  
    showModal('login-modal', 'login-modal--active')
})

 
SearchBox.addEventListener('click', () => {  
    showModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
})
 

searchBoxModalOverlay.addEventListener('click', () => { 
    hideModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
})
cityModalOverlay.addEventListener('click', () => {
    hideModal('city-modal', 'city-modal--active')
})
categoryModalOverlay.addEventListener('click', () => { 
    hideModal('header__category-menu', 'header__category-menu--active')
}) 
 
loginModalOverlay.addEventListener('click', () => { 
    hideModal('login-modal', 'login-modal--active')
})
 
 