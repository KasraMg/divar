import { baseUrl, getToken } from "../../../utlis/utils.js"


window.addEventListener('load', async () => {
    const token = getToken()
    const articlesCount = document.querySelector('#articles-count')
    const usersCount = document.querySelector('#users-count')
    const postsCount = document.querySelector('#posts-count')
    const usersTable = document.querySelector('#users-table')
    const postsTable = document.querySelector('#posts-table')
    const loading = document.querySelector('#loading-container')

    const res = await fetch(`${baseUrl}/v1/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    const data = await res.json()
    loading.style.display = 'none'
    articlesCount.innerHTML = data.data.articlesCount
    usersCount.innerHTML = data.data.usersCount
    postsCount.innerHTML = data.data.postsCount
    data.data.users.filter(user => (
        usersTable.insertAdjacentHTML('beforeend', `
                 <tr>
                    <td>${user.phone}</td>
                    <td>${user.verified ? 'تایید شده ' : 'تایید نشده '}</td>
                    <td>${user.postsCount}</td>
                </tr>
        `)
    ))
    data.data.posts.filter(post => (
        postsTable.insertAdjacentHTML('beforeend', `
                 <tr> 
                    <td>${post.title}</td>
                    <td>09046417084</td>
                    <td>موبایل و تبلت</td> 
                </tr>
        `)
    ))
})