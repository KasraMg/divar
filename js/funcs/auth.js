import { saveIntoLocalStorage, getToken, hideModal } from "./utils.js";

const loginModalStep_1 = document.querySelector('.login_modal_step_1')
const loginModalStep_2 = document.querySelector('.login_modal_step_2')
const userNumberNotice = document.querySelector('.user_number_notice')
const userPhoneNumberInput = document.querySelector(".phone_Number_input");
const userCodeInput = document.querySelector(".code_input");
const step1LoginFormError = document.querySelector('.step-1-login-form__error')
const step2LoginFormError = document.querySelector('.step-2-login-form__error')
const requestCodeBtn=document.querySelector('.req_new_code_btn')
const changeNumberSpan = document.querySelector('.login-change-number')

const SubmitNumber = () => {
  const phoneRegex = RegExp(/^(09)[0-9]{9}$/) 

  const phoneRegexResult = phoneRegex.test(userPhoneNumberInput.value)

  if (phoneRegexResult) {
    step1LoginFormError.innerHTML = ""
    fetch(`https://divarapi.liara.run/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: userPhoneNumberInput.value.trim() }),
    }).then(res => {
      console.log(res);
      if (res.status == 200) {
        loginModalStep_1.style.display = 'none'
        loginModalStep_2.style.display = 'flex'
        userNumberNotice.innerHTML = userPhoneNumberInput.value
      }
    })
  } else {
    step1LoginFormError.innerHTML = "لطفا یک شماره موبایل معتبر وارد نمایید."
  }


};

const verifyNumber =()=>{
  const codeRegex = RegExp(/^\d+/) 
  const codeRegexResult = codeRegex.test(userCodeInput.value)
 
  if (codeRegexResult) {
    step2LoginFormError.innerHTML = ""
    const datas={
      phone:userPhoneNumberInput.value,
      otp:userCodeInput.value
    }
    fetch(`https://divarapi.liara.run/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datas),
    }).then(res => res.json())
    .then(data=>{    
        console.log(data);
        if (data.status==400) {
          step2LoginFormError.innerHTML = "کد منقضی یا نامعتبر است"
         }else if(data.status == 200){
          saveIntoLocalStorage('divar',data.data.token)
          hideModal('login-modal', 'login-modal--active')
         }
    })
  } else {
    step2LoginFormError.innerHTML = "کد نامعتبر است"
  }
}
requestCodeBtn?.addEventListener('click',()=>{
  fetch(`https://divarapi.liara.run/v1/auth/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: userPhoneNumberInput.value.trim() }),
  }).then(res => {
    console.log(res);
     
  })
})

changeNumberSpan?.addEventListener('click', () => {
  loginModalStep_1.style.display = 'flex'
  loginModalStep_2.style.display = 'none'
})

const getMe = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const res = await fetch(`http://localhost:4000/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  return data;
};

export { SubmitNumber, getMe,verifyNumber };
