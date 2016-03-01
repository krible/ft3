$(document).ready(function() {

	window.validateForm = function($jform) {
		var arError = [];
		$jform.find('.js-tilda-rule').each(function(){
			var req = $(this).data('tilda-req') || 0;
			var rule = $(this).data('tilda-rule') || 'none', regExp;
			var error = {};
			var val = $(this).val();
			error.obj = $(this);
			error.type = [];
			
			if (req==1 && val.length == 0) {
				error.type.push('req');
			} else {
				switch(rule){
					case 'email':
						regExp = /^[a-zA-Z0-9_\.\-]{1,64}@[a-zA-Z0-9\.\-]{1,253}\.[a-zA-Z]{2,10}$/;
						if( val.length > 0 && !val.match( regExp ) ) {
							error.type.push('email');
						}
						break;

					case 'phone':
						regExp = /^[0-9\(\)\-\+\s]+$/gi;
						if( val.length > 0 && !val.match( regExp ) ) {
							error.type.push('phone');
						}
						break;

					/*
					case 'name':
						var regExp = /^([A-Za-zА-Яа-яЁё\s]{1,}((\-)?[A-Za-zА-Яа-яЁё\.\s](\')?){0,})*$/i;
	
						if( val.length > 0 && !val.match( regExp ) ) {
							error.type.push('name');
						}
						break;
					case 'string':
						var regExp = /^[A-Za-zА-Яа-яЁё0-9,\.:;\"\'\`\-\_\+\?\!\%\$\@\*\&\^\s]$/i;
	
						if( val.length > 0 && !val.match( regExp ) ) {
							error.type.push('string');
						}
						break;
						*/
					default:
						break;
				}
			}
			if (error.type && error.type.length > 0) {
				arError[arError.length] = error;
			}
		});
		return arError;
	}

	$('.r').on('submit','.js-form-proccess', function(event) {

        $(this).find('.js-errorbox-all').hide();
        $(this).find('.js-rule-error').hide();
        $(this).find('.js-error-rule-all').html('');
        $(this).find('.js-successbox').hide();
        $(this).find('.js-error-control-box').removeClass('js-error-control-box');
        $(this).removeClass('js-send-form-error');
        $(this).removeClass('js-send-form-success');
        
        var arError = validateForm($(this));
        var $blockinput='';
        if (arError && arError.length > 0) {
            var clsInputBoxSelector = $(this).data('inputbox');
            if ( !clsInputBoxSelector ) {
                clsInputBoxSelector = '.blockinput';
            }
            //$(this).find('.blockinput__errorbox').show().css({'display':'block'});
            for(var i=0; i<arError.length;i++) {
                if (!arError[i] || !arError[i].obj) { continue; }
                
                arError[i].obj.closest(clsInputBoxSelector).addClass('js-error-control-box')
                
                for(j=0;j<arError[i].type.length;j++) {
                    error = arError[i].type[j];
                    var $errItem = $(this).find('.js-rule-error-'+error);
                    if ($errItem.length > 0){
                        $errItem.css('display','block').show();
                    }
                }
            }
            if(arError.length > 0) {
                $(this).find('.js-errorbox-all').css('display','block').show();
            }
            return false;
        } else {
            var $activeForm = $(this);
            var formtype = $(this).data('formactiontype');
            if (formtype==2 && $(this).find('.js-formaction-services').length > 0) {

                var $btn = $(this).find('[type=submit]');
                $btn.attr('disabled','disabled');
                $(this).data('submitbtn', $btn);
                $(this).data('opacity', $btn.css('opacity'));
                $btn.css('opacity','0.5');
            
                $.ajax({
                    type: "POST",
                    url: $(this).attr('action'),
                    data: $(this).serialize(),
                    dataType : "json",
                    success: function(json){
                        var $btn =$activeForm.data('submitbtn');
                        var css = $activeForm.data('opacity');
                        if(css) {
                            $btn.css('opacity', css);
                        } else {
                            $btn.css('opacity', '1');
                        }
                        $btn.removeAttr('disabled');
                        
                        if(json && json.error) {
                            var $errBox = $activeForm.find('.js-errorbox-all');
                            if(!$errBox || $errBox.length == 0) {
                                $activeForm.prepend('<div class="js-errorbox-all"></div>');
                                $errBox = $activeForm.find('.js-errorbox-all');
                            }

                            var $allError = $errBox.find('.js-rule-error-all');
                            if (!$allError || $allError.length == 0) {
                                $errBox.append('<p class="js-rule-error-all">'+json.error+'</p>');
                                $allError = $errBox.find('.js-rule-error-all');
                            }
                            $allError.html(json.error).show();
                            $errBox.show();

                            $activeForm.addClass('js-send-form-error');
                        } else {
                            $activeForm.find('.js-successbox').show();
                            $activeForm.find('input[type=text]:visible').val('');
                            $activeForm.find('textarea:visible').html('');
                            
                            $activeForm.addClass('js-send-form-success');
                        }
                        
                        var virtPage = '/tilda/'+$activeForm.attr('id')+'/submitted/';
                        var virtTtitle = 'Send data from form '+$activeForm.attr('id');
                        if(ga) {
                            if (window.mainTracker == 'tilda') {
                                ga('tilda.send', {'hitType':'pageview', 'page':virtPage,'title':virtTtitle});
                            } else {
                                ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTtitle});
                            }
                        }
                        
                        if (window.mainMetrika > '' && window[window.mainMetrika]) {
                            window[window.mainMetrika].hit(virtPage, {title: virtTtitle,referer: window.location.href});
                        }
                    },
                    error: function(error) {
                        var $btn =$activeForm.data('submitbtn');
                        var css = $activeForm.data('opacity');
                        if(css) {
                            $btn.css('opacity', css);
                        } else {
                            $btn.css('opacity', '1');
                        }
                        $btn.removeAttr('disabled');

                        var $errBox = $activeForm.find('.js-errorbox-all');
                        if(!$errBox || $errBox.length == 0) {
                            $activeForm.prepend('<div class="js-errorbox-all"></div>');
                            $errBox = $activeForm.find('.js-errorbox-all');
                        }

                        var $allError = $errBox.find('.js-rule-error-all');
                        if (!$allError || $allError.length == 0) {
                            $errBox.append('<p class="js-rule-error-all">Unknown error. Later, plaese try again.</p>');
                            $allError = $errBox.find('.js-rule-error-all');
                        }
                        $allError.show();
                        $errBox.show();

                        $activeForm.addClass('js-send-form-error');
                    },
                    timeout: 1000*15
                });
            
                event.preventDefault();        
                return false;
            } else {
                if ($(this).data('is-formajax')=='y') {
                    var $btn = $(this).find('[type=submit]');
                    $btn.attr('disabled','disabled');
                    $(this).data('submitbtn', $btn);
                    $(this).data('opacity', $btn.css('opacity'));
                    $btn.css('opacity','0.5');
                    
                    $.ajax({
                        type: "POST",
                        url: $(this).attr('action'),
                        data: $(this).serialize(),
                        dataType : "html",
                        success: function(html){
                            var $btn =$activeForm.data('submitbtn');
                            var css = $activeForm.data('opacity');
                            if(css) {
                                $btn.css('opacity', css);
                            } else {
                                $btn.css('opacity', '1');
                            }
                            $btn.removeAttr('disabled');

                            if(html && html.length > 0){
                                $activeForm.find('.js-successbox').html(html);
                            }
                            $activeForm.find('.js-successbox').show();
                            $activeForm.find('input[type=text]:visible').val('');
                            $activeForm.find('textarea:visible').html('');
                            $activeForm.addClass('js-send-form-success');

                            var virtPage = '/tilda/'+$activeForm.attr('id')+'/submitted/';
                            var virtTtitle = 'Send data from form '+$activeForm.attr('id');
                            if(ga) {
                                if (window.mainTracker == 'tilda') {
                                    ga('tilda.send', {'hitType':'pageview', 'page':virtPage,'title':virtTtitle});
                                } else {
                                    ga('send', {'hitType':'pageview', 'page':virtPage,'title':virtTtitle});
                                }
                            }
                            
                            if (window.mainMetrika > '' && window[window.mainMetrika]) {
                                window[window.mainMetrika].hit(virtPage, {title: virtTtitle,referer: window.location.href});
                            }

                        },
                        error: function(error) {
                            var $btn =$activeForm.data('submitbtn');
                            var css = $activeForm.data('opacity');
                            if(css) {
                                $btn.css('opacity', css);
                            } else {
                                $btn.css('opacity', '1');
                            }
                            $btn.removeAttr('disabled');
    
                            var $errBox = $activeForm.find('.js-errorbox-all');
                            if(!$errBox || $errBox.length == 0) {
                                $activeForm.prepend('<div class="js-errorbox-all"></div>');
                                $errBox = $activeForm.find('.js-errorbox-all');
                            }
    
                            var $allError = $errBox.find('.js-rule-error-all');
                            if (!$allError || $allError.length == 0) {
                                $errBox.append('<p class="js-rule-error-all">Unknown error. Later, plaese try again.</p>');
                                $allError = $errBox.find('.js-rule-error-all');
                            }
                            $allError.show();
                            $errBox.show();
                            $activeForm.addClass('js-send-form-error');
    
                        },
                        timeout: 1000*15
                    });
                
                    event.preventDefault();        
                    return false;
                } else {
                    return true;
                }
            }
        }


	
	});
});

