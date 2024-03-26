import { getAndShowPostCategories, getCourseDetails, getUserBookmarks } from "./funcs/shared.js";
import { getToken, getUrlParam, isLogin, showModal, showSwal } from "./funcs/utils.js";






window.addEventListener('load', () => {
    const userLogin = isLogin()
    
    getCourseDetails().then(postData => {
        const postTitle = document.querySelector('#post-title')
        const postInfoes = document.querySelector('#post-infoes-list')
        const postDiscription = document.querySelector('#post-description')
        const mainSlider = document.querySelector('#main-slider-wrapper')
        const secondSlider = document.querySelector('#secend-slider-wrapper')
        const shareIcon = document.querySelector('#share-icon')
        const bookmarkIconBtn = document.querySelector('#bookmark-icon-btn')
        const postPreview = document.querySelector('#post-preview')
        const phoneInfoBtn = document.querySelector('#phone-info-btn')
        const noteTextarea = document.querySelector('#note-textarea')
        const noteTrashIcon = document.querySelector('#note-trash-icon')

        const data = postData.data.post
        console.log(data);
        postTitle.innerHTML = data.title
        postDiscription.innerHTML = data.description
        const token = getToken()
        let bookmarkStaus;
        shareIcon.addEventListener("click", async () => {
            await navigator.share({ title: data.title, url: location.href });
        });

        const checkBookmark = () => { 
            if (userLogin) {
                const icon = bookmarkIconBtn.querySelector('.bi')
            getUserBookmarks(token).then(bookmarksData => {
                bookmarksData.data.bookmarks.some(bookmark => {
                    if (bookmark.post._id == data._id) {
                        bookmarkStaus = true
                        icon.style.color = 'red'
                        return true
                    } else {
                        bookmarkStaus = false
                        icon.style.color = 'gray'
                    }
                })
            })
            } 
            
        }
        checkBookmark()
        bookmarkIconBtn.addEventListener("click", () => {
            const id = getUrlParam('id')
            if (userLogin) {
                if (bookmarkStaus) {
                    fetch(`https://divarapi.liara.run/v1/bookmark/${id}`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            checkBookmark()
                        }
                    })
                } else {
                    fetch(`https://divarapi.liara.run/v1/bookmark/${id}`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.status == 201) {
                            checkBookmark()
                        }
                    })
                }
    
            }else{
                showModal('login-modal', 'login-modal--active')
            }
           
        })

        postInfoes.insertAdjacentHTML('beforeend', `
        <li class="post__info-item">
                    <span class="post__info-key">قیمت</span>
                    <span class="post__info-value">${data.price.toLocaleString()} تومان</span>
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

        if (data.pics.length) {
            data.pics.map(pic => {
                mainSlider.insertAdjacentHTML("beforeend", `
                    <div class="swiper-slide">
                        <img src="https://divarapi.liara.run/${pic.path}" />
                    </div>`
                );
                secondSlider.insertAdjacentHTML("beforeend", `
                    <div class="swiper-slide">
                        <img src="https://divarapi.liara.run/${pic.path}" />
                    </div>`
                );
            });
        } else {
            postPreview.style.display = 'none'
        }

        phoneInfoBtn.addEventListener('click', () => {
            showSwal(`شماره تماس : ${data.creator.phone}`, null, 'اوکی', () => { })
        })



        noteTextarea.addEventListener('keyup', (event) => {
            if (event.target.value.length) {
                noteTrashIcon.style.display = 'block'
            } else {
                noteTrashIcon.style.display = 'none'
            }
        })
        noteTextarea.addEventListener('blur', (event) => {
            console.log(event.target.value);
            const noteData={
                postId: data._id,
                content: event.target.value
            }
            fetch('https://divarapi.liara.run/v1/note/',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                    
                },
                body:JSON.stringify(noteData)
            }).then(res=>{
                console.log(res);
            })
        })

        noteTrashIcon.addEventListener('click', () => {
            noteTextarea.value = ''
            noteTrashIcon.style.display = 'none'
        })











        // Initialize Swiper
        const mainSliderSwiper = new Swiper('.mySwiper', {
            spaceBetween: 10,
            rewind: true,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        const secondSliderSwiper = new Swiper('.mySwiper2', {
            spaceBetween: 10,
            rewind: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            thumbs: {
                swiper: mainSliderSwiper,
            },
        });

        // Initialize map
        var map = L.map('map').setView([data.map.x, data.map.y], 13);

        var icon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==',
            iconSize: [30, 30]
        });

        L.marker([data.map.x, data.map.y], { icon: icon }).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">33</a>'
        }).addTo(map);


    })

    // feadback icon
    const feedbackIcons = document.querySelectorAll('.post_feedback_icon')

    feedbackIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            feedbackIcons.forEach(icon => icon.classList.remove('active'))
            icon.classList.add('active')
        })
    })
})

