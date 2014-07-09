var chat = {
	activeId: 0,
	activePhoto: null,
	activeName: null,
	init: function(){
		
		$('#msg-form').submit(function(ev){
			ev.preventDefault();
			chat.submit();
		});
		
	},
	load: function(id){
		loader.show();
		
		this.activeId = parseInt(id);
		
		chat.loadHistory();
	},
	submit: function(){
		$msg = $('#chat-msg');
		message = $msg.val();
		if(parseInt(this.activeId) > 0 && message != '')
		{
			//alert($msg.val());
			this.showLoader();
			$msg.val('');
			a.req('sendmsg',{
				data: {
					m: message,
					id: chat.activeId
				},
				success: function(){
					chat.hideLoader();
				}
			});
			
			
		}
	},
	getPush: function(id,message)
	{
		alert(id+'=>'+message);
		msg = {m:message};
		$('#conversation').append(this.tpl(msg));
		this.bottomScroll();
		
	},
	showLoader: function(){
		$('#chat-loader').show();
		chat.bottomScroll();
	},
	hideLoader: function(){
		$('#chat-loader').hide();
	},
	bottomScroll: function(){
		window.scrollTo(0, document.body.scrollHeight);
	},
	loadHistory: function(){
		loader.miniShow();
		a.req('chathistory',{
			data: {id:chat.activeId},
			success: function(ret){
				ret.history.reverse();
				$conv = $('#conversation');
				for(i=0;i<ret.history.length;i++)
				{
					m = ret.history[i];
					$conv.append(chat.tpl(m));
				}
				
				page.activate('chat');
				chat.bottomScroll();
				loader.hide();
			}
		});
	},
	tpl: function(m)
	{
		return '<li>' +
	  				'<span class="photo nopic"><img width="50" height="50" src="' + u.avatar(m.p,50) + '" /></span>' +
		  			'<span class="text">' +
		  				'<span class="msg">' + m.m + '</span>' +
		  				'<span class="info">' + m.n + ' - ' + m.t + '</span>' +
		  			'</span>' +
		  			'<span class="clear"></span>' +
		  		'</li>';
	}
};
