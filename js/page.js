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
			if(map.map !== null)
			{
				map.map.invalidateSize(false);
			}
			map.init(c.lat, c.lon, c.zoom);
		}
		
		c.backpage = c.currentpage;
		c.currentpage = name;
		init.fButtonsHide();
		
	},
	setFootMenu: function(index){	
		
		$('#menu a').removeClass('pure-button-active');
		$('#menu a.page-' + index).addClass('pure-button-active');
	},
	setTitle: function(text)
	{
		//$('#title').text(text);
	}
};
