/**
 * Created by hangwei on 15/11/7.
 */
(function($){
    //查找url传参
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


    // 显示所有状态红包

    function domRender(redType){
        var redPacketType =redType;
        $.ajax({
            type: "POST",
            url: "/redPacket/findList",
            data: JSON.stringify({redPacketType:redPacketType}),
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        });
    }

    var Request = GetRequest('redType').redType;

    if(Request){
        var index=Request-1;
        $('.hb-tab-change').eq(index).addClass('cur-line').siblings('.hb-tab-change').removeClass('cur-line');
        domRender(index);
    }else{
        domRender(1);
    }

    $('.hb-tab-change').on('click',function(e){
        var index =$(this).index();
        $(this).addClass('cur-line').siblings().removeClass('cur-line');
        domRender(index+1);
    })

    /*——————————红包查询——————————*/
    $('#J-searchRed').on('click',function(){

        function getIndex(){
            var index=0;
            $('.hb-tab-change').each(function(i,el){
                if($(el).hasClass('cur-line')){
                    index =i;
                }
            })
            return index;
        }

        var index =getIndex();
        var redPacketType =index+1;
        var status = $('#J-selectStatus').val();
        if(status==''){
            alert('请选择状态')
        }else{
            $.ajax({
                type: "POST",
                url: "/redPacket/findList",
                data: JSON.stringify({
                    redPacketType:redPacketType,
                    status:status
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            });
        }
    })



     /*——————————改变红包状态——————————*/
    $(document).on('click','.J-changeRed',function(){
        var statusNmme = $(this).html();
        var redPacketId =$(this).attr('redPacketId');
        switch (statusNmme){
            case '关闭':
                $(this).parent().siblings('.j-red-status').html('无效');
                $(this).html('开启');
                changeStatus(redPacketId,'2')
                break;
            case '开启':
                $(this).parent().siblings('.j-red-status').html('有效');
                $(this).html('关闭');
                changeStatus(redPacketId,'1')
                break;
        }

        function changeStatus(redPacketId,status){
            $.ajax({
                type: "POST",
                //接口url
                url: "",
                //入参
                data: JSON.stringify({
                    redPacketId:redPacketId,
                    status:status
                }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
            });
        }

    })
    //创建新红包
    $(document).on('click','.J-createNew',function(){
        $.ajax({
            type: "POST",
            url: "/redPacket/toRedPacket",
            data: JSON.stringify({
                redPacketId:'0'
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        });
    })

    //修改红包
    $(document).on('click','.J-changeCreate',function(){
        var redPacketId=$(this).attr('redPacketId');

        $.ajax({
            type: "POST",
            url: "/redPacket/toRedPacket",
            data: JSON.stringify({
                redPacketId:redPacketId
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        });
    })

})(jQuery)
