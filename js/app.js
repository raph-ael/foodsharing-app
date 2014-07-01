var lang = new Array ();
init.location_counter = 0;

lang['foodbasket'] = 'Essenskorb';
lang['settings'] = 'Einstellungen';

document.addEventListener('deviceready',function(){
    if(navigator.splashscreen)
    {
        navigator.splashscreen.hide();
    }
	if(init.location_counter <= 10)
    {
		init.location();
	}
	init.hardwareButtons();
},false);

$(document).ready(function(){
	
	init.footer();
	init.checkboxes();
	init.cambutton();
	
	

	init.checkLogin();
	init.login_data();
	
	setTimeout(function(){
		loader.hide();
	},500);
	
	$('#basketSubmit').click(function(ev){
		ev.preventDefault();
		basket.submit();
	});
	loader.miniHide();
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
