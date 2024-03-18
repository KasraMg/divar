ClassicEditor
.create( document.querySelector( '#editor' ) )
.catch( error => {
    console.error( error );
} );

const newArticle = document.querySelector('#new-article')
const newArticleSpan = document.querySelector('#new-article span')
const newArticleContents = document.querySelector('.new-article-contents')

newArticle.addEventListener('click',()=>{
    newArticleContents.classList.toggle('active')
    newArticleSpan.innerHTML=''
    
    if (newArticleContents.className.includes('active')) {
        newArticleSpan.innerHTML='-'
    }else{
        newArticleSpan.innerHTML='+'
    }
   
})