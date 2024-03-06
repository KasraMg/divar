
import { saveIntoLocalStorage, getToken, hideModal, showSwal } from "./utils.js";

const loginModalContainer = document.querySelector('.login-modal')
const userNumberNotice = document.querySelector('.user_number_notice')
const userPhoneNumberInput = document.querySelector(".phone_Number_input");
const userCodeInput = document.querySelector(".code_input");
const step1LoginFormError = document.querySelector('.step-1-login-form__error')
const step2LoginFormError = document.querySelector('.step-2-login-form__error')
const changeNumberSpan = document.querySelector('.login-change-number')
const requestBtnTimerContainer = document.querySelector('.request_timer')
const requestBtnTimer = document.querySelector('.request_timer span')
const requestCodeBtn = document.querySelector('.req_new_code_btn')

let timer;

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
      if (res.status == 200) {
        loginModalContainer.classList.add('active_step_2')
        userNumberNotice.innerHTML = userPhoneNumberInput.value

        requestCodeBtn.style.display = 'none'
        let count = 30
        requestBtnTimerContainer.style.display = 'flex'
        requestBtnTimer.textContent = '30'
        count = parseInt(requestBtnTimer.textContent);
        timer = setInterval(function () {
          count--;
          requestBtnTimer.textContent = count;
          if (count === 0) {
            clearInterval(timer);
            requestCodeBtn.style.display = 'block'
            requestBtnTimerContainer.style.display = 'none'
          }
        }, 1000);
      }
    })
  } else {
    step1LoginFormError.innerHTML = "لطفا یک شماره موبایل معتبر وارد نمایید."
  }


}; 
const verifyNumber = () => {
  const codeRegex = RegExp(/^\d+/)
  const codeRegexResult = codeRegex.test(userCodeInput.value)

  if (codeRegexResult) {
    step2LoginFormError.innerHTML = ""
    const datas = {
      phone: userPhoneNumberInput.value,
      otp: userCodeInput.value
    }
    fetch(`https://divarapi.liara.run/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datas),
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status == 400) {
          step2LoginFormError.innerHTML = "کد منقضی یا نامعتبر است"
        } else if (data.status == 201 || data.status == 200) {
          saveIntoLocalStorage('divar', data.data.token)
          hideModal('login-modal', 'login-modal--active')
          showSwal('با موفقیت وارد شدید', "success", "بزن بریم", () => location.href = "/panel/verify.html")
        }
      })
  } else {
    step2LoginFormError.innerHTML = "کد نامعتبر است"
  }
} 
const requestNewCode = () => {
  fetch('https://divarapi.liara.run/v1/auth/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: userPhoneNumberInput.value.trim() }),
  }).then(res => {
    console.log(res);
    if (res.status == 200) {

      requestBtnTimer.textContent = '30';
      requestCodeBtn.style.display = 'none';
      requestBtnTimerContainer.style.display = 'flex';

      let count = parseInt(requestBtnTimer.textContent);

      timer = setInterval(function () {
        count--;
        requestBtnTimer.textContent = count;
        console.log(count);
        if (count === 0) {
          clearInterval(timer);
          requestCodeBtn.style.display = 'block';
          requestBtnTimerContainer.style.display = 'none';
        }
      }, 1000);
    }
  });
}
const logout = () => {
  showSwal(
    "آیا از Logout اطمینان دارید؟",
    "success",
    ["نه", "آره"],
    (result) => {
      if (result) {
        showSwal("با موفقیت خارج شدید", "success", "اوکی", () => {
          localStorage.removeItem("divar");
          location.href = "/index.html";
          return true;
        });
      }
    }
  );

}
const getMe = async () => {
  const token = getToken();
  console.log(token);
  if (!token) {
    return false;
  }
  const res = await fetch(`https://divarapi.liara.run/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  return data;
};
changeNumberSpan?.addEventListener('click', () => {
  loginModalContainer.classList.remove('active_step_2')
  clearInterval(timer);
})


export { SubmitNumber, getMe, verifyNumber, requestNewCode, logout };
