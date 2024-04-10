

import { baseUrl, calculateTimeDifference, getToken, showSwal } from "../funcs/utils.js"

window.addEventListener('load', async () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')
    let posts = null;

    const postGenerator = (post) => {
        const date = calculateTimeDifference(post.createdAt)
        postsContainer.insertAdjacentHTML('beforeend', ` 
        <div class="post">
        <div>
        ${post.pics.length ? (
                ` <img
        src="${baseUrl}/${post.pics[0].path}"
        alt>`
            ) : (
                '<img src=/images/main/noPicture.PNG">'
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
    }
    const res = await fetch(`${baseUrl}/v1/user/notes`, {
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

    window.removeNoteHandler = function (noteId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                fetch(`${baseUrl}/v1/note/${noteId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        console.log(res);
                        posts = posts.filter(post => post.note._id !== noteId)
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

})


