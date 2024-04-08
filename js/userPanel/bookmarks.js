import { baseUrl, calculateTimeDifference, convertToPersianDate, getToken, showSwal } from "../funcs/utils.js"

window.addEventListener('load', () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')


    const getBookmarksHandler = () => {
        fetch(`${baseUrl}/v1/user/bookmarks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.data.bookmarks.length) {
                    data.data.bookmarks.map(bookmark => {
                        const date = calculateTimeDifference(bookmark.createdAt)
                        console.log(date);
                        postsContainer.insertAdjacentHTML('beforeend', `
                       <div class="post">
                                    <div>
                                        <div>
                                            <a class="title" href='/post.html?id=${bookmark.post._id}'>${bookmark.post.title}</a>
                                            <div>
                                                <p>${bookmark.post.price} تومان</p>
                                                <p>۱ ساعت پیش در جنت‌آباد جنوبی</p>
                                            </div>
                                        </div>
                                        <img
                                            src="https://s100.divarcdn.com/static/photo/afra/thumbnail/H72jKosecIcfS1RtJLvhtw/3c29f6af-b802-460a-834e-560501852de8.jpg"
                                            alt>
                                    </div>
                                    <div>
                                        <button onclick="sharePostHandler('${bookmark.post._id}','${bookmark.post.title}')">
                                            اشتراک گذاری
                                            <i class="bi bi-share"></i>
                                        </button>
                                        <button onclick="removeBookmarkHandler('${bookmark._id}')">
                                            حذف نشان
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                       `)

                    })

                } else {
                    emptyContainer.style.display = 'flex'
                }
            })
    }
    getBookmarksHandler()

    window.removeBookmarkHandler = function (postId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                fetch(`${baseUrl}/v1/bookmark/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => res.json()).then(data => { console.log(data) })
            }
        })

    }
    window.sharePostHandler = async function (postId, postTitle) {
        await navigator.share({ title: postTitle, url: `/post.html?id=${postId}` });
    }

})

// publish
// waiting
// reject