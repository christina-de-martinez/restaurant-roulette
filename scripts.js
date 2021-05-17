const apiKey = 'Bearer RR7CdGkIgHbkAg0AEvTn0y4CZssHOyXchYdmcRWbn1d0xe7WQERLK7C6TvcgH3-C3Z9u5kF6bfgY0o735IiF_Gx5UrqEHBDOn-7YR2787Znrij9yTW-7fQFpEa98YHYx';
const yelpSearchUrl = 'https://api.yelp.com/v3/businesses/search';
const corsAnywhere = 'https://cors-anywhere.herokuapp.com';
const requestUrl = corsAnywhere + '/' + yelpSearchUrl;

function processZipCode() {
    const zipCodeInput = document.getElementById('zipcode-input');
    const zipCode = zipCodeInput.value;
    apiCall(zipCode);
}

function apiCall(zipCode) {
    var requestObj = {
        url: requestUrl,
        data: { term: 'restaurants', location: zipCode },
        headers: { 'Authorization': apiKey },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('AJAX error, jqXHR = ', jqXHR, ', textStatus = ', textStatus, ', errorThrown = ', errorThrown);
        }
    }
    $.ajax(requestObj)
        .done(function(response) {
            chooseRestaurant(response);
        })
}

function checkIfRestaurantIsOpen(selectedRestaurant) {
    if (selectedRestaurant.is_closed === true) {
        const isOpenZipCode = document.getElementById('zipcode-input');
        console.log('restaurant is closed');
        // apiCall(isOpenZipCode);
    }
    return;
}
function chooseRestaurant(restaurants){
    const randomNumber = Math.floor((Math.random() * 20));
    const selectedRestaurant = restaurants['businesses'][randomNumber];
    checkIfRestaurantIsOpen(selectedRestaurant);
    determineStarRating(selectedRestaurant);
    letThemKnow(selectedRestaurant);
}
function makeAddress(selectedRestaurant) {
    const restaurantLocation = selectedRestaurant.location.display_address;
    const restaurantLocationLength = restaurantLocation.length;
    let restaurantLocationString = '';
    for (i=0; i<restaurantLocationLength; i++) {
        let currentLine = restaurantLocation[i] + '<br/>'
        restaurantLocationString += currentLine;
    }
    return restaurantLocationString;
}
function determineStarRating(selectedRestaurant) {
    let starCount = 0;
    const starContainer = document.getElementById('put-stars-here');
    starContainer.innerHTML = '';
    for (j=0; j <= selectedRestaurant.rating; j++) {
        createStar('stars__active', starContainer);
        starCount++;
    }
    let diffBetweenStars = 5 - starCount;
    if (diffBetweenStars > 0) {
        for (let k=0; k < diffBetweenStars; k++) {
            createStar('stars', starContainer);
        }
    }
}

function createStar(classToAdd, elementToAppendTo) {
    let newStarSpan = document.createElement("span");
    newStarSpan.innerHTML = '★';
    newStarSpan.classList.add(classToAdd);
    elementToAppendTo.appendChild(newStarSpan);
}

function letThemKnow(selectedRestaurant){
    const selectedRestaurantAddress = makeAddress(selectedRestaurant);
    const selectedRestaurantName = selectedRestaurant['name'];
    const resultsDiv = document.getElementById('start-hidden');
    resultsDiv.style.opacity = 1;
    const outputName = document.getElementById('output-name');
    outputName.innerHTML = selectedRestaurantName;
    const outputAddress = document.getElementById('output-address');
    outputAddress.innerHTML = selectedRestaurantAddress;
}

function handleSubmit() {
    processZipCode();
}