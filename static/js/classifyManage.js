/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     佛祖保佑                    永无BUG
 */

//点击渲染下级类目
$('.category-con').delegate('.category-attr-item','click',function (e) {
	var _self = $(this);
	var id = _self.find('.category-attr-name').attr('data-itemId');
	var _data={
		id:id
	}
	if (_self.is('.noPost')!=true) {
			$.ajax({
				type:"post",
				url:"/category/findByParent",
				data: JSON.stringify(_data),
		             dataType: "json",
		             contentType: "application/json; charset=utf-8",
		             success: function(data){
		                 console.log(data);
		                 //回调成功后需要添加隐藏input
		                 _self.parents('.category-item').nextAll('.category-item').remove();
		                 var pid = data.parentId;
		                 if (data.isTrue&&data.isTrue==1) {
		                 	_self.parents('.category-item').after('<div class="category-item"><div class="category-attr-list-con"><ul class="category-attr-list" data-pid="'+pid+'"></ul></div><div class="category-action clearfix" id="C_acitons"><span class="category-action-addNew">新增</span><span class="category-action-sortSure hidden">完成</span></div></div>');
		                 	var listBox = _self.parents('.category-item').next().find('.category-attr-list');
		                 	for (i=0;i<data.itemCategoryList.length;i++) {
		                 		var listClone = '<li class="category-attr-item"><span class="category-attr-name" data-itemId="' + data.itemCategoryList[i].id + '">' + data.itemCategoryList[i].cateName + '</span><div class="category-attr-renameBox hidden"><input class="category-attr-rename" name="category-attr-rename" value=""/><div><span class="category-attr-renameSure">完成</span><span class="category-attr-renameCancel">取消</span></div></div><div class="category-attr-sortBox hidden"><input class="category-attr-sort" name="category-attr-sort" value="" /><span class="category-attr-sortSure">确认</span></div><div class="category-attr-newNameBox hidden"><input class="category-attr-newName" name="category-attr-newName" value=""/><div><span class="category-attr-newNameSure">完成</span><span class="category-attr-newNameCancel">取消</span></div></div><div class="category-add-editcon"><span class="category-attr-listNew">+</span><a class="category-attr-edit">编辑</a><ul class="category-edit-pop hidden"><li class="category-edit-pop-rename">更名</li><li class="category-edit-pop-property"><a href="/itemMetaProperty/propertyList/"'+data.itemCategoryList[i].id+'">属性</a></li><li class="category-edit-pop-sort">排序</li><li class="category-edit-pop-delete">删除</li></ul></div></li>';
		                 		listBox.append(listClone);
		                 	}
		                 	mousemove();
		                 }
		                 _self.siblings().removeClass('noPost');
		                 _self.addClass('noPost');
		             },
		             error: function(res){
		                 console.log(res);
		             }
			});
	}
	 if (e.cancelBubble) {
		e.cancelBubble=true;
	} else{
		 e.stopPropagation();
	}
})

//鼠标经过
function mousemove () {
	$('.category-add-editcon').css({'visibility':'hidden'});
	$('.category-con').delegate('.category-attr-item','mouseenter',function () {
		$(this).children('.category-add-editcon').css({'visibility':'visible'});
		$(this).addClass('category-active');
	})
	$('.category-con').delegate('.category-attr-item','mouseleave',function () {
		$(this).children('.category-add-editcon').css({'visibility':'hidden'});
		$(this).find('.category-edit-pop').addClass('hidden');
		$(this).removeClass('category-active');
	})
}
mousemove ();


//下拉框
$('.category-con').delegate('.category-attr-edit','click',function (e) {
	$(this).parents('.category-add-editcon').find('.category-edit-pop').toggleClass('hidden');
	//IE事件冒泡的兼容
	if (e.cancelBubble) {
		e.cancelBubble=true;
	} else{
		 e.stopPropagation();
	}
})
//更名
$('.category-con').delegate('.category-edit-pop-rename','click',function (e) {
	var _self = $(this);
	var Item = _self.parents('.category-attr-item');
	var ItemName = Item.find('.category-attr-name').html();
	_self.parents('.category-add-editcon').hide();
	_self.parents('.category-edit-pop').addClass('hidden');
	Item.find('.category-attr-renameBox').removeClass('hidden');
	Item.find('.category-attr-rename').val(ItemName);
	if (e.cancelBubble) {
		e.cancelBubble=true;
	} else{
		 e.stopPropagation();
	}
})
$('.category-con').delegate('.category-attr-renameSure','click',function (e) {
	var _self = $(this);
	var Item = _self.parents('.category-attr-item');
	var ItemRename = Item.find('.category-attr-rename').val();
	var itemId = Item.find('.category-attr-name').attr('data-itemId');
	Item.find('.category-attr-name').html(ItemRename);
	//约定入参格式
	var _data = {
		id:itemId,
		rename:ItemRename
	}
	$.ajax({
		type:"post",
		url:"/category/updateCategory",
		data: JSON.stringify(_data),
             dataType: "json",
             contentType: "application/json; charset=utf-8",
             success: function(data){
                 console.log(data);
                 //回调成功后需要添加隐藏input
             },
             error: function(res){
                 console.log(res);
             }
	});
	Item.find('.category-attr-renameBox').addClass('hidden');
	Item.find('.category-add-editcon').show();
	if (e.cancelBubble) {
		e.cancelBubble=true;
	} else{
		 e.stopPropagation();
	}
});
$('.category-con').delegate('.category-attr-renameCancel','click',function (e) {
	var _self = $(this);
	var Item = _self.parents('.category-attr-item');
	Item.find('.category-attr-renameBox').addClass('hidden');
	Item.find('.category-add-editcon').show();
	if (e.cancelBubble) {
		e.cancelBubble=true;
	} else{
		 e.stopPropagation();
	}
})
//删除
var pop = {
        init:function(){
            var _this = this;
            $('body').on('click','.J_popClose',function(){
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
    //弹窗初始化
    pop.init();
    //使用
    $('.category-con').delegate('.category-edit-pop-delete','click',function (e) {
		_self = $(this);
	    pop.popShow('#pop_delete');
	    //确认删除
	    $('.erp-container').delegate('.J_popSure','click',function (e) {
			var Item = _self.parents('.category-attr-item');
			var itemId = Item.find('.category-attr-name').attr('data-itemId');
			var _data = {
				id:itemId
			}
			$.ajax({
				type:"post",
				url:"/category/delete",
				data: JSON.stringify(_data),
	            dataType: "json",
	            contentType: "application/json; charset=utf-8",
	            success: function(data){
	               console.log(data);
	               if (data.isTrue!=1) {
	               		pop.popHide('#pop_delete');
						Item.remove();//成功回调后进行删除
						
						if () {
							_self.parents('.category-item').nextAll().remove();
						}
	               } else{
	               		pop.popHide('#pop_delete');
	               		pop.popShow('#pop_undelete');
	               		$('.category-con').delegate('.J_popSureClose','click',function (e) {
	               			pop.popHide('#pop_undelete');
	               		})
	               }
	           },
	           error: function(res){
	               console.log(res);
	           }
			});
			if (e.cancelBubble) {
				e.cancelBubble=true;
			} else{
				 e.stopPropagation();
			}
		});
	});
//排序
$('.category-con').delegate('.category-edit-pop-sort','click',function (event) {
	var ItemList = $(this).parents('.category-attr-list').find('.category-attr-item');
	ItemList.each(function (i,e) {
		$(this).find('.category-add-editcon').hide();
		$(this).find('.category-attr-sortBox').removeClass('hidden').children('.category-attr-sort').val(i+1);
	})
	$(this).parents('.category-item').find('.category-action-sortSure').removeClass('hidden');
	$('.category-con').delegate('.category-attr-sortSure','click',function (event) {
		var Num = $(this).parents('.category-attr-item').index();
			Num = Num +1;
		var changeNum = $(this).siblings('.category-attr-sort').val();
		var changeDiv = $(this).parents('.category-attr-item');
		var newItemList = $(this).parents('.category-attr-list').find('.category-attr-item');
		var beChanged = newItemList.eq(changeNum-1);
		if (Num>changeNum) {
			changeDiv.insertBefore(beChanged);
		} else if(Num<changeNum){
			changeDiv.insertAfter(beChanged)
		}
		var newItemList = $(this).parents('.category-attr-list').find('.category-attr-item');
		newItemList.each(function (i,e) {
			$(this).find('.category-attr-sort').val(i+1);
		})
		if (event.cancelBubble) {
			e.cancelBubble=true;
		} else{
			 event.stopPropagation();
		}
	});
	$('.category-con').delegate('.category-action-sortSure','click',function (event) {
		var arr =[];
		var newItemList = $(this).parents('.category-item').find('.category-attr-item');
		newItemList.each(function (i,e) {
			itemId = $(this).find('.category-attr-name').attr('data-itemId');
			arr.push(itemId); 
		})
		var arrLength = arr.length;
		var _data = {
			id:arr,
			length:arrLength
		}
		$.ajax({
			type:"post",
			url:"/category/updateCategorySequence",
			data: JSON.stringify(_data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data){
               console.log(data);
               $('.category-attr-sortBox').addClass('hidden');
			   $(".category-add-editcon").show();
			   $(".category-action-sortSure").addClass('hidden');
           },
           error: function(res){
               console.log(res);
           }
		});
		console.log(arr);
		
		if (event.cancelBubble) {
			event.cancelBubble=true;
		} else{
			 event.stopPropagation();
		}
	});
	if (event.cancelBubble) {
		e.cancelBubble=true;
	} else{
		 event.stopPropagation();
	}
})
//底部新增
$('.category-con').delegate('.category-action-addNew','click',function (event) {
	var _self = $(this);
	var itemMould = $('.category-attr-item').eq(0);
	var itemMouldInit = itemMould.clone(true);
	_self.parents('.category-item').find(".category-attr-list").append(itemMouldInit);
	itemMouldInit.find('.category-attr-name').html('类目名');
	itemMouldInit.find('.category-attr-newNameBox').removeClass('hidden');
	itemMouldInit.find('.category-attr-newName').val('类目名');
	itemMouldInit.find('.category-attr-newName').attr('data-itemId','');
	itemMouldInit.find('.category-attr-newName').focus();
	itemMouldInit.find('.category-attr-newName').select();
	itemMouldInit.find('.category-add-editcon').hide();
//	var itemMouldInit = '<li class="category-attr-item"><span class="category-attr-name" data-itemId="">类目名</span><div class="category-attr-renameBox hidden"><input class="category-attr-rename" name="category-attr-rename" value="类目名"/><div><span class="category-attr-renameSure">完成</span><span class="category-attr-renameCancel">取消</span></div></div><div class="category-attr-sortBox hidden"><input class="category-attr-sort" name="category-attr-sort" value="" /><span class="category-attr-sortSure">确认</span></div><div class="category-attr-newNameBox hidden"><input class="category-attr-newName" name="category-attr-newName" value=""/><div><span class="category-attr-newNameSure">完成</span><span class="category-attr-newNameCancel">取消</span></div></div><div class="category-add-editcon"><span class="category-attr-listNew">+</span><a class="category-attr-edit">编辑</a><ul class="category-edit-pop hidden"><li class="category-edit-pop-rename">更名</li><li class="category-edit-pop-property"><a href="/itemMetaProperty/propertyList/">属性</a></li><li class="category-edit-pop-sort">排序</li><li class="category-edit-pop-delete">删除</li></ul></div></li>';
//	_self.parents('.category-item').find(".category-attr-list").append(itemMouldInit);
//	itemMouldInit.find('.category-attr-newNameBox').removeClass('hidden');
//	itemMouldInit.find('.category-attr-newName').focus();
//	itemMouldInit.find('.category-attr-newName').select();
//	itemMouldInit.find('.category-add-editcon').hide();
	$('.category-con').delegate('.category-attr-newNameSure','click',function (event) {
		var _self = $(this);
		var Item = _self.parents('.category-attr-item');
		var NewName = Item.find('.category-attr-newName').val();
		Item.find('.category-attr-name').html(NewName);
		var pid = _self.parents('.category-attr-list').attr('data-pid');
		//约定入参格式
		var _data = {
			pid:pid,
			name:NewName
		}
		$.ajax({
			type:"post",
			url:"/category/save",
			data: JSON.stringify(_data),
	             dataType: "json",
	             contentType: "application/json; charset=utf-8",
	             success: function(data){
	                 console.log(data);
	                 var id = data.catgoryId;
	                 _self.parents('.category-attr-item').find('.category-attr-name').attr('data-itemId',id);
	                 //回调成功后需要添加隐藏input,并重新渲染当前类目或者回调id
	             },
	             error: function(res){
	                 console.log(res);
	             }
		});
		Item.find('.category-attr-newNameBox').addClass('hidden');
		Item.find('.category-add-editcon').show();
		if (event.cancelBubble) {
			event.cancelBubble=true;
		} else{
			event.stopPropagation();
		}
	});
	$('.category-con').delegate('.category-attr-newNameCancel','click',function (event) {
		var _self = $(this);
		var Item = _self.parents('.category-attr-item');
		Item.find('.category-attr-newNameBox').addClass('hidden');
		Item.find('.category-add-editcon').show();
		if (event.cancelBubble) {
			event.cancelBubble=true;
		} else{
			event.stopPropagation();
		}
	})
	if (event.cancelBubble) {
		event.cancelBubble=true;
	} else{
		event.stopPropagation();
	}
})
// “+”新增
$('.category-con').delegate('.category-attr-listNew','click',function (event) {
	var _self = $(this);
	var pid = _self.parents('.category-attr-item').find('.category-attr-name').attr('data-itemId');
	var _data = {
		pid:pid
	}
	if (_self.is('.noAdd')!=true) {
			$.ajax({
				type:"post",
				url:"/category/findByParent",
				data: JSON.stringify(_data),
		             dataType: "json",
		             contentType: "application/json; charset=utf-8",
		             success: function(data){
		                 console.log(data);
		                 //回调成功后需要添加隐藏input
		                 _self.parents('.category-item').nextAll('.category-item').remove();
//		                 var pid = data.parentId;
	                 	_self.parents('.category-item').after('<div class="category-item"><div class="category-attr-list-con"><ul class="category-attr-list" data-pid="'+pid+'"></ul></div><div class="category-action clearfix" id="C_acitons"><span class="category-action-addNew">新增</span><span class="category-action-sortSure hidden">完成</span></div></div>');
	                 	var listBox = _self.parents('.category-item').next().find('.category-attr-list');
	                 	for (i=0;i<data.itemCategoryList.length;i++) {
	                 		var listClone = '<li class="category-attr-item"><span class="category-attr-name" data-itemId="' + data.itemCategoryList[i].id + '">' + data.itemCategoryList[i].cateName + '</span><div class="category-attr-renameBox hidden"><input class="category-attr-rename" name="category-attr-rename" value=""/><div><span class="category-attr-renameSure">完成</span><span class="category-attr-renameCancel">取消</span></div></div><div class="category-attr-sortBox hidden"><input class="category-attr-sort" name="category-attr-sort" value="" /><span class="category-attr-sortSure">确认</span></div><div class="category-attr-newNameBox hidden"><input class="category-attr-newName" name="category-attr-newName" value=""/><div><span class="category-attr-newNameSure">完成</span><span class="category-attr-newNameCancel">取消</span></div></div><div class="category-add-editcon"><span class="category-attr-listNew">+</span><a class="category-attr-edit">编辑</a><ul class="category-edit-pop hidden"><li class="category-edit-pop-rename">更名</li><li class="category-edit-pop-property"><a href="/itemMetaProperty/propertyList/"'+data.itemCategoryList[i].id+'">属性</a></li><li class="category-edit-pop-sort">排序</li><li class="category-edit-pop-delete">删除</li></ul></div></li>';
	                 		listBox.append(listClone);
		                 	mousemove();
		                 }
		                 _self.siblings().removeClass('noAdd');
		                 _self.addClass('noAdd');
		                 _self.parents('.category-item').next().find('.category-action-addNew').trigger('click');
		             },
		             error: function(res){
		                 console.log(res);
		             }
			});
	}

	if (event.cancelBubble) {
		event.cancelBubble=true;
	} else{
		event.stopPropagation();
	}
})
