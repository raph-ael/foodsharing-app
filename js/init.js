var init = {
	location_counter: 0,
	footerTimeout : null,
	footer: function()
	{
		
		$('#menu a.pagelink').bind('touchstart',function(){
			index = this.href.split('#')[1];
			page.activate(index);
		});
		
		$('#menu a.pagelink').click(function(ev){
			ev.preventDefault();
		});
	},
	cambutton: function()
	{
		$('#cambutton').bind('touchend',function(ev){
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
	checkboxes: function(){
		
		$('label.checkbox').click(function(ev){
			ev.preventDefault();
		});
		
		$('label.checkbox').bind('touchstart',function(){

			$this = $(this);
			
			if($this.hasClass('checked'))
			{
				$this.children('i').addClass('fa-square-o').removeClass('fa-check-square-o');
				$this.removeClass('checked');
				$this.children('input')[0].checked = false;
			}
			else
			{
				$this.children('i').addClass('fa-check-square-o').removeClass('fa-square-o');
				$this.addClass('checked');
				$this.children('input')[0].checked = true;
			}
		});
		
		$('label.checkbox').click(function(ev){
			ev.preventDefault();
		});
		
		$('label.pure-radio').click(function(ev){
			ev.preventDefault();
		});
		
		$('label.pure-radio').bind('touchstart',function(){

			$this = $(this);
			check = $this.hasClass('checked');
			
			if(!check)
			{
				
				$this.parent().parent().children('li').each(function(){	
					$child = $(this);
					$child.children('label').removeClass('checked');
					$child.children('label').children('input')[0].checked = false;
					$child.children('label').children('i').addClass('fa-circle-o').removeClass('fa-dot-circle-o');
				});
				
				
				$this.children('i').addClass('fa-dot-circle-o').removeClass('fa-circle-o');
				$this.addClass('checked');
				$this.children('input')[0].checked = true;
				
			}
		});
		
		$('#basketSubmit').click(function(ev){
			ev.preventDefault();
			basket.submit();
		});
		
		$('#cb-details-label').bind('touchstart',function(){
			if($('#cb-details').is(':visible'))
			{
				$(this).children('i').removeClass('fa-caret-down').addClass('fa-caret-right');
				$('#cb-details').css('display','none');
			}
			else
			{
				$(this).children('i').removeClass('fa-caret-right').addClass('fa-caret-down');
				$('#cb-details').css('display','block');
			}
		});
		
		$('#cb-location-label').bind('touchstart',function(){
			if($('#cb-location').is(':visible'))
			{
				$(this).children('i').removeClass('fa-caret-down').addClass('fa-caret-right');
				$('#cb-location').css('display','none');
			}
			else
			{
				$(this).children('i').removeClass('fa-caret-right').addClass('fa-caret-down');
				$('#cb-location').css('display','block');
			}
		});
		
		$('#cb-contact-label').bind('touchstart',function(){
			if($('#cb-contact').is(':visible'))
			{
				$(this).children('i').removeClass('fa-caret-down').addClass('fa-caret-right');
				$('#cb-contact').css('display','none');
			}
			else
			{
				$(this).children('i').removeClass('fa-caret-right').addClass('fa-caret-down');
				$('#cb-contact').css('display','block');
			}
		});
		
		$('input.phone-check').parent().bind('touchstart',function(){
			if($(this).children('input:checked').length > 0)
			{
				$('#phone-wrapper').show();
			}
			else
			{
				$('#phone-wrapper').hide();
			}
		});
		
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
		});
		
		if(!loginDataSaved())
		{
			page.activate('settings');
		}
	}
};
