import { getMe } from "../funcs/auth.js"
import { isLogin } from "../funcs/utils.js"

window.addEventListener('load', () => {
    const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')
    const userLogin = isLogin()

    if (userLogin) {
        getMe().then(data=>{ 
            sidebarPhoneNumber.innerHTML=`تلفن : ${data.phone} `
        })
    } else {
        location.href = '/posts/html'
    }
})