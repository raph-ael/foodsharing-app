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
					
					$('#phone').val(json.phone);
					$('#phone_mobile').val(json.phone_mobile);
					
					$('#title').text(json.name);
					
					this.loginTryCount = 0;
					page.activate('map');
					
					if(option.success != undefined)
					{
						option.success();
					}
				},
				error: function(){
					this.loginTryCount++;
					if(option.error != undefined)
					{
						option.error();
					}
				}
			});
		}
	}
};

