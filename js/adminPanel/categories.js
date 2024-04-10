import { getAndShowPostCategories, getAndShowArticleCategories } from "../funcs/shared.js"
import { baseUrl } from "../funcs/utils.js"

window.addEventListener('load', () => {
    const postTable = document.querySelector('.post-categories-table')
    const articleTable = document.querySelector('.article-categories-table')
    const backToPostCategoriesBtn = document.querySelector('.back-to-post-categories-btn')
    let categoriesDatas;

    // posts
    getAndShowPostCategories().then(categories => {
        categoriesDatas =  categories;
        renderCategories()

    });
    const renderCategories = () => {
        postTable.innerHTML = ''
        postTable.insertAdjacentHTML('beforeend', `
        <tr>
            <th>نام کتگوری </th>
            <th>تعداد کتگوری فرزند</th>
            <th>مشاهده کتگوری های فرزند    </th>
            <th>تغییر اسم کتگوری اصلی </th>
            <th>حذف کتگوری اصلی</th>
        </tr>
        ${categoriesDatas.map(category => (
            `<tr>
                <td>${category.title}</td>
                <td>${category.subCategories.length}</td>
                <td><button onclick="showChildCategory('${category._id}')" class="edit-btn">مشاهده ساب کتگوری های فرزند </button></td>
                <td><button class="edit-btn">ویرایش</button></td>
                <td><button class="delete-btn">حذف</button></td>
            </tr>`
        )).join('')}
    `);
    }
    window.showChildCategory = function (categoryId) {
        let category = categoriesDatas.filter(category => category._id == categoryId)
        postTable.innerHTML = ''
        backToPostCategoriesBtn.style.display = 'flex'
        postTable.insertAdjacentHTML('beforeend', ` 
            <tr>
            <th>نام کتگوری فرزند </th> 
            <th>تعداد ساب کتگوری</th>
            <th>مشاهده ساب کتگوری ها</th>
            <th>تغییر اسم   کتگوری فرزند</th>
            <th>حذف   کتگوری فرزند</th>
        </tr> 
        ${category[0].subCategories.map(subCategory => (
            `  <tr>
          <td>${subCategory.title}</td>
            <td>${subCategory.subCategories?.length ? subCategory.subCategories?.length : '0'}</td> 
            ${subCategory.subCategories?.length ? `<td><button  onclick="showSubCategory('${subCategory._id}')"  class="edit-btn"> مشاهده ساب کتگوری ها</button></td>` : ' <td>ساب کتگوری وجود ندارد </td>'}
          <td><button class="edit-btn">ویرایش</button></td>
            <td><button class="delete-btn">حذف</button></td>
        </tr>  
`
        )).join('')} 
        
            `)
    }
    window.showSubCategory = function (subCategoryId) {
        const subCategories = findSubCategoryById(categoriesDatas, subCategoryId)
        postTable.innerHTML = ''

        postTable.insertAdjacentHTML('beforeend', ` 
            <tr>
            <th>نام ساب کتگوری</th>   
            <th>تغییر اسم ساب کتگوری</th>
            <th>حذف ساب کتگوری</th>
        </tr> 
        ${subCategories.subCategories.map(subCategory => (
            `    <tr>
          <td>${subCategory.title}</td> 
          <td><button class="edit-btn">ویرایش</button></td>
            <td><button class="delete-btn">حذف</button></td>
        </tr>  
`
        )).join('')} 
        
            `)
    }
    function findSubCategoryById(categories, categoryId) {
        const allSubCategories = categories.flatMap(category => category.subCategories);
        return allSubCategories.find(subCategory => subCategory._id === categoryId);
    }
    backToPostCategoriesBtn.addEventListener('click', () => {
        backToPostCategoriesBtn.style.display = 'none'
        renderCategories()
    })

    // articles
    getAndShowArticleCategories().then(data => { 
        data.data.categories.map(category => {
            articleTable.insertAdjacentHTML("beforeend", `
            <tr>
            <th>نام کتگوری </th>
            <th>آیکون کتگوری</th> 
            <th>تغییر اسم کتگوری</th>
            <th>حذف کتگوری  </th>
        </tr>
            <tr>
                            <td>${category.name}</td> 
                            <td><img height="30px" src="${baseUrl}/${category.pic?.path}"></img></td> 
                            <td><button class="edit-btn">ویرایش</button></td>
                            <td><button class="delete-btn">حذف</button></td>
                        </tr>
            `)
        })
    })
})




