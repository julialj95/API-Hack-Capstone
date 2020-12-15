// holds results from google books API call to avoid needing a second call when retrieving sales information //
let bookResults = [];

function getRecTitlesUrl(recSearchTerm){

  const searchUrl = 'https://tastedive.com/api/similar';
  const apiKey = '393554-StudentC-MF9HETN1';

  const recParams = {
    q: 'book:' + recSearchTerm,
    k: apiKey,
    type: 'books',
    callback: 'getRecInfo'
  };

  const queryString = formatRecQueryParams(recParams);
  const recUrl = searchUrl + '?' + queryString;
  return recUrl;
}

function formatRecQueryParams(recParams){
  const recQueryItems = Object.keys(recParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(recParams[key])}`);
  return recQueryItems.join('&');
}

// for jsonp callback needed with tastedive api//
function insertScript(recSearchTerm){
    const newScriptElement = document.createElement('script');
    newScriptElement.setAttribute('src', getRecTitlesUrl(recSearchTerm));
    newScriptElement.setAttribute('id', 'jsonp');
    const oldScriptElement = document.getElementById('jsonp');
    

    const head = document.getElementsByTagName('head')[0];
    if (oldScriptElement === null){
      head.appendChild(newScriptElement);
    }
    else {
      head.replaceChild(newScriptElement, oldScriptElement);
    }
}


function getRecInfo(recTitleJson){
  if (recTitleJson.Similar.Results.length === 0){
    $('.loadingBox').addClass('hidden');
    $('.results').html('<p>Sorry! No results were found for that search. Try a different book title.</p>').addClass('bg-box');
  }
  else {
  const recInfoBaseUrl = 'https://www.googleapis.com/books/v1/volumes';
  const googleApiKey = 'AIzaSyDEde2t4gSXAMcNjSVn56s2RfIu6G7R5ZM';
  const recInfoArray = [];
  for (let i = 0; i < 12; i++){
    const recInfoParams = {
    q: recTitleJson.Similar.Results[i].Name,
    printType: 'books',
    key: googleApiKey
    };
    const recInfoQueryString = formatRecInfoQueryParams(recInfoParams);
    const recInfoUrl = recInfoBaseUrl + '?' + recInfoQueryString;
  
    recInfoArray.push(fetch(recInfoUrl));
  }

Promise.all(recInfoArray)
  .then(results => {
  return Promise.all(results.map(recInfo => recInfo.json()))
  })
  .then(jsonRecs => {
  bookResults = jsonRecs
  displayRecResults(jsonRecs)
  })
  .catch(err => displayCatchError(err))
  }
}

function displayCatchError(err){
  console.log(err)
  $('.results').html('<p>Sorry! Your request cannot be processed. Please try again in a moment.</p>').addClass('bg-box');
  $('results').removeClass('hidden')
}


function formatRecInfoQueryParams(recInfoParams){
  const recInfoQueryItems = Object.keys(recInfoParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(recInfoParams[key])}`);
  return recInfoQueryItems.join('&');
}

function watchRecForm(){
  $('#js-book-search-form').on('submit', event => {
    event.preventDefault();
    $('#js-rec-results').empty();
    $('.loadingBox').removeClass('hidden');
    const recSearchTerm = $('#js-search-term').val();
    insertScript(recSearchTerm);
    getRecTitlesUrl(recSearchTerm);
    $('#js-search-term').val('');
    $('.shop').addClass('hidden');
  })
}

function displayRecResults(resultsJson){
  $('.loadingBox').addClass('hidden');
  for (let i = 0; i < 12; i++){
    $('#js-rec-results').append(`
    <div class='item recBox'>
      <h2 class='js-book-title'>${resultsJson[i].items[0].volumeInfo.title}</h2>
      <h3>${resultsJson[i].items[0].volumeInfo.authors}</h3>
      <img src='${resultsJson[i].items[0].volumeInfo.imageLinks.thumbnail}' alt='${resultsJson[i].items[0].volumeInfo.title} cover photo'>
      <p class='extra-padding'>${resultsJson[i].items[0].volumeInfo.description}</p>
      <button class='js-shop'>Shop this book</button>
      <div class='hidden-id'>${i}</div>
      <section class='hidden shopResults'></section>
    </div>`)};
  $('.results').removeClass('hidden');
  }

function watchShopLinkOnRecPage(){
  $('body').on('click','button.js-shop', event=> {
    event.preventDefault;
    $('.shopResults').empty();
    $(event.currentTarget).next().next().removeClass('hidden');
    const shopSearchNumber = $(event.currentTarget).next().text();
    const shopDisplay = $(event.currentTarget).next().next();
    displayShopResults(bookResults, shopSearchNumber, shopDisplay);
  })
}

function displayShopResults(bookResults, shopSearchNumber, shopDisplay){
  let shopCounter = 0
  for (let i = 0; i < bookResults[shopSearchNumber].items.length; i++) {
    const titleToMatch = bookResults[shopSearchNumber].items[0].volumeInfo.title;
    const currentTitle = bookResults[shopSearchNumber].items[i].volumeInfo.title;
    
    if(bookResults[shopSearchNumber].items[i].saleInfo.saleability === 'FOR_SALE' && currentTitle.includes(titleToMatch)) {
      shopCounter = shopCounter + 1;
      $(shopDisplay).append(`
        <section class='shop-item shop-box'>
          <h2 class='dark-font'>Title: ${currentTitle}</h2>
          <h3 class='dark-font'>Price: ${bookResults[shopSearchNumber].items[i].saleInfo.listPrice.amount} ${bookResults[shopSearchNumber].items[i].saleInfo.listPrice.currencyCode}</h3>
          <a href='${bookResults[shopSearchNumber].items[i].saleInfo.buyLink}' target='_blank' class='light-font'>Buy this book</a>
        </section>`);
    }
  }
  $('.shopResults').removeClass('hidden');
  errorMessage(shopCounter, shopDisplay);
}

function errorMessage(shopCounter, shopDisplay){
  if (shopCounter === 0){
    $(shopDisplay).append(`
      <section class='shop-item'>
        <p>Sorry! That book is not currently for sale.</p>
      </section>`);
  }
}

function handleApp(){
  watchRecForm();
  watchShopLinkOnRecPage();
}

$(handleApp);
