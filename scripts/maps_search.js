  var current_question = 0;
  var map;
  
  function parseInfor(latLng){
    var geocoder = new google.maps.Geocoder();
    var content  = "";
    var postal_code = "";
    var country = "";
    var city = "";
    var locality = "";
    geocoder.geocode({
        'latLng': latLng
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
          for(var j=0;j < results[0].address_components.length; j++){
            for(var k=0; k < results[0].address_components[j].types.length; k++){
                if(results[0].address_components[j].types[k] == "postal_code"){
                  postal_code = results[0].address_components[j].short_name;
                }

                if(results[0].address_components[j].types[k] == "country"){
                  country = results[0].address_components[j].long_name;
                }

                if(results[0].address_components[j].types[k] == "administrative_area_level_1"){
                  city = results[0].address_components[j].long_name;
                }

                if(results[0].address_components[j].types[k] == "locality"){
                  locality = results[0].address_components[j].long_name;
                }
            }
            //console.log("full address: ", results[0]);  

            document.getElementById("selectedAddress").innerHTML = "Dit valg: " + results[0].formatted_address;
            var address = document.getElementById("selectedAddress").innerHTML;
            if (current_question == 5) //start
            {
              api.fn.answers({journey_start_point: results[0].formatted_address});
              api.fn.answers({urlVar19: JSON.stringify(latLng)});
            }

            if (current_question == 7) //stop
            {
              api.fn.answers({journey_end_point: results[0].formatted_address});
              api.fn.answers({urlVar20: JSON.stringify(latLng)});
            }
          }
          }
        }
    }); 
  }

  function hideGoogleMaps() {
    current_question = 0;
    var x = document.getElementById("map");
    x.style.display = "none";
    var y = document.getElementById("pac-input");
    y.style.display = "none";
    y.innerHTML = "";
    map.setZoom(8);
    document.getElementById("selectedAddress").style.display = "none";
    document.getElementById("selectedAddress").innerHTML = "";
    document.getElementById("pac-input").value = "";
    //Modify CSS to display Google Map
    var rt_container = document.querySelectorAll(".rt-container");
    var slt_page_container = document.querySelectorAll(".slt-page-container");
    
    for (var i = 0; i < rt_container.length; i++) {
      rt_container[i].style.minHeight = 100 +"vh";
    }

    for (var i = 0; i < slt_page_container.length; i++) {
      slt_page_container[i].style.paddingBottom = 100 +"px";
    }
  }

  function showGoogleMaps() {
    var x = document.getElementById("map");
    x.style.display = "block";
    var y = document.getElementById("pac-input");
    y.style.display = "block";
    document.getElementById("selectedAddress").style.display = "block";
    
    //Modify CSS to display Google Map
    var rt_container = document.querySelectorAll(".rt-container");
    var slt_page_container = document.querySelectorAll(".slt-page-container");
  
    for (var i = 0; i < rt_container.length; i++) {
      //console.log(rt_container[i].style.minHeight);
      rt_container[i].style.minHeight = 0 +"vh";
    }

    for (var i = 0; i < slt_page_container.length; i++) {
      //console.log( rt_container[i].style.paddingBottom);
      slt_page_container[i].style.paddingBottom = 0 +"px";
    }
  }

  function initAutocomplete() {
    const myLatlng = { lat: 55.444901, lng: 11.788920};

    //const map = new google.maps.Map(document.getElementById("map"), {
    map = new google.maps.Map(document.getElementById("map"), {      
    center: myLatlng,
    zoom: 8,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        //console.log("Returned place contains no geometry");
        return;
      }
      else {
        parseInfor(place.geometry.location);
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
    parseInfor(mapsMouseEvent.latLng);
  
    });

    window.initAutocomplete = initAutocomplete;
    hideGoogleMaps();
}

