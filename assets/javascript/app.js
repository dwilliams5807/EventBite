//  get user location
var postalCode;
var latitude;
var longitude;

if ("geolocation" in navigator) {
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
        function success(position) {
            console.log(position)
        // for when getting location is a success
        postalCode = position.address.postalCode;
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log('latitude', position.coords.latitude, 
                    'longitude', position.coords.longitude);
        },
        function error(error_message) {
        // for when getting location results in an error
        console.error('An error has occured while retrieving location', error_message)
        })
    } else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
}
//    if user refuses, they can use search bar

//  search bar
//    accept city name / zip code


function seatGeek() {
    var clientID = "MTcwMTYxNTZ8MTU2MDQ0Nzk3Mi41NQ";
    // the number of gifs we want returned
    var limit = "15";
    // our URL to search
    var queryURL = "https://api.seatgeek.com/2/events?client_id=" + clientID;
    
    // send an AJAX request
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response) // our returned object
        console.log("seatgeek - title: ", response.events[0].title)
        console.log("seatgeek - image (280px): ", response.events[0].performers[0].image)
        console.log("seatgeek - venue name: ", response.events[0].venue.name)
        console.log("seatgeek - venue address: ", response.events[0].venue.address) // for displaying to user
        console.log("seatgeek - venue zip code: ", response.events[0].venue.postal_code) // for displaying to user
        console.log("seatgeek - venue location: ", response.events[0].venue.location) // for passing to YELP API
        console.log("seatgeek - event type: ", response.events[0].taxonomies[0].name)
        console.log("seatgeek - event type: ", response.events[0].datetime_local)
    })
}

