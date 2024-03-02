import { hideModal, showModal } from "./funcs/utils.js"

const cityModalOverlay = document.querySelector('.city-modal__overlay')
const cityBtn = document.querySelector('.header__city')
const cityCloseBtn = document.querySelector('.city-modal__close') 
const headerCategoryBtn = document.querySelector('.header__category-btn') 
const categoryModalOverlay = document.querySelector('.category_modal_overlay')
const headerSearchBox =document.querySelector('.header__form-input')
cityBtn.addEventListener('click', () => {
    showModal('city-modal', 'city-modal--active')
})
cityModalOverlay.addEventListener('click', () => {
    hideModal('city-modal', 'city-modal--active')
})
cityCloseBtn.addEventListener('click', () => {
    hideModal('city-modal', 'city-modal--active')
})
 
headerCategoryBtn.addEventListener('click', () => { 
    showModal('header__category-menu', 'header__category-menu--active')
})
 
categoryModalOverlay.addEventListener('click', () => { 
    hideModal('header__category-menu', 'header__category-menu--active')
})
 
headerSearchBox.addEventListener('click', () => {  
    showModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
})
 
categoryModalOverlay.addEventListener('click', () => { 
    hideModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
})
 