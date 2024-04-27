import { baseUrl, getToken, showSwal } from "../../../utlis/utils.js";

window.addEventListener('load', () => {
    const token = getToken()
    const createSocialBtn = document.querySelector('#create-social-btn')
    const titleInput = document.querySelector('#title-input')
    const iconInput = document.querySelector('#icon-input')
    const linkInput = document.querySelector('#link-input')
    const loading = document.querySelector('#loading-container')


    let socialData = null;

    const socialsGenerator = async () => {
        const res = await fetch(`${baseUrl}/v1/social/`);
        const data = await res.json();
        console.log(data);
        loading.style.display = 'none'
        socialData = data.data.socials
        const socialTable = document.querySelector('.social-table')
        socialTable.innerHTML = ""
        data.data.socials.map(social => {
            socialTable.insertAdjacentHTML('beforeend', `
        <tr>
            <th>نام شبکه </th>
            <th>لینک شبکه </th>
            <th>آیکون شبکه</th>  
            <th>ویرایش شبکه</th>  
            <th>حذف شبکه</th>
        </tr>
          <tr>
               <td>${social.name}</td> 
               <td>${social.link}</td> 
                <td><img height="30px" src="${baseUrl}/${social.icon.path}" /></td>  
                <td><button onclick="generateModal('${social._id}')" class="edit-btn">ویرایش</button></td>  
                <td><button onclick="deleteSocialHandler('${social._id}')" class="edit-btn">حذف</button></td>  
            </tr>
        
        `)
        })

    }
    socialsGenerator()


    window.generateModal = (socialId) => {
        const nameEditInput = document.querySelector('#name-edit-input')
        const linkEditInput = document.querySelector('#link-edit-input')
        const iconEditInput = document.querySelector('#icon-edit-input')
        const editBtn = document.querySelector('#edit-btn')
        const editModal = document.querySelector('#edit-modal')
        const editModalIcon = document.querySelector('.close-modal-icon')
        editModal.classList.add('active')
        const social = socialData.find(social => social._id == socialId)
        nameEditInput.value = social.name
        linkEditInput.value = social.link

        editBtn.addEventListener('click', () => { 
            if (nameEditInput.value && linkEditInput.value) {
                const formData = new FormData()
                formData.append('name', nameEditInput.value)
                formData.append('link', linkEditInput.value)
                formData.append('icon', iconEditInput.files[0])
                fetch(`${baseUrl}/v1/social/${socialId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                }).then(res => {
                    if (res.status === 200) {
                        socialsGenerator()
                        showSwal('شبکه اجتماعی با موفقیت ادیت شد', 'success', 'اوکی', () => null)
                        editModal.classList.remove('active')
                    }
                })
            } else { 
                showSwal( 'لطفا همه فیلدا رو وارد کنید', 'error', 'اوکی', () => null)
            }

        })

        editModalIcon.addEventListener('click', () => editModal.classList.remove('active'))
    }

    window.deleteSocialHandler = (socialId) => {
        showSwal( 'آیا از حذف شبکه اجتماعی اطمینان دارید؟', 'warning',['خیر', 'آره'], (res) => {
            if (res) {
                fetch(`${baseUrl}/v1/social/${socialId}/xbox`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        socialsGenerator()
                        showSwal('شبکه اجتماعی با موفقیت حذف شد', 'success', 'اوکی', () => null)
                    }
                })
            }  
        }) 
         
    }
    createSocialBtn.addEventListener('click', async () => {
        if (titleInput.value.length && linkInput.value.length && iconInput.value.length) {
            const formData = new FormData();
            formData.append("name", titleInput.value);
            formData.append("link", linkInput.value);
            formData.append("icon", iconInput.files[0]);
            const res = await fetch(`${baseUrl}/v1/social/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })
            const data = await res.json()
            if (data.status === 201) {
                socialsGenerator()
                showSwal('شبکه اجتماعی با موفقیت اضافه شد', 'success', 'اوکی', () => {
                    titleInput.value = ''
                    linkInput.value = ''
                    iconInput.value = ''
                })
            }
        } else {
            showSwal( 'لطفا همه فیلدا رو وارد کنید', 'error', 'اوکی', () => null)
        }
    })

})

