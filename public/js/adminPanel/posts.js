import { baseUrl, getToken, showSwal } from "../../../utlis/utils.js"

window.addEventListener('load', () => {
    const loading = document.querySelector('#loading-container')
    const token = getToken()
    const postsGenerator = async () => {
        const postsTable = document.querySelector('#posts-table')

        const res = await fetch(`${baseUrl}/v1/post/all`, {
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
    }
    postsGenerator()
    window.deletePostHandler = (postId) => {
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