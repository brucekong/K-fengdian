/**
 * Created by xuelei.kong on 2017/2/13.
 */
var treeTimer;

$('.float-menu-wrap').hover(function () {
    $(this).find('.float-menu-list').show();
},function () {
    $(this).find('.float-menu-list').hide();
});

$('.collapse-btn').click(function () {
    $('body').toggleClass('maximize');
    $(window).resize();
});
$('#env_wf_info').hover(function () {
    $('#envNavTreeDiv').fadeIn();
}, function () {
    treeTimer = setTimeout(function () {
        $('#envNavTreeDiv').fadeOut();
    }, 30)
});

$('#envNavTreeDiv').hover(function () {
    clearTimeout(treeTimer);
    $('#envNavTreeDiv').show();
}, function () {
    $('#envNavTreeDiv').fadeOut();
});
$('.level1').find('a[level=1]').on("click", function () {
    $(this).next('.level2').toggle();
    $('#env_menu').css(
        'min-height',$('.menu').height()+100+72+56<winH?winH-100-72-56:$('.menu').height()
    );
});

$('a[level=2]').hover(function () {
    $(this).css({
        "color": "rgb(220, 93, 3)"
    });
    $(this).find('span').css({
        'background': 'url(' + $(this).find('span').attr('hover_icon') + ') no-repeat'

    });
}, function () {
    $(this).find('span').css({
        'background': 'url(' + $(this).find('span').attr('icon') + ') no-repeat'
    });
    $(this).css({
        "color": "rgb(149, 149, 149)"
    });
});


//页面高度初始化
var winW = $(window).width();
var winH = $(window).height();
var screenH = window.screen.height;//屏幕高度
var rightWidth = winW - $('#env-left').width() < 1079 ? 1079 : winW - $('#env-left').width();
var headerH=$('body').hasClass('maximize')?0:56;

var rightHeight = winH - headerH < screenH / 2 ? screenH : winH - headerH;
$('#svg_content_svg_name').width(rightWidth).height(rightHeight);


$('.spline-column-wrapper').width(rightWidth * 0.613).height(rightHeight * 0.441);
$('#spline-column').width(rightWidth * 0.613).height(rightHeight * 0.441);


$('.spline-wrapper').width(rightWidth * 0.34).height(rightHeight * 0.441);
$('#highcharts2').width(rightWidth * 0.34).height(rightHeight * 0.441);


$('#env_menu').css(
    'min-height',$('.menu').height()+($('body').hasClass('maximize')?50:100+72)+56<winH?winH-($('body').hasClass('maximize')?50:100+72)-56:$('.menu').height()
);

if(winH - headerH < screenH / 2){
    if($('body').hasClass('maximize')){
        $('#env_menu').css(
            'min-height',screenH-56-50
        )
    }else{
        $('#env_menu').css(
            'min-height',screenH-72-100
        )
    }
}

//柱状加折线
var chartCurve = new Highcharts.Chart('spline-column', {
    chart: {
        zoomType: 'xy',
        backgroundColor: "rgba(12, 35, 42, 0)",
        borderColor: "rgba(0,0,0,1.00)",
        borderRadius: "4",
        borderWidth: "1",
        marginLeft: 90,
        marginRight: 100,
        marginTop: 100,
        width: rightWidth * 0.613,
        height: rightHeight * 0.441
    },

    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true,
        lineColor: '#65B28C',
        labels: {
            style: {
                color: '#fff'
            }
        }
    }],
    yAxis: [
        { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mb',
                style: {
                    color: '#489ca8'
                }
            },
            opposite: true
        },
        { // Secondary yAxis
            "gridLineColor": '#75878a',
            gridLineWidth: 1,
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                    color: '#489ca8'
                }
            }
        }
    ],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'horizontal',
        align: 'right',
        x: 0,
        verticalAlign: 'top',
        y: 40,
        floating: true,
        backgroundColor: 'transparent',
        itemStyle: {
            "color": "#ccc",
            "fontWeight": "normal"
        }
    },

    series: [
        {
            name: 'Rainfall',
            type: 'column',
            borderColor: "transparent",
            yAxis: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            tooltip: {
                valueSuffix: ' mm'
            },
            pointWidth: 20,
            color: '#27F9F9'
        },
        {
            name: 'Sea-Level Pressure',
            type: 'spline',
            color: '#ffaa00',
            yAxis: 0,
            data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
            marker: {
                enabled: false
            },
            dashStyle: 'shortdot',
            tooltip: {
                valueSuffix: ' mb'
            }
        }
    ]
});


//横向柱状图
var chartColumn = new Highcharts.Chart('highcharts2',
    {
        chart: {
            type: 'bar',
            backgroundColor: "rgba(12, 35, 42, 0)",
            borderColor: "rgba(0,0,0,1.00)",
            borderRadius: "4",
            borderWidth: "1",
            marginLeft: 90,
            marginRight: 100,
            marginTop: 70,
            marginBottom: 30,
            width: rightWidth * 0.34,
            height: rightHeight * 0.441
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            tickWidth: 0,
            lineWidth: 0,
            categories: ['1号机组', '2号机组', '3号机组', '4号机组', '5号机组'],
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            gridLineWidth: 0,
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify',
                enabled: false
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                borderColor: 'transparent',
                dataLabels: {
                    enabled: true,
                    style: {
                        "fontWeight": "normal",
                        "fontSize": "12px",
                        color: '#fff'
                    }
                }

            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },

        series: [{
            name: '日',
            borderWidth: 0,
            data: [973, 914, 4054, 732, 324],
            colorByPoint: true,
            colors: ['#2096FF', '#27F9F9', '#25F552', '#BDFD21', '#FD5421'],
            pointWidth: 20

        }]
    });


var timer;
$(window).resize(function () {

    winW = $(window).width();
    winH = $(window).height();
    clearTimeout(timer);
    timer = setTimeout(function () {
        $('#env_menu').css(
            'min-height',$('.menu').height()+($('body').hasClass('maximize')?50:100+72)+56<winH?winH-($('body').hasClass('maximize')?50:100+72)-56:$('.menu').height()
        );
        rightWidth = winW - $('#env-left').width() < 1079 ? 1079 : winW - $('#env-left').width();
         headerH=$('body').hasClass('maximize')?0:56;
         rightHeight = winH - headerH < screenH / 2 ? screenH : winH - headerH;
         if(winH - headerH < screenH / 2){
                if($('body').hasClass('maximize')){
                    $('#env_menu').css(
                        'min-height',screenH-56-50
                    )
                }else{
                    $('#env_menu').css(
                        'min-height',screenH-72-100
                    )
                }
         }
        $('#svg_content_svg_name').width(rightWidth).height(rightHeight);

        $('.spline-column-wrapper').width(rightWidth * 0.613).height(rightHeight * 0.441);
        $('#spline-column').width(rightWidth * 0.613).height(rightHeight * 0.441);


        $('.spline-wrapper').width(rightWidth * 0.34).height(rightHeight * 0.441);
        $('#highcharts2').width(rightWidth * 0.34).height(rightHeight * 0.441);

        chartCurve.update({
            chart: {
                width: rightWidth * 0.613,
                height: rightHeight * 0.441
            }
        });
        chartColumn.update({
            chart: {
                width: rightWidth * 0.34,
                height: rightHeight * 0.441
            }
        });
    }, 50)
    $('#envNavTreeDiv').css({
        left:$('#env_wf_info').width(),
        top:56
    })
});


//zTree
var setting = {
    data: {
        key: {
            title: "t"
        },
        simpleData: {
            enable: true
        }
    },
    view: {
        fontCss: getFontCss
    }
};

var zNodes = [
    {id: 1, pId: 0, name: "节点搜索演示 1", t: "id=1", open: true},
    {id: 11, pId: 1, name: "关键字可以是名字", t: "id=11"},
    {id: 12, pId: 1, name: "关键字可以是level", t: "id=12"},
    {id: 13, pId: 1, name: "关键字可以是id", t: "id=13"},
    {id: 14, pId: 1, name: "关键字可以是各种属性", t: "id=14"},
    {id: 2, pId: 0, name: "节点搜索演示 2", t: "id=2", open: true},
    {id: 21, pId: 2, name: "可以只搜索一个节点", t: "id=21"},
    {id: 22, pId: 2, name: "可以搜索节点集合", t: "id=22"},
    {id: 23, pId: 2, name: "搜我吧", t: "id=23"},
    {id: 3, pId: 0, name: "节点搜索演示 3", t: "id=3", open: true},
    {id: 31, pId: 3, name: "我的 id 是: 31", t: "id=31"},
    {id: 32, pId: 31, name: "我的 id 是: 32", t: "id=32"},
    {id: 33, pId: 32, name: "我的 id 是: 33", t: "id=33"}
];

function focusKey(e) {
    if (key.hasClass("empty")) {
        key.removeClass("empty");
    }
}
function blurKey(e) {
    if (key.get(0).value === "") {
        key.addClass("empty");
    }
}
var lastValue = "", nodeList = [], fontCss = {};
function clickRadio(e) {
    lastValue = "";
    searchNode(e);
}
function searchNode(e) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    if (!$("#getNodesByFilter").attr("checked")) {
        var value = $.trim(key.get(0).value);
        var keyType = "";
        if ($("#name").attr("checked")) {
            keyType = "name";
        } else if ($("#level").attr("checked")) {
            keyType = "level";
            value = parseInt(value);
        } else if ($("#id").attr("checked")) {
            keyType = "id";
            value = parseInt(value);
        }
        if (key.hasClass("empty")) {
            value = "";
        }
        if (lastValue === value) return;
        lastValue = value;
        if (value === "") return;
        updateNodes(false);

        if ($("#getNodeByParam").attr("checked")) {
            var node = zTree.getNodeByParam(keyType, value);
            if (node === null) {
                nodeList = [];
            } else {
                nodeList = [node];
            }
        } else if ($("#getNodesByParam").attr("checked")) {
            nodeList = zTree.getNodesByParam(keyType, value);
        } else if ($("#getNodesByParamFuzzy").attr("checked")) {
            nodeList = zTree.getNodesByParamFuzzy(keyType, value);
        }
    } else {
        updateNodes(false);
        nodeList = zTree.getNodesByFilter(filter);
    }
    updateNodes(true);

}
function updateNodes(highlight) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    for (var i = 0, l = nodeList.length; i < l; i++) {
        nodeList[i].highlight = highlight;
        zTree.updateNode(nodeList[i]);
    }
}
function getFontCss(treeId, treeNode) {
    // return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
function filter(node) {
    return !node.isParent && node.isFirstNode;
}
var key;

$(function () {
    var init = $.fn.zTree.init($("#envNavTree"), setting, zNodes);
    key = $("#key");
    key.bind("focus", focusKey)
        .bind("blur", blurKey)
        .bind("propertychange", searchNode)
        .bind("input", searchNode);
    $("#name").bind("change", clickRadio);
    $("#level").bind("change", clickRadio);
    $("#id").bind("change", clickRadio);
    $("#getNodeByParam").bind("change", clickRadio);
    $("#getNodesByParam").bind("change", clickRadio);
    $("#getNodesByParamFuzzy").bind("change", clickRadio);
    $("#getNodesByFilter").bind("change", clickRadio);
    $('#envNavTreeDiv').css({
        left:$('#env_wf_info').width(),
        top:56
    })
});




