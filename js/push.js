var pushNotification;
var push = {
	registered:false,
	init: function()
	{		
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
			//alert('register pushnotify');
		    pushNotification.register(
		        tokenHandler,
		        push.errorHandler, {
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
	   // alert(error);
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
   },
   foreground: function(type,data)
   {
   		alert(type + ':' +dump(data));
   		switch(type)
   		{
   			case 1 :
   				chat.getPush(data.i,data.message);
   				break;
   				
   			default:
			    break;
			    msg.info('Du hast eine Essenskorb Anfrage erhalten!');
				basket.showRequests();
   		}
   }
};

function tokenHandler (result) 
{
	c.pushios = result;
	setIosToken();
	  
	//alert('token: ' + result);
    
}

function setIosToken()
{
	if(u.loggedIn)
	{
		//alert('send token' + c.pushios);
		u.setIOSID(c.pushios);
	}
	else
	{
	  	  loader.miniShow();
	      window.setTimeout(function(){
	      	setIosToken();
	      },100);
	}
}

function onNotificationAPN (event) {
	
	alert(dump(event));
	
	if(event.foreground)
	{
		push.foreground(parseInt(event.d.t),event.d);
	}
	
	/*
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
    */
}

// Android
function onNotificationGCM(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

	alert(dump(e));

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
        	push.foreground(e.payload.d.t,e.payload);
            //$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
			
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
