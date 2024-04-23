import { getAllCitiesHandler } from "../../../utlis/shared.js";
import { baseUrl, getToken, getUrlParam, showSwal } from "../../../utlis/utils.js";

window.addEventListener('load', async () => {
    const loading = document.querySelector('#loading-container')
    const dynamicFields = document.querySelector('#dynamic-fields')
    const imagesContainer = document.querySelector('#images-container')
    const postTitleInput = document.querySelector('#post-title-input')
    const postDescriptionInput = document.querySelector('#post-description-textarea')
    const registerBtn = document.querySelector('#register-btn')
    const exchangeCheckbox = document.querySelector('#exchange-checkbox')
    const postPriceInput = document.querySelector('#post-price-input')
    const subCategoryTitle = document.querySelector('#subCategory-title')
    const citySelectbox = document.querySelector('#city-select');
    const neighborhoodSelectbox = document.querySelector('#neighborhood-select');

    const res = await fetch(`${baseUrl}/v1/category/sub`)
    const data = await res.json()
    const subCategoryId = getUrlParam('subCategoryId')


    let mapView = { x: 35.551066, y: 51.197588 };
    let pics = [];
    let dynamicFieldsData = {}


    const subCategoryDetails = data.data.categories.find(category => category._id == subCategoryId) 
    subCategoryTitle.innerHTML = subCategoryDetails.title 
 
    // map
    let markerIcon = null;
    let iconStatus = true;

    let map = L.map('map').setView([35.551066, 51.197588], 13);
    let firstIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==',
        iconSize: [30, 30]
    });
    let secondIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==',
        iconSize: [30, 30]
    });
    markerIcon = firstIcon

    const iconControll = document.querySelector('.icon-controll')
    iconControll.addEventListener('click', () => {
        if (iconStatus) {
            markerIcon = secondIcon;
            mapMarker.setIcon(markerIcon); // افزودن این خط برای بروزرسانی آیکون نقشه
            iconStatus = false
        } else {
            markerIcon = firstIcon;
            mapMarker.setIcon(markerIcon); 
            iconStatus = true
        }
    });
    let mapMarker = L.marker([35.551066, 51.197588], { icon: markerIcon }).addTo(map);


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    map.on('move', () => {
        const center = map.getSize().divideBy(2);
        const targetPoint = map.containerPointToLayerPoint(center);
        const targetLatLng = map.layerPointToLatLng(targetPoint);
        mapMarker.setLatLng(targetLatLng);
        mapMarker.getElement().style.pointerEvents = 'none';
        mapView = {
            x: targetLatLng.lat,
            y: targetLatLng.lng
        };
    });
    // map


    subCategoryDetails.productFields.map(field => {
        dynamicFields.insertAdjacentHTML('beforeend', `
            ${field.type == 'selectbox' ? (
                `
            <div class="group">
                    <p class="field-title">${field.name}</p>
                    <div class="field-box"> 
                        <select onchange="fieldChangeHandler('${field.slug}', event.target.value)"
                            required="required">  
                            <option value="default">انتخاب</option>
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
                    <div class="group checkbox-group">
                    <input  onchange="fieldChangeHandler('${field.slug}', event.target.checked)" class="checkbox" type="checkbox">
                    <p>${field.name}</p>
                </div>

                    `
            ) : ""}
            
            `)
    })

    window.fieldChangeHandler = function (slug, data) {
        dynamicFieldsData[slug] = data; 
    }

    subCategoryDetails.productFields.forEach(item => {
        if (item.type == 'checkbox') {
            dynamicFieldsData[item.slug] = false;
        } else {
            dynamicFieldsData[item.slug] = item.data;
        } 
    });

    uploader.addEventListener('change', (event) => {
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                pics.push(file)
                ganerateImages(pics)
            } else {
                showSwal('تایپ فایل وارد شده اشتباه است. لطفا فایل با تایپ های .png یا .jpg وارد کنید', "error", "اوکی", () => null)
            }
        }
    });

    const ganerateImages = (pics) => {
        imagesContainer.innerHTML = ''
        pics.map(pic => {
            let reader = new FileReader();
            reader.onloadend = function () {
                let base64String = reader.result;
                imagesContainer.insertAdjacentHTML('beforeend', `
                <div class="image-box">
                    <div onclick="deleteImageHandler('${pic.name}')">
                       <i class="bi bi-trash"></i>
                    </div>
                    <img src="${base64String}" alt="post-image" />
                </div>
                    `);
            };
            reader.readAsDataURL(pic);
        })

    }

    window.deleteImageHandler = function (picName) {
        pics = pics.filter(pic => pic.name !== picName)
        ganerateImages(pics)
    }

    // city selector handler
    getAllCitiesHandler().then(data => {
        loading.style.display = 'none'
        const cityChoices = new Choices(citySelectbox);
        const neighborhoodChoices = new Choices(neighborhoodSelectbox)

        const tehranNeighborhoods = data.neighborhoods.filter(
            neighborhood => neighborhood.city_id == 301
        );

        const choices = [
            { value: "default", label: "انتخاب محله", disabled: true, selected: true },
            ...tehranNeighborhoods.map(neighborhood => ({ value: neighborhood.id, label: neighborhood.name }))
        ];
        neighborhoodChoices.setChoices(choices, 'value', 'label', false);

        cityChoices.setChoices(
            data.cities.map(city => {
                return { value: city.id, label: city.name, customProperties: { id: city.id }, selected: city.name == 'تهران' ? true : false }
            }),
            'value',
            'label',
            false
        );

        citySelectbox.addEventListener(
            'addItem',
            function (event) {
                neighborhoodChoices.clearStore(); // پاک کردن مقادیر قبلی
                const neighborhoods = data.neighborhoods.filter(
                    neighborhood => neighborhood.city_id == event.detail.customProperties.id
                );

                if (neighborhoods.length) {
                    const choices = [
                        { value: "default", label: "انتخاب محله", disabled: true, selected: true },
                        ...neighborhoods.map(neighborhood => ({ value: neighborhood.id, label: neighborhood.name }))
                    ];
                    neighborhoodChoices.setChoices(choices, 'value', 'label', false);
                } else {
                    neighborhoodChoices.setChoices(
                        [{ value: 0, label: "همه محله ها", disabled: true, selected: true }],
                        'value',
                        'label',
                        false
                    );
                }
            },
            false
        );


    })

    registerBtn.addEventListener('click', async () => {  
        console.log(neighborhoodSelectbox.value);
        let allFieldsFilled = null;
        for (const key in dynamicFieldsData) {
            if (dynamicFieldsData.hasOwnProperty(key) && (typeof dynamicFieldsData[key] === 'undefined' || dynamicFieldsData[key] === '')) {
                allFieldsFilled = false;
                break;
            } else {
                allFieldsFilled = true;
                break;
            }
        }
        if (neighborhoodSelectbox.value === 'default' || !allFieldsFilled || !postTitleInput.value.length || !postDescriptionInput.value.length || !postPriceInput.value.length) {
            showSwal('لطفا همه فیلد هارو پر کنید', 'error', 'حله', () => null)
        } else {
            loading.style.display = 'block'
            const token = getToken()
            const formData = new FormData();
            formData.append("city", citySelectbox.value);
            formData.append("neighborhood", neighborhoodSelectbox.value);
            formData.append("title", postTitleInput.value);
            formData.append("price", postPriceInput.value);
            formData.append("exchange", exchangeCheckbox.checked);
            formData.append("description", postDescriptionInput.value);
            formData.append("map", JSON.stringify(mapView));
            formData.append("categoryFields", JSON.stringify(dynamicFieldsData));
            pics?.map(pic => {
                formData.append("pics", pic);
            })
            const res = await fetch(`${baseUrl}/v1/post/${subCategoryId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })
            const data = await res.json()
            loading.style.display = 'none'
            if (data.status === 201) {
                showSwal('آگهی با موفقیت در صف انتشار قرار گرفت.', 'success', 'حله', (res) => {
                    if (res) {
                        location.href = `/pages/userPanel/posts/preview.html?id=${data.data.post._id}`
                    }
                })
            }
        }
    })

})

