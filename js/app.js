var lang = new Array ();


init.location_counter = 0;

lang['foodbasket'] = 'Essenskorb';
lang['settings'] = 'Einstellungen';

document.addEventListener('deviceready',function(){
	
	// initialize Push Messaging
	
	if(navigator.splashscreen)
    {
        navigator.splashscreen.hide();
    }
	
	push.init();
	
	if(init.location_counter <= 10)
    {
		init.location();
	}
	init.hardwareButtons();
},false);

$(document).ready(function(){
	
	var u_loader = $('#loader');
	u_loader.fadeOut(1,function(){
		u_loader.css('display','none');
	});
	
	init.footer();
	init.checkboxes();
	init.cambutton();
	
	$('#title-wrapper').click(function(){
		init.menuClick();
	});

	init.checkLogin();
	init.login_data();
	
	$('#basketSubmit').click(function(ev){
		ev.preventDefault();
		basket.submit();
	});
	loader.miniHide();
	
	// map bugfix while resizing
	$(window).resize(function(){
		if(map.map !== null)
		{
			map.map.invalidateSize(false);
		}
	});
	
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

function setLocation(position)
{
	$('#latitude').val(position.coords.latitude);
	$('#longitude').val(position.coords.longitude);
	$('.geoview').show();  
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
