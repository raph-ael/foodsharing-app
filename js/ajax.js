var a = {
	ready: function()
	{
		alert('ready');
	},
	req: function(method,option){
		
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
	        url: 'http://' + c.domain + '/freiwillige/xhrapp.php?app=' + option.app + '&m=' + method + '&format=jsonp&callback=?',
	        dataType: 'jsonp',
	       	type: 'get',
	        data: option.data,
	        success: function (json) 
	        {
	
	            if(option.success != undefined && json.status == 1)
				{
					option.success(json);
				}
				else if(option.success != undefined && option.error != undefined)
				{
					option.error(json);
				}

				if(json.script != undefined)
				{
					$.globalEval(json.script);
				}
	
	        },
	        complete: function(){
	        	loader.hide();
	        	loader.miniHide();
	        }
	
	});
		
		/*
		caller = $('#caller');
		caller.attr('action','http://' + c.domain + '/freiwillige/xhrapp.php?app=api&m=' + method);
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
				url:'http://' + c.domain + '/freiwillige/xhrapp.php?app=api&m=' + method,
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
	miniVisible:false,
	visible:false,
	miniShow: function()
	{
		if(!this.miniVisible)
		{
			this.miniVisible = true;
			$('#mini-loader').stop().fadeIn();
		}
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
		if(this.miniVisible)
		{
			$('#mini-loader').stop().fadeOut();
			this.miniVisible = false;
		}
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
