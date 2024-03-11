import { getAllCitiesHandler, getAndShowHeaderCityTitle, getAndShowSocialMedia, showPannelLinksToUser } from './funcs/shared.js'
import { hideModal, showModal, saveIntoLocalStorage, getFromLocalStorage } from "./funcs/utils.js"
import { SubmitNumber, getMe, verifyNumber, requestNewCode, logout } from './funcs/auth.js'

window.addEventListener('load', () => {
    getAndShowSocialMedia()
    showPannelLinksToUser()
    getAndShowHeaderCityTitle()
    let citySelect;
    let AllCitiesData;


    const addCityToModal = (cities) => {
        const citySelectedContainer = document.querySelector('#city-selected');
        citySelectedContainer.innerHTML = '';
        cities.forEach(city => {
            citySelectedContainer.insertAdjacentHTML("beforeend", ` 
                <div class="city-modal__selected-item">   
                    <span class="city-modal__selected-text">${city.title}</span>   
                    <button onclick="removeCityFromModal('${city.id}')"   class="city-modal__selected-btn">   
                        <i class="city-modal__selected-icon bi bi-x"></i>   
                    </button>   
                </div>   `
            );
        });
    };


    // Function to remove a city from the modal
    window.removeCityFromModal = function (cityId) {
        const prevItem = document.querySelector(`#city-${cityId}`);
        if (prevItem) {
            const checkbox = prevItem.querySelector("input");
            const checkboxShape = prevItem.querySelector("div");
            checkbox.checked = false;
            checkboxShape.classList.remove('active');
        }

        citySelect = citySelect.filter(city => city.id !== cityId);
        addCityToModal(citySelect);
        toggleCityModalButtons(citySelect);
    }

    // DOM elements
    const cityModalAcceptBtn = document.querySelector('.city-modal__accept');
    const cityModalError = document.querySelector('#city_modal_error');
    const deleteAllCities = document.querySelector('#delete-all-cities');
    const cityModalList = document.querySelector('#city_modal_list');

    // Event listeners
    cityModalAcceptBtn.addEventListener('click', () => {
        saveIntoLocalStorage('cities', citySelect);
        getAndShowHeaderCityTitle();
        hideModal('city-modal', 'city-modal--active');
    });

    deleteAllCities.addEventListener('click', () => {
        removeCitiesModalActive();
        citySelect = [];
        addCityToModal(citySelect);
        cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept');
        cityModalError.style.display = 'block';
        deleteAllCities.style.display = 'none';
    });

    // Function to remove all selected cities from the modal
    const removeCitiesModalActive = () => {
        const cityitems = document.querySelectorAll(".city-item");
        cityitems.forEach(item => {
            const checkbox = item.querySelector("input");
            const checkboxShape = item.querySelector("div");
            checkbox.checked = false;
            checkboxShape.classList.remove('active');
        });
    }

    // Fetching all cities and showing provinces and cities in the modal
    getAllCitiesHandler().then(data => {
        AllCitiesData = data;
        showProvincesAndCities(data);
    });

    // Function to display provinces and cities in the modal
    function showProvincesAndCities(data) {
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

                let isCheck = citySelect.some(selectedCity => selectedCity.title == `همه شهر های ${provinceName}`);

                cityModalList.insertAdjacentHTML('beforeend', `
                <li id="city_modal_all_province" class="city_modal_all_province">
                    <span>همه شهر ها</span>
                    <i class="bi bi-arrow-right-short"></i>
                </li>
                <li class="city-modal__cities-item select-all-city city-item" id="city-${provinceName.replace(/ /g, '-')}-${provinceId}">
                    <span>همه شهر های ${provinceName} </span>
                    <input  onclick="cityItemClickHandler('${provinceName.replace(/ /g, '-')}','${provinceId}')" checked="${isCheck && true}" type="checkbox">
                    <div class="${isCheck && 'active'}"  id="checkboxShape"></div>
                </li>
            `);

                cities.forEach(city => {
                    let isCheck = citySelect.some(selectedCity => selectedCity.title == city.name); 
                    cityModalList.insertAdjacentHTML("beforeend", `
                    <li class="city-modal__cities-item city-item" id="city-${city.id}">
                        <span>${city.name}</span>
                        <div class="${isCheck && 'active'}" id="checkboxShape"></div>
                        <input onclick="cityItemClickHandler('${city.id}',null)"  checked="${isCheck && true}" id="city-item-checkbox" type="checkbox">
                    </li>
                `);
                });

                const backToAllProvince = document.querySelector('#city_modal_all_province');

                backToAllProvince.addEventListener('click', () => {
                    cityModalList.innerHTML = '';
                    showProvincesAndCities(data);
                });
            });
        });
    }

    // Function to handle city item click
    window.cityItemClickHandler = function (cityId, provinceId) {
        const item = provinceId ? document.querySelector(`#city-${cityId}-${provinceId}`) : document.querySelector(`#city-${cityId}`);
        const checkbox = item.querySelector("input");
        const cityTitle = item.querySelector("span").innerHTML;
        if (!provinceId) {
            citySelect.map(city => {
                if (city.title == cityTitle) { 
                    const checkbox = item.querySelector("input");
                    checkbox.checked = true; 
                }
            });
         }
        console.log( checkbox.checked);
       
        const checkboxShape = item.querySelector("div");
        checkbox.checked = !checkbox.checked;
        console.log(checkbox.checked);
        if (!provinceId) {
            if (checkbox.checked) {
                updateCitySelect(cityTitle, cityId);
                checkbox.checked = false;
                checkboxShape.classList.add("active");
            } else {
                checkboxShape.classList.remove("active");
                checkbox.checked = true;
                const newSelected = citySelect.filter(city => city.title !== cityTitle)

                citySelect = newSelected
                addCityToModal(citySelect);
                toggleCityModalButtons(citySelect)
            }
        } else {
            checkboxShape.classList.toggle("active");
            if (checkbox.checked) {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
            }

            let cities = AllCitiesData.data.cities.filter(city => city.province_id == provinceId);

            cities.map(city => {
                const cityItem = document.querySelector(`#city-${city.id}`);
                const cityCheckbox = cityItem.querySelector("input");
                const cityCheckboxShape = cityItem.querySelector("div");
                const cityTitle = cityItem.querySelector("span").innerHTML;

                cityCheckbox.checked = checkbox.checked;
                if (checkbox.checked === false) {
                    updateCitySelect(city.name, city.id)
                } else {
                    const newSelected = citySelect.filter(selectedCity => selectedCity.title !== cityTitle);
                    citySelect = newSelected;
                    addCityToModal(citySelect);
                    toggleCityModalButtons(citySelect)
                }
                if (checkbox.checked) {
                    cityCheckboxShape.classList.remove("active");
                } else {
                    cityCheckboxShape.classList.add("active");
                }
            });
        }
    };

    // Function to update the selected cities
    function updateCitySelect(cityTitle, cityId) {
        const index = citySelect.findIndex(item => item.id === cityId);
        if (index !== -1) {
            citySelect.splice(index, 1);
            addCityToModal(citySelect);
        } else {
            citySelect.push({ title: cityTitle, id: cityId });
            addCityToModal(citySelect);
        }

        toggleCityModalButtons(citySelect);
    }

    // Function to toggle the visibility of modal buttons
    function toggleCityModalButtons(citySelect) {
        if (citySelect.length) {
            cityModalAcceptBtn.classList.replace('city-modal__accept', 'city-modal__accept--active');
            deleteAllCities.style.display = 'block';
            cityModalError.style.display = 'none';
        } else {
            cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept');
            deleteAllCities.style.display = 'none';

            cityModalError.style.display = 'block';
        }
    }

    // Function to select active cities
    const activeCitiesSelected = () => {
        const cityitems = document.querySelectorAll(".city-item");
        cityitems.forEach(item => {
            const cityTitle = item.querySelector("span");
            citySelect.map(city => {
                if (city.title == cityTitle.innerHTML) {
                    const checkboxShape = item.querySelector("div");
                    const checkbox = item.querySelector("input");
                    checkbox.checked = true;
                    checkboxShape.classList.add('active');
                }
            });
        });
    }




    const cityModalSearchInput = document.querySelector('#city-modal-search-input')

    getAllCitiesHandler().then(data => {
        cityModalSearchInput.addEventListener('keyup', (event) => {
            const filteredResult = data.data.cities.filter(city => city.name.includes(event.target.value))
            if (event.target.value.length !== 0 && filteredResult.length !== 0) {
                cityModalList.innerHTML = "";
                filteredResult.forEach(city => {
                    let isCheck = citySelect.some(selectedCity => selectedCity.title == city.name);
                    cityModalList.insertAdjacentHTML("beforeend", `
                        <li class="city-modal__cities-item city-item" id="city-${city.id}">
                            <span>${city.name}</span>
                            <div class="${isCheck && 'active'}" id="checkboxShape"></div>
                            <input onclick="cityItemClickHandler('${city.id}')" checked="${isCheck && true}" id="city-item-checkbox" type="checkbox">
                        </li>
                    `);
                });
            } else {
                cityModalList.innerHTML = "";
                showProvincesAndCities(data);
            }

        })
    });


















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
        const cities = getFromLocalStorage('cities')
        deleteAllCities.style.display = 'block'
        citySelect = cities
        addCityToModal(citySelect)
        activeCitiesSelected()
    })

    cityModalCloseBtn?.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active')
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

        removeCitiesModalActive()
    })
    categoryModalOverlay?.addEventListener('click', () => {
        hideModal('header__category-menu', 'header__category-menu--active')
    })

    loginModalOverlay?.addEventListener('click', () => {
        hideModal('login-modal', 'login-modal--active')
    })

})