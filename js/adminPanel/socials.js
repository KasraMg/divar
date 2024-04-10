import { baseUrl } from "../funcs/utils.js";

window.addEventListener('load', async () => {
    const res = await fetch(`${baseUrl}/v1/social/`);
    const data = await res.json();

    const socialTable = document.querySelector('.social-table')
    
    data.data.socials.map(social=>{
        socialTable.insertAdjacentHTML('beforeend',`
        <tr>
            <th>نام مدیا </th>
            <th>آیکون مدیا</th> 
            <th>تغییر آیکون مدیا</th>
            <th>حذف مدیا  </th>
        </tr>
          <tr>
               <td>${social.name}</td> 
                <td><img height="30px" src="${social.icon}"></img></td> 
                <td><button class="edit-btn">ویرایش</button></td>
                <td><button class="delete-btn">حذف</button></td>
            </tr>
        
        `)
    })
})

