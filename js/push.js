var pushNotification;
var push = {
	registered:false,
	init: function()
	{
		//alert('push.init()');
		
		//alert(window.device.model+'');
		
		pushNotification = window.plugins.pushNotification;
		
		

		if ( device.platform == 'android' || device.platform == 'Android' )
		{
		    pushNotification.register(
			    push.successHandler,
			    push.errorHandler, {
			        "senderID":"484531551799",
			        "ecb":"onNotificationGCM"
			 });
		}
		else
		{
		    pushNotification.register(
		        tokenHandler,
		        errorHandler, {
		            "badge":"true",
		            "sound":"true",
		            "alert":"true",
		            "ecb":"onNotificationAPN"
		        });
		}
		
		//this.notification.register(push.successHandler, push.errorHandler,{"senderID":"484531551799","ecb":"app.onNotificationGCM"});
	},
	successHandler: function(result) {
    	//alert('Callback Success! Result = '+result);
    	this.registered = true;
    },
	errorHandler:function(error) {
	    alert(error);
	},
   showMessage: function(){
   	   loader.miniHide();
   },
   coldstart: function(){
	  if(u.loggedIn)
	  {
	  		basket.showRequests();
	  }
	  else
	  {
	  	  loader.miniShow();
	      window.setTimeout(function(){
	      	push.coldstart();
	      },100);
	  }
   }
};

function tokenHandler (result) 
{
    u.setIOSID(result);
}

function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

// Android
function onNotificationGCM(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            c.pushgcm = e.regid;
            // set gcm id in database
            u.setGCM(e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            //$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
			msg.info('Du hast eine Essenskorb Anfrage erhalten!');
			basket.showRequests();
            // if the notification contains a soundname, play it.
           // var my_media = new Media("/android_asset/www/"+e.soundname);
           // my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
            	push.coldstart();
            }
            else
            {
                basket.showRequests();
            }
        }

    break;

    case 'error':
       // $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
       // $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}
