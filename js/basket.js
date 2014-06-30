var basket = {
	validate: function(){
		if($('#description').val() == '')
		{
			$('#description')[0].focus();
			window.scrollTo(0, 0);
			msg.error('Bitte gib eine Beschreibung ein');
			return false;
		}
		
		return true;
	},
	clearForm: function()
	{
		$('#image-preview').css('display','none');
		$('#description').val('');
		window.scrollTo(0, 0);
	},
	submit: function(){
		
		if(this.validate())
		{
			var food_types = new Array();
			$('.cb-food_type:checked').each(function(){
				food_types[food_types.length] = $(this).val();
			});
			
			var food_art = new Array();
			$('.cb-food_art:checked').each(function(){
				food_art[food_art.length] = $(this).val();
			});
			
			var contact_type = new Array();
			$('.cb-contact_type:checked').each(function(){
				contact_type[contact_type.length] = $(this).val();
			});
			
			a.req('basket_submit',{
				data: {
					desc: $('#description').val(),
					art: food_art,
					types: food_types,
					ctype: contact_type,
					fetchart: $('.cb-fetch-point:checked').val(),
					lat: $('#latitude').val(),
					lon: $('#longitude').val(),
					phone: $('#phone').val(),
					phone_mobile: $('#phone_mobile').val(),
					photo: $('#photo').val(),
					weight: $('#weight').val()
				},
				success: function(){
					basket.clearForm();
					msg.success('Korb wurde erfolgreich eingestellt!');
				},
				error: function(){
					msg.error('Es ist ein Fehler aufgetreten, versuche es gleich nochmal!');
				}
			});
		}
	}
};
