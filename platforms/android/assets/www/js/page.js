var page = {
	
	activate: function(name)
	{		
		if(loginDataSaved() == false)
		{
			name = 'settings';
		}
	
		$('.page').css('display','none');
		$('#page-' + name).css('display','block');
		this.setFootMenu(name);
		
		
	},
	setFootMenu: function(index){	
		
		$('footer a').removeClass('pure-button-active');
		$('footer a.page-' + index).addClass('pure-button-active');
	},
	setTitle: function(text)
	{
		$('#title').text(text);
	}
};
