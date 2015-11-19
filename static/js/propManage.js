(function(){
$(document).ready(function(){
	var $addProp = $("#addProp"),
		$PropType = $("#PropType"),
		$J_propConfirm = $("#J_propConfirm"),
		$propName = $("#propName"),
		$Propchecks = $("#Propchecks"),
		$propTbody = $("#propTbody"),
		$sort = $("#sort"),
		$J_sortComplete = $("#J_sortComplete");
		
	//添加属性
	$addProp.bind('click', addProp);
	//更改属性类型
	$PropType.bind('change', PropType);
	//检查属性名
	$propName.bind('input', propNameCheck);
	//开始排序
	$sort.bind('click', sort);
	//排序input
	$propTbody.delegate('.J_propsort', 'blur', sortHandler);
	//完成排序
	$J_sortComplete.bind('click', sortComplete);
	//删除属性
	$propTbody.delegate('.J_delete', 'click', deleteProp);
	//编辑属性
	$propTbody.delegate('.J_edit', 'click', editProp);
	
	function editProp() {
		var $editItemId = $(this).parent().parent().attr('data-propid');
		$.ajax({
			type:"post",
			url:"",
			async:true,
			data: JSON.stringify({"propid": $editItemId}),
			success: function(data) {
				var obj = data.property,
					$PropDesc = $("#PropDesc"),
					$Propchecks = $("#Propchecks"),
					options = $PropType.find('option');
					options.each(function(i, e){
						if(e.value === 'number'){
							e.selected = true;
						};
					});
					$propName.val(obj.name);
					$PropDesc.val(obj.description);
					if(obj.isRequire){
						$Propchecks[0].checked = true;
					}else{
						$Propchecks[0].checked = false;
					};
				switch (obj.fieldType){
					case 5:
						var $numberType = $("input[name='numberType']");
						$numberType[0].checked = true;
						numberTypeHandler(obj);
						$J_sortComplete.bind('click', propEditConfirm);
						break;
					case 6:
						var $numberType = $("input[name='numberType']");
						$numberType[1].checked = true;
						numberTypeHandler(obj);
						$J_sortComplete.bind('click', propEditConfirm);
						break;
					case 2:
						$("#minString").val(obj.minValue);
						$("#maxString").val(obj.maxValue);
						$("#textarea_tab").show();
						pop.popShow('#pop_propEdit');
						$J_sortComplete.bind('click', propEditConfirm);
						break;
					case 3:
						if(obj.propertyValue){
							var propertyValueString = '';
							for (var i = 0, j = obj.propertyValue.length; i < j; i++){
								propertyValueString += obj.propertyValue[i] + '\n';
							}
							$("#propValue").val(propertyValueString);
						};
						$("#select_tab").show();
						pop.popShow('#pop_propEdit');
						$J_sortComplete.bind('click', propEditConfirm);
						break;
					case 4:
						if(obj.propertyValue){
							var propertyValueString = '';
							for (var i = 0, j = obj.propertyValue.length; i < j; i++){
								propertyValueString += obj.propertyValue[i] + '\n';
							}
							$("#propValue").val(propertyValueString);
						};
						$("#checkbox_tab").show();
						pop.popShow('#pop_propEdit');
						$J_sortComplete.bind('click', propEditConfirm);
						break;
					default:
						break;
				}
			}
		});
	}
	
	function numberTypeHandler(obj) {
		var $maxValue = $("input[name='maxVal']");
		if(obj.maxValue == null){
			$maxValue[0].checked = true;
		}else{
			$maxValue[1].checked = true;
			$("#maxValue").val(obj.maxValue);
		};
		var $minValue = $("input[name='minVal']");
		if(obj.minValue == null){
			$minValue[0].checked = true;
		}else{
			$minValue[1].checked = true;
			$("#minValue").val(obj.minValue);
		};
		var $unit = $("input[name='unit']");
		if(obj.unit == null){
			$unit[0].checked = true;
		}else{
			$unit[1].checked = true;
			$("#unitValue").value(obj.unit);
		};
		$("#number_tab").show();
		pop.popShow('#pop_propEdit');
	}
	
	function deleteProp() {
		var $deleteItem = $(this).parent().parent(),
			$deleteItemId = $deleteItem.attr('data-propid');
		$.ajax({
			type:"post",
			url:"",
			async:true,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({"propid": $deleteItemId}),
			success: function() {
				$deleteItem.remove();
			}
		});
	}
	
	function sortComplete() {
		var sortData = '{sortData: {'
		var trs = $propTbody.find('tr');
		trs.each(function(i, e){
			if(i === 0){
				sortData += '"' + $(e).attr('data-propid') + '":' + '"' + (i+1) + '"';
			}else{
				sortData += ',"' + $(e).attr('data-propid') + '":' + '"' + (i+1) + '"';
			}
		});
		sortData +='}}';
		sortData = parseJson(sortData);
		$.ajax({
			type:"post",
			url:"",
			async:true,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(sortData),
			success: function() {
				var sortInputs = $propTbody.find('.J_propsort');
				sortInputs.each(function(i, e){
					e.disabled = true;
				});
				$J_sortComplete.hide();
			}
		});
	};
	function parseJson(text){
		try{
			return JSON.parse(text);
		}catch(e){
			return eval('('+text+')');
		};
	};
	
	function sortHandler() {
		var cursortIndex = $(this).attr('data-sort'),
			sortIndex = $(this).val(),
			trs = $propTbody.find('tr');
			
		if(sortIndex < cursortIndex){
			//insertBefore
			$(this).parent().parent().insertBefore(trs.eq(sortIndex-1));
			var sortInputs = $propTbody.find('.J_propsort');
			sortInputs.each(function(i, e){
				e.value = ++i;
				e.setAttribute('data-sort', i);
			});
		}else if(sortIndex > cursortIndex){
			//insertAfter
			if(sortIndex > trs.size()){
				//输入值大于列别最大值则跳转到最后
				sortIndex = trs.size();
			};
			$(this).parent().parent().insertAfter(trs.eq(sortIndex-1));
			var sortInputs = $propTbody.find('.J_propsort');
			sortInputs.each(function(i, e){
				e.value = ++i;
				e.setAttribute('data-sort', i);
			});
		}
	};
	
	function sort() {
		var sortInputs = $propTbody.find('.J_propsort');
		sortInputs.each(function(i, e){
			e.disabled = false;
		});
		$J_sortComplete.show();
	}
	
	function propNameCheck() {
		if(this.value === ''){
			if(this.parentNode.getElementsByTagName('p')[0]){
				this.parentNode.getElementsByTagName('p')[0].innerHTML = '请填写属性名称';
			}else{
				var p = document.createElement('p');
			 	p.className = 'alert';
			 	p.innerHTML = '请填写属性名称';
			 	p.style.color = '#f00';
			 	propName.parentNode.appendChild(p)
			};
		}else{
			if(this.parentNode.getElementsByTagName('p')[0]){
				this.parentNode.getElementsByTagName('p')[0].innerHTML = '';
			};
		};
	};
	
	function PropTypecheck(status){
		if($PropType.parent().find('.alert').length){
			if(status){
				$PropType.parent().find('.alert').text('');
			}else{
				$PropType.parent().find('.alert').text('请选择属性类型');
			};
		};
	};
	
	function PropType() {
		switch (this.value){
			case 'number':
				$('.prop-form-tab').hide();
				$("#number_tab").show();
				PropTypecheck(1);
				break;
			case 'textarea':
				$('.prop-form-tab').hide();
				$("#textarea_tab").show();
				PropTypecheck(1);
				break;
			case 'select':
				$('.prop-form-tab').hide();
				$("#select_tab").show();
				PropTypecheck(1);
				break;
			case 'checkbox':
				$('.prop-form-tab').hide();
				$("#select_tab").show();
				PropTypecheck(1);
				break;
			default:
				PropTypecheck(0);
				$('.prop-form-tab').hide();
				break;
		};
	};
	
	function addProp() {
		sortComplete();
		pop.popShow('#pop_propEdit');
		$J_propConfirm.bind('click', propConfirm);
	}
	
	function numberProp(action) {
		var categoryId = $addProp.attr('data-categoryId');
		var propName = document.getElementById('propName');
		if(propName.value === ''){
			if(propName.parentNode.getElementsByTagName('p')[0]){
				propName.parentNode.getElementsByTagName('p')[0].innerHTML = '请填写属性名称';
			}else{
				var p = document.createElement('p');
				p.className = 'alert';
				p.innerHTML = '请填写属性名称';
				p.style.color = '#f00';
				propName.parentNode.appendChild(p);
			};
			return;
		};
		var propTypeSelect = {
			"number": "数值型",
			"textarea": "文本框",
			"select": "下拉选择框",
			"checkbox": "多选框"
		};
		var _propName = $propName.val(),
			propDesc = $("#PropDesc").val(),
			_propType = $PropType.val(),
			_propTypeText = propTypeSelect[_propType],
			Propchecks = $("#Propchecks")[0].checked,
			$numberType = $("input[name='numberType']"),
			numberType = 'default';
			
		Propchecks = Propchecks? 1:0;
		$numberType.each(function(i, e){
			if(e.checked){
				numberType = e.value;
			}
		});
		var $maxVal = $("input[name='maxVal']"),
			max = 'default',
			maxVal = 'default';
		$maxVal.each(function(i, e){
			if(e.checked){
				maxVal = e.value;
				if(maxVal !== '0'){
					max = $("#maxValue").val();
				};
			};
		});
		var $minVal = $("input[name='minVal']"),
			min = 'default',
			minVal = 'default';
		$minVal.each(function(i, e){
			if(e.checked){
				minVal = e.value
				if(minVal !== '0'){
					min = $("#minValue").val();
				}
			};
		});
		var $unit = $("input[name='unit']"),
			unit = 'default',
			unitType = 'default';
		$unit.each(function(i, e){
			if(e.checked){
				unitType = e.value
				if(minVal !== '0'){
					unit = $("#unitVal").val();
				};
			};
		});
		
		var numData = {
			"propName": _propName,
			"propDesc": propDesc,
			"propType": _propType,
			"isRequire": Propchecks,
			"numberType": numberType,
			"maxVal": maxVal,
			"max": max,
			"minVal": minVal,
			"min": min,
			"unitType": unitType,
			"unit": unit,
			"categoryId": categoryId
		};
		var index = $propTbody.find('tr').length + 1;
				/*
				 * reset表单
				 * 
				 * */
				$propName.val('');
				$("#PropDesc").val('');
				$PropType.find('option')[0].selected = true;
				$Propchecks[0].checked = false;
				$numberType.each(function(i, e){
					e.checked = false;
				});
				$maxVal.each(function(i, e){
					e.checked = false;
				});
				$minVal.each(function(i, e){
					e.checked = false;
				});
				$unit.each(function(i, e){
					e.checked = false;
				});
				$("#pointNumber").val('');
				$("#maxValue").val('');
				$("#minValue").val('');
				$("#unitVal").val('');
				$("#number_tab").hide();
				
				//插入表格
				$propTbody.append('<tr><td class="proptd">'+ _propName +'</td><td class="proptd">' + propDesc + '</td><td class="proptd">'+ _propTypeText +'</td><td class="proptd"></td><td class="proptd"><a href="#" class="propAction J_edit">编辑</a> | <a href="#" class="propAction J_delete">删除</a></td><td class="proptd"><input class="J_propsort" disabled data-sort="'+index+'" value="'+index+'" /></td></tr>');
				pop.popHide();
		
		//取消事件绑定
		if(action === 'edit'){
			$J_propConfirm.unbind('click', propEditConfirm);
		}else{
			$J_propConfirm.unbind('click', propConfirm);
		}
		$.ajax({
			type:"post",
			url:"",
			async:true,
			data: JSON.stringify(numData),
			success: function(){
				
			}
		});
	};
	
	function textareaCheck() {
		var categoryId = $addProp.attr('data-categoryId');
		var propName = document.getElementById('propName');
		if(propName.value === ''){
			if(propName.parentNode.getElementsByTagName('p')[0]){
				propName.parentNode.getElementsByTagName('p')[0].innerHTML = '请填写属性名称';
			}else{
				var p = document.createElement('p');
				p.className = 'alert';
				p.innerHTML = '请填写属性名称';
				p.style.color = '#f00';
				propName.parentNode.appendChild(p);
			};
			return;
		};
		var propTypeSelect = {
			"number": "数值型",
			"textarea": "文本框",
			"select": "下拉选择框",
			"checkbox": "多选框"
		};
		var _propName = $propName.val(),
			propDesc = $("#PropDesc").val(),
			_propType = $PropType.val(),
			_propTypeText = propTypeSelect[_propType],
			Propchecks = $("#Propchecks")[0].checked,
			linecheck = $("#lineCheck")[0].checked,
			minString = $("#minString").val(),
			maxString = $("#maxString").val();
		
		if(minString === ''){
			minString = 'default';
		};
		if(maxString === ''){
			maxString = 'default';
		};
		
		var stringData = {
			"propName": _propName,
			"propDesc": propDesc,
			"propType": _propType,
			"Propchecks": Propchecks,
			"linecheck": linecheck,
			"minString": minString,
			"maxString": maxString,
			"categoryId": categoryId
		};
		
		$.ajax({
			type:"post",
			url:"",
			async:true,
			data: JSON.stringify(stringData),
			success: function(data){
				/*
				 * reset表单
				 * */
				$propName.val('');
				$("#PropDesc").val('');
				$PropType.find('option')[0].selected = true;
				$Propchecks[0].checked = false;
				$("#lineCheck")[0].checked = false;
				$("#minString").val('');
				$("#maxString").val('');
				$("#textarea_tab").hide();
				//插入表格
				var index = $propTbody.find('tr').length + 1;
				$propTbody.append('<tr data-propid="'+ data.property.Id +'"><td class="proptd">'+ _propName +'</td><td class="proptd">' + propDesc + '</td><td class="proptd">'+ _propTypeText +'</td><td class="proptd"></td><td class="proptd"><a href="#" class="propAction">编辑</a> | <a href="#" class="propAction">删除</a></td><td class="proptd"><input class="J_propsort" disabled data-sort="'+index+'" value="'+index+'" /></td></tr>');
				pop.popHide();
				//取消事件绑定
				if(action === 'edit'){
					$J_propConfirm.unbind('click', propEditConfirm);
				}else{
					$J_propConfirm.unbind('click', propConfirm);
				};
			}
		});
	};
	
	function selectCheck() {
		var categoryId = $addProp.attr('data-categoryId');
		var propName = document.getElementById('propName');
		if(propName.value === ''){
			if(propName.parentNode.getElementsByTagName('p')[0]){
				propName.parentNode.getElementsByTagName('p')[0].innerHTML = '请填写属性名称';
			}else{
				var p = document.createElement('p');
				p.className = 'alert';
				p.innerHTML = '请填写属性名称';
				p.style.color = '#f00';
				propName.parentNode.appendChild(p);
			};
			return;
		};
		var propTypeSelect = {
			"number": "数值型",
			"textarea": "文本框",
			"select": "下拉选择框",
			"checkbox": "多选框"
		};
		var _propName = $propName.val(),
			propDesc = $("#PropDesc").val(),
			_propType = $PropType.val(),
			_propTypeText = propTypeSelect[_propType],
			Propchecks = $("#Propchecks")[0].checked,
			propValue = $("#propValue").val().split('\n');
			
			if(propValue[propValue.length-1] === ''){
				propValue.pop();
			};
			var propValueString = '';
			for(var i = 0, j = propValue.length; i < j; i++){
				propValueString += propValue[i] + ', ';
			}
			var propValueStr = propValueString.substr(0, propValueString.length-2);
			
		var selectData = {
			"propName": _propName,
			"propDesc": propDesc,
			"propType": _propType,
			"Propchecks": Propchecks,
			"propValue": propValue,
			"categoryId": categoryId
		};
			/*
				 * reset表单
				 * */
				$propName.val('');
				$("#PropDesc").val('');
				$PropType.find('option')[0].selected = true;
				$Propchecks[0].checked = false;
				$("#propValue").val('');
				$("#select_tab").hide();
				//插入表格
				var index = $propTbody.find('tr').length + 1;
				$propTbody.append('<tr><td class="proptd">'+ _propName +'</td><td class="proptd">' + propDesc + '</td><td class="proptd">'+ _propTypeText +'</td><td class="proptd">'+ propValueStr +'</td><td class="proptd"><a href="#" class="propAction">编辑</a> | <a href="#" class="propAction">删除</a></td><td class="proptd"><input class="J_propsort" disabled data-sort="'+index+'"value="'+index+'" /></td></tr>');
				pop.popHide();
		$.ajax({
			type:"post",
			url:"",
			async:true,
			data: JSON.stringify(selectData),
			success: function() {
				//取消事件绑定
				if(action === 'edit'){
					$J_propConfirm.unbind('click', propEditConfirm);
				}else{
					$J_propConfirm.unbind('click', propConfirm);
				};
			}
		});
	}
	
	function propEditConfirm() {
		switch ($PropType.val()){
			case 'number':
				numberProp('edit');
			
				break;
			case 'textarea':
				textareaCheck('edit');
				
				break;
			case 'select':
				selectCheck('edit');
				
				break;
			case 'checkbox':
				selectCheck('edit');
				
				break;
			default:
				var propName = document.getElementById('propName');
				if(propName.value === ''){
					if(propName.parentNode.getElementsByTagName('p')[0]){
						propName.parentNode.getElementsByTagName('p')[0].innerHTML = '请填写属性名称';
					}else{
						var p = document.createElement('p');
						p.className = 'alert';
						p.innerHTML = '请填写属性名称';
						p.style.color = '#f00';
						propName.parentNode.appendChild(p);
					};
				};
				if($PropType.parent().find('.alert').length){
					$PropType.parent().find('.alert').text('请选择属性类型');
				}else{
					var p = document.createElement('p');
				 	p.className = 'alert';
				 	p.innerHTML = '请选择属性类型';
				 	p.style.color = '#f00';
				 	$PropType[0].parentNode.appendChild(p);
				};
				break;
		};
	}
	
	function propConfirm() {
		switch ($PropType.val()){
			case 'number':
				numberProp();
			
				break;
			case 'textarea':
				textareaCheck();
				
				break;
			case 'select':
				selectCheck();
				
				break;
			case 'checkbox':
				selectCheck();
				
				break;
			default:
				var propName = document.getElementById('propName');
				if(propName.value === ''){
					if(propName.parentNode.getElementsByTagName('p')[0]){
						propName.parentNode.getElementsByTagName('p')[0].innerHTML = '请填写属性名称';
					}else{
						var p = document.createElement('p');
						p.className = 'alert';
						p.innerHTML = '请填写属性名称';
						p.style.color = '#f00';
						propName.parentNode.appendChild(p);
					};
				};
				if($PropType.parent().find('.alert').length){
					$PropType.parent().find('.alert').text('请选择属性类型');
				}else{
					var p = document.createElement('p');
				 	p.className = 'alert';
				 	p.innerHTML = '请选择属性类型';
				 	p.style.color = '#f00';
				 	$PropType[0].parentNode.appendChild(p);
				};
				break;
		};
	};
	
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
    //初始化
    pop.init();
});
}());
