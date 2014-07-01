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
		
		if(name == 'map')
		{
			map.init(50.943740, 6.920743,13);
		}
		
		c.backpage = c.currentpage;
		c.currentpage = name;
		
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
