var map = {
	lat:0,
	lon:0,
	watchPosition:null,
	watchCompass: null,
	bkIcon: L.divIcon({
            // Specify a class name we can refer to in CSS.
            className: 'faicon basket-icon',
            // Define what HTML goes in each marker.
            html: '<span><i class="fa fa-map-marker"></i></span>',
            // Set a markers width and height.
            iconSize: [50, 50],
            iconAnchor:   [22, 43]
    }),
	locIcon: L.divIcon({
            // Specify a class name we can refer to in CSS.
            className: 'faicon loc-icon',
            // Define what HTML goes in each marker.
            html: '<span><i class="fa fa-location-arrow"></i></span>',
            // Set a markers width and height.
            iconSize: [41, 41],
            iconAnchor:   [20, 20]
    }),
	locMarker: null,
	route: null,
	map: null,
	latLng: null,
	tileLayer:null,
	init: function(lat,lon,zoom)
	{
		this.lat = lat;
		this.lon = lon;
		
		map.latLng = L.latLng(lat, lon);
		
		if(this.map == null)
		{
			this.map = L.map('page-map',{zoomControl:false}).setView([lat, lon], zoom);
			
			new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map);
			
			this.tileLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri 2014'
			});
			
			this.tileLayer.addTo(this.map);
			
			
			this.initMarker();
			
			this.map.on('dragend',function(distance){
				//map.loadMore(distance);
				ltng = map.map.getCenter();
				//c.lat = ltng.lat;
				//c.lng = ltng.lng;
			});
			
			this.map.on('zoomend',function(){
				c.zoom = map.map.getZoom();
			});	
			
			if(this.locMarker === null)
			{
				this.locMarker = L.marker([c.lat, c.lon], {icon: this.locIcon});
				this.locMarker.addTo(this.map);
				this.turnLoc(60);
			}	
			
			$('.leaflet-top.leaflet-left').append('<div class="leaflet-control-crosshairs leaflet-bar leaflet-control"><a title="Wo bin ich" href="#" class="leaflet-crosshairs"><i class="fa fa-crosshairs"></i></a></div>').click(function(){
				map.center();
			});		
				
			$('.leaflet-control-zoom-in').html('<i class="fa fa-plus-circle"></i>');
			$('.leaflet-control-zoom-out').html('<i class="fa fa-minus-circle"></i>');
		
		}
	},
	center: function(){
		this.map.setView([c.lat, c.lon], 16);
	},
	unload: function(){
		
	},
	loadMore: function(p)
	{
		// wenn karte um mehr als 40 km bewegt lade essenskörbe im umkreis von 50 km neu
		distance = map.latLng.distanceTo(map.map.getCenter());
		if(distance > 40000)
		{
			map.latLng = map.map.getCenter();
			map.lat = map.latLng.lat;
			map.lon = map.latLng.lng;
			
			map.initMarker();
		}
	},
	clearRoutes: function(){
		if(this.route !== null)
		{
			this.route.spliceWaypoints(0, 2);
		}
	},
	routeTo: function(lat,lng){
		
		
		this.clearRoutes();
		
		if(this.route === null)
		{
			this.route = L.Routing.control({
			    lineOptions: {
				    styles: [
				      // Shadow
				      {color: 'black', opacity: 1, weight: 0},
				      // Outline
				      {color: '#ffffff', opacity: 1, weight: 8},
				      // Center
				      {color: '#68B12C', opacity: 1, weight: 4}
				    ]
				  }
			}).addTo(map.map);
		}
		
		this.route.setWaypoints([
	    	L.latLng(map.lat, map.lon),
			L.latLng(lat, lng)
		]);
		
		
	},
	markerCluster: null,
	initMarker: function(){
		// http://www.lebensmittelretten.de/xhrapp.php?app=basket&m=update&app=basket&loader=false
		loader.miniShow();
		
		a.req('allbaskets',{
			
			success: function(json){
				
				// fallsch schon marker vorhanden entfernen
				if(map.maskerCluster != null)
				{
					map.map.removeLayer(map.markerCluster);
				}	
				map.markerCluster = L.markerClusterGroup({maxClusterRadius: 50});
				
				map.markerCluster.on('click', function(el){	
					basket.loadBasket(el.layer.options.id);
				});
					
				
				// abfrage abarbeiten
				if(json.baskets.length > 0)
				{
					for (var i = 0; i < json.baskets.length; i++) 
					{
						var a = json.baskets[i];
						
						// zum cluster hinzufügen
						map.markerCluster.addLayer(
							L.marker(
							new L.LatLng(a.a, a.o), 
							{ 
								id: a.i, 
								icon: map.bkIcon,
								type:'bk' 
							})
						);
					}
				}
				
				// cluster wieder der map hinzufügen
				map.map.addLayer(map.markerCluster);
				
				loader.miniHide();
			},
			error: function()
			{
				loader.miniHide();
			}
		});
	},
	watchSuccess: function(pos)
	{
		this.locMarker.setLatLng(L.latLng(pos.coords.latitude, pos.coords.longitude));
		this.lat = pos.coords.latitude;
		this.lon = pos.coords.longitude;
		c.lat = this.lat;
		c.lon = this.lon;
	},
	watchError: function(error)
	{
		//alert('error');
	},
	turnLoc: function(degrees)
	{
		degrees -= 40;
		/*
		 * 	  		'-webkit-transform' : 'rotate('+degrees+'deg)',
		    	'-moz-transform' : 'rotate('+degrees+'deg)',  
		      	'-ms-transform' : 'rotate('+degrees+'deg)',  
		       	'-o-transform' : 'rotate('+degrees+'deg)',  
		 */
	    $('.leaflet-marker-icon.loc-icon span').css({
	        'transform' : 'rotate('+degrees+'deg)',  
	        'zoom' : 1
	
	    });

	},
	startWatch: function()
	{		
		this.watchCompass = navigator.compass.watchHeading(
			function(CompassHeading){
				//alert(parseInt(CompassHeading.magneticHeading) + ' : ' + CompassHeading.magneticHeading);
				map.turnLoc(CompassHeading.magneticHeading);
				//alert( 'true: ' + CompassHeading.trueHeading );
			}, 
			function()
			{
				//alert('error compass');
			}, 
			{
			    frequency: 3000
			}
		);
		
		// position actuality
		this.watchPosition = navigator.geolocation.watchPosition(
			function(pos)
			{
				map.watchSuccess(pos);
			}, 
			function(error)
			{
				map.watchError(error);
			}, 
			{ 
				maximumAge: 3000, 
            	timeout: 600000, 
            	enableHighAccuracy: true 
			}
		);
	},
	stopWatch: function()
	{
		if(this.watchPosition !== null)
		{
			navigator.geolocation.clearWatch(this.watchPosition);
			this.watchPosition = null;
		}
		
		if(this.watchCompass !== null)
		{
			navigator.compass.clearWatch(this.watchCompass);
			this.watchCompass = null;
		}
	}
		
};
