

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
        const res = await fetch(`${baseUrl}/v1/user/notes?page=${page}&limit=3`, {
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
        ${post.pics.length ? (
                        ` <img
        src="${baseUrl}/${post.pics[0].path}"
        alt>`
                    ) : (
                        '<img src="/public/images/main/noPicture.PNG">'
                    )}
            <div>
                <a class="title" href='/pages/post.html?id=${post._id}'>${post.title}</a>
                <p>${date} در ${post.city.name} ${post.neighborhood.id !== 0 ? '، ' + post.neighborhood.name : ''}</p>
                <p>${post.note.content}</p>
            </div>
        </div>
        <i  onclick="removeNoteHandler('${post.note._id}')" class="bi bi-trash"></i>
    </div>  
        `)
            }) 
            paginateItems('/pages/userPanel/notes.html', paginateParentElem, page, data.data.pagination.totalPosts, 3)
        } else {
            emptyContainer.style.display = 'flex'
        }

    }
    postsGenerator()

    window.removeNoteHandler = function (noteId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                loading.style.display = 'block'
                fetch(`${baseUrl}/v1/note/${noteId}/xbox`, {
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

})


