import { baseUrl, calculateTimeDifference, getToken } from "../funcs/utils.js"

window.addEventListener('load', () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')


   

    fetch(`${baseUrl}/v1/user/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).then(res => res.json())
        .then(data => { 
            if (data.data.posts.length) {
                data.data.posts.map(post => {
                    const date = calculateTimeDifference(post.createdAt)
                    console.log(date);
                    postsContainer.insertAdjacentHTML('beforeend', `
                <div class="post">
                <div class="post-info">
                ${post.pics.length ? (
                            ` <img
src="${baseUrl}/${post.pics[0].path}"
    alt>`
                        ) : (
                            '<img src=/images/main/noPicture.PNG">'
                        )}
                   
                    <div>
                        <a class="title" href>${post.title}</a> 
                        <p>${date} در تهران</p> 
                    </div>
                </div>
                <div class="post-status">
                    <div>
                        <p>وضعیت آگهی: </p>
                        <p class="waiting">در صف انتشار</p>
                    </div>
                    <a class="controll-btn" href="post/post.html">مدیریت اگهی</a>
                </div>
            </div>
                `)
                })

            } else {
                emptyContainer.style.display = 'flex'
            }
        })
})

// publish
// waiting
// reject