import { baseUrl, getFromLocalStorage, getToken, getUrlParam, saveIntoLocalStorage, showSwal } from "../../../utlis/utils.js"

window.addEventListener('load', () => {
    const loading = document.querySelector('#loading-container')
    const token = getToken()
    let page = getUrlParam('page')
    !page ? page = 1 : null

    const postsGenerator = async () => {
        const postsTable = document.querySelector('#posts-table')
        const paginateParentElem = document.querySelector('.pagination-items')
        const res = await fetch(`${baseUrl}/v1/post/all?page=${page}&limit=5`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        const data = await res.json()
        console.log(data);
        loading.style.display = 'none'
        postsTable.innerHTML = ''
        postsTable.insertAdjacentHTML("beforeend", `
        <tr>
               <th>تیتر</th>
               <th>کاربر</th>
               <th>وضعیت</th>
               <th>تایید</th>
               <th>رد</th>
               <th>خذف</th>
           </tr>
          ${data.data.posts.map(post => (
            `  <tr>
               <td>${post.title}</td>
               <td>${post.creator.phone}</td>
               <td>
               ${post.status == 'published' ? (
                `  <p class="publish">منتشر شده</p>`
            ) : ''}
               ${post.status == 'rejected' ? (
                ` <p class="reject">رد شده</p>`
            ) : ''}
               ${post.status == 'pending' ? (
                `<p class="pending">در صف انتشار</p>`
            ) : ''}</td>
               <td> ${post.status === 'published' || post.status === 'rejected' ? '❌' : `<button  onclick="acceptPostHandler('${post._id}')" class="edit-btn">تایید</button>`}</td>
               <td> ${post.status === 'published' || post.status === 'rejected' ? '❌' : `<button  onclick="rejectPostHandler('${post._id}')" class="edit-btn">رد </button>`}</td>
               <td><button class="delete-btn" onclick="deletePostHandler('${post._id}')">حذف</button></td>
           </tr>
           `
        )).join('')}
        `)


        paginateParentElem.innerHTML = ''
        let paginatedCount = Math.ceil(data.data.pagination.totalPosts / 5)

        for (let i = 1; i < paginatedCount + 1; i++) {
            paginateParentElem.insertAdjacentHTML('beforeend', `
            ${i === Number(page) ? `
            <li class="active">
            <a href="/pages/adminPanel/posts.html?page=${i}">
                     ${i}
             </a>
            </li>
       `: `
           <li>
            <a href="/pages/adminPanel/posts.html?page=${i}">
                    ${i}
            </a>
            </li>
       ` }
          
            
          `)
        }
    }
    postsGenerator()
    window.deletePostHandler = (postId) => {
        let recentSeen = getFromLocalStorage('recent-seen')

        showSwal('آیا از حذف آگهی اطمینان دارید؟', 'warning', ['خیر ', 'بله'], (res) => {
            if (res) {
                fetch(`${baseUrl}/v1/post/${postId}/xbox`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        postsGenerator()
                        if (recentSeen) {
                            const newRecentId = recentSeen.find(recent => recent !== postId) 
                            console.log(newRecentId);
                            if (newRecentId) {
                                saveIntoLocalStorage('recent-seen', [newRecentId])
                            } else {
                                localStorage.removeItem('recent-seen')
                            }
                        }
                        showSwal('آگهی با موفقیت حذف شد', 'success', 'اوکی', () => null)
                    }
                })
            }
        })


    }
    window.acceptPostHandler = (postId) => {
        showSwal('آیا از تایید آگهی اطمینان دارید؟', 'warning', ['خیر ', 'بله'], (res) => {
            if (res) {
                fetch(`${baseUrl}/v1/post/${postId}/status`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'published' })
                }).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        postsGenerator()
                        showSwal('آگهی با موفقیت تایید شد', 'success', 'اوکی', () => null)
                    }
                })

            }
        })


    }
    window.rejectPostHandler = (postId) => {
        showSwal('آیا از رد آگهی اطمینان دارید؟', 'warning', ['خیر ', 'بله'], (res) => {
            if (res) {
                fetch(`${baseUrl}/v1/post/${postId}/status`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'rejected' })
                }).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        postsGenerator()
                        showSwal('آگهی با موفقیت رد شد', 'success', 'اوکی', () => null)
                    }
                })

            }
        })


    }
})