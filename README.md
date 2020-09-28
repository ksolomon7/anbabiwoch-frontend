# anbabiwoch-frontend
if i want to add a show button within the partial render book function
 let showButton=document.createElement('button')
    showButton.innerText= "Look at more information"
    showButton.addEventListener("click", (evt)=>{
        showFullInfo=!showFullInfo
        if(showFullInfo){
        fetch(`http://localhost:3000/books/${book.id}`)
        .then(resp=>resp.json())
        .then(secondResp=>{
            renderBook(secondResp)
        })
    }