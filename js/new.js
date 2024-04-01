import { isLogin } from "./funcs/utils.js"

window.addEventListener('load', () => {
    const isUserLogin = isLogin()
    if (isUserLogin) {

    } else {
        location.href = '/posts.html'
    }
})