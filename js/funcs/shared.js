import { showModal,hideModal } from "./utils";
const getAndShowSocialMedia = async () => {
  const footerSocialMedia = document.querySelector('.footer__social-media')
  const res = await fetch(`https://divarapi.liara.run/v1/social/`);
  const social = await res.json();
  console.log(social);
}

 

export {
  getAndShowSocialMedia
};
