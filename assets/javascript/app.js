//  get user location
var postalCode;
var latitude;
var longitude;
// var dateFilter;
var categoryFilter = "";
var eventsArray = [];
var queryURL;
var clientID = "MTcwMTYxNTZ8MTU2MDQ0Nzk3Mi41NQ";
var resLat;
var resLon;
var cityQuery;
var currentCity;
var searchInput;

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

// $('#dateDropdown').on('click', '.dropdown-item', function(event) {
//     event.preventDefault();
//     dateFilter = $(this).text();
//     switch (dateFilter) {
//         case "Today":
//             dateFilter = moment().utc().format("YYYY-MM-DD");
//             break;
//         case "Tomorrow":
//             dateFilter = moment().add(1, "days").utc().format("YYYY-MM-DD");
//             break;
//         case "Weekend":
//             dateFilter = moment().day(6).utc().format("YYYY-MM-DD") + "&datetime_utc=" + moment().day(7).format("YYYY-MM-DD");
//             break;
//         default:
//             ""
//             break;
//     }
//     console.log(dateFilter);
//     eventsArray = [];
//     if (categoryFilter !== "") {
//         queryURL = "https://api.seatgeek.com/2/events?lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter + "&datetime_utc=" + dateFilter;  
//     } else {
//         queryURL = "https://api.seatgeek.com/2/events?lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&datetime_utc=" + dateFilter;
//     }
//     seatGeek(queryURL);
// })


//need to rename because both dropdowns are called dropdown
$('#categoryDropdown').on('click', '.dropdown-item', function(event) {
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
    if (searchInput === undefined || searchInput === "") {
        queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter;
    } else if (searchInput !== "") {
        queryURL = "https://api.seatgeek.com/2/events?q=" + searchInput + "?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter;  
    }
    seatGeek(queryURL);
})

//    if user refuses, they can use search bar
//  search bar
//    accept city name / zip code
$("form").on("submit", function(event) {
    event.preventDefault();
    searchInput = "";
    searchInput = $(".search-input").val();
    cityQuery = $('.location-input').val();
    //do we want to allow zipcode also?
    getLatLong(cityQuery);
    $(".search-input").val("");
    categoryFilter = "";
    dropdownReset();
    // //would like to pass the city only
    // $(".upcoming-listing").text("Upcoming Events in " + currentCity);
    // $('.location-input').val(currentCity);
    $('html, body').animate({
        scrollTop: $("#upcoming-events").offset().top - 50
   }, 500);
})

function seatGeek(seatGeekURL) {
    // taxonomies: sports, concert, theater
    // console.log(queryURL)
    // send an AJAX request
    $.ajax({
        url: seatGeekURL,
        method: "GET"
    }).done(function(response) {
        console.log(response)
        $('.card-container').html("");
        if (response.events.length === 0) {
            $('.card-container').html(
                '<div class="search-error">' +
                '<h2><strong>No results found.</strong></h2>' + 
                '<p>It seems we can’t find any event based on your search. Try broader search terms or select a featured location at the bottom.</p>' +
                '<a href="index.html" class="back-home">Back Home</a></div>'
            );
        } else {
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
        }
    })
    // console.log("eventsArray", eventsArray);  // not needed unless sifting through the array
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
    searchInput = "";
    dropdownReset();
    eventsArray = [];
    categoryFilter = "";
    queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
    seatGeek(queryURL);
    $('html, body').animate({
        scrollTop: $("#upcoming-events").offset().top - 50
   }, 500);
})

//to do
//if no events show up in a certain category, display an error page

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
        // console.log("getLatLong: ", response)
        latitude = response.features[0].center[1];
        // console.log('getLatLong latitude: ', response.features[0].center[1]);
        longitude = response.features[0].center[0];
        // console.log('getLatLong longitude: ', response.features[0].center[0]);
        currentCity = response.features[0].text;
        var fullLocation = response.features[0].place_name;
        //would like to pass the city only
        $(".upcoming-listing").text("Upcoming Events in " + currentCity);
        $('.location-input').val(fullLocation);
        if (searchInput === undefined || searchInput === "") {
            queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
        } else if (searchInput !== "") {
            queryURL = "https://api.seatgeek.com/2/events?q=" + searchInput + "?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";  
        }
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
    // $(".date-toggle:first-child").text("Any Date");
    // $(".date-toggle:first-child").removeAttr("style");
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
    $('.tickets').attr({
        'href': e.tickets,
        'target': "_blank"
    });
        
    // Wikipedia API
    var performerTitle = $(this).children(".card-body").children(".card-title").text();
    console.log(performerTitle);
    var wikiURL = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=1&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + performerTitle + "&gsrinfo=totalhits&format=json&callback=?";

    $.ajax({
        url: wikiURL,
        method: "GET",
        jsonp: "callback",
        dataType: 'jsonp'   
    }).done(function(response) {
        console.log(response);
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
            
            if (resRating >= 0 && resRating < 0.3) {
                resRating = "<div class='noRating'> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> </div>"
            }  else if (resRating >= 0.3 && resRating < 0.8) {
                resRating = "<i class='fas fa-star-half-alt'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
            }  else if (resRating >= 0.8 && resRating < 1.3) {
                resRating = "<i class='fas fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
            }  else if (resRating >= 1.3 && resRating < 1.8) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
            } else if (resRating >= 1.8 && resRating < 2.3) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
            } else if (resRating >= 2.3 && resRating < 2.8) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
            } else if (resRating >= 2.8 && resRating < 3.3) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='far fa-star'></i> <i class='far fa-star'></i>"
            } else if (resRating >= 3.3 && resRating < 3.8) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i> <i class='far fa-star'></i>"
            } else if (resRating >= 3.8 && resRating < 4.3) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='far fa-star'></i>"
            } else if (resRating >= 4.3 && resRating < 4.8) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star-half-alt'></i>"
            } else if (resRating >= 4.8 && resRating <= 5) {
                resRating = "<i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i>"
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
                + resRating + "</div></div> <h4>" + resName + "</h4> <p>" + resAddress + "</p><div class='price-range'>" + resPrice + " </div> </div>");
        }
    })
    $(".row").animate({ "scrollLeft": 0});
    mapBox();
});

getCityState();