import { getMe, logout } from "../../../utlis/auth.js"
import { isLogin } from "../../../utlis/utils.js"

 

window.addEventListener('load', async() => {
    const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')
    const logoutBtn = document.querySelector('#logout-btn')
    const userLogin = await isLogin()

    if (userLogin) {
        getMe().then(data=>{ 
            sidebarPhoneNumber.innerHTML=`تلفن : ${data.phone} `
        })
    } else {
        location.href = '/pages/posts.html'
    }

    logoutBtn.addEventListener('click',()=>{
        logout() 
    })
})
