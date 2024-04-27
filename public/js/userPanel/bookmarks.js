import { baseUrl, calculateTimeDifference, getToken, showSwal } from "../../../utlis/utils.js"

window.addEventListener('load', () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    const loading = document.querySelector('#loading-container')
    

    const postsGenerator = async () => {
        const res = await fetch(`${baseUrl}/v1/user/bookmarks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        const data = await res.json()
        loading.style.display = 'none'
        postsContainer.innerHTML=''
        if (data.data.posts.length) {
            data.data.posts.map(post => {
                const date = calculateTimeDifference(post.createdAt)
              
                postsContainer.insertAdjacentHTML('beforeend', `
                <div class="post">
                             <div>
                                 <div>
                                     <a class="title" href='/post.html?id=${post._id}'>${post.title}</a>
                                     <div>
                                         <p>${post.price.toLocaleString()} تومان</p>
                                         <p> ${date} در جنت‌آباد جنوبی</p>
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
        } else {
            emptyContainer.style.display = 'flex'
        } 

    }

    postsGenerator()
  
    window.removeBookmarkHandler = function (postId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                loading.style.display = 'block'
                fetch(`${baseUrl}/v1/bookmark/${postId}/xbox`, {
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
        await navigator.share({ title: postTitle, url: `/post.html?id=${postId}` });
    }

})

 