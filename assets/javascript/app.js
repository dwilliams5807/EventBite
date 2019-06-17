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

if ("geolocation" in navigator) {
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
        function success(position) {
            console.log('user coordinates: ', position)
                // for when getting location is a success
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // console.log('latitude', position.coords.latitude, 'longitude', position.coords.longitude);
            // if it's the first search and there are no filter terms, set filter to empty string
            queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
            seatGeek(queryURL);
            // }
        },
        function error(error_message) {
            // for when getting location results in an error
            console.error('An error has occured while retrieving location', error_message)
            console.log('No location data available. Using default location (Austin, TX).');

            // use default location (Austin, TX)
            latitude = 30.2672;
            longitude = -97.7431;

            queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
            seatGeek(queryURL);
        }
    )
} else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
}

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
    queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter;
    seatGeek(queryURL);
})


//    if user refuses, they can use search bar

//  search bar
//    accept city name / zip code
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
                '<div class="location"><i class="fas fa-map-marker-alt"></i>' + venue + ', ' + city + ', ' + state + '</div>' +
                '</div>' +
                '</div>'
            );
        }
        console.log("eventsArray", eventsArray);
    })
}

$(".city-container").on("click", function() {
    var destination = $(this).children(".travel-destination").children("h4").text();
    if (destination === "Austin, TX") {
        longitude = -97.7431;
        latitude = 30.2672;
    } else if (destination === "Orlando, FL") {
        longitude = 28.5383;
        latitude = 81.3792;
    } else if (destination === "New York City, NY") {
        longitude = 40.7128;
        latitude = 74.0060;
    } else if (destination === "Venice, ITL") {
        longitude = 45.4408;
        latitude = 12.3155;
    }
})

// function featuredLocation() {

// }

//to do
//element.url --> view tickets
//link view tickets button to seatgeek ticket url  // stored in variable tickets -Mark
//use a promise so that map loading does not interfere with api loading
//if no events show up in a certain category, display an error page

//create constructor for api calls
//seatgeek api will be called about 6-7 times,
//so we don't want to write the same code 6-7 times
//1. geolocation
//2. if user declines geolocation
//3. when user chooses a category from dropdown**
//4. when user filters by date from dropdown**
//5. when user enters a search input
//6. when displaying information on the modal
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

//store longlat of event as data attribute  // This is stored in the eventsArray as coords -Mark
//use longlat for zomato api and map api

//$("event div").on("click, function() {
//empty the modal content
//get longlat from data attribute and pass on as a parameter for queryurl for zomato and map
//get event name for wikipedia api
//call zomato api, wikipedia api, map api
//info needed from seatgeek: image, event title, location, date, time, ticket url
//could possibly get this info from using "this" and getting it from the div
//or we can make a separate ajax call
//info needed from zomato: image, rating, restaurant name, location
//info needed from wikipedia: description
//info needed from mapbox: map
//append info to html
//})

//if zomato image does not show,
//have a placeholder image

//mapbox
//will place mapbox in it's own function and call it when the event is pressed on
function mapBox() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxhaW50cmFuIiwiYSI6ImNqd3pkMnJrNzEzbzg0M2p6Z293M2JneGIifQ.1LK7HmyNbLKLeL4u7yfjaA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        //position is longitude, latitude
        center: [resLon, resLat],
        zoom: 13
    });

    var marker = new mapboxgl.Marker()
        .setLngLat([resLon, resLat])
        .addTo(map);

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.resize();
}

$(".card-container").on("click", ".card", function() {
    // console.log("this: ", $(this));
    var index = $(this).attr('data-index');
    var e = eventsArray[index];
    // console.log(index);
    $('.modal-header > img').attr('src', e.image);
    $('.event-title').text(e.event);
    $('.location').text(e.venue + ', ' + e.city + ', ' + e.state);
    $('.date-container > p').html('<i class="far fa-calendar"></i>' + moment(e.date).format("ddd, MMM D"));
    $('.time-container > p').html('<i class="far fa-clock"></i>' + moment(e.date).format("h:mm A"));
})

$(".date-menu a").on("click", function() {
    toggle(".date-toggle:first-child", this);
})

$(".category-menu a").on("click", function() {
    toggle(".category-toggle:first-child", this);
})

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
    resLat = $(this).attr("data-lat");
    resLon = $(this).attr("data-lon");
    var performerTitle = $(this).children(".card-body").children(".card-title").text();
    var restaurantURL = "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + resLat + "&lon=" + resLon + "&radius=12874&sort=real_distance&order=asc&apikey=aac31fc7cf28e8d834b11bc72cbcc148";

    // Wikipedia API
    var wikiURL = "https://www.mediawiki.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&redirects=1&srsearch=" + performerTitle;

    $.ajax({
        url: wikiURL,
        method: "GET"
    }).done(function(response) {
        console.log(response);
    });

    $.ajax({
        url: restaurantURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $('.row').html("");
        for (var i = 0; i < response.restaurants.length; i++) {
            var resElement = response.restaurants[i].restaurant;
            var resName = resElement.name;
            var resRating = resElement.user_rating.aggregate_rating;
            //var resImage = resElement.photos[0].photo.url;
            var resImage = resElement.featured_image;
            var resAddress = resElement.location.address;
            //console.log(resElement.photos[0].photo.url);
            if (resImage === "") {
                resImage = "assets/images/restaurant.jpg";
            }

            $(".row").append("<div class='col-5'> <img src='" +
                resImage + "'> <div class='star-rating'>" +
                resRating + "</div> <h4>" + resName + "</h4> <p>" + resAddress + "</p> </div>");
        }
    })
    mapBox();
})