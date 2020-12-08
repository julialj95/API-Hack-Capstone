function getRecTitles(recSearchTerm){

  const searchUrl = 'https://tastedive.com/api/similar'
  const apiKey = '393554-StudentC-MF9HETN1'

  const recParams = {
    q: "book:" + recSearchTerm,
    k: apiKey,
    type: 'books',
    callback: 'callbackData'
  }

  const queryString = formatRecQueryParams(recParams)
  const recUrl = searchUrl + '?' + queryString
  console.log(recUrl)
  return recUrl
}

function getRecInfo(recTitleJson){
  const recInfoBaseUrl = 'https://www.googleapis.com/books/v1/volumes'
  const googleApiKey = 'AIzaSyDEde2t4gSXAMcNjSVn56s2RfIu6G7R5ZM'

  // for (let i = 0; i < recTitleJson.Results.length; i++){
  
    const recInfoParams = {
    q: recTitleJson.Similar.Results[0].Name + '+intitle:',
    printType: 'books',
    key: googleApiKey
    }
  const recInfoQueryString = formatRecInfoQueryParams(recInfoParams)
  const recInfoUrl = recInfoBaseUrl + '?' + recInfoQueryString
  console.log(recInfoUrl)

  const recInfoArray = []
  
  fetch(recInfoUrl)
  .then(recInfoResponse => recInfoResponse.json())
  .then(recInfoResponseJson => recInfoArray.push(recInfoResponseJson))
  .catch(err => console.log(err))
  console.log(recInfoArray)
  return recInfoArray
  }


function callbackData(recTitleJson){
  console.log(recTitleJson)
  // displayRecResults(recTitleJson)
  return recTitleJson

}

function formatRecQueryParams(recParams){
  const recQueryItems = Object.keys(recParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(recParams[key])}`);
  return recQueryItems.join('&')
}
function formatRecInfoQueryParams(recInfoParams){
  const recInfoQueryItems = Object.keys(recInfoParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(recInfoParams[key])}`);
  return recInfoQueryItems.join('&')
}

function insertScript(recSearchTerm){
    const newScriptElement = document.createElement('script');
    newScriptElement.setAttribute('src', getRecTitles(recSearchTerm));
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

function watchRecForm(recTitleJson){
  $('#js-book-search-form').on('submit', event => {
    event.preventDefault()
    const recSearchTerm = $("#js-search-term").val()
    console.log(recSearchTerm)
    insertScript(recSearchTerm)
    getRecTitles(recSearchTerm)
    getRecInfo(recTitleJson)
  })
}

function displayRecResults(recTitleJson){
  $("#js-rec-results").empty()
  for (let i = 0; i < 20; i++){
    $("#js-rec-results").append(`
    <div class="item">
    <h2>${recTitleJson.Similar.Results[i].Name}</h2>`)
  }
  $(".results").removeClass('hidden')
}
// function displayRecResults(recTitleJson, recInfoResponseJson){
//   $("#js-rec-results").empty()
//   for (let i = 0; i < 20; i++){
//     console.log(recTitleJson.Similar.Results[i].Name)
//   $("#js-rec-results").append(`
//   <div class="item">
//     <h2>${recTitleJson.Similar.Results[i].Name}</h2>
//     <h3>${recInfoResponseJson[i].volumeInfo.author}</h3>
//     <img src="${recInfoResponseJson[i].imageLinks.thumbnail}" alt="${recInfoResponseJson[i].volumeInfo.title} cover photo">
//     <p>${recInfoResponseJson[i].volumeInfo.description}</p>
//     <a href="shop.html">Shop this book</a>
//   </div>`)}
//   $('.results').removeClass('hidden')
//   }


function watchShopLinkOnRecPage(){
  $("#").on('click', event=> {
    event.preventDefault;
    getBooksToBuy(recResponseJson)
  })
}

function getBooksToBuy(shopSearchTerm){
  const shopSearchUrl = 'https://www.googleapis.com/books/v1/volumes'
  const googleApiKey = 'AIzaSyDEde2t4gSXAMcNjSVn56s2RfIu6G7R5ZM'

  const googleParams = {
    q: shopSearchTerm + '+intitle:',
    printType: 'books',
    key: googleApiKey
  }

  const shopQueryString = formatShopQueryParams(googleParams)
  const url = shopSearchUrl + '?' + shopQueryString
  console.log(url)

  fetch(url)
  .then(shopResponse => shopResponse.json())
  .then(shopResonseJson => console.log(shopResonseJson))
  .catch(err => console.log(err))

}

function formatShopQueryParams(googleParams){
  const shopQueryItems = Object.keys(googleParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(googleParams[key])}`)
  return shopQueryItems.join('&')
}

function watchShopForm(){
  $('#book-shop-form').submit(event => {
    event.preventDefault();
    const shopSearchTerm = $("#js-book-shop").val()
    getBooksToBuy(shopSearchTerm)
  })

}

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
  $(watchShopForm)