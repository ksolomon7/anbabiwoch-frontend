let bookContainer= document.querySelector('#book-collection')
let bookForm=document.querySelector('.container')
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
    newBookdiv.className= 'card'
  
    //add image for book
    let bookImg= document.createElement('img');
    bookImg.src= book.image
    bookImg.alt= `${book.name} image`
    // add title name to a h2 tag
    let bookTitle= document.createElement('h2')
    bookTitle.innerText= book.title
    bookTitle.addEventListener("click", (evt)=>{
        showFullInfo=!showFullInfo
        if (showFullInfo){
            bookTitle.style.block= "block"
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
            rating.innerText= "Book Reviews"
            
            // delete books
            let deleteBook=document.createElement("button")
            deleteBook.innerText= `Remove ${book.title}`
            deleteBook.style.color= "purple"
            deleteBook.style.border= "padded"
            deleteBook.addEventListener("click", (evt)=>{
                deletingBook(book)
            })

            // forEach Review 
            book.reviews.forEach((info)=>{
                let outerOl= document.createElement('li')
                outerOl.className= `${book.title} list`
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
                increaseButton.id= book.id
                increaseButton.style.color= "purple"
                increaseButton.addEventListener("click", (evt)=>{
                    
                    console.log(evt.target)
                    let updatedRating= info.ratings + 1
                    console.log(updatedRating)

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
                          console.log(updatedRating)
                          info.ratings= updatedRating
                          console.log(info.ratings)
                          secondLi.innerText= `Rating: ${updatedRating}`
                    })
                })

                // decrease review button
                let decreaseButton= document.createElement('button')
                decreaseButton.innerText= `Decrease Rating`
                decreaseButton.id= book.id
                decreaseButton.style.color= "purple"
                decreaseButton.addEventListener("click", (evt)=>{
                    
                    console.log(evt.target)
                    let updatedRating= info.ratings - 1
                    console.log(updatedRating)

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
                          console.log(updatedRating)
                          info.ratings= updatedRating
                          console.log(info.ratings)
                          secondLi.innerText= `Rating: ${updatedRating}`
                    })
                })
                rating.append(outerOl,increaseButton, decreaseButton)
                newBookdiv.append(rating)
            })
            
                bookDiv.append(bookAuthor,publisherInfo,bookDescription, deleteBook)
        }else{
            bookTitle.style.block="none"
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




 // let userRating= review.ratings
    // let updatedRating= userRating + 1
    // console.log(updatedRating)

    // fetch(`http://localhost:3000/reviews/${review.id}`, {
    //     method: 'PATCH',
    //     headers:{
    //         'Content-type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body:JSON.stringify({
    //         ratings: updatedRating
    //     })
    // })
    // .then(resp=> resp.json())
    // .then(updatedObj=>{
    //     console.log(updatedObj)
    // })



// Optional method: where there is a list of titles
// and when clicked presents the book.
//I want to have a list of all the book titles displayed
// the title list should be clickable and it should
// conditional render the book information
// let showTitles= (book)=>{
  
//     let h3= document.createElement('h3')
//     h3.innerText= book.title
//     h3.id=book.id
//     h3.addEventListener("click", (evt)=>{
//         fetch(`http://localhost:3000/books/${evt.target.id}`)
//         .then(resp=>resp.json())
//         .then(secondResp=>{
//             renderPartialBook(secondResp)
//         })
//         // how do i clear the screen in order to show one book at a time, only when selected
//     })
 
//     fullBookCollection.append(h3)
// }


// let renderBook=(book)=>{
//     console.log(book)
// }