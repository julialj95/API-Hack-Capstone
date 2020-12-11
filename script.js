let bookResults = []

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
  for (let i = 0; i < 4; i++){
    // recTitleJson.Similar.Results.length
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
  return Promise.all(results.map(recInfo => recInfo.json()))
  })
  .then(jsonRecs => {
  console.log(jsonRecs)
  bookResults = jsonRecs
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
    $(".loading").removeClass("hidden")
    const recSearchTerm = $("#js-search-term").val()
    insertScript(recSearchTerm)
    getRecTitlesUrl(recSearchTerm)

  })
}

function displayRecResults(resultsJson){
  $(".loading").addClass('hidden')
  $("#js-rec-results").empty()
  for (let i = 0; i < 4; i++){
  $("#js-rec-results").append(`
  <div class="item">
    <h2 class="js-book-title">${resultsJson[i].items[0].volumeInfo.title}</h2>
    <h3>${resultsJson[i].items[0].volumeInfo.authors}</h3>
    <img src="${resultsJson[i].items[0].volumeInfo.imageLinks.thumbnail}" alt="${resultsJson[i].items[0].volumeInfo.title} cover photo">
    <p>${resultsJson[i].items[0].volumeInfo.description}</p>
    <button class="js-shop">Shop this book</button>
    <div class="hidden-id">${i}</div>
    <div class="hidden shop-results" id="js-shop-results"></div>
  </div>`)}
  $('.results').removeClass('hidden')
  }



function watchShopLinkOnRecPage(){
  $('body').on('click','button.js-shop', event=> {
    event.preventDefault
    console.log('clicked')
    const shopSearchNumber = $(event.currentTarget).next().text()
    console.log(shopSearchNumber)
    displayShopResults(bookResults, shopSearchNumber)
    
  })
}

function displayShopResults(bookResults, shopSearchNumber){
  console.log(bookResults[shopSearchNumber])
  for (let i = 0; i < bookResults[shopSearchNumber].items.length; i++) {
    const titleToMatch = bookResults[shopSearchNumber].items[0].volumeInfo.title
    const currentTitle = bookResults[shopSearchNumber].items[i].volumeInfo.title
    if(bookResults[shopSearchNumber].items[i].saleInfo.saleability === "FOR_SALE" && currentTitle.includes(titleToMatch)) {
    $("#js-shop-results").append(`
    <div class="shop-item">
      <h2>Title: ${currentTitle}</h2>
      <h3>Price: ${bookResults[shopSearchNumber].items[i].saleInfo.listPrice.amount} ${bookResults[shopSearchNumber].items[i].saleInfo.listPrice.currencyCode}</h3>
      <a href="${bookResults[shopSearchNumber].items[i].saleInfo.buyLink}" target="_blank">Buy this book on Google</a>
    </div>
    `)
    }
  }
  $("#js-shop-results").removeClass('hidden')
}

$(watchRecForm)
$(watchShopLinkOnRecPage)
