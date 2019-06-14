//  get user location
//    if user refuses, they can use search bar

//  search bar
//    accept city name / zip code


// function seatGeek() {
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
// }