var lang = new Array ();
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

init.location_counter = 0;

lang['foodbasket'] = 'Essenskorb';
lang['settings'] = 'Einstellungen';

document.addEventListener('deviceready',function(){
		
	// initialize Push Messaging
	position.get();
	
	document.body.className = t.id(device.platform);
		
	push.init();
	
	init.hardwareButtons();
	
	//cache.init();
	
	if(c.splashVisible)
    {
    	c.splashVisible = false;
        navigator.splashscreen.hide();
    }
    
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
	
},false);

$(document).ready(function(){
	
	loader.miniShow();
	
	var u_loader = $('#loader');
	u_loader.fadeOut(1,function(){
		u_loader.css('display','none');
	});
	
	init.footer();
	init.cambutton();
	init.checkboxes();
	
	$('#title-wrapper').bind('touchstart', function(ev){
		init.menuClick();
    });
	
	init.checkLogin();
	init.login_data();
	
	loader.miniHide();
	basket.init();
	chat.init();
	
	// map bugfix while resizing
	$(window).resize(function(){
		if(map.map !== null && c.currentpage == 'map')
		{
			map.map.invalidateSize(false);
		}
	});
	
	if(c.splashVisible)
    {
    	c.splashVisible = false;
        navigator.splashscreen.hide();
    }
    
    
	
});

function loginDataSaved()
{
	try
	{
		email = window.localStorage.getItem('lmr-email');
		pass = window.localStorage.getItem('lmr-pass');
		
		if(null == email || null == pass)
		{
			return false;
		}
		
		return true;
		
	}
	catch(error)
	{
		return false;
	}
	return false;
}

function s(index)
{
	if(lang[index] != undefined)
	{
		return lang[index];
	}
	else
	{
		return index;
	}
}
