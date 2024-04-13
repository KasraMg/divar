import { baseUrl, calculateTimeDifference, getToken } from "../../../utlis/utils.js"

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
            console.log(data);
            if (data.data.posts.length) {
                data.data.posts.map(post => {
                    const date = calculateTimeDifference(post.createdAt)
                    console.log(date);
                    postsContainer.insertAdjacentHTML('beforeend', `
                <a href="/pages/userPanel/posts/preview.html?id=${post._id}" class="post">

 
                <div class="post-info">
                ${post.pics.length ? (
                            ` <img
src="${baseUrl}/${post.pics[0].path}"
    alt>`
                        ) : (
                            '<img src="/public/images/main/noPicture.PNG">'
                        )} 
                    <div>
                        <p class="title">${post.title}</p> 
                        <p class="price">${post.price.toLocaleString()} تومان</p> 
                        <p class="location">${date} در تهران</p> 
                    </div>
                </div>
                <div class="post-status">
                    <div>
                        <p>وضعیت آگهی: </p>
                        ${post.status == 'published' ? (
                            `  <p class="publish">منتشر شده</p>`
                        ): ''}
                        ${post.status == 'rejected' ? (
                            ` <p class="reject">رد شده</p>`
                        ): ''}
                        ${post.status == 'pending' ? (
                            `<p class="pending">در صف انتشار</p>`
                        ): ''}
                        
                    </div>
                    <button class="controll-btn">مدیریت اگهی</button>
                </div>


 
            </a>
                `)
                })

            } else {
                emptyContainer.style.display = 'flex'
            }
        })
})

 

 