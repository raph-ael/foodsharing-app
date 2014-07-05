var init = {
	location_counter: 0,
	footerTimeout : null,
	footer: function()
	{
		
		$('#menu a.pagelink').click(function(ev){
			ev.preventDefault();
			index = this.href.split('#')[1];
			page.activate(index);
		});
	},
	cambutton: function()
	{
		$('#cambutton').click(function(ev){
			ev.preventDefault();
			
			capturePhoto();
		});
	},
	location: function()
	{
		pos.getPosition();
		//$('.geoview').hide(); 
		/*
		navigator.geolocation.getCurrentPosition(
			// success get geolocation
			function(position){
				
				setLocation(position);
	
			}, 
			// failed get geolocation
	        function(){
	        	$('.geoview').hide();  
	        	navigator.geolocation.watchPosition(function(position){
	        		setLocation(position);
	        	},
	            function(){
	            	if(this.location_counter <= 10)
	            	{
	            		this.location_counter++;
	            		this.location();
	            	}
	            },
	            {timeout:30});                       	
	        }
	    );
	    */
	
	},
	fButtonsHide: function(){
		$('#menu').addClass('invisible');
	},
	fButtonsShow: function(){
		$('#menu').removeClass('invisible');
	},
	menuClick: function()
	{
		if($('#menu').hasClass('invisible'))
		{
			if(init.footerTimeout !== null)
			{
				clearTimeout(init.footerTimeout);
			}
			init.fButtonsShow();
				
			init.footerTimeout = setTimeout(function(){
				init.fButtonsHide();
			},5000);
		}
		else
		{
			if(init.footerTimeout !== null)
			{
				clearTimeout(init.footerTimeout);
			}
			init.fButtonsHide();
		}
	},
	hardwareButtons: function(){

		document.addEventListener("backbutton", function(){

			t.goBack();
			
		}, false);
		
		document.addEventListener("menubutton", function(){
			init.menuClick();
		}, false);
	},
	login_data: function()
	{
		try
		{
			email = store.get('lmr-email');
			pass = store.get('lmr-pass');
			token = store.get('lmr-token');
			
			if(null == email || null == pass)
			{
				page.activate('settings');
				return false;
			}
			
			$('#email').val(email);
			$('#password').val(pass);
			
			u.login();
			
		}
		catch(error)
		{
			page.activate('settings');
		}
	},
	checkLogin: function(){
		$('#savesettings').click(function(ev){
			ev.preventDefault();
			u.login();
			/*
			
			
			
			email = $('#email').val();
			pass = $('#password').val();
			
			$.ajax({
				dataType: 'json',
				url:'http://' + c.domain + '/freiwillige/xhrapp.php?app=api&m=login',
				type:'post',
				data: {
					e: email,
					p: pass
				},
				success: function(json){
					if(json.status != undefined && json.status == 1)
					{
						window.localStorage.setItem('lmr-email',email);
						window.localStorage.setItem('lmr-pass',pass);
						window.localStorage.setItem('lmr-token',json.token);
						activatePage('foodbasket');
						
					}
				}
			});
			*/
		});
		
		if(!loginDataSaved())
		{
			page.activate('settings');
		}
	}
};
