	

    function onPhotoURISuccess(imageURI) {

      //
      var largeImage = document.getElementById('largeImage');
		
	
	  $('#basketPhotoWait').show();
	  $('#basketSubmit').hide();
      // Unhide image elements
      //
      $('#image-preview').css('display','block');
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
      
      uploadPhoto(imageURI);
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 65,targetWidth: 450, targetHeight: 450,

        destinationType: destinationType.FILE_URI });
    }
    // Called if something bad happens.
    // 
    function onFail(message) {
    	msg.error('Das Foto konnte nicht hochgeladen werden');
      //alert('Failed because: ' + message);
    }

	function uploadPhoto(imageURI)
	{
		loader.miniShow();
		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";
		var params = new Object();
		params.value1 = "test";
		params.value2 = "param";
		options.params = params;
		options.chunkedMode = false;
		var ft = new FileTransfer();
		ft.upload(imageURI, 'http://' + c.domain + '/xhrapp.php?app=api&m=upload', uploadwin, uploadfail, options);
	}
	
	function uploadwin(r) 
	{
		loader.miniHide();
		$('#basketPhotoWait').hide();
	    $('#basketSubmit').show();
		if(r.response.length > 0)
		{
			$('#photo').val(r.response+'');
		}
		else
		{
			msg.error("Das Foto konnte leider nicht hochgeladen werden, Bitter überprüfe Deine Internet-Verbindung!" );
		}
	}
	
	function uploadfail(error) 
	{
		loader.miniHide();
		$('#basketPhotoWait').hide();
	    $('#basketSubmit').show();
		msg.error("Das Foto konnte leider nicht hochgeladen werden, Bitter überprüfe Deine Internet-Verbindung!" );
	}  
