import { baseUrl, getToken } from "../../../utlis/utils.js"


window.addEventListener('load', async () => {
    const token = getToken()
    
    const res = await fetch(`${baseUrl}/v1/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    const data = await res.json()
    console.log(data);
})