import { getMe } from "../../../utlis/auth.js"
import { isLogin } from "../../../utlis/utils.js"

 

window.addEventListener('load', async() => {
    const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')
    const userLogin = await isLogin()

    if (userLogin) {
        getMe().then(data=>{ 
            sidebarPhoneNumber.innerHTML=`تلفن : ${data.phone} `
        })
    } else {
        location.href = '/posts/html'
    }
})
