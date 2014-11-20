var chat = {
	activeId: 0,
	activePhoto: null,
	activeName: null,
	history: null,
	init: function(){
		
		this.history = new Array();
		$('#msg-form').submit(function(ev){
			ev.preventDefault();
			chat.submit();
		});
		
	},
	isActive: function(id)
	{
		//alert(c.currentpage+':'+this.activeId+'=>'+id);
		if(c.currentpage == 'chat' && this.activeId == id)
		{
			return true;
		}
		return false;
	},
	chat: function(id,option){
		//alert(id);
		$('#conversation').html('');
		this.activeId = parseInt(id);
		this.load(id,option);
		page.activate('chat');
		t.scrollBottom();
	},
	deleteHistory: function(id){
		this.history.splice(id, 1);
	},
	load: function(id,option){
		this.activeId = parseInt(id);
		if(option == undefined)
		{
			option = {};
		}
		
		this.loadHistory(option);
	},
	submit: function(){
		var $msg = $('#chat-msg');
		var message = $msg.val();
		if(parseInt(this.activeId) > 0 && message != '')
		{
			//alert($msg.val());
			this.showLoader();
			
			$msg.val('');
			//$msg.focus();
			//alert(chat.activeId);
			//alert(message);
			a.req('sendmsg',{
				data: {
					ms: message,
					id: chat.activeId
				},
				success: function(ret){
					chat.hideLoader();
					loader.miniHide();
					chat.history[parseInt(ret.id)].history[chat.history[parseInt(ret.id)].history.length] = {
						m: ret.msg,
						p:store.get('fs-photo'),
						n:store.get('fs-name'),
						t:ret.time
					};
					$('#conversation').append(chat.tpl({
						m:message,
						p:store.get('fs-photo'),
						n:store.get('fs-name'),
						t:ret.time
					}));
					
				}
			});
			
			
		}
	},
	/*
	 * Appends a new pushed Message to History Object and display
	 */
	getPush: function(id,message,time)
	{
		id = parseInt(id);
		//alert('getPush ' + id);
		// Chat Nachricht anhängen
		this.history[id].history[this.history[id].history.length] = {
			m: message,
			p:this.history[parseInt(id)].user.photo,
			n:this.history[parseInt(id)].user.name,
			t:time
		};
		$('#conversation').append(this.tpl({
			m:message,
			p:this.history[parseInt(id)].user.photo,
			n:this.history[parseInt(id)].user.name,
			t:time
		}));
		
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
		t.scrollBottom();
	},
	saveHistory: function(ret){
		this.history[ret.user.id] = {
			user: ret.user,
			history: ret.history
		};
	},
	loadHistory: function(option){
		
		if(option == undefined)
		{
			option = {};
		}
	
		if(this.history[this.activeId] != undefined)
		{
			chat.fillChat(this.history[this.activeId].history);
			if(option.success != undefined)
			{
				option.success();
			}
		}
		else
		{
			loader.show();
			loader.miniShow();
			a.req('chathistory',{
				data: {id:chat.activeId},
				success: function(ret){
					ret.history.reverse();
					chat.saveHistory(ret);
					chat.fillChat(ret.history);
					chat.bottomScroll();
					
					if(option.success != undefined)
					{
						option.success();
					}
					
					loader.hide();
				}
			});
		}
	},
	fillChat: function(history)
	{
		$conv = $('#conversation');
		//alert(dump(history));
		$conv.html('');
		
		for(i=0;i<history.length;i++)
		{
			$conv.append(chat.tpl(history[i]));
		}
	},
	tpl: function(m)
	{
		return '<li>' +
	  				'<span class="photo nopic"><img width="50" height="50" src="' + u.avatar(m.p,50) + '" /></span>' +
		  			'<span class="text">' +
		  				'<span class="msg">' + m.m + '</span>' +
		  				'<span class="info">' + m.n + ' - ' + t.dateTime(m.t) + '</span>' +
		  			'</span>' +
		  			'<span class="clear"></span>' +
		  		'</li>';
	},
	name: function(data)
	{
		if(data.name != undefined && data.name != '')
		{
			return data.name;
		}
		else
		{
			var out ='';
			for(var i=0;i<data.u.length;i++)
			{
				if(store.get('fs-id') != data.u[i].id)
				{
					out += ', ' + data.u[i].name;
				}
			}
			return out.substring(2);
		}
	},
	tt: function(txt,length)
	{
		if(length == undefined)
		{
			length = 25;
		}
		if(txt.length > length)
		{
			return txt.substring(0,(length-3)) + '...';
		}
		else
		{
			return txt;
		}
	}
};
