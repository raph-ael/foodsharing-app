var a = {
	ready: function()
	{
		alert('ready');
	},
	req: function(method,option){
		var method = method;
		var option = option;
		
		if(option == undefined)
		{
			option = {};
		}
		
		if(option.data == undefined)
		{
			option.data = new Array();
		}
		
		if(option.app == undefined)
		{
			option.app = 'api';
		}
		
		loader.miniShow();
		
		$.ajax({
	        url: 'http://' + c.domain + '/xhrapp.php?app=' + option.app + '&m=' + method + '&format=jsonp&callback=?',
	        dataType: 'jsonp',
	       	type: 'get',
	        data: option.data,
	        success: function (json) 
	        {
	            if(option.success != undefined && json.status == 1)
				{
					option.success(json);
				}
				else if(json.status == 2)
				{
					u.relogin(method,option);
				}
				else if(option.success != undefined && option.error != undefined)
				{
					option.error(json);
				}
				else if(option.status == 0 && option.error != undefined)
				{
					option.error(json);
				}
				else
				{
					//msg.error('Die Anfragekonnte nicht bearbeitet werden');
				}

				if(json.script != undefined)
				{
					$.globalEval(json.script);
				}
	
	        },
	        complete: function(){
	        	loader.hide();
	        	loader.miniHide();
	        },
	        error: function(){
	        	msg.error('Die Anfrage konnte nciht bearbeitet werden');
	        }
	
	});
		
		/*
		caller = $('#caller');
		caller.attr('action','http://' + c.domain + '/xhrapp.php?app=api&m=' + method);
		caller.html('');
		
		for (var k in option.data){
		    if (option.data.hasOwnProperty(k)) 
		    {
		    	caller.append('<input type="hidden" name="' + k + '" value="' + option.data[k] + '" />');
		    }
		}
		
		caller.submit();
		*/
		/*
		$.ajax({
				dataType: 'json',
				url:'http://' + c.domain + '/xhrapp.php?app=api&m=' + method,
				type:'post',
				data: option.data,
				success: function(json,status,xhr){
					
					alert(xhr.getResponseHeader('Set-Cookie'));
					
					if(option.success != undefined)
					{
						option.success(json);
					}
				},
				complete: function(json){
					if(option.complete != undefined)
					{
						option.complete(json);
					}
				}
			});
			*/
	},
	setData: function(jsonStr,callback)
	{
		alert('setData');
		if(jsonStr != undefined && callback != undefined)
		{
			if(callback != 'none')
			{
				callback();
			}
		}
	}
};

var loader = {
	visible:false,
	miniShow: function()
	{
		$('#mini-loader').stop().fadeIn();
	},
	pageHide: function(){
		$('.pageloader').hide();
		$('.pageContent').show();
	},
	pageShow: function(){
		$('.pageloader').show();
		$('.pageContent').hide();
	},
	miniHide: function(){
		$('#mini-loader').stop().fadeOut();
	},
	show: function(){
		if(!this.visible)
		{
			window.scrollTo(0, 0);
			$('body').css('overflow','hidden');
			var u_loader = $('#loader');
			
			u_loader.css('display','block');
			u_loader.stop().fadeIn(10);
			
			this.visible = true;
		}
	},
	hide: function(){
		if(this.visible)
		{
			$('body').css('overflow','auto');
			var u_loader = $('#loader');
			u_loader.stop().fadeOut(200,function(){
				u_loader.css('display','none');
			});
			this.visible = false;
		}
	}
};
