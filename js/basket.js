var basket = {
	hideLocWait: function(){
		$('#basketSubmitWait').hide();
		$('#basketSubmit').show();
	},
	validate: function(){
		if($('#description').val() == '')
		{
			$('#description')[0].focus();
			window.scrollTo(0, 0);
			msg.info('Bitte gib eine Beschreibung ein');
			return false;
		}
		
		return true;
	},
	clearForm: function()
	{
		$('#image-preview').css('display','none');
		$('#description').val('');
		$('#page-foodbasket input[type=\'checkbox\']').each(function(){
			this.checked = false;
		});
		window.scrollTo(0, 0);
	},
	tryCount: 0,
	submit: function(){
		
		if(this.validate())
		{
			var food_types = new Array();
			$('.cb-food_type:checked').each(function(){
				food_types[food_types.length] = $(this).val();
			});
			
			var food_art = new Array();
			$('.cb-food_art:checked').each(function(){
				food_art[food_art.length] = $(this).val();
			});
			
			var contact_type = new Array();
			$('.cb-contact_type:checked').each(function(){
				contact_type[contact_type.length] = $(this).val();
			});
			
			fetchpoint = '0';
			if($('.cb-fetch-point:checked').val() != 'home')
			{
				fetchpoint = 'loc';
			}
			
			loader.show();
			a.req('basket_submit',{
				data: {
					desc: $('#description').val(),
					art: food_art,
					types: food_types,
					ctype: contact_type,
					fetchart: $('.cb-fetch-point:checked').val(),
					lat: $('#latitude').val(),
					lon: $('#longitude').val(),
					phone: $('#phone').val(),
					phone_mobile: $('#phone_mobile').val(),
					photo: $('#photo').val(),
					weight: $('#weight').val(),
					fp: fetchpoint
				},
				success: function(){
					loader.hide();
					this.tryCount = 0;
					basket.clearForm();
					msg.success('Korb wurde erfolgreich eingestellt!');
				},
				error: function(){
					this.tryCount++;
					loader.hide();
					if(this.tryCount > 3)
					{
						msg.error('Der Korb konnte noch nicht hochgeladen werden, überprüfe Deine Internet-Verbindung und versuche es später noch einmal.');
						this.tryCount = 0;
					}
					else
					{
						setTimeout(function(){
							u.login({
								success:function(){
									basket.submit();
								}
							});
						},2000);
					}
				}
			});
		}
	},
	getPosition: function(){
		$('#basketSubmitWait').show();
		$('#basketSubmit').hide();
		
		loader.miniShow();
		this.watchId = navigator.geolocation.getCurrentPosition(
			function(pos){
				
				c.lat = pos.coords.latitude;
				c.lon = pos.coords.longitude;
				$('#latitude').val(c.lat);
				$('#longitude').val(c.lon);
				$('#basketSubmitWait').hide();
				$('#basketSubmit').show();
				loader.miniHide();
				
			},
            function(error){
            	
            	msg.error('Position konnte nicht ermittelt werden');
            	$('#basketSubmitWait').hide();
				$('#basketSubmit').show();
				$(".cb-fetch-point[value='home']")[0].checked = true;
				loader.miniHide();
            	
            },
            { 
            	maximumAge: 3000, 
            	timeout: 600000, 
            	enableHighAccuracy: true 
            }
        );
	},
	loadBasket: function(id)
	{
		// lade essenskorb fülle essenkorb seite un wechsle
		loader.show();
		a.req('loadBasket',{
			data:{
				id: id
			},
			success: function(data){
				loader.hide();
				page.activate('basket');
				$('#page-basket h2:first').text('Essenskorb von ' + data.basket.fs_name);
				$('#page-basket aside:first').text(data.basket.description);
				if(data.basket.picture != '')
				{
					$('#page-basket .picture img').attr('src','http://' + c.domain + '/freiwillige/images/basket/thumb-' + data.basket.picture);
					$('#page-basket .picture').css('display','block');
				}
				else
				{
					$('#page-basket .picture').css('display','none');
				}
				
				if(data.basket.lat > 0)
				{
					distance = L.latLng(c.lat, c.lon).distanceTo(L.latLng(data.basket.lat,data.basket.lon));
					
					if(distance >= 1000)
					{
						distance = t.number((distance/1000)) + ' km';
					}
					else
					{
						distance = t.number(distance) + ' m';
					}
					$('#b-distance').text(distance);
					
					$('#route-btn button').unbind('click').click(function(){
						page.activate('map',{
							complete: function(){
								map.routeTo(data.basket.lat,data.basket.lon);
							}
						});
					});
				}
				else
				{
					$('#route-btn').hide();
				}
				
				
				
				/*
				 * Anfrage Buttons
				 */
				contact_type = new Array(1);
				
				if(data.basket.contact_type != '')
				{
					contact_type = data.basket.contact_type.split(':');
				}
				
				// möchte angerufen werden
				if(t.in_array(2,contact_type))
				{
					number = data.basket.handy;
					if(number == '')
					{
						number = data.basket.tel;
					}
					button = $('#request-phone a:first');
					button.attr('href','tel:' + number);
					button.text(number + ' anrufen');
				}
				else
				{
					$('#request-phone').hide();
				}
				
				// möchte per nachricht angefragt werden
				if(t.in_array(1,contact_type))
				{
					$('#request-msg').show();
					// request buttons cleanen
					$('#request-msg button').unbind('click');
					
					$('#request-msg button').click(function(){

						navigator.notification.prompt('Schreibe ' + data.basket.fs_name + ' eine kurze Nachricht zu Deiner Anfrage', function(ret){
							if(ret.buttonIndex == 1)
							{
								loader.show();
								a.req('sendreqmessage',{
									data:{
										id: data.basket.id,
										msg: ret.input1
									},
									app: 'basket',
									success: function(){
										loader.hide();
										t.goBack();
									}
								});
							}
						}, 'Essenskorb anfragen', ['Anfrage absenden','Abbrechen'], '');
						
					});
				}
				else
				{
					$('#request-msg').hide();
				}
			}
		});
	},
	showRequests: function()
	{
		page.activate('requests');
		
		a.req('loadrequests',{
			success: function(ret){
				loader.pageHide();
				
				$('#requestBody').html('');
				
				if(ret.requests != undefined && ret.requests.length > 0)
				{
					for(i=0;i<ret.requests.length;i++)
					{
						r = ret.requests[i];
						$('#requestBody').append('<li class="fill"><a href="http://lebensmittelretten.de/freiwillige/?page=message&conv=' + r.fs_id + '" target="_blank"><img class="corner" src="' + r.fs_photo + '" /></span><span class="pure-menu-heading">Anfrage von ' + r.fs_name + '</span><span class="time">' + r.time + '</span><span class="text">' + r.text + '</span><span class="clear"></span></a></li>');
					}
				}
				else
				{
					$('#requestBody').append('<li class="pure-menu-heading">Zur Zeit keine Anfragen..</li>');
				}
				
			}
		});
	}
};
