import { baseUrl, getToken, showSwal } from "../../../utlis/utils.js"


window.addEventListener('load', () => {
    const token = getToken()
    const usersTable = document.querySelector('#users-table')
    const loading = document.querySelector('#loading-container')

    const usersGenerator = async () => {
        const res = await fetch(`${baseUrl}/v1/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        const data = await res.json()
        loading.style.display = 'none'

        usersTable.innerHTML = ''
        usersTable.insertAdjacentHTML('beforeend', `
        <tr>
              <th>کاربر</th>
              <th>تعداد آگهی</th>
              <th>نقش</th>
              <th>تغییر نقش</th>
              <th>بن</th>
          </tr>       
        `
        )
        data.data.users.reverse().map(user => (
            usersTable.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${user.phone}</td>
        <td>2</td>
        <td>${user.role !== "USER" ? 'ادمین' : 'کاربر'}</td>
        <td><button onclick="changeRoleHandler('${user._id}','${user.role}')" class="edit-btn">تغییر</button></td>
        <td><button onclick="banUserHandler('${user._id}')" class="delete-btn">بن</button></td>
      </tr>
        `)
        ))
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
                    usersGenerator()
                })
            }
        })
    }
    window.banUserHandler = (userId) => {
        showSwal('آیا از بن کاربر اطمینان دارید؟', 'warning', ['خیر', 'بله'], (res) => {
            if (res) {
                fetch(`${baseUrl}/v1/users/ban/${userId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }).then(res => {
                    console.log(res);
                    usersGenerator()
                })
            }
        })
    }
})