var cache = {
	works: false,
	dir: '',
	fileSystem: null,
	pathCache: null,
	rootCache: null,
	tileCache: null,
	init: function(){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			cache.fileSystem = fileSystem;
        	cache.dir = fileSystem.root.getDirectory(".foodsharing", {create: true, exclusive: false}, function(){
        		// ordner erstellt
        		cache.works = true;
        		
        	}, function(){
        		// failed
        	});
			
			fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
		}, function(){
			// no filesystem accessable
		});
	},
	downloadFile: function(tile,url){
		
		var fileTransfer = new FileTransfer();
		var uri = encodeURI(tile.src);
		
		fileTransfer.download(
		    uri,
		    url.pathCache,
		    function(entry) {		        
		        cache.fire(tile,entry.toURL());
		    },
		    function(error) {
		    	// on error fire default src to map tile
		        cache.fire(tile,tile.src);
		    },
		    false
		);
    },
	getSrc: function(tile)
	{
		url = this.localUrl(tile);
		this.tileExists(tile,url);
		
	},
	tileExists: function(tile,url){
		
		this.fileSystem.root.getFile(url.rootCache, { create: false }, function(entry){
			// file exists just load it from sdcard
		    cache.fire(tile,entry.toURL());
		    
		}, function(){
			// file not exists lets download it
			cache.downloadFile(tile,url);
		});
	},
	localUrl: function(tile)
	{
		rootCache = '.foodsharing/' + tile.src.split('/World_Street_Map/MapServer/')[1];
		pathCache = this.fileSystem.root.toURL() + rootCache;
		
		return {
			rootCache: rootCache,
			pathCache: pathCache
		};
		
	},
	fire: function(tile,url){
		tile.src = url;
		
		alert(url);
		
		map.tileLayer.fire('tileloadstart', {
			tile: tile,
			url: tile.src
		});
	}
};

function fail(evt) {
    console.log(evt.target.error.code);
}
