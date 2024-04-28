import { baseUrl, getToken, getUrlParam, paginateItems, showSwal } from "../../../utlis/utils.js"


window.addEventListener('load', () => {
    const token = getToken()
    const usersTable = document.querySelector('#users-table')
    const loading = document.querySelector('#loading-container')
    let page = getUrlParam('page')

    !page ? page = 1 : null

    const usersGenerator = async () => {
        const paginateParentElem = document.querySelector('.pagination-items')
        const res = await fetch(`${baseUrl}/v1/users?page=${page}&limit=5`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        const data = await res.json()
        console.log(data);
        loading.style.display = 'none'
        usersTable.innerHTML = ''
        usersTable.insertAdjacentHTML('beforeend', `
        <tr>
              <th>کاربر</th>
              <th>تعداد آگهی</th>
              <th>هویت</th>
              <th>نقش</th>
              <th>تغییر نقش</th>
              <th>بن</th>
          </tr>       
        `
        )
        data.data.users.map(user => (
            usersTable.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${user.phone}</td>
        <td>${user.postsCount}</td>
        <td>${user.verified ? 'تایید شده ' : 'تایید نشده '}</td>
        <td>${user.role !== "USER" ? 'ادمین' : 'کاربر'}</td>
        <td><button onclick="changeRoleHandler('${user._id}','${user.role}')" class="edit-btn">تغییر</button></td>
        <td><button onclick="banUserHandler('${user._id}')" class="delete-btn">بن</button></td>
      </tr>
        `)
        ))

        paginateItems('/pages/adminPanel/users.html', paginateParentElem, page, data.data.pagination.totalUsers, 5)
    }
    usersGenerator()

    window.changeRoleHandler = (userId, userRole) => {
        showSwal('آیا از تغییر سطح کاربر اطمینان دارید؟', 'warning', ['خیر', 'بله'], (res) => {
            if (res) {
                const newRole = {
                    role: userRole === 'ADMIN' ? 'USER' : 'ADMIN'
                }
                fetch(`${baseUrl}/v1/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(newRole)
                }).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        showSwal('سطح کاربر با موفقیت عوض شد', 'success', 'بله', () => null)
                    }
                    usersGenerator()
                })
            }
        })
    }
    window.banUserHandler = (userId) => {
        showSwal('آیا از بن کاربر اطمینان دارید؟', 'warning', ['خیر', 'بله'], (res) => {
            if (res) {
                fetch(`${baseUrl}/v1/users/ban/${userId}/xbox`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }).then(() => {
                    showSwal(' کاربر با موفقیت بن شد', 'success', 'بله', () => null)
                    usersGenerator()
                })
            }
        })
    }
})