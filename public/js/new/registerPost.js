import { getAllCitiesHandler } from "../../../utlis/shared.js";
import { baseUrl, getUrlParam } from "../../../utlis/utils.js";

window.addEventListener('load', async () => {
    const loading = document.querySelector('#loading-container')
    const dynamicFields = document.querySelector('#dynamic-fields')
    const postImages = document.querySelector('#post-images')
    const postTitleInput = document.querySelector('#post-title-input')
    const postDescriptionInput = document.querySelector('#post-description-textarea')
    const registerBtn = document.querySelector('#register-btn')
    const exchangeCheckbox = document.querySelector('#exchange-checkbox')
    const postPriceInput = document.querySelector('#post-price-input')


    const res = await fetch(`${baseUrl}/v1/category/sub`)
    const data = await res.json()
    const id = getUrlParam('subCategoryId')
    let mapView = null;
    let pics = [];
    let dynamicFieldsData = {}

    const subCategoryTitle = document.querySelector('#subCategory-title')
    const subCategoryDetails = data.data.categories.find(category => category._id == id)
    console.log(subCategoryDetails);
    subCategoryTitle.innerHTML = subCategoryDetails.title
    const citySelect = document.querySelector('#city-select');
    const neighborhoodSelect = document.querySelector('#neighborhood-select');

    getAllCitiesHandler().then(data => {
        loading.style.display = 'none'

        const example = new Choices(citySelect);
        const example2 = new Choices(neighborhoodSelect)

        example2.setChoices(
            [{ value: " انتخاب محله", label: " انتخاب محله", disabled: true, selected: true }],
            'value',
            'label',
            false
        );
        example.setChoices(
            data.cities.map(city => {
                return { value: city.name, label: city.name, customProperties: { id: city.id }, selected: city.name == 'شیراز' ? true : false }
            }),
            'value',
            'label',
            false
        );
        citySelect.addEventListener(
            'addItem',
            function (event) {
                example2.clearStore(); // پاک کردن مقادیر قبلی
                const neighborhoods = data.neighborhoods.filter(
                    neighborhood => neighborhood.city_id == event.detail.customProperties.id
                );

                if (neighborhoods.length) {
                    const choices = [
                        { value: "انتخاب محله", label: "انتخاب محله", disabled: true, selected: true },
                        ...neighborhoods.map(neighborhood => ({ value: neighborhood.name, label: neighborhood.name }))
                    ];
                    example2.setChoices(choices, 'value', 'label', false);
                } else {
                    example2.setChoices(
                        [{ value: "محله ای در دسترس نیست", label: "محله ای در دسترس نیست", disabled: true, selected: true }],
                        'value',
                        'label',
                        false
                    );
                }
            },
            false
        );


    })
    var map = L.map('map').setView([35.551066, 51.197588], 13);

    var icon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==',
        iconSize: [30, 30]
    });

    var marker = L.marker([35.551066, 51.197588], { icon: icon }).addTo(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">33</a>'
    }).addTo(map);

    map.on('move', () => {
        const center = map.getSize().divideBy(2);
        const targetPoint = map.containerPointToLayerPoint(center);
        const targetLatLng = map.layerPointToLatLng(targetPoint);
        marker.setLatLng(targetLatLng);
        marker.getElement().style.pointerEvents = 'none';
        mapView = {
            x: targetLatLng.lat,
            y: targetLatLng.lng
        };
    });

    subCategoryDetails.productFields.map(field => {
        dynamicFields.insertAdjacentHTML('beforeend', `
            ${field.type == 'selectbox' ? (
                `
            <div class="group">
                    <p class="field-title">${field.name}</p>
                    <div class="field-box"> 
                        <select onchange="fieldChangeHandler('${field.slug}', event.target.value)"
                            required="required">  
                                ${field.options.map(option => (
                    ` <option value="${option}">${option}</option>`
                ))} 
                        </select>
                        <svg>
                            <use
                                xlink:href="#select-arrow-down"></use>
                        </svg>
                    </div>
                    <svg class="sprites">
                        <symbol id="select-arrow-down"
                            viewbox="0 0 10 6">
                            <polyline points="1 1 5 5 9 1"></polyline>
                        </symbol>
                    </svg>
                </div>
        `
            ) : ""}
            ${field.type == 'checkbox' ? (
                `
                    <div class="group exchange-group">
                    <input  onchange="fieldChangeHandler('${field.slug}', event.target.checked)" class="exchange-checkbox" id="exchange-checkbox" type="checkbox">
                    <p>${field.name}</p>
                </div>

                    `
            ) : ""}
            
            `)
    })

    window.fieldChangeHandler = function (slug, data) {
        dynamicFieldsData[slug] = data;
        console.log(dynamicFieldsData);
    }

    subCategoryDetails.productFields.forEach(item => {
        if (item.type == 'checkbox') {
            dynamicFieldsData[item.slug] = false;
        } else {
            dynamicFieldsData[item.slug] = item.data;
        }

        console.log(dynamicFieldsData);
    });

    uploader.addEventListener('change', (event) => {
        pics.push(event.target.files[0])
        console.log(pics);

        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                let reader = new FileReader();
                reader.onloadend = function () {
                    let base64String = reader.result;
                    postImages.insertAdjacentHTML('beforeend', `
                        <img src="${base64String}" alt="" />
                    `);
                };
                reader.readAsDataURL(file);
            } else {
                showSwal('تایپ فایل وارد شده اشتباه است. لطفا فایل با تایپ های .png یا .jpg وارد کنید', "error", "اوکی", () => null)
            }
        }
    });

    registerBtn.addEventListener('click', () => { 
        let allFieldsFilled = null;
        for (const key in dynamicFieldsData) {
            if (dynamicFieldsData.hasOwnProperty(key) && (typeof dynamicFieldsData[key] === 'undefined' || dynamicFieldsData[key] === '')) {
              allFieldsFilled = false;
              break;
            }else{
                allFieldsFilled = true;
                break;
            }
          }
          console.log(allFieldsFilled);

        if (!postTitleInput.length) {

        }
        else if (!postDescriptionInput.length) {

        } 
        else {

        }
    })

})