import { getAllCitiesHandler } from "../../../utlis/shared.js";
import { baseUrl, getUrlParam } from "../../../utlis/utils.js";

window.addEventListener('load', async () => {
    const res = await fetch(`${baseUrl}/v1/category/sub`)
    const data = await res.json()

    console.log(data);

    const id = getUrlParam('subCategoryId')


    const subCategoryTitle = document.querySelector('#subCategory-title')

    const subCategoryDetails = data.data.categories.find(category => category._id == id)
    console.log(subCategoryDetails);
    subCategoryTitle.innerHTML = subCategoryDetails.title


    const citySelect = document.querySelector('#city-select');
    const neighborhoodSelect = document.querySelector('#neighborhood-select');

    getAllCitiesHandler().then(data => {
        console.log(data);

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
    });




})