var map = {
	lat:0,
	lon:0,
	bkIcon: L.icon({
	    iconUrl: 'img/marker-baskets.png',
	    shadowUrl: 'img/shadow-marker.png',
	
	    iconSize:     [36, 50], // size of the icon
	    shadowSize:   [62, 50], // size of the shadow
	    iconAnchor:   [36, 50], // point of the icon which will correspond to marker's location
	    shadowAnchor: [36, 50],  // the same for the shadow
	    popupAnchor:  [-18, -52] // point from which the popup should open relative to the iconAnchor
	}),
	map: null,
	latLng: null,
	init: function(lat,lon,zoom)
	{
		this.lat = lat;
		this.lon = lon;
		
		map.latLng = L.latLng(lat, lon);
		
		if(this.map == null)
		{
			this.map = L.map('page-map').setView([lat, lon], zoom);
			
			L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri 2014'
			}).addTo(this.map);
			
			this.initMarker();
			
			this.map.on('dragend',function(distance){
				map.loadMore(distance);
			});
					
		}
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
	markerCluster: null,
	initMarker: function(){
		// http://www.lebensmittelretten.de/freiwillige/xhrapp.php?app=basket&m=update&app=basket&loader=false
		loader.miniShow();
		
		a.req('basketsnear',{
			data:{
				lat:map.lat,
				lon:map.lon
			},
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
	}
		
};
