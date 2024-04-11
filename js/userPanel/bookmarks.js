import { baseUrl, calculateTimeDifference, getToken, showSwal } from "../funcs/utils.js"

window.addEventListener('load', async () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    let posts = null;

    const postGenerator = (post) => {
        const date = calculateTimeDifference(post.createdAt)
        console.log(date);

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
                '<img src="/images/main/noPicture.PNG">'
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
    }

    const res = await fetch(`${baseUrl}/v1/user/bookmarks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    const data = await res.json()
    if (data.data.posts.length) {
        console.log(data.data.posts);
        posts = data.data.posts
        posts.map(post => {
            console.log(posts);
            postGenerator(post)
        })
    } else {
        emptyContainer.style.display = 'flex'
    }


    window.removeBookmarkHandler = function (postId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                fetch(`${baseUrl}/v1/bookmark/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        posts = posts.filter(post => post._id !== postId)
                        postsContainer.innerHTML = ""
                        if (posts.length) {
                            posts.map(post => {
                                postGenerator(post)
                            })
                        } else {
                            emptyContainer.style.display = 'flex'
                        }

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

// publish
// waiting
// reject