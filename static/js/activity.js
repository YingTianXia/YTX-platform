var pop = {
	init:function(){
		var _this = this;
		$('.J_popClose').click(function(){
			_this.popHide();
		});
	},
	popShow:function(el) {
		var _this = this;
		$(el).show();
		_this.maskShow();
	},
	popHide:function(el){
		var _this = this;
		var _el = el || '.J_pop';
		$(_el).hide();
		$('#J_popMask').hide();
	},
	maskShow:function(){
		var _this = this;
		if($('#J_popMask').length){
			$('#J_popMask').show();
		}else{
			$('body').append('<div class="pop-mask" id="J_popMask" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #333;opacity: .6;display: none;"></div>');
			$('#J_popMask').show();
		}
	}
}

var activity = {
	init:function(){
		var _this = this;
		_this.bindEv();
	},
	bindEv:function(){
		var _this = this;
	}
}
pop.init();
activity.init();