

import { baseUrl, calculateTimeDifference, getToken, showSwal } from "../../../utlis/utils.js"

window.addEventListener('load', () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    const loading = document.querySelector('#loading-container')


    const postsGenerator = async () => {
        const res = await fetch(`${baseUrl}/v1/user/notes`, {
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
                <a class="title" href>${post.title}</a>
                <p> ${date} در شهرک طالقانی</p>
                <p>${post.note.content}</p>
            </div>
        </div>
        <i  onclick="removeNoteHandler('${post.note._id}')" class="bi bi-trash"></i>
    </div>  
        `)
            })
        } else {
            emptyContainer.style.display = 'flex'
        }

    }
    postsGenerator()


    window.removeNoteHandler = function (noteId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                loading.style.display = 'block'
                fetch(`${baseUrl}/v1/note/${noteId}`, {
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


