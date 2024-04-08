import { baseUrl, calculateTimeDifference, getToken } from "../funcs/utils.js"

window.addEventListener('load', () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    fetch(`${baseUrl}/v1/user/notes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).then(res => res.json())
        .then(data => {
            console.log(data);
            // if (data.data.notes.length) {
            //     data.data.notes.map(post => {
            //         const date =calculateTimeDifference(post.createdAt)
            //         console.log(date);
            //         postsContainer.insertAdjacentHTML('beforeend', `
                
            //     `)
            //     })

            // } else {
            //     emptyContainer.style.display='flex'
            // }
        })
})

 