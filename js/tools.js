var t = {
	in_array: function(needle, haystack) 
	{
	    for(var i in haystack) 
	    {
	        if(haystack[i] == needle) return true;
	    }
	    return false;
	},
	goBack: function(){
		page.activate(c.backpage);
	}
};
