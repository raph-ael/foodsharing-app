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
		if(parseInt(this.activeId) > 0 && $msg.val() != '')
		{
			alert($msg.val());
			
			$msg.val('');
			$msg[0].focus();
		}
	},
	showLoader: function(){
		$conv = $('#conversation');
		$conv.append('<li class="loader"></li>');
	},
	loadHistory: function(){
		loader.miniShow();
		a.req('chathistory',{
			data: {id:chat.activeId},
			success: function(ret){
				$conv = $('#conversation');
				for(i=0;i<ret.history.length;i++)
				{
					m = ret.history[i];
					$conv.append(chat.tpl(m));
				}
				
				page.activate('chat');
				window.scrollTo(0, document.body.scrollHeight);
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
