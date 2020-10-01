let bookContainer= document.querySelector('#book-collection')
let bookForm=document.querySelector('.add-book-form')
let newBookButton=document.querySelector('#new-book-btn')
let fullBookCollection=document.querySelector('#full-book-collection')
let newBook=false;
let showFullInfo=false;


// fetch from the backend to show all the books, url: "http://localhost:3000/books"
fetch("http://localhost:3000/books")
.then(resp=>resp.json())
.then(bookArray=>{
    bookArray.forEach(renderPartialBook)
})

//I want to have a list of all the book titles displayed the title list should be clickable and it should conditional render the book information
// renders the book information conditionally

let renderPartialBook= (book)=>{
    // adds a div element in the book collection container
    let bookDiv=document.createElement('div');
    bookDiv.className='card';
    bookDiv.dataset.id= book.id

    // add another div to hold all the information for the individual books
    let newBookdiv=document.createElement('div')
    newBookdiv.className= 'card-mb3'
  
    let midDiv=document.createElement('div')
    midDiv.className="card-mb4"
    //add image for book
    let bookImg= document.createElement('img');
    bookImg.src= book.image
    bookImg.alt= `${book.name} image`

    // add title name to a h2 tag
    let bookTitle= document.createElement('h2')
    bookTitle.innerText= book.title

    
    bookTitle.addEventListener("click", (evt)=>{
    
        if (midDiv.innerHTML=== " ") {
            let bookAuthor=document.createElement('span')
            bookAuthor.innerText= `Author/s: ${book.authors}`
            // add p tag to hold the publisher, and published date
            let publisherInfo=document.createElement('p')
            publisherInfo.innerHTML= `<span>Publishing Company: ${book.publisher}</span>
            <br><span>Published date: ${book.published_date}</span>`
            let bookDescription= document.createElement('p')
            bookDescription.class= "card"
            bookDescription.innerText= book.description

            let rating= document.createElement('div')
            rating.class= "book-review-container"
            rating.innerText= "Book Reviews"
            
            
            // delete books
            let deleteBook=document.createElement("button")
            deleteBook.innerText= `Remove ${book.title}`
            deleteBook.style.border= "padded"
            deleteBook.addEventListener("click", (evt)=>{
                deletingBook(book)
            })

    

            // forEach Review 
            book.reviews.forEach((info)=>{
                
                let ratingInfo=document.createElement('div')
                ratingInfo.dataset.id= info.id

                let outerOl= document.createElement('li')
                outerOl.className= `${book.title} list`
                outerOl.dataset.id= info.id
                outerOl.style= "list-style: none"
                outerOl.innerText= `Username: ${info.user.username}`
                let firstLi=document.createElement('li')
                firstLi.innerText= `Review: ${info.comment}`
                let secondLi=document.createElement('li')
                secondLi.innerText=`Rating: ${info.ratings}`
                
                outerOl.append(firstLi, secondLi)

                // increase review button
                let increaseButton= document.createElement('button')
                increaseButton.innerText= `Increase Rating`
                increaseButton.dataset.id= info.id
                increaseButton.addEventListener("click", (evt)=>{
                    
                    let updatedRating= info.ratings + 1
                   

                    fetch(`http://localhost:3000/reviews/${info.id}`, {
                          method: "PATCH",
                          headers:{
                                'Content-type': 'application/json',
                                // 'Accept': 'application/json'
                           },
                          body:JSON.stringify({
                                ratings: updatedRating
                            })
                    })
                    .then(resp=> resp.json())
                    .then(updatedObj=>{
                          updatedRating= updatedObj.ratings
                          info.ratings= updatedRating
                          secondLi.innerText= `Rating: ${updatedRating}`
                    })
                })

                // decrease review button
                let decreaseButton= document.createElement('button')
                decreaseButton.innerText= `Decrease Rating`
                decreaseButton.dataset.id= info.id
                decreaseButton.addEventListener("click", (evt)=>{
                    
                    let updatedRating= info.ratings - 1

                    fetch(`http://localhost:3000/reviews/${info.id}`, {
                          method: "PATCH",
                          headers:{
                                'Content-type': 'application/json',
                                // 'Accept': 'application/json'
                           },
                          body:JSON.stringify({
                                ratings: updatedRating
                            })
                    })
                    .then(resp=> resp.json())
                    .then(updatedObj=>{
                          updatedRating= updatedObj.ratings
                          info.ratings= updatedRating
                
                          secondLi.innerText= `Rating: ${updatedRating}`
                    })


                })

                let deleteButton= document.createElement('button')
                deleteButton.innerText= `Delete Rating`
                deleteButton.dataset.id= info.id
                deleteButton.addEventListener("click", (evt)=>{
                    fetch(`http://localhost:3000/reviews/${info.id}`, {
                        method: "DELETE",   
                    })
                   
                    reviewInfo= document.querySelector(`[data-id="${info.id}"]`)
                    reviewInfo.remove()
                    alert("The review has been removed!")
                })
                    ratingInfo.append(outerOl,increaseButton, decreaseButton, deleteButton)
                    rating.append(ratingInfo)
                    midDiv.append(rating)
                })
            
                
                
            // create a div to hold the reviews
            let reviewDiv= document.createElement('div')
            reviewDiv.className= "review"

            // button for adding reviews
            let addReviewButton= document.createElement('button')
                addReviewButton.innerText= `Add a new review`
                addReviewButton.id= book.id
                addReviewButton.addEventListener("click", (evt)=>{
                    if (reviewDiv.innerHTML=== " "){
                        let newCommentForm= document.createElement("form")
                        newCommentForm.id= "new-book-review"

                        let newCommentDiv=document.createElement("div")
                        newCommentDiv.className= "review-form"
               
                        // write a fetch request for localhost:3000/users and have the foreach go through and create a select

                        fetch('http://localhost:3000/users')
                        .then(resp=> resp.json())
                        .then(userArray=> {
                            userArray.forEach(user=>{createUsername(user)})
                        })

                        let usernameLabel=document.createElement('select')
                            usernameLabel.type= "text"
                            usernameLabel.className= "input-text"
                            usernameLabel.id= "username"
                            usernameLabel.innerText= "Select User"
                        
                        
                        let createUsername=(user)=>{
                            let users= document.createElement('option')
                            users.id= user.id
                            users.innerText= user.username
                            usernameLabel.appendChild(users)
                        }

                        let bookLabel= document.createElement('select')
                        bookLabel.id= "book"
                        bookLabel.dataset= book.id
                        bookLabel.className= "input-text"
                        bookLabel.innerText= "Select book"

                        let booksOption= document.createElement('option')
                        booksOption.dataset.id= book.id
                        booksOption.innerText= book.title

                        bookLabel.append(booksOption)

                        let commentLabel=document.createElement('input')
                        commentLabel.type= "text"
                        commentLabel.value=" "
                        commentLabel.className= "input-text"
                        commentLabel.id= "comment"
                        commentLabel.placeholder= "Enter review"


                        let ratingLabel=document.createElement('input')
                        ratingLabel.type= "number"
                        ratingLabel.value= " "
                        ratingLabel.className= "input-text"
                        ratingLabel.id= "Rating"
                        ratingLabel.placeholder= "Enter number rating"

                        let submitInfoButton= document.createElement("button")
                        submitInfoButton.type= "Submit"
                        submitInfoButton.className= "btn btn-primary"
                        submitInfoButton.innerText= "Create a review"

                        reviewDiv.addEventListener("submit", (evt)=>{
                            evt.preventDefault()
                
                            fetch('http://localhost:3000/reviews', {
                                method: "POST",
                                headers:{
                                    'Content-type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body:JSON.stringify({
                                    comment: evt.target.comment.value,
                                    ratings: evt.target.Rating.value,
                                    user_id: evt.target.username.value,
                                    book_id:book.id
                                })
                                })
                                .then(resp=>resp.json())
                                .then(secondResp=>{
                                    console.log(secondResp)
                                    let ratingInfo=document.createElement('div')
                                    ratingInfo.dataset.id= secondResp.id


                                    let outerOl= document.createElement('li')
                                    outerOl.style= "list-style: none"
                                    outerOl.innerText= `Username: ${secondResp.user.username}`

                                    let firstLi=document.createElement('li')
                                    firstLi.innerText= `Review: ${secondResp.comment}`
                                    let secondLi=document.createElement('li')
                                    secondLi.innerText=`Rating: ${secondResp.ratings}`
                                    evt.target.reset()

                                    outerOl.append(firstLi, secondLi)
                                    // ratingInfo.append(outerOl)
                                    // midDiv.append(ratingInfo)

                                    let increaseButton= document.createElement('button')
                                    increaseButton.innerText= `Increase Rating`
                                    increaseButton.dataset.id= secondResp.id
                                    increaseButton.addEventListener("click", (evt)=>{
                    
                                         let updatedRating= secondResp.ratings + 1
                   

                                        fetch(`http://localhost:3000/reviews/${secondResp.id}`, {
                                                method: "PATCH",
                                                headers:{
                                                'Content-type': 'application/json',
                                                // 'Accept': 'application/json'
                                                 },
                                                body:JSON.stringify({
                                                ratings: updatedRating
                                                 })
                                            })
                                            .then(resp=> resp.json())
                                            .then(updatedObj=>{
                                                updatedRating= updatedObj.ratings
                                                secondResp.ratings= updatedRating
                                                secondLi.innerText= `Rating: ${updatedRating}`
                                            })
                                        })

                                     // decrease review button
                                    let decreaseButton= document.createElement('button')
                                    decreaseButton.innerText= `Decrease Rating`
                                    decreaseButton.dataset.id= secondResp.id
                                    decreaseButton.addEventListener("click", (evt)=>{
                    
                                        let updatedRating= secondResp.ratings - 1

                                        fetch(`http://localhost:3000/reviews/${secondResp.id}`, {
                                                method: "PATCH",
                                                headers:{
                                                'Content-type': 'application/json',
                                                 // 'Accept': 'application/json'
                                                },
                                                body:JSON.stringify({
                                                ratings: updatedRating
                                            })
                                        })
                                        .then(resp=> resp.json())
                                        .then(updatedObj=>{
                                              updatedRating= updatedObj.ratings
                                              secondResp.ratings= updatedRating
                
                                              secondLi.innerText= `Rating: ${updatedRating}`
                                            })
                                        })

                                        
                                        //  deleting review button
                                        let deleteButton= document.createElement('button')
                                        deleteButton.innerText= `Delete Rating`
                                        deleteButton.dataset.id= secondResp.id
                                        deleteButton.addEventListener("click", (evt)=>{
                                        fetch(`http://localhost:3000/reviews/${secondResp.id}`, {
                                             method: "DELETE",   
                                        })
                   
                                        reviewInfo= document.querySelector(`[data-id="${secondResp.id}"]`)
                                        reviewInfo.remove()
                                        alert("The review has been removed!")
                                        })
                                            
                                            ratingInfo.append(outerOl, increaseButton, decreaseButton, deleteButton)
                                            rating.append(ratingInfo)
                                            // midDiv.append(ratingInfo)
                                        })

                                     })

                        
                                newCommentForm.append(newCommentDiv, usernameLabel, commentLabel, ratingLabel, bookLabel, submitInfoButton)
                                reviewDiv.append(newCommentForm)
                    } else {
                        reviewDiv.innerHTML= " "
                    }
                })
                     midDiv.append(bookAuthor,publisherInfo,bookDescription, deleteBook, addReviewButton, reviewDiv,rating)
                     bookDiv.append(newBookdiv, midDiv)
           
        }else{
            midDiv.innerHTML= " "
        }
    }) 
    
    newBookdiv.append(bookImg, bookTitle)
    bookDiv.append(newBookdiv)
    bookContainer.append(bookDiv)
}


//Expands to show a place to input a new book
newBookButton.addEventListener("click", (evt) => {
    // hide & seek with the form
    newBook = !newBook
    if (newBook === true) {
      bookForm.style.display = "none";
      bookForm.addEventListener("submit", (evt)=>{
        evt.preventDefault()
        postBook(evt)
      })
    } else {
      bookForm.style.display = "block";
    }
  });

// adding books-Post request for books
let postBook=(evt)=>{
    fetch('http://localhost:3000/books', {
        method:"POST",
        headers: {
            'Content-type':'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            title: evt.target.title.value,
            authors: evt.target.author.value,
            publisher: evt.target.publisher.value,
            published_date: evt.target.publisher.value,
            description: evt.target.description.value,
            image: evt.target.image.value,
            main_category: evt.target.main_category.value
        })
        })
        .then(resp=>resp.json())
        .then(secondResp=>{
            console.log(secondResp)
            renderPartialBook(secondResp)
            alert("The book has been added!")
            evt.target.reset() 
    }) 
    
}

// deleting books
let deletingBook= (book)=>{
   
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "DELETE",   
    })
   
    bookDomInfo=bookContainer.querySelector(`[data-id="${book.id}"]`)
    bookDomInfo.remove()
    alert("The book has been removed!")
}

