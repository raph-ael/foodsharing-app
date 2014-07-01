var msg = {
	info: function(msg)
	{
		navigator.notification.alert(msg, function(){
			
		}, 'Info!', 'OK');
	},
	error: function(msg)
	{
		navigator.notification.alert(msg, function(){
			
		}, 'Fehler', 'Alles klar');
;
	},
	success: function(msg)
	{
		navigator.notification.alert(msg, function(){
			
		}, 'Prima!', 'OK');
	}
};
