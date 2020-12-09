function getRecTitlesUrl(recSearchTerm){

  const searchUrl = 'https://tastedive.com/api/similar'
  const apiKey = '393554-StudentC-MF9HETN1'

  const recParams = {
    q: "book:" + recSearchTerm,
    k: apiKey,
    type: 'books',
    callback: 'getRecInfo'
  }

  const queryString = formatRecQueryParams(recParams)
  const recUrl = searchUrl + '?' + queryString
  console.log(recUrl)
  return recUrl
}

function formatRecQueryParams(recParams){
  const recQueryItems = Object.keys(recParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(recParams[key])}`);
  return recQueryItems.join('&')
}


function insertScript(recSearchTerm){
    const newScriptElement = document.createElement('script');
    newScriptElement.setAttribute('src', getRecTitlesUrl(recSearchTerm));
    newScriptElement.setAttribute('id', 'jsonp');
    const oldScriptElement = document.getElementById('jsonp');
    

    const head = document.getElementsByTagName('head')[0];
    if (oldScriptElement === null){
      head.appendChild(newScriptElement)
    }
    else {
      head.replaceChild(newScriptElement, oldScriptElement)
    }
}


function getRecInfo(recTitleJson){
  console.log(recTitleJson)

  const recInfoBaseUrl = 'https://www.googleapis.com/books/v1/volumes'
  const googleApiKey = 'AIzaSyDEde2t4gSXAMcNjSVn56s2RfIu6G7R5ZM'
  const recInfoArray = [];
  for (let i = 0; i < recTitleJson.Similar.Results.length; i++){
  
    const recInfoParams = {
    q: recTitleJson.Similar.Results[i].Name,
    printType: 'books',
    key: googleApiKey
    }
  const recInfoQueryString = formatRecInfoQueryParams(recInfoParams)
  const recInfoUrl = recInfoBaseUrl + '?' + recInfoQueryString
    recInfoArray.push(fetch(recInfoUrl))
  }
Promise.all(recInfoArray)
  .then(results => {
  return Promise.all(results.map(r => r.json()))
  })
  .then(jsonRecs => {
  console.log(jsonRecs)
  displayRecResults(jsonRecs)
  })
  .catch(err => console.log(err))
}


function formatRecInfoQueryParams(recInfoParams){
  const recInfoQueryItems = Object.keys(recInfoParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(recInfoParams[key])}`);
  return recInfoQueryItems.join('&')
}

function watchRecForm(){
  $('#js-book-search-form').on('submit', event => {
    event.preventDefault()
    const recSearchTerm = $("#js-search-term").val()
    insertScript(recSearchTerm)
    getRecTitlesUrl(recSearchTerm)
  })
}

function displayRecResults(resultsJson){
  $("#js-rec-results").empty()
  for (let i = 0; i < 12; i++){
  $("#js-rec-results").append(`
  <div class="item">
    <h2>${resultsJson[i].items[0].volumeInfo.title}</h2>
    <h3>${resultsJson[i].items[0].volumeInfo.authors}</h3>
    <img src="${resultsJson[i].items[0].volumeInfo.imageLinks.thumbnail}" alt="${resultsJson[i].items[0].volumeInfo.title} cover photo">
    <p>${resultsJson[i].items[0].volumeInfo.description}</p>
    <a href="shop.html">Shop this book</a>
  </div>`)}
  $('.results').removeClass('hidden')
  }



// function watchShopLinkOnRecPage(){
//   $("#").on('click', event=> {
//     event.preventDefault;
//     getBooksToBuy(recResponseJson)
//   })
// }

// function getBooksToBuy(shopSearchTerm){
//   const shopSearchUrl = 'https://www.googleapis.com/books/v1/volumes'
//   const googleApiKey = 'AIzaSyDEde2t4gSXAMcNjSVn56s2RfIu6G7R5ZM'

//   const googleParams = {
//     q: shopSearchTerm + '+intitle:',
//     printType: 'books',
//     key: googleApiKey
//   }

//   const shopQueryString = formatShopQueryParams(googleParams)
//   const url = shopSearchUrl + '?' + shopQueryString
//   console.log(url)

//   fetch(url)
//   .then(shopResponse => shopResponse.json())
//   .then(shopResonseJson => console.log(shopResonseJson))
//   .catch(err => console.log(err))

// }

// function formatShopQueryParams(googleParams){
//   const shopQueryItems = Object.keys(googleParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(googleParams[key])}`)
//   return shopQueryItems.join('&')
// }

// function watchShopForm(){
//   $('#book-shop-form').submit(event => {
//     event.preventDefault();
//     const shopSearchTerm = $("#js-book-shop").val()
//     getBooksToBuy(shopSearchTerm)
//   })

// }

// function displayShopResults(recResponseJson){
//   $('.results').empty()
//   for (let i = 0; i < recResponseJson.length; i++){
//   $('.results').append(`<div class="item">
//     <h2>${recResponseJson[i].volumeInfo.title}</h2>
//     <h3>${recResponseJson[i].volumeInfo.author}</h3>
//     <img src="${recResponseJson[i].imageLinks.thumbnail}" alt="${recResponseJson[i].volumeInfo.title} cover photo">
//     <p>${recResponseJson[i].volumeInfo.description}</p>
//   </div>`)
//   }
// }

// function getCarbonOffsetData(){
//   const apiKey = 'aQLGLDqsUuR5GPHa3OSVZQ'
//   const searchUrl = 'https://www.carboninterface.com/api/v1/estimates'

//   const options = {
//     header: new Headers({
//       Authorization: 'Bearer ' + apiKey
//     })
//   }
// }

// function watchCarbonForm(){

// }

// function formatCarbonQueryParams(carbonQueryParams){

// }



  $(watchRecForm)
  // $(watchShopForm)