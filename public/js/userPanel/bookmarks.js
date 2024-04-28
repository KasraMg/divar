import { baseUrl, calculateTimeDifference, getToken, getUrlParam, paginateItems, showSwal } from "../../../utlis/utils.js"

window.addEventListener('load', () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    const loading = document.querySelector('#loading-container')
    const paginateParentElem = document.querySelector('.pagination-items')
    let page = getUrlParam('page')
    !page ? page = 1 : null

    const postsGenerator = async () => {
        const res = await fetch(`${baseUrl}/v1/user/bookmarks?page=${page}&limit=4`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        const data = await res.json()
        loading.style.display = 'none'
        postsContainer.innerHTML = ''
        if (data.data.posts.length) {
            data.data.posts.map(post => {
                const date = calculateTimeDifference(post.createdAt)

                postsContainer.insertAdjacentHTML('beforeend', `
                <div class="post">
                             <div>
                                 <div>
                                     <a class="title" href='/pages/post.html?id=${post._id}'>${post.title}</a>
                                     <div>
                                         <p>${post.price.toLocaleString()} تومان</p> 
                                         <p>${date} در ${post.city.name} ${post.neighborhood.id !== 0 ? '، ' + post.neighborhood.name : ''}</p>
                                     </div>
                                 </div>
                                 ${post.pics.length ? (
                        ` <img
        src="${baseUrl}/${post.pics[0].path}"
            alt>`
                    ) : (
                        '<img src="/public/images/main/noPicture.PNG">'
                    )}
                             </div>
                             <div>
                                 <button onclick="sharePostHandler('${post._id}','${post.title}')">
                                     اشتراک گذاری
                                     <i class="bi bi-share"></i>
                                 </button>
                                 <button onclick="removeBookmarkHandler('${post._id}')">
                                     حذف نشان
                                     <i class="bi bi-trash"></i>
                                 </button>
                             </div>
                         </div>
                `)
            })
            paginateItems('/pages/userPanel/bookmarks.html', paginateParentElem, page, data.data.pagination.totalPosts, 4)
        } else {
            emptyContainer.style.display = 'flex'
        }

    }

    postsGenerator()

    window.removeBookmarkHandler = function (postId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                loading.style.display = 'block'
                fetch(`${baseUrl}/v1/bookmark/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        postsGenerator()
                    }
                }
                )
            }
        })

    }


    window.sharePostHandler = async function (postId, postTitle) {
        await navigator.share({ title: postTitle, url: `/pages/post.html?id=${postId}` });
    }

})

