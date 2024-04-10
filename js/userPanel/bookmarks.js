import { baseUrl, calculateTimeDifference, getToken, showSwal } from "../funcs/utils.js"

window.addEventListener('load', async () => {
    const token = getToken()

    const postsContainer = document.querySelector('#posts-container')
    const emptyContainer = document.querySelector('.empty')

    const postGenerator = (bookmark) => {
        const date = calculateTimeDifference(bookmark.post.createdAt)
        console.log(date);
        console.log(bookmark);
        postsContainer.insertAdjacentHTML('beforeend', `
        <div class="post">
                     <div>
                         <div>
                             <a class="title" href='/post.html?id=${bookmark.post._id}'>${bookmark.post.title}</a>
                             <div>
                                 <p>${bookmark.post.price.toLocaleString()} تومان</p>
                                 <p> ${date} در جنت‌آباد جنوبی</p>
                             </div>
                         </div>
                         ${bookmark.post.pics.length ? (
                ` <img
src="${baseUrl}/${bookmark.post.pics[0].path}"
    alt>`
            ) : (
                '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAG1BMVEXv7+/KysrR0dHo6Oje3t7l5eXi4uLW1tba2tqj3xFIAAADTUlEQVR42u2ZQW/aQBCFJzGQHLOGBB9xSqscaQhVj0BU5QqVouRIWqm9wqHtNaRKf3ddMH5rTZDx4FEVab4TWMHfet/YO96QYRiGYRiGYRiGYbwifk1IHxdekzY159xPUubQJVz0SJWp+0c4JE0Wbs0zKeI2dPWmrOEy2jNS4hASvVp+73zekQpLGPRqOYZAo5aRe3jna35Q1Ry5hDO6ip1TqWXk3iGqL5xeLY9cwiMljP1gflef+3p6PsZKtVxfjXtTBL4lmlSde0owVrn9D1zCCb5r1DJyT6m6lpH7JJfS0oGwiloOkDv4UnEtH7uEFgFey91qcweN3O2/by0/uIQ5AY1aHtwmkA+vZc22rBYLlrKgn7Jr7QdPpZYyPECQ8y58dx6PpbqSJu0Abv9SYxtlJUk74y9lw53W8lJ/zmu5MMp+f7DwQvza3wqvi/v0R1SEK0Hn5Vo+U5Tg2aMowZqjKEGvoShBr6EnwZqjKEHuyhKsOcWS9reUkctxHhdI0GsUS1posUH4p0f04YlJeK9RUjLly/cdk7DcxZJ2VvyXOQlfIppyyYwtBJCw3IWSNwTq8TbJAsMpGTwP8xKS0rlDEvVTHnAhHsEWSW312x0lnAmbe0hY7kJJlC6v5+fX6Ga4ZIpjAsnJyrHI1ooAEp67QIJ24vO6BHrY/4DE+ylJJf7om6g6SJB7Wypp+w1fiC+QIPdTqaSV3ueYuxokbMNCKGmmx3HmOpekQQ2lEpw2m5CXJDFyF0pq+cmLuaSB3KWSI9yZTMJyV5Mgd7nkuHC6RshdKmkUBY/mUV7CAR5k+NbhzaNEgrEv8EKIm5FtVMklUa47Wp2RSw5wQCQJCYNfD/YAEvbSIJS4mffwGuIzJMhdLulg1/EtzggJy10iOcteCLvrT5Dncm+JJRhhMOhtQoZkPMOhE7mEd4WxJxmFz1lK870kLdZXQ5LMIV4axBL2TFrmJKuOnzWPEknELgSShPAG1yuQ8I47iJkkpSmUgCGbLCaZyyR817cOB5PMxBJw8al/exO7rZKQ9pRwuCTSk2DDrqknwf+eOpoSuo+Ru44EqwCpSbDHGelJsPl8qi+hqzkZhmEYhmEYhmEYhmEYhmEYhmEYhmEY/4e/GvQFDCMQeOUAAAAASUVORK5CYII=">'
            )}
                     </div>
                     <div>
                         <button onclick="sharePostHandler('${bookmark.post._id}','${bookmark.post.title}')">
                             اشتراک گذاری
                             <i class="bi bi-share"></i>
                         </button>
                         <button onclick="removeBookmarkHandler('${bookmark.post._id}')">
                             حذف نشان
                             <i class="bi bi-trash"></i>
                         </button>
                     </div>
                 </div>
        `)
    }

    const res = await fetch(`${baseUrl}/v1/user/bookmarks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    const data = await res.json()

    if (data.data.bookmarks.length) {
        data.data.bookmarks.map(bookmark => {
            postGenerator(bookmark)
        })

    } else {
        emptyContainer.style.display = 'flex'
    }


    window.removeBookmarkHandler = function (postId) {
        showSwal('از حذف نشان آگهی مطمئنید؟', 'success', ["خیر", "بله"], (result) => {
            if (result) {
                fetch(`${baseUrl}/v1/bookmark/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        const newBookmarks = data.data.bookmarks.filter(bookmark => bookmark.post._id !== postId)
                        postGenerator(newBookmarks)
                    }
                }
                )
            }
        })

    }


    window.sharePostHandler = async function (postId, postTitle) {
        await navigator.share({ title: postTitle, url: `/post.html?id=${postId}` });
    }

})

// publish
// waiting
// reject