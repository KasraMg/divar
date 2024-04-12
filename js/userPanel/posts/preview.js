import { getPostDetails } from "../../funcs/shared.js";
import { calculateTimeDifference } from "../../funcs/utils.js";


window.addEventListener('load', () => {
    const postTitle = document.querySelector('#post-title')
    const postInfoes = document.querySelector('#post-infoes-list')
    const postLocation = document.querySelector('#post-location')
    const postStatus = document.querySelector('#post-status')
    const postDiscription = document.querySelector('#post-description')
    const categoryTitle = document.querySelector('#category-title')
    const dynamicFields = document.querySelector('#dynamic-fields')
    const postTitleInput = document.querySelector('#post-title-input')
    const postDescriptionInput = document.querySelector('#post-description-input')
    const postImages = document.querySelector('#post-images')

    getPostDetails().then(data => {
        console.log(data);
        postTitle.innerHTML = data.title
        document.title = data.title
        const date = calculateTimeDifference(data.createdAt)
        postLocation.innerHTML = `${date} در ${data.city.name}، ${data.neighborhood.name}`
        postDiscription.innerHTML = data.description

        postInfoes.insertAdjacentHTML('beforeend', `
        <li class="post__info-item">
                    <span class="post__info-key">قیمت</span>
                    <span class="post__info-value">${data.price.toLocaleString()} تومان</span>
        </li>
        <li class="post__info-item">
        <span class="post__info-key">دسته بندی</span>
        <a href="/posts.html?categoryId=${data.category._id}" class="post__info-value">${data.category.title}</a>
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
                                    <span class="post__info-value">${field.data}</span>
                        </li>
    `)
        })

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


        var map = L.map('preview-map').setView([data.map.x, data.map.y], 13);
        var marker = L.marker([data.map.x, data.map.y]).addTo(map);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);



        // edit post

        categoryTitle.innerHTML = data.category.title
        postTitleInput.value = data.title
        postDescriptionInput.innerHTML = data.description
        let icon = null;
        let iconStatus = true


        var editMap = L.map('edit-map').setView([data.map.x, data.map.y], 13);

        var icon1 = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==',
            iconSize: [30, 30]
        });
        var icon2 = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==',
            iconSize: [30, 30]
        });
        icon = icon1

        const iconControll = document.querySelector('.icon-controll')
        iconControll.addEventListener('click', () => {
            if (iconStatus) {
                icon = icon2;
                editMapMarker.setIcon(icon); // افزودن این خط برای بروزرسانی آیکون نقشه
                iconStatus = false
            } else {
                icon = icon1;
                editMapMarker.setIcon(icon);
                console.log(icon2);
                iconStatus = true
            }
        });
        var editMapMarker = L.marker([data.map.x, data.map.y], { icon: icon }).addTo(editMap);


        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(editMap);

        editMap.on('move', () => {
            const center = editMap.getSize().divideBy(2);
            const targetPoint = editMap.containerPointToLayerPoint(center);
            const targetLatLng = editMap.layerPointToLatLng(targetPoint);
            editMapMarker.setLatLng(targetLatLng);
            editMapMarker.getElement().style.pointerEvents = 'none';
        });




        data.category.productFields.map(field => {
            let prevUserSelect = data.dynamicFields.find(productField => productField.slug === field.slug)
            let filteredOptions = field.options.filter(option => option !== prevUserSelect.data)

            dynamicFields.insertAdjacentHTML('beforeend', `
            ${field.type == 'selectbox' && (
                    `
            <div class="group">
                    <p class="edit-title">${field.name}</p>
                    <label class="select" for="slct">
                     
                        <select id="slct"
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
                    </label>
                    <svg class="sprites">
                        <symbol id="select-arrow-down"
                            viewbox="0 0 10 6">
                            <polyline points="1 1 5 5 9 1"></polyline>
                        </symbol>
                    </svg>
                </div>
    `
                )}
            
            `)
        })


        uploader.addEventListener('change', (event) => {
            console.log(event.target.files[0]);
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
                    alert('Invalid file type. Please upload a .png or .jpg file.');
                }
            }
        });


    })

 


})