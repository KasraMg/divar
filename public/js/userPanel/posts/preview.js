import { baseUrl, calculateTimeDifference, getFromLocalStorage, getToken, getUrlParam, saveIntoLocalStorage, showSwal } from "../../../../utlis/utils.js";


window.addEventListener('load', async () => {
    const postTitle = document.querySelector('#post-title')
    const postInfoes = document.querySelector('#post-infoes-list')
    const postIntro = document.querySelector('#post-intro')
    const postStatus = document.querySelector('#post-status')
    const postDiscription = document.querySelector('#post-description')
    const categoryTitle = document.querySelector('#category-title')
    const dynamicFields = document.querySelector('#dynamic-fields')
    const postTitleInput = document.querySelector('#post-title-input')
    const postDescriptionInput = document.querySelector('#post-description-textarea')
    const imagesContainer = document.querySelector('#images-container')
    const editNavItem = document.querySelector('#edit-nav-item')
    const saveChangesBtn = document.querySelector('#save-changes-btn')
    const citySelectbox = document.querySelector('#city-selectbox')
    const postPriceInput = document.querySelector('#post-price-input')
    const exchangeCheckbox = document.querySelector('#exchange-checkbox')
    const loading = document.querySelector('#loading-container')
    const deletePostBtn = document.querySelector('#delete-post-btn')

    let mapView = null;
    let pics = [];
    let dynamicFieldsData = {}
    let editMap = null;
    let editMapMarker = null;
    let previewMap = null;
    let previewMapMarker = null;

    const postId = getUrlParam('id')
    const token = getToken()

    const res = await fetch(`${baseUrl}/v1/post/${postId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    if (data.status == 404) {
        location.href = "/pages/posts.html"
    }

    const generateDatas = (data) => {
        // preview tab start 
        loading.style.display = 'none'
        postTitle.innerHTML = data.title
        document.title = data.title
        const date = calculateTimeDifference(data.createdAt)
        console.log(data.neighborhood.id);
        postIntro.innerHTML = `${date} در ${data.city.name} ${data.neighborhood.id !== 0 ? '،' + data.neighborhood.name : ''}`
        postDiscription.innerHTML = data.description
        citySelectbox.innerHTML = `<option>${data.neighborhood.name}</option>`

        data.dynamicFields.forEach(item => {
            dynamicFieldsData[item.slug] = item.data;
        });
        mapView = { x: data.map.x, y: data.map.y };

        postInfoes.innerHTML = ''
        postInfoes.insertAdjacentHTML('beforeend', `
        <li class="post__info-item">
                    <span class="post__info-key">قیمت</span>
                    <span class="post__info-value">${data.price.toLocaleString()} تومان</span>
        </li>
        <li class="post__info-item">
        <span class="post__info-key">دسته بندی</span>
        <a href="/pages/posts.html?categoryId=${data.category._id}" class="post__info-value">${data.category.title}</a>
        </li>
        <li class="post__info-item">
                    <span class="post__info-key">مایل به معاوضه</span>
                    <span class="post__info-value">${data.exchange ? 'هستم' : 'نیستم'}</span>
        </li>
        `)
        data.dynamicFields.map(field => {
            postInfoes.insertAdjacentHTML('beforeend', `
                  <li class="post__info-item">
                        <span class="post__info-key">${field.name}</span>
                        ${field.type == 'checkbox' ? `<span class="post__info-value">${field.data ? 'بله' : 'خیر'}</span>` : `<span class="post__info-value">${field.data}</span>`}
                   </li>
        `)
        })
        postStatus.innerHTML = ''
        if (data.status == "published") {
            postStatus.insertAdjacentHTML('beforeend', ` 
            <p class="publish">منتشر شده</p>
            <p class="post-status-description">آگهی منتشر شده و در لیست آگهی‌های دیوار قرار گرفته است.</p>
            `)
        } else if (data.status == "rejected") {
            postStatus.insertAdjacentHTML('beforeend', ` 
            <p class="reject">رد شده</p>
            <p class="post-status-description">اطلاعات آگهی گنگ یا ناکافی‌ است و یا شامل کالا یا خدمت مشخصی نیست.</p>
            `)
        } else {
            postStatus.insertAdjacentHTML('beforeend', ` 
            <p class="pending">در صف انتشار</p>
            <p class="post-status-description">آگهی‌ در صف انتشار قرار دارد. زمان انتظار در صف حداکثر ۲ ساعت خواهد بود.</p>
            `)
        }

        // مپ از قبل اگ ساخته شده باشه دوباره نمیسازیم و مقدار دهی فقط میکنیم
        if (!previewMap) {
            previewMap = L.map('preview-map').setView([data.map.x, data.map.y], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19
            }).addTo(previewMap);
            var icon = L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==',
                iconSize: [45, 45]
            });
            previewMapMarker = L.marker([data.map.x, data.map.y],{icon:icon}).addTo(previewMap);
        } else {
            previewMap.setView([data.map.x, data.map.y], 13);
            previewMapMarker.setLatLng([data.map.x, data.map.y]);
        }
        // preview tab end

        // edit tab start

        categoryTitle.innerHTML = data.category.title
        postTitleInput.value = data.title
        postDescriptionInput.innerHTML = data.description
        postPriceInput.value = data.price
        data.exchange ? exchangeCheckbox.checked = true : exchangeCheckbox.checked = false

        editNavItem.addEventListener("click", () => {
            if (!editMap) {
                editMap = L.map('edit-map').setView([data.map.x, data.map.y], 13);
                var icon = L.icon({
                    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==',
                    iconSize: [45, 45]
                });
                editMapMarker = L.marker([data.map.x, data.map.y], { icon: icon }).addTo(editMap);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">33</a>'
                }).addTo(editMap);

            }
            editMap.on('move', () => {
                const center = editMap.getSize().divideBy(2);
                const targetPoint = editMap.containerPointToLayerPoint(center);
                const targetLatLng = editMap.layerPointToLatLng(targetPoint);
                editMapMarker.setLatLng(targetLatLng);
                editMapMarker.getElement().style.pointerEvents = 'none';
                mapView = {
                    x: targetLatLng.lat,
                    y: targetLatLng.lng
                };
            });
        })

        data.category.productFields.map(field => {
            let prevUserSelect = data.dynamicFields.find(productField => productField.slug === field.slug)
            let filteredOptions = field.options.filter(option => option !== prevUserSelect.data)
            console.log(prevUserSelect.data)
            dynamicFields.insertAdjacentHTML('beforeend', `
            ${field.type == 'selectbox' ? (
                    `
            <div class="group">
                    <p class="edit-title">${field.name}</p>
                    <div class="field-box"> 
                        <select
                        onchange="fieldChangeHandler('${field.slug}', event.target.value)"
                            required="required"> 
                            <option value="${prevUserSelect.data}">${prevUserSelect.data}</option> 
                                ${filteredOptions.map(option => (
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
                    //اینجا نیاز به بررسی خودتون داره پیوی پیام بدید تا بگم چرا
                    prevUserSelect.data ? (
                        ` 
                        <div class="group checkbox-group">
                        <input checked="true" onchange="fieldChangeHandler('${field.slug}', event.target.checked)" class="checkbox" type="checkbox">
                        <p>${field.name}</p>
                    </div> 
                        `
                    ) : (
                        ` 
                        <div class="group checkbox-group">
                        <input  onchange="fieldChangeHandler('${field.slug}', event.target.checked)" class="checkbox" type="checkbox">
                        <p>${field.name}</p>
                    </div> 
                        `
                    )

                ) : ""}
            `)
        })

        window.fieldChangeHandler = function (slug, data) {
            dynamicFieldsData[slug] = data;
        }

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

        saveChangesBtn.addEventListener('click', async () => {
            console.log(dynamicFieldsData);
            loading.style.display = 'block'
            const token = getToken()
            const formData = new FormData();
            formData.append("city", data.city.id);
            formData.append("neighborhood", data.neighborhood.id);
            formData.append("title", postTitleInput.value);
            formData.append("price", postPriceInput.value);
            formData.append("exchange", exchangeCheckbox.checked);
            formData.append("description", postDescriptionInput.value);
            formData.append("map", JSON.stringify(mapView));
            formData.append("categoryFields", JSON.stringify(dynamicFieldsData));
            pics?.map(picture => {
                formData.append("pics", picture);
            })
            const editPostRes = await fetch(`${baseUrl}/v1/post/${postId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })
            const editPostResData = await editPostRes.json()
            loading.style.display = 'none'
            if (editPostResData.status === 200) {
                showSwal('آگهی با موفقیت تغییر یافت', 'success', 'حله', () => null)
            }
            console.log(editPostResData.data.post);
            generateDatas(editPostResData.data.post)
        })

        // edit tab end
    }

    generateDatas(data.data.post)

    deletePostBtn.addEventListener('click', () => {
        let recentSeen = getFromLocalStorage('recent-seen') 
      
        showSwal('آیا  از حذف آگهی اطمینان دارید؟', "warning", ['خیر', 'بله'], (res) => {
            if (res) {
                loading.style.display = 'block' 
                fetch(`${baseUrl}/v1/post/${postId}/xbox`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status == 200) {
                        loading.style.display = 'none' 
                        if (recentSeen) {
                            const newRecentId = recentSeen.find(recent => recent !== postId) 
                            if (newRecentId) {
                                saveIntoLocalStorage('recent-seen', [newRecentId])
                            } else {
                                localStorage.removeItem('recent-seen')
                            }
                        } 
                        showSwal('آگهی با موفقیت حذف شد', "success", 'حله', () => location.href = "/pages/posts.html")
                    }
                })
            }
        })

    })

})


