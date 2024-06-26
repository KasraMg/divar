import { getAllCitiesHandler, getAndShowHeaderCityTitle, getAndShowPostCategories, getAndShowSocialMedia, showPannelLinksToUser } from '../../utlis/shared.js'
import { hideModal, showModal, saveIntoLocalStorage, getFromLocalStorage, addParamToUrl, removeParameterFromURL, isLogin } from "../../utlis/utils.js"
import { submitNumber, getMe, verifyNumber, requestNewCode, logout } from '../../utlis/auth.js'


window.addEventListener('load', async () => {
    getAndShowSocialMedia()
    showPannelLinksToUser()
    getAndShowHeaderCityTitle()

    // city modal handler //
    let citySelect = null;
    let AllCitiesData = null;
    const userLogin = await isLogin()
    const addCityToModal = (cities) => {
        const citySelectedContainer = document.querySelector('#city-selected');
        citySelectedContainer.innerHTML = '';
        const newCities = cities.filter(city => city.id !== 0)
        newCities.forEach(city => {
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
        console.log(prevItem);
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
    const deleteAllSelectedBtn = document.querySelector('#delete-all-cities');
    const cityModalList = document.querySelector('#city_modal_list');

    // Event listeners
    cityModalAcceptBtn?.addEventListener('click', () => {
        saveIntoLocalStorage('cities', citySelect);
        console.log(citySelect);
        let ids = citySelect.map(obj => obj.id).join('|');
        addParamToUrl('city', ids)
        getAndShowHeaderCityTitle();
        hideModal('city-modal', 'city-modal--active');
    });

    deleteAllSelectedBtn?.addEventListener('click', () => {
        removeCitiesModalActive();
        citySelect = [];
        addCityToModal(citySelect);
        cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept');
        cityModalError.style.display = 'block';
        deleteAllSelectedBtn.style.display = 'none';
    });

    // Function to remove all selected cities from the modal
    const removeCitiesModalActive = () => {
        const cityitems = document.querySelectorAll(".city-item");
        cityitems.forEach(item => {
            const checkbox = item.querySelector("input");

            const checkboxShape = item.querySelector("div");
            checkbox.checked = false;
            checkboxShape.classList.remove('active');
            console.log(checkboxShape)
        });
    }

    // Fetching all cities and showing provinces and cities in the modal
    getAllCitiesHandler().then(data => {
        AllCitiesData = data;
        showProvinces(data);
    });

    // Function to display provinces and cities in the modal
    function showProvinces(data) {
        data.provinces.forEach(province => {
            cityModalList?.insertAdjacentHTML("beforeend", `
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

                let cities = data.cities.filter(city => city.province_id == provinceId);

                cityModalList.innerHTML = '';

                let isCheck = citySelect.some(selectedCity => selectedCity.title.trim() === `همه شهر های ${provinceName}`);

                cityModalList.insertAdjacentHTML('beforeend', `
                <li id="city_modal_all_province" class="city_modal_all_province">
                    <span>همه شهر ها</span>
                    <i class="bi bi-arrow-right-short"></i>
                </li>
                <li class="city-modal__cities-item select-all-city city-item" id="city-${provinceName.replace(/ /g, '-')}-${provinceId}">
                    <span>همه شهر های ${provinceName} </span>
                    <div class="${isCheck && 'active'}"  id="checkboxShape"></div>
                    <input onclick="cityItemClickHandler('${provinceName.replace(/ /g, '-')}','${provinceId}')" checked="${isCheck && true}" type="checkbox">
                </li>
            `);

                cities.forEach(city => {
                    let isCheck = citySelect.some(selectedCity => selectedCity.title == city.name);
                    cityModalList.insertAdjacentHTML("beforeend", `
                    <li class="city-modal__cities-item city-item" id="city-${city.id}">
                        <span>${city.name}</span>
                        <div class="${isCheck && 'active'}" id="checkboxShape"></div>
                        <input onclick="cityItemClickHandler('${city.id}')"  checked="${isCheck && true}" id="city-item-checkbox" type="checkbox">
                    </li>
                `);
                });

                const backToAllProvince = document.querySelector('#city_modal_all_province');

                backToAllProvince.addEventListener('click', () => {
                    cityModalList.innerHTML = '';
                    showProvinces(data);
                });
            });
        });
    }

    // Function to handle city item click
    window.cityItemClickHandler = function (cityId, provinceId) { 
        const item = provinceId ? document.querySelector(`#city-${cityId}-${provinceId}`) : document.querySelector(`#city-${cityId}`);
        const checkbox = item.querySelector("input");
        const cityTitle = item.querySelector("span").innerHTML;
        const checkboxShape = item.querySelector("div");
        if (!provinceId) { 
            citySelect.map(city => {
                if (city.title === cityTitle) {
                    checkbox.checked = true;
                }else{
                    checkbox.checked = false;
                }
            });
            
            checkbox.checked = !checkbox.checked; 
            if (checkbox.checked) {
                updateCitySelectList(cityTitle, cityId);
                checkboxShape.classList.add("active");
            } else {
                alert('hi')
                const allCityItemCheckbox = document.querySelector('.select-all-city > div ')
                const allCityItemInput = document.querySelector('.select-all-city input')
                const allCityItemSpan = document.querySelector('.select-all-city span')
                const newSelected = citySelect.filter(city => city.title !== allCityItemSpan.innerHTML && city.title !== cityTitle);
                citySelect = newSelected;
                allCityItemInput.checked = false
                allCityItemCheckbox.classList.remove("active");
                checkboxShape.classList.remove("active"); 
                addCityToModal(citySelect);
                toggleCityModalButtons(citySelect)

            }
            
        } else {

            checkbox.checked = checkboxShape.classList.toggle("active");
            checkbox.checked = !checkbox.checked
            let cities = AllCitiesData.cities.filter(city => city.province_id == provinceId);

            if (!checkbox.checked) {
                updateCitySelectList(cityTitle, 0)
            } else {
                const newSelected = citySelect.filter(selectedCity => selectedCity.title !== cityTitle);
                citySelect = newSelected
            }
            console.log(citySelect);

            cities.map(city => {
                const cityItem = document.querySelector(`#city-${city.id}`);
                const cityCheckbox = cityItem.querySelector("input");
                const cityCheckboxShape = cityItem.querySelector("div");
                const cityTitle = cityItem.querySelector("span").innerHTML;

                cityCheckbox.checked = checkbox.checked; 
                if (checkbox.checked === false) {
                    updateCitySelectList(city.name, city.id)
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
    function updateCitySelectList(cityTitle, cityId) {
        if (cityId !== 0) { 
            const isTitleRepeated = citySelect.some(item => item.title === cityTitle);
            if (!isTitleRepeated) {
                citySelect.push({ title: cityTitle, id: cityId });
                addCityToModal(citySelect);
            }
            toggleCityModalButtons(citySelect);
        } else {
            citySelect.push({ title: cityTitle, id: cityId });
        }

    }

    // Function to toggle the visibility of modal buttons
    function toggleCityModalButtons(citySelect) {
        if (citySelect.length) {
            cityModalAcceptBtn.classList.replace('city-modal__accept', 'city-modal__accept--active');
            deleteAllSelectedBtn.style.display = 'block';
            cityModalError.style.display = 'none';
        } else {
            cityModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept');
            deleteAllSelectedBtn.style.display = 'none';

            cityModalError.style.display = 'block';
        }
    }

 

    const cityModalSearchInput = document.querySelector('#city-modal-search-input')


    cityModalSearchInput?.addEventListener('keyup', (event) => {
        const filteredResult = AllCitiesData.cities.filter(city => city.name.includes(event.target.value))
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
            showProvinces(AllCitiesData);
        }

    })

    // city modal handler //


    // modals activity //
    const loginDropdownBtn = document.querySelector('#login-btn')
    const loginExitIcon = document.querySelector('.login-modal__icon')
    const cityModalOverlay = document.querySelector('.city-modal__overlay')
    const cityModalBtn = document.querySelector('.header__city')
    const cityModalCloseBtn = document.querySelector('.city-modal__close')
    const categoryModalBtn = document.querySelector('.header__category-btn')
    const categoryModalOverlay = document.querySelector('.category_modal_overlay')
    const SearchBox = document.querySelector('.header__form-input')
    const searchBoxModalOverlay = document.querySelector('.searchbar__modal-overlay')

    const loginModalOverlay = document.querySelector('.login_modal_overlay')
    cityModalBtn?.addEventListener('click', () => {
        showModal('city-modal', 'city-modal--active')
        hideModal('header__category-menu', 'header__category-menu--active')
        const cities = getFromLocalStorage('cities')
        deleteAllSelectedBtn.style.display = 'block'
        citySelect = cities
        addCityToModal(citySelect) 
    })

    cityModalCloseBtn?.addEventListener('click', () => {
        hideModal('city-modal', 'city-modal--active')
        removeCitiesModalActive()
    })

    categoryModalBtn?.addEventListener('click', () => {
        showModal('header__category-menu', 'header__category-menu--active')
    })


    loginDropdownBtn?.addEventListener('click', () => {
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
    loginExitIcon?.addEventListener('click', () => {
        hideModal('login-modal', 'login-modal--active')
    })

    // modals activity //





    const cities = getFromLocalStorage('cities')
    const ids = cities?.map(item => item.id).join("|");



    const globalSearchInput = document.querySelector('#global_search_input')
    const mostSearchedContainer = document.querySelector('#most_searched')

    const mostSearchedArr = ['ماشین', 'ساعت', 'موبایل', 'کیف', 'تلویزیون']
    globalSearchInput?.addEventListener("keydown", event => {
        console.log(location);
        if (event.keyCode == 13) {
            event.preventDefault();
            if (event.target.value.length) {
                if (location.pathname == '/pages/posts.html') {
                    addParamToUrl('value', globalSearchInput.value.trim())
                } else {
                    location.href = `posts.html?city=${ids}&value=${globalSearchInput.value.trim()}`;
                }
            }
        }

    });


    mostSearchedArr.map(value => {
        mostSearchedContainer?.insertAdjacentHTML('beforeend', `
        <li class="header__searchbar-dropdown-item">
        <a class="header__searchbar-dropdown-link" href="${`posts.html?city=${ids}&value=${value}`}">${value}</a>
    </li>
        `)
    })

    //  red btn left side in header
    const createPostBtn = document.querySelector('.create_post_btn')
    createPostBtn?.addEventListener('click', () => {
        if (userLogin) {
            location.href = '/pages/new.html'
        } else {
            showModal('login-modal', 'login-modal--active')
            hideModal('header__category-menu', 'header__category-menu--active')
        }
    })


    // register functions
    const submitPhoneNumberBtn = document.querySelector('.submit_phone_number_btn')
    const loginBtn = document.querySelector('.login_btn')
    const requestNewCodeBtn = document.querySelector('.req_new_code_btn')

    submitPhoneNumberBtn?.addEventListener('click', event => {
        event.preventDefault()
        submitNumber()
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
        if (data) {
            const logoutBtn = document.querySelector(".logout-link")

            logoutBtn?.addEventListener("click", (event) => {
                event.preventDefault();
                logout()
            })
        }
    })






    // category modal hadnler

    const categoriesList = document.querySelector('#categories-list')
    const allCategoriesPostsBtn = document.querySelector('#all-categories-posts')
    const categoryresults = document.querySelector('#category-results')

    if (categoryModalBtn) {
        allCategoriesPostsBtn.addEventListener('click', () => {
            removeParameterFromURL('categoryId')
        })


        getAndShowPostCategories().then(categories => {

            categories.map(category => {
                categoriesList.insertAdjacentHTML('beforeend', `
            <li onmouseenter="showAcitveCategoryItems('${category._id}')" class="header__category-menu-item">
                                                <div class="header__category-menu-link">
                                                    <div class="header__category-menu-link-right">
                                                        <i class="header__category-menu-icon bi bi-house"></i>
                                                       ${category.title}
                                                    </div>
                                                    <div class="header__category-menu-link-left">
                                                        <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
                                                    </div>
                                                </div> 
                                            </li>
            `)
            })

            window.showAcitveCategoryItems = function (categoryId) {
                categoryresults.innerHTML = ''
                const category = categories.find(category => category._id == categoryId)
                category.subCategories.map(subCategory => {
                    categoryresults.insertAdjacentHTML("beforeend", `
                <div>
                                                 <ul class="header__category-dropdown-list">
                                                     <div  onclick="categoryClickHandler('${subCategory._id}')"  class="header__category-dropdown-title">${subCategory.title}</div>
                                                  ${subCategory.subCategories.map(subSubCategory => (
                        ` <li class="header__category-dropdown-item">
                                                    <div  onclick="categoryClickHandler('${subSubCategory._id}')" class="header__category-dropdown-link"
                                                        >${subSubCategory.title}</div>
                                                </li>`
                    )).join('')} 
                                                 </ul>
                                             </div>
                `)
                })
            }

            showAcitveCategoryItems(categories[0]._id)

        })

        window.categoryClickHandler = function (categoryId) {
            location.href = `posts.html?categoryId=${categoryId}`
        }

    }


})