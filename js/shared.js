import { getAndShowCities, getAndShowHeaderCityTitle, getAndShowSocialMedia, showPannelLinksToUser } from './funcs/shared.js'
import { hideModal, showModal, saveIntoLocalStorage } from "./funcs/utils.js"
import { SubmitNumber, getMe, verifyNumber, requestNewCode, logout } from './funcs/auth.js'


window.addEventListener('load', () => {
    let citySelect = []

    getAndShowSocialMedia()
    showPannelLinksToUser()
    getAndShowHeaderCityTitle()

    const cityModalAcceptBtn = document.querySelector('.city-modal__accept')
    const cityModalError = document.querySelector('#city_modal_error')
    const deleteAllCities = document.querySelector('#delete-all-cities')
    cityModalAcceptBtn.addEventListener('click', () => {
        saveIntoLocalStorage('cities', citySelect)
        getAndShowHeaderCityTitle()
        hideModal('city-modal', 'city-modal--active')
    })
    const removeCitiesModalActive = () => {
        const citySelectedContainer = document.querySelector('#city-selected')
        const cityitems = document.querySelectorAll(".city-item")
        citySelectedContainer.innerHTML = ''
        cityitems.forEach(item => {
            const checkbox = item.querySelector("input");
            const checkboxShape = item.querySelector("div");
            checkbox.checked = false
            checkboxShape.classList.remove('active')
        })
    }

    getAndShowCities().then(data => {
        console.log(data);
        showProvincesAndCities(data);
    });
    function showProvincesAndCities(data) {
        const cityModalList = document.querySelector('#city_modal_list');

        data.data.provinces.forEach(province => {
            cityModalList.insertAdjacentHTML("beforeend", `
                <li class="city-modal__cities-item province-item" data-province-id="${province.id}">
                    <span>${province.name}</span>
                    <i class="city-modal__cities-icon bi bi-chevron-left"></i>
                </li>
            `);
        });

        const provinceModalItem = document.querySelectorAll('.province-item');

        provinceModalItem.forEach(province => {
            province.addEventListener('click', (event) => {
                const provinceId = event.target.dataset.provinceId;
                const provinceName = event.target.querySelector('span').innerHTML;

                let cities = data.data.cities.filter(city => city.province_id == provinceId);

                cityModalList.innerHTML = '';

                cityModalList.insertAdjacentHTML('beforeend', `
                    <li id="city_modal_all_province" class="city_modal_all_province">
                        <span>همه شهر ها</span>
                        <i class="bi bi-arrow-right-short"></i>
                    </li>
                    <li class="city-modal__cities-item select-all-city">
                        <span>همه شهر های ${provinceName}</span>
                        <input type="checkbox">
                        <div id="checkboxShape"></div>
                    </li>
                `);

                cities.forEach(city => {
                    cityModalList.insertAdjacentHTML("beforeend", `
                        <li class="city-modal__cities-item city-item" data-city-id="${city.id}">
                            <span>${city.name}</span>
                            <div id="checkboxShape"></div>
                            <input id="city-item-checkbox" type="checkbox">
                        </li>
                    `);
                });

                const backToAllProvince = document.querySelector('#city_modal_all_province');

                backToAllProvince.addEventListener('click', () => {
                    cityModalList.innerHTML = '';
                    showProvincesAndCities(data);
                });

                const cityitems = document.querySelectorAll(".city-modal__cities-item")

                cityitems.forEach(item => {
                    const checkbox = item.querySelector("input");
                    const cityTitle = item.querySelector("span").innerHTML;
                    const checkboxShape = item.querySelector("div");
                    checkbox.addEventListener("click", function () {

                        if (checkbox.checked == true) {
                            checkboxShape.classList.add("active");
                            citySelect.push(cityTitle)
                            addCityToModal(citySelect)
                            if (citySelect.length !== 0) {
                                cityModalAcceptBtn.classList.replace('city-modal__accept', 'city-modal__accept--active')
                                deleteAllCities.style.display = 'block'
                            } else {
                                cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
                                deleteAllCities.style.display = 'none'
                            }
                        } else {
                            checkboxShape.classList.remove("active");
                            const newArr = citySelect.filter(item => item !== cityTitle)
                            citySelect = newArr
                            addCityToModal(citySelect)
                            if (citySelect.length !== 0) {
                                cityModalAcceptBtn.classList.replace('city-modal__accept', 'city-modal__accept--active')
                                deleteAllCities.style.display = 'block'
                            } else {
                                cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
                                deleteAllCities.style.display = 'none'
                            }
                        }
                    });
                });
            });
        });



        deleteAllCities.addEventListener('click', () => {
            removeCitiesModalActive()
            citySelect = []
            addCityToModal(citySelect)
            cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
            cityModalError.style.display = 'block'
            deleteAllCities.style.display = 'none'
        })



    }

    const addCityToModal = (cities => {
        const citySelectedContainer = document.querySelector('#city-selected')
        citySelectedContainer.innerHTML = ''
        cities.forEach(city => {
            citySelectedContainer.insertAdjacentHTML("beforeend", `
            <div class="city-modal__selected-item">
            <span class="city-modal__selected-text">${city}</span>
            <button class="city-modal__selected-btn">
                <i class="city-modal__selected-icon bi bi-x"></i>
            </button>
        </div>
            `)
        })
    })



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
    mostSearchedArr.map(value => {
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
        citySelect = []
        addCityToModal(citySelect)
        removeCitiesModalActive()
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
        citySelect = []
        addCityToModal(citySelect)
        removeCitiesModalActive()
    })
    categoryModalOverlay?.addEventListener('click', () => {
        hideModal('header__category-menu', 'header__category-menu--active')
    })

    loginModalOverlay?.addEventListener('click', () => {
        hideModal('login-modal', 'login-modal--active')
    })

})