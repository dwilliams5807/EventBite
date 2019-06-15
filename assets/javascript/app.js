//  get user location
var postalCode;
var latitude;
var longitude;
var categoryFilter;

function seatGeek(categoryFilter) {
if ("geolocation" in navigator) {
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
        function success(position) {
            // console.log(position)
            // for when getting location is a success
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);
            var clientID = "MTcwMTYxNTZ8MTU2MDQ0Nzk3Mi41NQ";
            // taxonomies: sports, concert, theater
            if (categoryFilter == undefined) {
                categoryFilter = "";
            }
            var queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter.toLowerCase();

            
            console.log(queryURL)
            // send an AJAX request
            // function seatGeek(categoryFilter) {
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) {

                    $('.card-container').html("");
                    for (var i = 0; i < response.events.length; i++) {
                        var element = response.events[i];
                        var event = element.title;
                        var date = element.datetime_local;
                        var city = element.venue.city;
                        var state = element.venue.state;
                        var venue = element.venue.name;
                        var category = element.taxonomies[0].name;
                        var image = element.performers[0].image;

                        // console.log(response) // our returned object
                        // console.log("seatgeek - title: ", response.events[0].title)
                        console.log(event, element)
                        // console.log("seatgeek - venue name: ", response.events[0].venue.name)
                        // console.log("seatgeek - venue address: ", response.events[0].venue.address) // for displaying to user
                        // console.log("seatgeek - venue zip code: ", response.events[0].venue.postal_code) // for displaying to user
                        // console.log("seatgeek - venue location: ", response.events[0].venue.location) // for passing to YELP API
                        // console.log("seatgeek - event type: ", response.events[0].taxonomies[0].name)
                        // console.log("seatgeek - event date: ", response.events[0].datetime_local)
                        // console.log("seatgeek - event city: ", response.events[0].venue.city)
                        // console.log("seatgeek - event state: ", response.events[0].venue.state)
                        // console.log(moment(date).format("ddd, MMM D hh:mm A"));

                        
                        $('.card-container').append(
                            '<div class="card" data-toggle="modal" data-target="#exampleModal">' + 
                                '<p class="category"><span>' + category + '</span></p>' + 
                                '<img src="' + image + '" class="card-img-top">' + 
                                '<div class="card-body">' + 
                                    '<div class="date">' + moment(date).format("ddd, MMM D &#65;&#84; h:mm A") + '</div>' + 
                                    '<h5 class="card-title">' + event + '</h5>' + 
                                    '<div class="location"><i class="fas fa-map-marker-alt"></i>' + venue + ', ' + city + ', ' + state + '</div>' + 
                                '</div>' + 
                            '</div>'
                        );
                    }   
                })
            // }
        },
        function error(error_message) {
            // for when getting location results in an error
            console.error('An error has occured while retrieving location', error_message)
            // use default location (Austin, TX)
            var clientID = "MTcwMTYxNTZ8MTU2MDQ0Nzk3Mi41NQ";
                // taxonomies: sports, concert, theater
            if (categoryFilter == undefined) {
                categoryFilter = "";
            }
            var queryURL = "https://api.seatgeek.com/2/events?client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter.toLowerCase();

                
            console.log(queryURL)
            // send an AJAX request
            // function seatGeek(categoryFilter) {
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {

                $('.card-container').html("");
                for (var i = 0; i < response.events.length; i++) {
                    var element = response.events[i];
                    var event = element.title;
                    var date = element.datetime_local;
                    var city = element.venue.city;
                    var state = element.venue.state;
                    var venue = element.venue.name;
                    var category = element.taxonomies[0].name;
                    var image = element.performers[0].image;

                    // console.log(response) // our returned object
                    // console.log("seatgeek - title: ", response.events[0].title)
                    console.log(event, element)
                    // console.log("seatgeek - venue name: ", response.events[0].venue.name)
                    // console.log("seatgeek - venue address: ", response.events[0].venue.address) // for displaying to user
                    // console.log("seatgeek - venue zip code: ", response.events[0].venue.postal_code) // for displaying to user
                    // console.log("seatgeek - venue location: ", response.events[0].venue.location) // for passing to YELP API
                    // console.log("seatgeek - event type: ", response.events[0].taxonomies[0].name)
                    // console.log("seatgeek - event date: ", response.events[0].datetime_local)
                    // console.log("seatgeek - event city: ", response.events[0].venue.city)
                    // console.log("seatgeek - event state: ", response.events[0].venue.state)
                    // console.log(moment(date).format("ddd, MMM D hh:mm A"));

                    
                    $('.card-container').append(
                        '<div class="card" data-toggle="modal" data-target="#exampleModal">' + 
                            '<p class="category"><span>' + category + '</span></p>' + 
                            '<img src="' + image + '" class="card-img-top">' + 
                            '<div class="card-body">' + 
                                '<div class="date">' + moment(date).format("ddd, MMM D &#65;&#84; h:mm A") + '</div>' + 
                                '<h5 class="card-title">' + event + '</h5>' + 
                                '<div class="location"><i class="fas fa-map-marker-alt"></i>' + venue + ', ' + city + ', ' + state + '</div>' + 
                            '</div>' + 
                        '</div>'
                    );
                }   
            })
        }
    )
} else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
}
}


$('.dropdown').on('click', '.dropdown-item', function(event) {
    event.preventDefault();
    // console.log($(this).text())/
    categoryFilter = $(this).text();
    switch (categoryFilter) {
        case "Sports": 
            categoryFilter = "sports";
            break;
        case "Concerts": 
            categoryFilter = "concert";
            break;
        case "Broadway Shows": 
            categoryFilter = "broadway_tickets_national";
            break;
        case "Comedy": 
            categoryFilter = "comedy";
            break;
        case "Music Festivals": 
            categoryFilter = "festival";
            break;
        default: ""
            break;
    }
    seatGeek(categoryFilter)
})
//    if user refuses, they can use search bar

//  search bar
//    accept city name / zip code

seatGeek();