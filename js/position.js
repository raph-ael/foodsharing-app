var position = {
	watchId: null,
	get: function(){
		this.watchId = navigator.geolocation.getCurrentPosition(
			function(pos){
				c.lat = pos.coords.latitude;
				c.lon = pos.coords.longitude;
				$('#latitude').val(c.lat);
				$('#longitude').val(c.lon);
			},
            function(error){
            	// noch nix
            },
            { 
            	maximumAge: 3000, 
            	timeout: 600000, 
            	enableHighAccuracy: true 
            }
        );
	},
	startWatch: function(){
		
	},
	stopWatch: function(){
		
	}
};
