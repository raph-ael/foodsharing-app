var store = {
	storage : $.localStorage,
	set: function(key,value)
	{
		this.storage.set(key,value);
	},
	del: function(key)
	{
		this.storage.remove(key);
	},
	get: function(key){
		return this.storage.get(key);
	}
};
