import { isLogin } from "../../utlis/utils.js"

window.addEventListener('load', async() => {
    const isUserLogin = await isLogin()
    if (isUserLogin) {

    } else {
        location.href = '/pages/posts.html'
    }
})