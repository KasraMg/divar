import { baseUrl, calculateTimeDifference, getToken, getUrlParam, paginateItems } from "../../../utlis/utils.js"

window.addEventListener('load', async () => {
    const token = getToken()
    let page = getUrlParam('page')
    !page ? page = 1 : null

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    const loading = document.querySelector('#loading-container')
    const paginateParentElem = document.querySelector('.pagination-items')

    const res = await fetch(`${baseUrl}/v1/user/posts?page=${page}&limit=3`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    const data = await res.json()



    loading.style.display = 'none'
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
                         alt="pic">`
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
                ) : ''}
                        ${post.status == 'rejected' ? (
                    ` <p class="reject">رد شده</p>`
                ) : ''}
                        ${post.status == 'pending' ? (
                    `<p class="pending">در صف انتشار</p>`
                ) : ''}
                        
                    </div>
                    <button class="controll-btn">مدیریت اگهی</button>
                </div>


 
            </a>
                `)
        }) 
        paginateItems('/pages/userPanel/posts.html', paginateParentElem, page, data.data.pagination.totalPosts, 3)

    } else {
        emptyContainer.style.display = 'flex'
    }

})



