
import { SubmitNumber, getMe, verifyNumber, requestNewCode } from "../funcs/auth.js"
import { isLogin } from "./utils.js";
const getAndShowSocialMedia = async () => {
    const footerSocialMedia = document.querySelector('.footer__social-media')
    const res = await fetch(`https://divarapi.liara.run/v1/social/`);
    const social = await res.json();

}

const showPannelLinksToUser = async () => {
    const dropDown = document.querySelector(".header_dropdown");
    const isUserLogin = isLogin();

    if (isUserLogin) {
        getMe().then((data) => {
            if (data.status == 200) {
                dropDown.insertAdjacentHTML('beforeend', `
      
                <ul class="dropdown-menu">
                    <li class="header__left-dropdown-item header_dropdown-item_account">
                        <div class="header__left-dropdown-link login_dropdown_link"> 
                           <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                           <div> 
                           <span>کاربر دیوار </span>
                           <p> تلفن 09046417084</p> 
                           </div>
                        </div>
                      
                    </li>
                    <li class="header__left-dropdown-item">
                    <a class="header__left-dropdown-link" href="#">
                        <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                        تایید هویت
                    </a>
                </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                            نشان ها
                        </a>
                    </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-journal"></i>
                            یادداشت ها
                        </a>
                    </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                            بازدید های اخیر
                        </a>
                    </li>
                    <li class="header__left-dropdown-item">
                        <a class="header__left-dropdown-link" href="#">
                            <i class="header__left-dropdown-icon bi bi-shop"></i>
                            دیوار برای کسب و کارها
                        </a>
                    </li>
                    <li class="header__left-dropdown-item logout-link">
                    <p class="header__left-dropdown-link" href="#">
                        <i class="header__left-dropdown-icon bi bi-shop"></i>
                        خروج
                    </p>
                </li>
                </ul>
                  `)
            }
        });
    } else {
        dropDown.insertAdjacentHTML('beforeend', `
      
    <ul class="dropdown-menu">
        <li class="header__left-dropdown-item">
            <p class="header__left-dropdown-link login_dropdown_link">
                <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                ورود
            </p>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                نشان ها
            </a>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-journal"></i>
                یادداشت ها
            </a>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                بازدید های اخیر
            </a>
        </li>
        <li class="header__left-dropdown-item">
            <a class="header__left-dropdown-link" href="#">
                <i class="header__left-dropdown-icon bi bi-shop"></i>
                دیوار برای کسب و کارها
            </a>
        </li>
    </ul>
      `);
    }
};







export {
    getAndShowSocialMedia,
    showPannelLinksToUser
};
