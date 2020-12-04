function getRecs(recSearchTerm){

  const searchUrl = 'https://tastedive.com/api/similar'
  const apiKey = '393554-StudentC-MF9HETN1'

  const recParams = {
    q: searchTerm + '+inTitle:',
    k: apiKey,
    type: 'book',
    callback: unknown
  }

  const queryString = formatRecQueryParams(recParams)
  const url = searchUrl + '?' + queryString
  console.log(url)

  fetch(url)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson))
    .catch(err => console.log(err))
}

function formatRecQueryParams(params){
  const recQueryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return recQueryItems.join('&')
}

function watchRecForm(){
  $('#js-book-search-form').on('submit', event => {
    event.preventDefault()
    const recSearchTerm = $("#js-search-term").val()
    getRecs(recSearchTerm)
  })
}

// function displayRecResults(){

// }

function getBooksToBuy(){
  const searchUrl = 'https://www.googleapis.com/books/v1/volumes'
  const apiKey = 'AIzaSyDEde2t4gSXAMcNjSVn56s2RfIu6G7R5ZM'

  const googleParams = {
    q: shopSearchTerm + '+intitle:',
    printType: books,
    key: apiKey
  }


}

function formatShopQueryParams(googleParams){
  const shopQueryItems = Object.keys(googleParams).map(key => `${encodeURIComponent(key)} = ${encodeURIComponent(googleParams[key])}`)
  return shopQueryItems.join('&')
}

function watchShopForm(){
  $('#js-search-term').submit (event => {
    event.preventDefault();
    const shopSearchTerm = $("#js-search-term").val();
    getBooksToBuy(shopSearchTerm)
  })

}

function displayShopResults(responseJson){
$('.results').empty()
$('.results').append(`<div class="item">
  <h2>${responseJson[i].volumeInfo.title}</h2>
  <h3>${responseJson[i].volumeInfo.author}</h3>
  <img src="${responseJson[i].imageLinks.thumbnail}" alt="${responseJson[i].volumeInfo.title} cover photo">
  <p>${responseJson[i].volumeInfo.description}</p>
</div>`)
}
function getCarbonOffsetData(){
  const apiKey = 'aQLGLDqsUuR5GPHa3OSVZQ'
  const searchUrl = 'https://www.carboninterface.com/api/v1/estimates'

  const options = {
    header: new Headers({
      Authorization: 'Bearer ' + apiKey
    })
  }
}

// function watchCarbonForm(){

// }

function formatCarbonQueryParams(carbonQueryParams){

}



  $(watchRecForm)