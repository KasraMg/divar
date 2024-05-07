import { getMe } from "../../../utlis/auth.js";
import { baseUrl, getToken } from "../../../utlis/utils.js";


window.addEventListener('load', () => {
    const phoneNumber = document.querySelector('#phone-number')
    const verifyInput = document.querySelector('#verify-input')
    const verifyBtn = document.querySelector('#verify-btn')
    const verifyError = document.querySelector('#verify-error')
    const verifyContainer = document.querySelector('#verify-container')
    const loading = document.querySelector('#loading-container')
    const token = getToken()

    getMe().then(data => {
        console.log(data);
        loading.style.display = 'none'
        if (data.verified) {
            verifyContainer.innerHTML = ''
            const gregorianDate = new Date(data.verificationTime);
            const persianMonths = [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
            ];
            const year = gregorianDate.getFullYear();
            console.log(data.verificationTime);
            const month = persianMonths[gregorianDate.getMonth() - 3]
            verifyContainer.insertAdjacentHTML('beforeend', `
            <div class="verified">
            <p>تأیید هویت شده</p>
            <span>تأیید هویت شما در ${month} ۱۴۰۳ از طریق کد ملی انجام شد.</span>  
            <img width="100" height="100" src="https://img.icons8.com/ios/100/approval--v1.png" alt="approval--v1"/>
            </div>
                `)
        }
        phoneNumber.innerHTML = data.phone
    })
    const NationalCodeRegex = RegExp(/^[0-9]{10}$/)

    verifyBtn.addEventListener('click', () => {
        const NationalCodeRegexResult = NationalCodeRegex.test(verifyInput.value)

        if (NationalCodeRegexResult) {
            loading.style.display = 'block'
            verifyError.style.display = 'none'
            fetch(`${baseUrl}/v1/user/identity`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nationalCode: verifyInput.value })
            }).then(res => {
                console.log(res);
                loading.style.display = 'none'
                if (res.status == 400) {
                    verifyError.style.display = 'flex'
                } else if (res.status == 200) {
                    const gregorianDate = new Date(data.verificationTime);
                    const persianMonths = [
                        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
                    ];
                    const year = gregorianDate.getFullYear();
                    console.log(data.verificationTime);
                    const month = persianMonths[gregorianDate.getMonth() - 3]
                    verifyError.style.display = 'none'
                    verifyContainer.innerHTML = ""
                    verifyContainer.insertAdjacentHTML('beforeend', `
                <div class="verified">
                <p>تأیید هویت شده</p>
                <span>تأیید هویت شما در ${month} ۱۴۰۳ از طریق کد ملی انجام شد.</span>  
                <img width="100" height="100" src="https://img.icons8.com/ios/100/approval--v1.png" alt="approval--v1"/>
                </div>
                    `)
                }
            })
        } else {
            verifyError.style.display = 'flex'
        }
    })
})