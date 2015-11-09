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

var examine = {
	init:function(){
		var _this = this;
		_this.bindEv();
		_this.showStaus();
	},
	bindEv:function(){
		var _this = this;
		$('.J_submit').on('click',function(){
			_this.checkPass();
		});
	},
	checkPass:function(){
		var _this = this;
		var passStr = '';
		$('.J_pass').each(function(i,e){
			if(e.checked){
				passStr += '1';
			}else{
				passStr += '0';
			}
		});
		console.log(passStr);
	},
	showStaus:function(){
		var _this = this;
		var staus = '0000101010101011010000000000111';
		var stausArr = staus.split('');
		$(stausArr).each(function(i,e){
			if(e == '1'){
				$('.J_examineLi').eq(i).append('<span class="examine-icon-right"></span>');
				$('.J_pass').eq(i).attr('checked','checked');
			}else if(e == '0'){
				$('.J_examineLi').eq(i).append('<span class="examine-icon-wrong"></span>');
				$('.J_pass').eq(i).removeAttr('checked');
			}
		});
	}
}
pop.init();
examine.init();