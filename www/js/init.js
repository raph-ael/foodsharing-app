var init = {
	location_counter: 0,
	checkboxes: function()
	{
		$('.cbmenu a').click(function(ev){
			ev.preventDefault();
			cb = $(this).children('label').children('input')[0];
			if(cb.checked)
			{
				cb.checked = false;
			}
			else
			{
				cb.checked = true;
			}
			
			if($('.phone-check')[0].checked)
			{
				$('#phone-wrapper').css('display','block');
			}
			else
			{
				$('#phone-wrapper').css('display','none');
			}
			
		});
	},
	footerTimeout : null,
	footer: function()
	{
		var footer = $('footer');
		footer.animate({
			'bottom':'-100px'
		},200,function(){
			footer.hide();
		});
		
		$('footer a.pagelink').click(function(ev){
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
		$('.geoview').hide(); 
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
		var footer = $('footer');
		footer.animate({
			'bottom':'-100px'
		},100,function(){
			footer.hide();
		});
	},
	fButtonsShow: function(){
		var footer = $('footer');
		footer.show();
		footer.animate({
			'bottom':'0px'
		},100);
	},
	hardwareButtons: function(){
		
		document.addEventListener("menubutton", function(){
			
			if($('footer').is(':visible'))
			{
				if(init.footerTimeout !== null)
				{
					clearTimeout(init.footerTimeout);
				}
				init.fButtonsHide();
			}
			else
			{
				init.fButtonsShow();
				
				init.footerTimeout = setTimeout(function(){
					init.fButtonsHide();
				},5000);
			}
			
			
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
