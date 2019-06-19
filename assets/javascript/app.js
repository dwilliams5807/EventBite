//global variables
//get user location
var postalCode;
var latitude;
var longitude;
var categoryFilter = "";
var eventsArray = [];
var queryURL;
//seatgeek client ID
var clientID = "MTcwMTYxNTZ8MTU2MDQ0Nzk3Mi41NQ";
//restaurant longitude and latitude
var resLat;
var resLon;
var cityQuery;
var currentCity;
var searchInput;

// uses the user's IP address to produce a city and state for
// inputting next to the search bar and above the event cards
function getCityState() {
    $.ajax({
        url: "https://get.geojs.io/v1/ip/geo.json",
        method: "GET"
    }).done(function(response) {
        //get latitude and longitude of the current location
        latitude = response.latitude;
        longitude = response.longitude;
        //seatgeek url using latitude and longitude parameters
        queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
        //indicate where the upcoming events are located
        $(".upcoming-listing").text("Upcoming Events in " + response.city);
        //place the location value in the search bar
        $('.location-input').val(response.city + ', ' + response.region);
        seatGeek(queryURL);
    })
}
getCityState();

// function to take the city search query and produce a latitude and longitude value
function getLatLong(cityQuery) {
    //encodeURI puts %20 inbetween spaces
    var citySearch = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURI(cityQuery) + ".json?access_token=pk.eyJ1IjoiZWxhaW50cmFuIiwiYSI6ImNqd3pkMnJrNzEzbzg0M2p6Z293M2JneGIifQ.1LK7HmyNbLKLeL4u7yfjaA";
    $.ajax({
        url: citySearch,
        method: "GET"
    }).done(function(response) {
        latitude = response.features[0].center[1];
        longitude = response.features[0].center[0];
        currentCity = response.features[0].text;
        var fullLocation = response.features[0].place_name;
        $(".upcoming-listing").text("Upcoming Events in " + currentCity);
        $('.location-input').val(fullLocation);
        //term input is optional, so if there is no input
        if (searchInput === undefined || searchInput === "") {
            //set queryurl with location parameters only
            queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
        //if term not empty
        } else if (searchInput !== "") {
            //set queryurl to take both search and location parameters
            queryURL = "https://api.seatgeek.com/2/events?q=" + searchInput + "?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";  
        }
        seatGeek(queryURL);
    })
}

//submit search bar
$("form").on("submit", function(event) {
    //prevent refresh
    event.preventDefault();
    //reset values
    generalReset();
    //term input from search
    searchInput = $(".search-input").val();
    //location input from search
    cityQuery = $('.location-input').val();
    //ajax call to seatgeek
    getLatLong(cityQuery);
    //clear term value from search
    $(".search-input").val("");
    //scroll down to upcoming events on search
    $('html, body').animate({
        scrollTop: $("#upcoming-events").offset().top - 50
   }, 500);
})

//category filter dropdown
$('#categoryDropdown').on('click', '.dropdown-item', function(event) {
    //prevent refresh
    event.preventDefault();
    //select dropdown text
    categoryFilter = $(this).text();
    //link category item to taxonomies of seatgeek
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
        default:
            ""
            break;
    }
    //clear out event array
    eventsArray = []; 
    if (searchInput === undefined || searchInput === "") {
        queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter;
    } else if (searchInput !== "") {
        queryURL = "https://api.seatgeek.com/2/events?q=" + searchInput + "?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12&taxonomies.name=" + categoryFilter;  
    }
    seatGeek(queryURL);
})

//featured locations on click
$(".city-container").on("click", function() {
    //get city name
    var destination = $(this).children(".travel-destination").children("h4").children("span").text();
    //set longitude and latitude of city
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
    //update upcoming event text
    $(".upcoming-listing").text("Upcoming Events in " + destination);
    generalReset();
    queryURL = "https://api.seatgeek.com/2/events?&lat=" + latitude + "&lon=" + longitude + "&client_id=" + clientID + "&per_page=12";
    seatGeek(queryURL);
    $('html, body').animate({
        scrollTop: $("#upcoming-events").offset().top - 50
   }, 500);
})

function seatGeek(seatGeekURL) {
    // taxonomies: sports, concert, theater
    // send an AJAX request
    $.ajax({
        url: seatGeekURL,
        method: "GET"
    }).done(function(response) {
        //clear events
        $('.card-container').empty();
        //if no events show up
        if (response.events.length === 0) {
            //create error page
            $('.card-container').append(
                '<div class="search-error">' +
                '<h2><strong>No results found.</strong></h2>' + 
                '<p>It seems we can’t find any event based on your search. Try broader search terms or select a featured location at the bottom.</p>' +
                '<a href="index.html" class="back-home">Back Home</a></div>'
            );
        //if there are current events
        } else {
            for (var i = 0; i < response.events.length; i++) {
                var element = response.events[i];
                var event = element.title;
                var date = element.datetime_local;
                var city = element.venue.city;
                var state = element.venue.state;
                var coords = element.venue.location;
                var extendedAddress = element.venue.extended_address;
                var tickets = element.url; // ticket URL
                var venue = element.venue.name;
                var address = element.venue.address;
                category = element.taxonomies[0].name;
                var image = element.performers[0].image;
                
                //if image is null, display placeholder image
                if (image === null && category === "sports") {
                    image = "assets/images/sports.jpg";
                } else if (image === null && category === "concert") {
                    image = "assets/images/concert.jpg";
                } else if (image === null && category === "theater") {
                    image = "assets/images/theater.jpg";
                } else {
                    image = element.performers[0].image;
                }

                //push event information into array
                eventsArray.push({
                    event: event,
                    date: date,
                    city: city,
                    state: state,
                    coords: coords,
                    venue: venue,
                    address: address,
                    extendedAddress: extendedAddress,
                    tickets: tickets,
                    category: category,
                    image: image
                });

                //append event information into card to display on html
                $('.card-container').append(
                    '<div class="card" data-toggle="modal" data-target="#eventModal" data-index="' + i + '" data-lat="' + coords.lat + '" data-lon="' + coords.lon + '">' +
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
}

//when clickingn on the event card
$(".card-container").on("click", ".card", function() {
    //display general event information via seatgeek using info stored in array
    var index = $(this).attr('data-index');
    var e = eventsArray[index];
    $('.modal-header > img').attr('src', e.image);
    $('.event-title').text(e.event);
    $('.datetime').empty();
    $('.location').empty();
    $('.datetime').append(
        '<i class="far fa-clock"></i>' +
        moment(e.date).format("dddd, MMMM Do YYYY") +
        " at " + moment(e.date).format("h:mm A")
    );
    $('.location').append(
        "<i class='fas fa-map-marker-alt'></i>"
        + e.address +'<p>' + e.extendedAddress + "</p>"
    );
    $('.tickets').attr({
        'href': e.tickets,
        'target': "_blank"
    });
        
    //zomato api
    //pull event longitude and latitude from data attribute
    resLat = $(this).attr("data-lat");
    resLon = $(this).attr("data-lon");

    var restaurantURL = "https://developers.zomato.com/api/v2.1/search?count=10&lat=" + resLat + "&lon=" + resLon + "&radius=12874&sort=real_distance&order=asc&apikey=aac31fc7cf28e8d834b11bc72cbcc148";

    $.ajax({
        url: restaurantURL,
        method: "GET"
    }).then(function(response) {
        //empty out restaurant section
        $('.row').empty();
        for (var i = 0; i < response.restaurants.length; i++) {
            var resElement = response.restaurants[i].restaurant;
            var resName = resElement.name;
            var resRating = resElement.user_rating.aggregate_rating;
            var resImage = resElement.featured_image;
            var resAddress = resElement.location.address;
            var resPrice = resElement.price_range;

            //if restaurant has no image, display placeholder image
            if (resImage === "") {
                resImage = "assets/images/restaurant.jpg";
            }
            
            //convert numerial rating into star rating
            if (resRating >= 0 && resRating < 0.3) {
                resRating = "<div class='noRating'> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> <i class='fas fa-star'></i> </div>"
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

            //convert numerial price rating to money rating
            if (resPrice === 1) {
                resPrice = "$";
            } else if (resPrice === 2) {
                resPrice = "$$";
            } else if (resPrice === 3) {
                resPrice = "$$$";
            } else if (resPrice === 4) {
                resPrice = "$$$$";
            }

            //append zomato restaurant info to restaurant section
            $(".row").append(
                "<div class='col-5'><img src='" +
                resImage + "'> <div class='res-info'><div class='star-rating'>" +
                resRating + "</div></div><h4>" + resName + "</h4> <p>" +
                resAddress + "</p><div class='price-range'>" + resPrice + " </div></div>"
            );
        }
    })
    //reset row scroll to 0 every time modal is open
    $(".row").animate({ "scrollLeft": 0});
    //display map on modal
    mapBox();
});

//event map
function mapBox() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxhaW50cmFuIiwiYSI6ImNqd3pkMnJrNzEzbzg0M2p6Z293M2JneGIifQ.1LK7HmyNbLKLeL4u7yfjaA';
    //display map according to event location
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [resLon, resLat],
        zoom: 13
    });

    //display map marker
    new mapboxgl.Marker().setLngLat([resLon, resLat]).addTo(map);

    //allows for full screen map
    map.addControl(new mapboxgl.FullscreenControl());
    //allows to zoom in and zoom out map
    map.addControl(new mapboxgl.NavigationControl());

    //initial map is blurry, so calling resize adjusts blur
    map.on('load', function() {
        map.resize();
    });
}

//change background color and text of dropdown when a dropdown item is selected
$(".category-menu a").on("click", function() {
    $(".category-toggle:first-child").text($(this).text());
    $(".category-toggle:first-child").val($(this).text());
    $(".category-toggle:first-child").css({
        "background-color": "#fb5845",
        "color": "white"
    })
})

//scroll restaurant section right
$(".fa-chevron-right").on("click", function() {
    var scrollWidth = $(".row").width() + 55;
    var position = $(".row").scrollLeft();
    $(".row").animate({ "scrollLeft": position + scrollWidth });
})

//scroll restaurant section left
$(".fa-chevron-left").on("click", function() {
    var scrollWidth = $(".row").width() + 55;
    var position = $(".row").scrollLeft();
    $(".row").animate({ "scrollLeft": position - scrollWidth });
})

function generalReset() {
    //clear search input so it doesn't mess with the category dropdown
    searchInput = "";
    //reset category filter
    categoryFilter = "";
    //clear event array
    eventsArray = [];
    //reset dropdown to default
    $(".category-toggle:first-child").text("Any Category");
    $(".category-toggle:first-child").removeAttr("style");
}