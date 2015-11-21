var map;
var lastVertex = 1;
var stepnum=0;
var step = 50; // 5; // metres
var tick = 100; // milliseconds
var eol= [];

var map;
var directionDisplay;
var directionsService;
var stepDisplay;
var position;
var marker = [];
var polyline = [];
var poly2 = [];
var poly = null;
var startLocation = [];
var endLocation = [];
var timerHandle = [];
var speed = 0.000005, wait = 1;
var infowindow = null;
var myPano;   
var panoClient;
var nextPanoId;
var source, destination;
var directionsDisplay;
var directionsService;
var geocoder;
var distance;

function initAutocomplete() {

  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  var pos = { };

     map = new google.maps.Map(document.getElementById('dvMap'), {
     center: {lat: -33.8688, lng: 151.2195},
     zoom: 14,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   });

  //showallcars(map);
  //   var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    //  console.log("Latitude: " + pos.lat + " Langitude: " + pos.lng);
      var marker = new google.maps.Marker({
        position: {lat: pos.lat, lng: pos.lng},
        map: map
      });
      getAddressFromLatLang(pos.lat, pos.lng);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  
  // Create the search box and link it to the UI element.
  var input = document.getElementById('txtSource');
  var searchBox = new google.maps.places.SearchBox(input);
 // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  //Destination
  var output = document.getElementById('txtDestination');
  var searchBox = new google.maps.places.SearchBox(output);
 // map.controls[google.maps.ControlPosition.TOP_LEFT].push(output);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  
  doOnClick();
  // [END region_getplaces]
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function getAddressFromLatLang(lat,lng){
 
  var latLng = new google.maps.LatLng(lat, lng);
  geocoder.geocode( { 'latLng': latLng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        alert(results[1].formatted_address);
        document.getElementById('txtSource').value = results[1].formatted_address;
      }
    }
    else  {
      alert("Geocode was not successful " + status);
    }
  });
}

function showallcars(map){
  var southWest = new google.maps.LatLng(37.3860517, -122.0838511);
  var northEast = new google.maps.LatLng(37.1911821, -121.70814540000003);
  var lngSpan = northEast.lng() - southWest.lng();
  var latSpan = northEast.lat() - southWest.lat();

  for (var i = 0; i < 1000; i++) {
    var x = southWest.lat() + latSpan * Math.random();
    var y = southWest.lng() + lngSpan * Math.random();
  //  console.log(x + "," + y); 
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(southWest.lat() + latSpan * Math.random(), southWest.lng() + lngSpan * Math.random()),
      map: map,
      icon:'../images/car.png',    
    });
  }
}

function doOnClick() {
  document.getElementById('loaddrivers').click();
  //Should alert('/testlocation');
}

function loadDrivers(res){

  console.log("In loaddrivers");

//    map = new google.maps.Map(document.getElementById('map'), {
//    center: {lat: -33.8688, lng: 151.2195},
//    zoom: 14,
//    mapTypeId: google.maps.MapTypeId.ROADMAP
//  });


  for (var i = 0; i < res.length; i++) {
    var x = res[i].LATITUDE;
    var y = res[i].LANGITUDE;

  //  console.log(x + "," + y); 
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(x,y),
      map: map,
      label: res[i].DRIVER_ID,
      labelStyle: {opacity: 0},
      icon:'../images/car.png'
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
         return function() {
            console.log(marker.label);
            document.getElementById('btnGetDriver').value = marker.label;
            console.log("div value "+document.getElementById('btnGetDriver').value);
            document.getElementById('btnGetDriver').click();
         }
    })(marker, i));
  }

}


// get location

function geocodeAddress(addr) {
  var geoloc;
  var geocoder = new google.maps.Geocoder();  
  geocoder.geocode({'address': addr}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      geoloc = results[0].geometry.location;      
      alert('Location is: ' + results[0].geometry.location);     
      return results[0].geometry.location;
      
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


function setRoutes(){   

  var srcloc;
  var desloc;

  console.log("From setRoutes");
  source = document.getElementById("txtSource").value;
  destination = document.getElementById("txtDestination").value;
  
  if(source == "" || destination == ""){
    alert("Source/Destination can not be empty");
    return;
  }
  srcloc = geocodeAddress(source);
  console.log("Src loc: " + srcloc);
  
  desloc = geocodeAddress(destination);
  console.log("Des loc: " + desloc);

  var startLoc = new Array();
  startLoc[0] = source;

  var endLoc = new Array();
  endLoc[0] = destination;

  var directionsDisplay = new Array();

  for (var i=0; i< startLoc.length; i++){
    var rendererOptions = {
          map: map,
          suppressMarkers : true,
          preserveViewport: true
    }
    directionsService = new google.maps.DirectionsService();
    var travelMode = google.maps.DirectionsTravelMode.DRIVING;  
    var request = {
          origin: startLoc[i],
          destination: endLoc[i],
          travelMode: travelMode
    };  

    directionsService.route(request,makeRouteCallback(i,directionsDisplay[i]));
  }   
  
  function makeRouteCallback(routeNum,disp){
    console.log("In makeRouteCallback");
    if (polyline[routeNum] && (polyline[routeNum].getMap() != null)) {
      startAnimation(routeNum);
        return;
    }
    
    return function(response, status){    
      if (status == google.maps.DirectionsStatus.OK){
        var bounds = new google.maps.LatLngBounds();
        var route = response.routes[0];
        startLocation[routeNum] = new Object();
        endLocation[routeNum] = new Object();
        polyline[routeNum] = new google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 3
        });
        
        poly2[routeNum] = new google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 3
        });     
        // For each route, display summary information.
        var path = response.routes[0].overview_path;
        var legs = response.routes[0].legs;
        disp = new google.maps.DirectionsRenderer(rendererOptions);     
        disp.setMap(map);
        disp.setDirections(response);
        
        //Markers               
        for (i=0;i<legs.length;i++) {
          if (i == 0) { 
            startLocation[routeNum].latlng = legs[i].start_location;
            startLocation[routeNum].address = legs[i].start_address;
            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
            marker[routeNum] = createMarker(legs[i].start_location,"start",legs[i].start_address,"green");
          }
          endLocation[routeNum].latlng = legs[i].end_location;
          endLocation[routeNum].address = legs[i].end_address;
          var steps = legs[i].steps;

          for (j=0;j<steps.length;j++) {
            var nextSegment = steps[j].path;                
            var nextSegment = steps[j].path;

            for (k=0;k<nextSegment.length;k++) {
              polyline[routeNum].getPath().push(nextSegment[k]);
              //bounds.extend(nextSegment[k]);
            }
          }
        }
      }       
      
      polyline[routeNum].setMap(map);
      //map.fitBounds(bounds);
      startAnimation(routeNum);  
    } // else alert("Directions request failed: "+status);
  }
}

 function updatePoly(i,d) {
 // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
    if (poly2[i].getPath().getLength() > 20) {
          poly2[i]=new google.maps.Polyline([polyline[i].getPath().getAt(lastVertex-1)]);
          // map.addOverlay(poly2)
        }

    if (polyline[i].GetIndexAtDistance(d) < lastVertex+2) {
        if (poly2[i].getPath().getLength()>1) {
            poly2[i].getPath().removeAt(poly2[i].getPath().getLength()-1)
        }
            poly2[i].getPath().insertAt(poly2[i].getPath().getLength(),polyline[i].GetPointAtDistance(d));
    } else {
        poly2[i].getPath().insertAt(poly2[i].getPath().getLength(),endLocation[i].latlng);
    }
 }
//----------------------------------------------------------------------------

function animate(index,d) {    

    //if () {
      marker[index].setPosition(endLocation[index].latlng);
      return;
   // }
    var p = polyline[index].GetPointAtDistance(d);

    //map.panTo(p);
    marker[index].setPosition(p);
    updatePoly(index,d);
    timerHandle[index] = setTimeout("animate("+index+","+(d+step)+")", tick);
}

//-------------------------------------------------------------------------

function startAnimation(index) {
        console.log("index: " + [polyline[index].getPath().getAt(0)]);
        if (timerHandle[index]) clearTimeout(timerHandle[index]);
        //eol[index]=polyline[index].Distance();
        map.setCenter(polyline[index].getPath().getAt(0));

        poly2[index] = new google.maps.Polyline({path: [polyline[index].getPath().getAt(0)], strokeColor:"#FFFF00", strokeWeight:3});
        var ct = 0;
        timerHandle[index] = setTimeout("animate("+index+",50)",2000);  // Allow time for the initial map display
}

function createMarker(latlng, label, html) {
// alert("createMarker("+latlng+","+label+","+html+","+color+")");
    var contentString = '<b>'+label+'</b><br>'+html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        icon:'../images/car.png',
        zIndex: Math.round(latlng.lat()*-100000)<<5
        });
        marker.myname = label;


    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
        });
    return marker;
}  