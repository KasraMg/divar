import { getMe, logout } from "../../../utlis/auth.js"
import { isLogin } from "../../../utlis/utils.js"



window.addEventListener('load', async () => {
    const phoneNumber = document.querySelector('#phone-number')
    const logoutBtn = document.querySelector('.logout')
    const userLogin = await isLogin()

    if (userLogin) {
        getMe().then(data => {
            if (data.role === 'USER') {
                location.href = '/pages/posts.html'
            }
            phoneNumber.innerHTML = `${data.phone}`
        })
    } else {
        location.href = '/pages/posts.html'
    }
 
    logoutBtn.addEventListener('click', () => {
        logout()
    })
})
