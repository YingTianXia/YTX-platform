/**
 * Created by hangwei on 15/11/11.
 */
(function($){

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    /*当前红包判断*/
    var redSelectType = $(".select-hb").find("option:selected").val()-1;
    $('.create-hb-detail').eq(redSelectType).show().siblings('.create-hb-detail').hide();

    $('.select-hb').on('change',function(){
        var index =$(this).val()-1;
        $('.create-hb-detail').eq(index).show().siblings('.create-hb-detail').hide();
    })

    $('.hb-submit').on('click',function(){
        var redPacketId = GetRequest('redPacketId').redPacketId;
        createData(redPacketId)
    });

    $('.hb-cancel').on('click',function(){
        location.reload();
    })


    function createData(redPacketId){
        var myDate = new Date(),
            nowY =myDate.getFullYear(),
            nowM=myDate.getMonth()+1,
            nowD=myDate.getDate(),
            nowData =nowY+'-'+(nowM<10 ? "0" + nowM : nowM) +'-'+(nowD<10 ? "0"+ nowD : nowD);
        var hbData={},
            redType =$('.select-hb').val(),
            selectIndex=$('.select-hb').val()-1;

        $('.create-hb-detail').eq(selectIndex).find('input').each(function(index,el){
            var check =$(el).attr('name');
            switch (check){
                case 'recipientsWay':
                    if($(this).get(0).checked){
                        if($(this).val()==1){
                            hbData.recipientsWay=1;
                        }else if($(this).val()==2){
                            hbData.recipientsWay=2;
                        }
                    }
                    break;
                case 'provideDate':
                    if($(this).get(0).checked) {
                        if ($(this).val() == 1) {
                            hbData.provideDate = nowData;
                        } else if($(this).siblings('.selfInput').val()) {
                            hbData.provideDate = $(this).siblings('.selfInput').val();
                        }
                    }
                    break;
                case 'efficientDate':
                    if($(this).get(0).checked) {
                        if ($(this).val() == 1) {
                            hbData.efficientDate = nowData;
                        } else if($(this).siblings('.selfInput').val()) {
                            hbData.efficientDate = $(this).siblings('.selfInput').val();
                        }
                    }
                    break;
                case 'validDate':
                    if($(this).val()) {
                        hbData.validDate = $(this).val();
                    }
                    break;
                case 'faceValue':
                    if($(this).val()) {
                        hbData.faceValue = $(this).val();
                    }
                    break;
                case 'releaseNum':
                    if($(this).get(0).checked) {
                        if ($(this).val() == 1) {
                            hbData.releaseNum = 0;
                        } else if($(this).siblings('.selfInput').val()){
                            hbData.releaseNum = $(this).siblings('.selfInput').val();
                        }
                    }
                    break;
                case 'useCondition':
                    if($(this).val()) {
                        hbData.useCondition = $(this).val()
                    }
                    break;
                case 'limitRecipients':
                    if($(this).val()) {
                        hbData.limitRecipients = $(this).val();
                    }
                    break;
                case 'shareValidDate':
                    if($(this).val()) {
                        hbData.shareValidDate = $(this).val();
                    }
            }
        })
        switch (redType) {
            case '1':
                hbData.redPacketName='日常红包';
                break;
            case '2':
                hbData.redPacketName='首单红包';
                break;
            case '3':
                hbData.redPacketName='新人红包';
                break;
            case '4':
                hbData.redPacketName='分享红包';
                break;
        }
        hbData.redPacketType=redType;
        hbData.status="1";

        if(redPacketId){
            hbData.redPacketId=redPacketId;
        }

        function getJsonObjLength(jsonObj) {
            var Length = 0;
            for (var item in jsonObj) {
                Length++;
            }
            return Length;
        }
        switch (redType) {
            case '1':
                if(getJsonObjLength(hbData)==11){
                    postDate(hbData)
                }else{
                    alert('请补全信息');
                    console.log(hbData)
                }
                break;
            case '2':
                if(getJsonObjLength(hbData)==11){
                    postDate(hbData)
                }else{
                    alert('请补全信息');
                }
                break;
            case '3':
                if(getJsonObjLength(hbData)==7){
                    postDate(hbData)
                }else{
                    alert('请补全信息');
                }
                break;
            case '4':
                if(getJsonObjLength(hbData)==8){
                    postDate(hbData)
                }else{
                    alert('请补全信息');
                }
                break;
        }

        function postDate(obj){
            $.ajax({
                type: "POST",
                url: "/redPacket/save",
                data: JSON.stringify(obj),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data){
                    if(data&&data.code==1){
                        /*$.ajax({
                         type: "POST",
                         url: "/redPacket/findList",
                         data: JSON.stringify({redType:redType}),
                         dataType: "json",
                         contentType: "application/json; charset=utf-8"
                         });*/

                        window.open("../../tamplates/marketing/hbManage.html?redType="+redType);
                    }
                }
            });
        }
    }

    /*日历组件实例化*/
    $('.selfInputTime').each(function(i,el){
        var start = {
            elem: $(el)[0],
            event: 'focus',
            format: 'YYYY-MM-DD'
        }
        laydate(start);
    })




})(jQuery)
