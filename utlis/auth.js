
import { saveIntoLocalStorage, getToken, hideModal, showSwal, baseUrl } from "./utils.js";

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
const loading = document.querySelector('#loading-container')
let timer = null;

const submitNumber = () => {
  loading.classList.add('active-login-loader')
  const phoneRegex = RegExp(/^(09)[0-9]{9}$/)
  const phoneRegexResult = phoneRegex.test(userPhoneNumberInput.value)
  if (phoneRegexResult) {
    step1LoginFormError.innerHTML = ""
    fetch(`${baseUrl}/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: userPhoneNumberInput.value.trim() }),
    }).then(res => {
      loading.classList.remove('active-login-loader')
      if (res.status === 403) {
        hideModal('login-modal', 'login-modal--active')
        showSwal('این شماره مجاز به ثبت نام در سایت نیست', "error", "اوکی", () => null)
      } else {
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
    loading.classList.remove('active-login-loader')
    step1LoginFormError.innerHTML = "لطفا یک شماره موبایل معتبر وارد نمایید."
  }


};
const verifyNumber = () => {
  loading.classList.add('active-login-loader')
  const codeRegex = RegExp(/^\d+/)
  const codeRegexResult = codeRegex.test(userCodeInput.value)

  if (codeRegexResult) {
    step2LoginFormError.innerHTML = ""
    const userData = {
      phone: userPhoneNumberInput.value,
      otp: userCodeInput.value
    }
    fetch(`${baseUrl}/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then(res => res.json())
      .then(data => {
        loading.classList.remove('active-login-loader')
        if (data.status == 400) {
          step2LoginFormError.innerHTML = "کد منقضی یا نامعتبر است"
        } else if (data.status == 201 || data.status == 200) {
          saveIntoLocalStorage('divar', data.data.token)
          hideModal('login-modal', 'login-modal--active')
          showSwal('با موفقیت وارد شدید', "success", "بزن بریم", () => location.href = "/pages/userPanel/verify.html")
        }
      })
  } else {
    loading.classList.remove('active-login-loader')
    step2LoginFormError.innerHTML = "کد نامعتبر است"
  }
}
const requestNewCode = () => {
  loading.classList.add('active-login-loader')
  fetch(`${baseUrl}/v1/auth/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: userPhoneNumberInput.value.trim() }),
  }).then(res => {
    loading.classList.remove('active-login-loader')
    if (res.status == 200) {
      requestBtnTimer.textContent = '30';
      requestCodeBtn.style.display = 'none';
      requestBtnTimerContainer.style.display = 'flex';

      let count = parseInt(requestBtnTimer.textContent);

      timer = setInterval(function () {
        count--;
        requestBtnTimer.textContent = count;
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
    "آیا از خروج اطمینان دارید؟",
    "success",
    ["نه", "آره"],
    (result) => {
      if (result) {
        showSwal("با موفقیت خارج شدید", "success", "اوکی", () => {
          localStorage.clear()
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
  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (data.status !== 404) {
    return data.data.user;
  }

};
changeNumberSpan?.addEventListener('click', () => {
  loginModalContainer.classList.remove('active_step_2')
  clearInterval(timer);
})


export { submitNumber, getMe, verifyNumber, requestNewCode, logout };
