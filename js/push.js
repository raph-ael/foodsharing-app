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
	  		u.login({
	  			success: function(){
	  				basket.showRequests();
	  			}
	  		});
	  }
	  else
	  {
	  	  loader.miniShow();
	      window.setTimeout(function(){
	      	push.coldstart();
	      },50);
	  }
   },
   foreground: function(type,data)
   {
   		/*
   		 * data.d = adiitional data opject
   		 * data.d.i = user_id
   		 * data.d.c = timestamp
   		 * data.d.t = message type (0=chat message)
   		 */
   		//page.activate('chat');
   		
   		switch(type)
   		{
   			// if type == 0 chat message arrived
   			case 0 :   				
   				/*
   				 * Wenn ankommende Nachricht gleich mit aktivem chatfenster appende einfach die msg
   				 */
   				if(chat.isActive(data.d.i))
   				{
   					// Wen History nocht nicht existiert laden...
   					if(chat.history[parseInt(data.d.i)] == undefined)
	   				{
	   					//alert('chat noch nicht geladen lade..');
	   					// if not lets load it from server
	   					chat.load(data.d.i,{
	   						success: function(){
	   							chat.getPush(data.d.i, data.message, data.d.c);
	   						}
	   					});
	   				}
	   				else
	   				{
	   					//alert('chat geladen nur appenden');
	   					chat.getPush(data.d.i,data.message,data.d.c);
	   				}
   				}
   				/*
   				 * Ansonsten abfrage
   				 */
   				else 
   				{
   					navigator.notification.confirm('Nachricht jetzt lesen?', function(bi){
		        		if(bi == 1)
		        		{
		        			page.activate('chat');
		        			chat.load(data.d.i,{
		        				success: function(){
		        					chat.getPush(data.d.i,data.message,data.d.c);
		        				}
		        			});
		        		}
		        		/**
		        		 * Nachricht später lesen
		        		 * lösche history um Nachricht nachzuladen bei chat aktivierung
		        		 */
		        		else
		        		{
		        			chat.deleteHistory(data.d.i); 
		        		}
		        	}, 'Neue Nachricht erhalten', ['jetzt lesen','Später']);
   				}
   				
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

function onNotificationAPN (e) {
	
	//alert(dump(e));
	
	 if ( e.foreground )
     {
            push.foreground(e.d.t,e);
     }
     else
     {  // otherwise we were launched because the user touched a notification in the notification tray.
           
         if ( e.coldstart )
         {
           		push.coldstart();
         }
         else
         {
           		chat.chat(e.d.i,{
           			success: function(){
           				chat.getPush(e.d.i,e.message,e.d.c);
           			}
           		});
         }
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
   // $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

	//alert(dump(e));

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
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
           
           if ( e.coldstart )
           {
           		// hmm läuft (noch nicht so wie gepant!)
           		push.coldstart();
           }
           else
           {
           		chat.chat(e.payload.d.i,{
           			success: function(){
           				chat.getPush(e.payload.d.i,e.payload.message,e.payload.d.c);
           			}
           		});
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
