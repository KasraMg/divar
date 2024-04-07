import { getMe } from "../funcs/auth.js";
import { baseUrl, getToken } from "../funcs/utils.js";


window.addEventListener('load', () => {
    const phoneNumber = document.querySelector('#phone-number')
    const verifyInput = document.querySelector('#verify-input')
    const verifyBtn = document.querySelector('#verify-btn')
    const verifyError = document.querySelector('#verify-error')

    const token = getToken()

    getMe().then(data => {
        console.log(data);
        phoneNumber.innerHTML = data.phone
    })
    const NationalCodeRegex = RegExp(/^[0-9]{10}$/)

    verifyBtn.addEventListener('click', () => { 
        const NationalCodeRegexResult = NationalCodeRegex.test(verifyInput.value)
        console.log(NationalCodeRegexResult);
        if (NationalCodeRegexResult) { 
            verifyError.style.display = 'none'
            fetch(`${baseUrl}/v1/user/identity`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({nationalCode:verifyInput.value})
            }).then(res=>{
                console.log(res);
                if (res.status == 400) {
                    verifyError.style.display = 'flex' 
                }else if(res.status == 200){
                    verifyError.style.display = 'none' 
                }
            })
        } else {
            verifyError.style.display = 'flex'
        }
    })
})