import { getAndShowPostCategories, getCourseDetails } from "./funcs/shared.js";
 

window.addEventListener('load', () => {
    getCourseDetails().then(postData => {
        const postTitle = document.querySelector('#post-title')
        const postInfoes = document.querySelector('#post-infoes-list')
        const postDiscription = document.querySelector('#post-description')
        const mainSlider = document.querySelector('#main-slider-wrapper')
        const secondSlider = document.querySelector('#secend-slider-wrapper')

        const data = postData.data.post
        console.log(data);
        postTitle.innerHTML = data.title
        postDiscription.innerHTML = data.description

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

        // Initialize Swiper
        const mainSliderSwiper = new Swiper('.mySwiper', {
            spaceBetween: 10,
            rewind: true,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        const secondSliderSwiper  = new Swiper('.mySwiper2', {
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

      

    })
    const feedbackIcons = document.querySelectorAll('.post_feedback_icon')

    feedbackIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            feedbackIcons.forEach(icon => icon.classList.remove('active'))
            icon.classList.add('active')
        })
    })
})

