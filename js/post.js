var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    rewind: true,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,

});
var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    rewind: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});


const feedbackIcons = document.querySelectorAll('.post_feedback_icon')

feedbackIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        feedbackIcons.forEach(icon => icon.classList.remove('active'))
        icon.classList.add('active')
    })
})