//  get user location
var postalCode;
var latitude;
var longitude;
var categoryFilter;
var eventsArray = [];
var queryURL;
var clientID = "MTcwMTYxNTZ8MTU2MDQ0Nzk3Mi41NQ";
var resLat;
var resLon;
var cityQuery

// if ("geolocation" in navigator) {
//     // check if geolocation is supported/enabled on current browser
//     navigator.geolocation.getCurrentPosition(
//         function success(position) {
//             console.log('user coordinates: ', position)
//                 // for when getting location is a success
//             latitude = position.coords.latitude;
//             longitude = position.coords.longitude;
//             // console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);
//             // if it's the first search and there are no filter terms, set filter to empty string
//             queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
//             seatGeek(queryURL);
//             // }
//         },
//         function error(error_message) {
//             // for when getting location results in an error
//             console.error('An error has occured while retrieving location', error_message)
//             console.log('No location data available. Using default location (Austin, TX).');

//             // use default location (Austin, TX)
//             latitude = 30.2672;
//             longitude = -97.7431;

//             queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
//             seatGeek(queryURL);
//         }
//     )
// } else {
//     // geolocation is not supported
//     // get your location some other way
//     console.log('geolocation is not enabled on this browser')
// }

//need to rename because both dropdowns are called dropdown
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
        default:
            ""
            break;
    }
    eventsArray = [];
    queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter;
    seatGeek(queryURL);
})

//    if user refuses, they can use search bar
//  search bar
//    accept city name / zip code
$("form").on("submit", function(event) {
    event.preventDefault();
    var searchInput = $(".search-input").val();
    cityQuery = $('.location-input').val();
    //when user inputs city, state, need to geocode into longlat
    //do we want to allow zipcode also?
    //queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
    //seatGeek(queryURL);
    $(".search-input").val("");
    dropdownReset();
    //would like to pass the city only
    $(".upcoming-listing").text("Upcoming Events in " + cityQuery);
    $('html, body').animate({
        scrollTop: $("#upcoming-events").offset().top - 50
   }, 500);
   getLatLong(cityQuery);
})

function seatGeek(seatGeekURL) {
    // taxonomies: sports, concert, theater
    // console.log(queryURL)
    // send an AJAX request
    $.ajax({
        url: seatGeekURL,
        method: "GET"
    }).done(function(response) {
        $('.card-container').html("");
        for (var i = 0; i < response.events.length; i++) {
            var element = response.events[i];
            var event = element.title;
            var date = element.datetime_local;
            var city = element.venue.city;
            var state = element.venue.state;
            var coords = element.venue.location;
            var tickets = element.url; // ticket URL
            var venue = element.venue.name;
            var address = element.venue.address;
            category = element.taxonomies[0].name;
            var image = element.performers[0].image;
            // I moved the image if/elses up here above the eventsArray 
            // because I was getting the same error with the images


            // console.log("seatgeek - event type: ", response.events[0].taxonomies[0].name)
            // console.log("seatgeek - event date: ", response.events[0].datetime_local)
            // console.log("seatgeek - event city: ", response.events[0].venue.city)
            // console.log("seatgeek - event state: ", response.events[0].venue.state)
            // console.log(moment(date).format("ddd, MMM D hh:mm A"));
            if (image === null && category === "sports") {
                image = "assets/images/sports.jpg";
            } else if (image === null && category === "concert") {
                image = "assets/images/concert.jpg";
            } else if (image === null && category === "theater") {
                image = "assets/images/theater.jpg";
            } else if (image === null && category === "comedy") {
                image = "assets/images/comedy.jpg";
            } else {
                image = element.performers[0].image;
            }

            eventsArray.push({
                event: event,
                date: date,
                city: city,
                state: state,
                coords: coords,
                venue: venue,
                address: address,
                tickets: tickets,
                category: category,
                image: image
            });


            // var element = response.events[i];



            // console.log("seatgeek - title: ", response.events[0].title)
            // console.log(event, element)
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
                '<div class="card" data-toggle="modal" data-target="#exampleModal" data-index="' + i + '" data-lat="' + coords.lat + '" data-lon="' + coords.lon + '">' +
                '<p class="category"><span>' + category + '</span></p>' +
                '<img src="' + image + '" class="card-img-top">' +
                '<div class="card-body">' +
                '<div class="date">' + moment(date).format("ddd, MMM D &#65;&#84; h:mm A") + '</div>' +
                '<h5 class="card-title">' + event + '</h5>' +
                '<div class="card-location"><i class="fas fa-map-marker-alt"></i>' + venue + ', ' + city + ', ' + state + '</div>' +
                '</div>' +
                '</div>'
            );
        }
        // console.log("eventsArray", eventsArray);  // not needed unless sifting through the array
    })
}

$(".city-container").on("click", function() {
    var destination = $(this).children(".travel-destination").children("h4").children("span").text();
    if (destination === "Austin") {
        longitude = -97.7539;
        latitude = 30.3076;
    } else if (destination === "Orlando") {
        longitude = -81.3792;
        latitude = 28.5383;
    } else if (destination === "New York City") {
        longitude = -74.0060;
        latitude = 40.7128;
    } else if (destination === "Los Angeles") {
        longitude = -119.4179;
        latitude = 36.7783;
    }
    $(".upcoming-listing").text("Upcoming Events in " + destination);
    dropdownReset();
    eventsArray = [];
    queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
    seatGeek(queryURL);
    $('html, body').animate({
        scrollTop: $("#upcoming-events").offset().top - 50
   }, 500);
})

//to do
//element.url --> view tickets
//link view tickets button to seatgeek ticket url  // stored in variable tickets -Mark
//if no events show up in a certain category, display an error page

//create constructor for api calls
//seatgeek api will be called about 6-7 times,
//so we don't want to write the same code 6-7 times
//1. geolocation - done
//2. if user declines geolocation - done
//3. when user chooses a category from dropdown** - done
//4. when user filters by date from dropdown**
//5. when user enters a search input
//6. when displaying information on the modal - done
//7. when user clicks on a featured location -- need to find the longlat for featured locations
//dropdown will be pertaining to the featured location
//maybe another ajax call when user makes a search and uses the dropdown

//change the url depending on whether user picks:
//category, then date
//date, then category
//category only
//date only

//search bar
//if user agrees to use geolocation, reverse geocode into city, state
//and pass that value into the location search
//if user rejects, user can enter their own location manually
//prevent page from refreshing
//get value from search and pass as a parameter for url
//user has to provide both a search term and location to submit
//call ajax
//maybe change the text from "upcoming events" to "upcoming events in <location>"
//clear value from term search, but not location search
//reset values on dropdown if utilized before search

//location bar

//$("event div").on("click, function() {
//get event name for wikipedia api
//info needed from wikipedia: description
//})

//is it possible to pass the whole address of the event for the modal instead of
//just the location, city, and state?

//clear dropdown when
//1. click on a new featured location
//2. when searching

//autocomplete for location search?



// uses the user's IP address to produce a city and state for
// inputting next to the search bar and above the event cards
function getCityState() {
    $.ajax({
        url: "https://get.geojs.io/v1/ip/geo.json",
        method: "GET"
    }).done(function(response) {
        // console.log(response)
        latitude = response.latitude;
        console.log('getCityState latitude: ', response.latitude);
        longitude = response.longitude;
        console.log('getCityState longitude: ', response.longitude);
        queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";

        $(".upcoming-listing").text("Upcoming Events in " + response.city);
        $('.location-input').val(response.city + ', ' + response.region);
        seatGeek(queryURL);
    })
}

// function to take the city search query and produce a latitude and longitude value
// currently it doesn't update the location to the right of the search bar or the "upcoming events in..." section
// we'll have to modify getCityState() or find another way to convert coords to a city/state
function getLatLong(cityQuery) {
    var citySearch = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURI(cityQuery) + ".json?access_token=pk.eyJ1IjoiZWxhaW50cmFuIiwiYSI6ImNqd3pkMnJrNzEzbzg0M2p6Z293M2JneGIifQ.1LK7HmyNbLKLeL4u7yfjaA"
    $.ajax({
        url: citySearch,
        method: "GET"
    }).done(function(response) {
        console.log("getLatLong: ", response)
        latitude = response.features[0].center[1];
        // console.log('getLatLong latitude: ', response.features[0].center[1]);
        longitude = response.features[0].center[0];
        // console.log('getLatLong longitude: ', response.features[0].center[0]);
        
        queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
        seatGeek(queryURL);
    })
}

function mapBox() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxhaW50cmFuIiwiYSI6ImNqd3pkMnJrNzEzbzg0M2p6Z293M2JneGIifQ.1LK7HmyNbLKLeL4u7yfjaA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        //position is longitude, latitude
        center: [resLon, resLat],
        zoom: 13
    });

    new mapboxgl.Marker().setLngLat([resLon, resLat]).addTo(map);

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', function() {
        map.resize();
    });
}

$(".date-menu a").on("click", function() {
    toggle(".date-toggle:first-child", this);
})

$(".category-menu a").on("click", function() {
    toggle(".category-toggle:first-child", this);
})

function dropdownReset() {
    $(".category-toggle:first-child").text("Any Category");
    $(".category-toggle:first-child").removeAttr("style");
}

function toggle(toggleItem, menu) {
    $(toggleItem).text($(menu).text());
    $(toggleItem).val($(menu).text());
    $(toggleItem).css({
        "background-color": "#fb5845",
        "color": "white"
    })
}

$(".fa-chevron-right").on("click", function() {
    var scrollWidth = $(".row").width() + 55;
    var position = $(".row").scrollLeft();
    $(".row").animate({ "scrollLeft": position + scrollWidth });
})

$(".fa-chevron-left").on("click", function() {
    var scrollWidth = $(".row").width() + 55;
    var position = $(".row").scrollLeft();
    $(".row").animate({ "scrollLeft": position - scrollWidth });
})

$(".card-container").on("click", ".card", function() {
    //seatgeek api
    var index = $(this).attr('data-index');
    var e = eventsArray[index];
    $('.modal-header > img').attr('src', e.image);
    $('.event-title').text(e.event);
    $('.location').html("<i class='fas fa-map-marker-alt'></i>" + e.address + '<p>' + e.city + ', ' + e.state + "</p>");
    $('.datetime').html('<i class="far fa-clock"></i>' + moment(e.date).format("dddd, MMMM Do YYYY") + " at " + moment(e.date).format("h:mm A"));
    // $('.time-container > p').html('<i class="far fa-clock"></i>' + moment(e.date).format("h:mm A"));
        
    // Wikipedia API
    var performerTitle = $(this).children(".card-body").children(".card-title").text();
    var wikiURL = "https://?format=json&action=query&prop=extracts&exintro=&explaintext=&redirects=1&srsearch=" + performerTitle;

    $.ajax({
        url: wikiURL,
        method: "GET"
    }).done(function(response) {
        // console.log(response);
    });

    //zomato api
    resLat = $(this).attr("data-lat");
    resLon = $(this).attr("data-lon");
    var restaurantURL = "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + resLat + "&lon=" + resLon + "&radius=12874&sort=real_distance&order=asc&apikey=aac31fc7cf28e8d834b11bc72cbcc148";

    $.ajax({
        url: restaurantURL,
        method: "GET"
    }).then(function(response) {
        // console.log(response);
        $('.row').html("");
        for (var i = 0; i < response.restaurants.length; i++) {
            var resElement = response.restaurants[i].restaurant;
            var resName = resElement.name;
            var resRating = resElement.user_rating.aggregate_rating;
            //var resImage = resElement.photos[0].photo.url;
            var resImage = resElement.featured_image;
            var resAddress = resElement.location.address;
            var resPrice = resElement.price_range;
            //console.log(resElement.photos[0].photo.url);
            if (resImage === "") {
                resImage = "assets/images/restaurant.jpg";
            }
            
            if (resRating === 0) {
                resRating = "No Rating";
            }

            if (resPrice === 1) {
                resPrice = "$";
            } else if (resPrice === 2) {
                resPrice = "$$";
            } else if (resPrice === 3) {
                resPrice = "$$$";
            } else if (resPrice === 4) {
                resPrice = "$$$$";
            }

            $(".row").append("<div class='col-5'> <img src='" +
                resImage + "'> <div class='res-info'> <div class='star-rating'>"
                + resRating + "</div> <div class='price-range'>" + resPrice + " </div> </div> <h4>" + resName + "</h4> <p>" + resAddress + "</p> </div>");
        }
    })
    $(".row").animate({ "scrollLeft": 0});
    mapBox();
});

getCityState();