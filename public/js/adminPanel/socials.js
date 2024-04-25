import { baseUrl, getToken, showSwal } from "../../../utlis/utils.js";

window.addEventListener('load', () => {
    const token = getToken()
    const createSocialBtn = document.querySelector('#create-social-btn')
    const titleInput = document.querySelector('#title-input')
    const iconInput = document.querySelector('#icon-input')
    const linkInput = document.querySelector('#link-input')
    const loading = document.querySelector('#loading-container')


    let socialData = null;

    const generateSocials = async () => {
        loading.style.display = 'none'
        const res = await fetch(`${baseUrl}/v1/social/`);
        const data = await res.json();
        socialData = data.data.socials
        const socialTable = document.querySelector('.social-table')
        socialTable.innerHTML = ""
        data.data.socials.map(social => {
            socialTable.insertAdjacentHTML('beforeend', `
        <tr>
            <th>نام مدیا </th>
            <th>لینک مدیا </th>
            <th>آیکون مدیا</th>  
            <th>ویرایش مدیا</th>  
            <th>حذف مدیا  </th>
        </tr>
          <tr>
               <td>${social.name}</td> 
               <td>${social.link}</td> 
                <td id="social-icon-container-${social._id}"><img height="30px" src="${social.icon}"></img></td> 
                <td><button onclick="generateModal('${social._id}')" class="edit-btn">ویرایش</button></td>  
                <td><button onclick="deleteSocialHandler('${social._id}')" class="edit-btn">حذف</button></td>  
            </tr>
        
        `)
        })

    }
    generateSocials()


    window.generateModal = (socialId) => {
        const socialName = document.querySelector('#social-name')
        const socialLink = document.querySelector('#social-link')
        const socialIcon = document.querySelector('#social-icon')
        const editBtn = document.querySelector('#edit-btn')
        const editModal = document.querySelector('#edit-modal')
        const editModalIcon = document.querySelector('.close-modal-icon') 
        editModal.classList.add('active') 
        const social = socialData.find(social => social._id == socialId)
        socialName.value = social.name
        socialLink.value = social.link

        editBtn.addEventListener('click', () => {
            console.log(socialIcon.files[0]);
            if (socialName.value && socialLink.value) {
                const formData = new FormData()
                formData.append('name', socialName.value)
                formData.append('link', socialLink.value)
                formData.append('icon', socialIcon.files[0])
                fetch(`${baseUrl}/v1/social/${socialId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                }).then(res => {
                    console.log(res);
                    generateSocials()
                    editModal.classList.remove('active')
                })
            } else {
                swal({
                    title: 'لطفا همه فیلدا رو وارد کنید',
                    icon: 'error',
                    button: 'اوکی'
                })
            }

        })

        editModalIcon.addEventListener('click', () => editModal.classList.remove('active'))
    }

    window.deleteSocialHandler = (socialId) => {
        swal({
            title: 'آیا از حذف شبکه اجتماعی اطمینان دارید؟',
            icon: 'warning',
            buttons: ['خیر', 'آره']
        }).then(res => {
            if (res) {
                fetch(`${baseUrl}/v1/social/${socialId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        generateSocials()
                    }
                })
            }
        })
    }
    createSocialBtn.addEventListener('click', () => {
        if (titleInput.value.length && linkInput.value.length && iconInput.value.length) {
            const formData = new FormData();
            formData.append("name", titleInput.value);
            formData.append("link", linkInput.value);
            formData.append("icon", iconInput.files[0]);
            fetch(`${baseUrl}/v1/social/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }).then(() => {
                generateSocials()
            })
        } else {
            swal({
                title: 'لطفا همه فیلد هارو پر کنید',
                icon: 'error',
                button: 'اوکی'
            })
        }
    })

})

