var u = {
	loginTryCount: 0,
	getToken: function(){
		token = store.get('lmr-token');
		if(token != null)
		{
			return token;
		}
		return false;
	},
	checkLogin: function(){
		a.req('checklogin');
	},
	login: function(option){
		
		if(option == undefined)
		{
			option = {};
		}
		
		if(this.loginTryCount >= 5)
		{
			msg.error('Du konntest Nicht angemeldet werden, bitte überprüfe Deine Internet-Verbindung');
		}
		else
		{
			store.del('lmr-email');
			store.del('lmr-pass');
			store.del('lmr-token');
			
			loader.show();
			
			a.req('login',{
				data:{
					e:$('#email').val(),
					p:$('#password').val()
				},
				success: function(json)
				{
					store.set('lmr-email',json.e);
					store.set('lmr-pass',json.p);
					store.set('lmr-token',json.token);
					store.set('fs-id',json.id);
					store.set('fs-phone',json.phone);
					store.set('fs-gender',json.gender);
					store.set('fs-name',json.name);
					
					store.set('fs-lat',json.lat);
					store.set('fs-lon',json.lon);
					
					c.lat = json.lat;
					c.lon = json.lon;

					/*
					$('#phone').val(json.phone);
					$('#phone_mobile').val(json.phone_mobile);
					*/
					
					if(json.phone_mobile != '')
					{
						$('#phone').val(json.phone_mobile);
					}
					else
					{
						$('#phone').val(json.phone);
					}
					
					//$('#title').text(json.name);
					
					this.loginTryCount = 0;
					page.activate('foodbasket');
					
					if(option.success != undefined)
					{
						option.success();
					}
					
					loader.hide();
					
				},
				error: function(){
					this.loginTryCount++;
					msg.info('Du konntest Nicht angemeldet werden, bitte überprüfe Deine Zugangsdaten');
				}
			});
		}
	}
};

