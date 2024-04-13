import { getMe } from "./auth.js";

const baseUrl = 'https://divarapi.liara.run'

const showSwal = (title, icon, buttons, callback) => {
  swal({
    title,
    icon,
    buttons,
  }).then((result) => callback(result));
};

const saveIntoLocalStorage = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};


const getToken = () => {
  const userInfos = JSON.parse(localStorage.getItem("divar"));
  return userInfos ? userInfos : null;
};

const isLogin = async () => {
  const token = getToken(); 
  if (!token) {
    return false;
  }
  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); 
return res.status === 200 ? true : false 
}; 

const getUrlParam = (key) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};


const addParamToUrl = (param, value) => {
  let url = new URL(location.href)
  let searchParams = url.searchParams

  searchParams.set(param, value)
  url.search = searchParams.toString()
  location.href = url.toString()
}

const removeParameterFromURL = (param) => {
  var url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.replaceState(null, null, url);
  location.reload()
}

function calculateTimeDifference(createdDate) {
  const currentTime = new Date();
  const createDate = new Date(createdDate);

  const timeDiff = Math.abs(currentTime - createDate);
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));

  if (hours < 24) {
    return `${hours} ساعت پیش `;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} روز پیش`;
  }
}


const showModal = (id, className) => {
  const element = document.querySelector(`#${id}`)
  element?.classList.add(`${className}`)
};
const hideModal = (id, className) => {
  const element = document.querySelector(`#${id}`)
  element?.classList.remove(`${className}`)
};


export {
  baseUrl,
  showSwal,
  saveIntoLocalStorage,
  getFromLocalStorage,
  getToken,
  isLogin,
  getUrlParam,
  removeParameterFromURL,
  calculateTimeDifference,
  addParamToUrl,
  showModal,
  hideModal,
};
