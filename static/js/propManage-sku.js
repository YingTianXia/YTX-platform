(function($){
	var backupSkuList,
		backupIfColor,
		backupskuName;
		backupSkuList ="S\nM\nL\nLL";
		$('#skuList').val(backupSkuList);
	$('.J_editOpen').on('click',function(){
		$('.J_sku_main').addClass('editing');
		backupIfColor = $('#ifColor')[0].checked;
		backupskuName = $('#skuName').val();
		backupSkuList = $('#skuList').val();
		$('#ifColor,#skuName,#skuList').prop('disabled',false);
	});
	$('.J_editSave').on('click',function(){
		var _name = $('#skuName').val();
		var _listArr = $('#skuList').val().split('\n');
		var _viewHtml ='';
		if(_name =='' || _name == ' '){
			alert('名称不能为空');
			return false;
		}else if(_listArr == 0){
			alert('sku不能为空');
		}
		$(_listArr).each(function(i,e){
			if(e == '' || e == ' '){

			}else{
				_viewHtml += '<span><input type="checkbox" disabled><label>'+ e +'</label></span>';
			}
		});	
		var _categoryId = $('.J_categoryId').attr('data-categoryId');
		var _isTrue = $('#ifColor')[0].checked?1:0;
		var _skuName = $('#skuName').val();
		var _length = _listArr.length;
		var _data = {
			categoryId : _categoryId,//类目ID
			isTrue : _isTrue,//带颜色分类
			skuName :_skuName,//规格名称
			length:_length,// 4 数组地长度
			skuValue :_listArr//数组的值
		}
        $.ajax({
            type: "POST",
            url: "/skuMetaProperty/saveSkuMetaProperty",
            data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data){
            	console.log(data);
				$('.J_view_list').html(_viewHtml);
				$('.J_sku_main').removeClass('editing');
				$('#ifColor,#skuName,#skuList').prop('disabled',true);
				$('.J_view_name span').html(_name);
            },
            error: function(res){
                console.log(res);
            }
        });
	});
	$('.J_editCanel').on('click',function(){
		$('.J_sku_main').removeClass('editing');
		if(backupIfColor){
			$('#ifColor').prop('checked',true);
		}else{
			$('#ifColor').prop('checked',false);
		}
		$('#skuName').val(backupskuName);
		$('#skuList').val(backupSkuList);
		$('#ifColor,#skuName,#skuList').prop('disabled',true);
	});


})(jQuery)