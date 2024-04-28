import { baseUrl, calculateTimeDifference, getFromLocalStorage, saveIntoLocalStorage } from "../../../utlis/utils.js"

window.addEventListener('load', async () => {
    let recentSeen = getFromLocalStorage('recent-seen')
    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    const loading = document.querySelector('#loading-container')

    let posts = []

    const postGenerator = () => {
        postsContainer.innerHTML = ''
        posts.map(post => {
            const date = calculateTimeDifference(post.createdAt)
            console.log(post);
            postsContainer.insertAdjacentHTML('beforeend', `   
            <div class="post">
            <div>
            ${post.pics.length ? (
                    ` <img
            src="${baseUrl}/${post.pics[0].path}"
            alt>`
                ) : (
                    '<img src="/public/images/main/noPicture.PNG">'
                )}
                     <div>
                    <a class="title" href="/pages/post.html?id=${post._id}">${post.title}</a>
                    <p>${date} در ${post.city.name} ${post.neighborhood.id !== 0 ? '، ' + post.neighborhood.name : ''}</p> 
                </div>
            </div>
            <i onclick="sharePostHandler('${post._id}','${post.title}')" class="bi bi-share"></i>
            <i onclick="removeRecentHandler('${post._id}')" class="bi bi-trash"></i>
        </div>
        `)
        })

    }

    if (recentSeen) {
        for (const postId of recentSeen) { 
            const res = await fetch(`${baseUrl}/v1/post/${postId}`);
            const data = await res.json(); 
            if (data.status !== 404) {
                posts.push(data.data.post);
            } 
        }
     
        postGenerator();
    }
    else {
        postsContainer.innerHTML = ''
        emptyContainer.style.display = 'flex'
    }
    loading.style.display = 'none'
    
    window.sharePostHandler = async function (postId, postTitle) {
        await navigator.share({ title: postTitle, url: `/pages/post.html?id=${postId}` });
    }
    window.removeRecentHandler = function (postId) {
        const newRecentId = recentSeen.filter(recent => recent !== postId)
        recentSeen = newRecentId
        posts = posts.filter(recent => recent._id !== postId) 
        console.log(recentSeen);
        if (recentSeen.length) {
            saveIntoLocalStorage('recent-seen', [newRecentId])
        }else{
            localStorage.removeItem('recent-seen')
            emptyContainer.style.display = 'flex'
        }
        
        postGenerator()
    }
})