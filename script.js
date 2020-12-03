function getRecs(searchTerm){

  const searchUrl = 'https://tastedive.com/api/similar'
  const apiKey = '393554-StudentC-MF9HETN1'

  const params = {
    q: searchTerm + '+inTitle:',
    k: apiKey,
    type: 'book',
    callback
  }

  const queryString = formatRecQueryParams(params)
  const url = searchUrl + '?' + queryString
  console.log(url)

  fetch(url)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson))
    .catch(err => console.log(err))
}

function formatRecQueryParams(params){
  const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`);
  return queryItems.join('&')
}

function watchRecForm(){
  $('#js-book-search-form').on('submit', event => {
    event.preventDefault()
    const searchTerm = $("#js-search-term").val()
    getRecs(searchTerm)
  })
}

// function displayRecResults(){

// }

function getBooksToBuy(){
  const searchUrl = 'https://www.googleapis.com/books/v1/volumes'

}

function formatShopQueryParams(params){

}

function watchShopForm(){

}

// function getCarbonOffsetData(){

// }

// function watchCarbonForm(){

// }





  $(watchRecForm)