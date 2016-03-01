 
function t071_unifyHeights(recid) {
    $('#rec'+recid+' .t071 .t-container').each(function() {
        var highestBox = 0;
        $('.t071__wrapper', this).each(function(){
            if($(this).height() > highestBox)highestBox = $(this).height(); 
        });  
        if($(window).width()>=960){
        	$('.t071__wrapper',this).css('height', highestBox); 
        }else{
	        $('.t071__wrapper',this).css('height', "auto");    
        }
    });
}