var div_now_load='svg_background';
var ws_now_no=0;
var curve_div="";
var xadd=21;
var curve_map={};
var g_time_area=new Date().getTimezoneOffset()/60*-1;//东8区
var padding_top=43;
var svg_specal="First";
var g_curve_font_size = 12;
var g_decimal_curve = 2;//曲线查询都使用2个小数点位
// var my_real_curve_refresh_time = get_web_cfg('my_real_curve_refresh_time');
// var my_history_curve_refresh_time = get_web_cfg('my_history_curve_refresh_time');
var g_day_micsecs = 86400 * 1000;
var pointer_chart_left = 0; //鼠标相对于plot的left值
var pointer_chart_top = 0; //鼠标相对于plot的top值

var temp_chart;


var curve_marge={//曲线的边距   注：bowen.yin 以后不手动设置marginLeft和marginRight值，让Highcharts自行处理，这样y轴的labels不会跑到曲线框外面去。
		right_double:80,
		right: 80, //由于右侧没有轴的时候，x轴的时间会超出，因此当right没有轴的时候，设置其margin为80（再乘缩放比例）(20141225 by zuoyong.tang)
		bottom:40,
		bottom_legend:20,//如果有曲线名，多增加的部分
		top_legend:30,  //bowen.yin
		top_title:28,//如果有title，多增加的部分
		top:30,//top的30和offset的20
	};

g_x_Format={
		millisecond:'%s',//time_html2php(),
	    second:'%s',//time_html2php(),
	    minute:'%s',//time_html2php(),
	    hour:'%H',//time_html2php(),
	    day:'%Y',//time_html2php(),
	    week:'%Y',//time_html2php(),
	    month:'%Y',//time_html2php(),
	    year:'%Y',//time_html2php(),
	};
/*
曲线分类类型：
4096：实时曲线
>4098:xy曲线
别的是历史曲线
*/

function  svg2curve(svg_name,curve_class){//根据svg中的信息，生成曲线（可能有多个曲线框）
	
	// (#36486 20160202 by zuoyong.tang) svg_content_不如svg_background_准确
	var svg_curves = $('#svg_background_'+svg_name+' svg g .'+curve_class);
	if (svg_curves.length <= 0)return;

	for(var div_i=0;div_i<svg_curves.length;div_i++)
	{	
		padding_top=43;
		var svg_curve=svg_curves.eq(div_i);//第i个曲线框
		var parameters=parse_SVG(svg_curve,svg_name);//对于每个曲线框，获取svg中信息，转换为highcharts中相关参数
		
		if('undefined' == typeof graph_curve_extend)
		{
			graph_curve_extend = undefined;
		}
		if('1' == parameters.need_grained && '4097' == parameters.curve_type)
		{
			//对于需要时间范围选择的曲线
			require(['graph_curve_extend'], (function(){
				//此函数是为了生成闭包
				var parameter_temp = parameters;
				return function(){
					parameter_temp.now_range = 'd';
					parameter_temp.now_time_index = 0;

					//这种曲线不需要endOnTick
					parameter_temp.no_half_tick = true;

					//强制显示标题
					parameter_temp.title_display = true;
					if(!parameter_temp.title)
					{
						parameter_temp.title = " ";
					}
					creat_data_curve(parameter_temp);
					var ranges_switch_btns = graph_curve_extend.get_curve_ranges();
					$('#' + parameter_temp.curve_div + ' div.tab_chart_title').prepend(ranges_switch_btns);
				}
			})());
		}
		else
		{
			parameters.need_grained = undefined;
			creat_data_curve(parameters);
		}
		
	}
}

//生成曲线框和内容
function creat_data_curve(parameters)
{
	par2div(parameters);//根据参数生成一个曲线框
	load_curve_data(parameters, 'firstGet');//根据参数获取数据并生成曲线
	save_refresh_pars(parameters,my_real_curve_refresh_time);//保存本个曲线框中的实时参数
}

/*
 * 根据svg对象获取highcharts的参数,生成一个div框
 * 输入：svg文件中的一个curve对象
 * 输出：生成highcharts所需要的全部参数
 */
function parse_SVG(svg_curve,svg_name)
{
	var parameters={};

	parameters.svg_name=svg_name;
	parameters.svg_id=svg_curve.attr("id");//曲线框的id
	parameters.curve_div=curve_div="curve_div_"+parameters.svg_id;//曲线框div的id
	
	$('#svg_background_'+svg_name).after("<div id='"+parameters.curve_div+"' class='div_env_curve'></div>");//在页面中插入曲线框div

	parameters.x = parseInt(svg_curve.attr("x"));//曲线位置
	parameters.y = parseInt(svg_curve.attr("y"));
	

	parameters.height = svg_curve.attr("height");//曲线宽高
	parameters.width = svg_curve.attr("width");
	
//	if(svg_name.indexOf(svg_specal)>-1)//首页的svg特殊处理
//	{	
//		padding_top=33;
//		//parameters.y-=10;
//		//parameters.height=parseInt(parameters.height)+10;
//	}

	var rate = get_svg_rate();
	$('#'+parameters.curve_div).css({
		'height' : parameters.height * rate[1] + 'px',
		'width' : parameters.width * rate[0]  + 'px',
		'left' : parameters.x * rate[0]  + 'px',
		'top' : parameters.y * rate[1]  + 'px',
		'position' : 'absolute',
		//'z-index' : '10'
	});

	$('#'+parameters.curve_div).data('parameters', parameters);
	return get_svg_pars(parameters,svg_curve);
}

/*
 * 根据svg对象获取highcharts的参数
 * 输入：svg文件中的一个curve对象
 * 输出：生成highcharts所需要部分参数
 */
function get_svg_pars(parameters,svg_curve)
{
	parameters.common_curve = svg_curve.attr('common_curve');

	//parameters.curve_count=svg_curve.attr("curve_count");//曲线数目
	parameters.refresh_time= 1000 * (svg_curve.attr("sample_cycle") || 60);//刷新时间
	if(parameters.refresh_time <= 0)
	{
		parameters.refresh_time = 60 * 1000;
	}
	parameters.time_mode=svg_curve.attr("time_mode");//时间表示方式（0代表json格式，1代表字符串时间格式yyyy-MM-dd hh:mm:ss）
	parameters.start_time=svg_curve.attr("start_time");//开始、结束时间（横坐标，这两个参数可能用不着）
	parameters.end_time=svg_curve.attr("end_time");
	parameters.title = svg_curve.attr("title");//曲线标题
	parameters.title_color=svg_curve.attr("title_color");//标题颜色
	parameters.title_font_family=svg_curve.attr("title_font_family");//标题字体
	parameters.title_font_size=svg_curve.attr("title_font_size");//标题字体大小
	parameters.xAxis_name=svg_curve.attr("x_axis_title");//x轴名称
	if(undefined==svg_curve.attr("x_axis_min")){
		parameters.xAxis_min=parameters.xAxis_max=undefined;
	}else{
		parameters.xAxis_min=parseInt(svg_curve.attr("x_axis_min"));//x轴标记的范围
		parameters.xAxis_max=parseInt(svg_curve.attr("x_axis_max"));
	}
	if (!svg_curve.attr("is_stack") || svg_curve.attr("is_stack") == "true") {
		parameters.is_stack="normal";
	} else{
		parameters.is_stack=""
	};
	parameters.is_tab_title="true"//标题是否包含tab选项卡
	parameters.tab01=svg_curve.attr("tab01");//tab01的内容
	parameters.tab02=svg_curve.attr("tab02");//tab02的内容
	parameters.legend_from_svg=svg_curve.attr("legend_from_svg"); //是否从svg获取图例的内容
    parameters.curve_belong_0_len=0;//���于分组“0”的曲线的条数
    parameters.curve_belong_1_len=0;//属于分组“1”的曲线的条数
    parameters.group_names='';//曲线的分组名,以“，”连接
    parameters.contain_column='';
    parameters.legend_str='';  //用于保存图例的字符串
    parameters.is_display_checkbox=svg_curve.attr("is_display_checkbox");//是否显示复选框

	parameters.xAxis_min==NaN?parameters.xAxis_min=undefined:parameters.height;
	parameters.xAxis_max==NaN?parameters.xAxis_max=undefined:parameters.height;

	parameters.xAxis_division=svg_curve.attr("x_axis_division");
	parameters.yAxis_count=parseInt(svg_curve.attr("y_axis_count"));//y轴个数（目前只支持1和2个y轴）
	
	//var primary_scale_count=svg_curve.attr("primary_scale_count");
	//var secondary_scale_count=svg_curve.attr("secondary_scale_count");
	
	var is_display_invalid=svg_curve.attr("no_display_invalid_point");//是否显示无效点，默认为显示
	var is_display_grid=svg_curve.attr("is_display_grid");//是否显示网格
	var is_display_curve_title=svg_curve.attr("is_display_curve_title");//是否在图例中显示各曲线名
	var is_display_smooth_curve=svg_curve.attr("is_display_smooth_curve");//是否为平滑曲线
	var is_display_legend=svg_curve.attr("is_display_curve_desc");//是否在图例中显示图例
	
	//var no_display_invalid_point=svg_curve.attr("no_display_invalid_point");
	parameters.is_display_invalid=is_display_invalid == '1' ? false : true;
	parameters.coord_bgcolor=svg_curve.attr("coord_bgcolor");//坐标区背景色
	parameters.coord_color=svg_curve.attr("coord_color");//坐标轴颜色
	parameters.grid_color=svg_curve.attr("grid_color");//曲格颜色
	parameters.scale_color=svg_curve.attr("scale_color");//坐标字颜色
	parameters.curve_type=svg_curve.attr("curve_type");//曲线类型号（给后台）
	parameters.borderWidth=svg_curve.attr("stroke-width");//边框宽度
	parameters.time_format_svg = svg_curve.attr("time_format");//x坐标使用的时间格式
	if(parameters.borderWidth)//如果是字符串形，显示会异常
	{
		parameters.borderWidth=parseFloat(parameters.borderWidth);
	}
	if(parameters.borderWidth==undefined)//默认为1，否则不能兼容以前的svg
	{
		parameters.borderWidth=1;
	}
	parameters.border_color=svg_curve.attr("stroke");//边框颜色
	if(parameters.border_color==undefined)//默认为黑色，否则不能兼容以前的svg
	{
		parameters.border_color='rgba(0,0,0,1)';
	}
	if(!parameters.coord_bgcolor || parameters.coord_bgcolor=='null')
	{
		parameters.coord_bgcolor="rgba(1,1,1,0)";//如果没有这个字段，在IE中不能tooltip
	}
	//(#18933)如果设为true，会有异常(右边变成log形式)，不知道为什么
	parameters.alignTicks = false;//双轴是否共用网格
	
	parameters.yAxis_names=[];//各y轴的名字
	parameters.yAxis_colors=[];//各y轴的颜色，包括刻度（目前为空）
	parameters.yAxis_divisions=[];//各y轴的刻度个数
	parameters.yAxis_scale_colors=[];//各y轴的数字颜色
	parameters.yAxis_maxs=[];//y轴的最大最小值
	parameters.yAxis_mins=[];
	parameters.yAxis_scale_count=[];
	parameters.yAxis_isMulti = false;
	parameters.plotLines=[];//平行与x轴的基线（认为最多只有2个曲线）
	parameters.plotLines.push([]);
	parameters.plotLines.push([]);
	parameters.yAxis_names.push(svg_curve.attr("primary_yaxis_title"));
	parameters.yAxis_names.push(svg_curve.attr("secondary_yaxis_title"));
	parameters.yAxis_colors.push(parameters.coord_color);
	parameters.yAxis_colors.push(parameters.coord_color);
	parameters.yAxis_divisions.push(svg_curve.attr("primary_scale_count"));
	parameters.yAxis_divisions.push(svg_curve.attr("secondary_scale_count"));
	parameters.yAxis_scale_colors.push(parameters.scale_color);
	parameters.yAxis_scale_colors.push(parameters.scale_color);
	parameters.yAxis_maxs.push(deal_yaxis_auto(svg_curve.attr("primary_yaxis_max")));
	parameters.yAxis_maxs.push(deal_yaxis_auto(svg_curve.attr("secondary_yaxis_max")));
	parameters.yAxis_mins.push(deal_yaxis_auto(svg_curve.attr("primary_yaxis_min")));
	parameters.yAxis_mins.push(deal_yaxis_auto(svg_curve.attr("secondary_yaxis_min")));
	parameters.yAxis_reversed=false;
	
	parameters.y_decimals=[0,0,0,0,0,0,0,0,0,0,0,0];//y轴小数点位数
	//下面是各条曲线的参数
	parameters.decimals=[];//小数点位数
	parameters.decimals_x=[];//x轴的小数点位数
	parameters.coord_maxs=[];//该曲线最大值
	parameters.coord_mins=[];//该曲线最小值
	parameters.dyn_params_x=[];//该曲线x轴读数的参数（发送给后台）
	parameters.dyn_params=[];//该曲线的参数（发送给后台）
	parameters.curve_names=[];//该曲线的名字，或描述
	parameters.to_yAxiss=[];//所属的y轴
	parameters.curve_colors=[];//曲线的颜色
	parameters.sub_types=[];//曲线类型相关（给后台）
	parameters.sub_types_x=[];//x轴类型
	parameters.is_valid=[];//x轴类型
	parameters.curve_style=[];//曲线的类型，是显示为柱状图还是线图
	parameters.group_belonged=[]; //柱状图属于哪一个分组 bowen.yin
	parameters.dash_style=[]; //线图的样式
	parameters.arith_type = []; //运算类型

	parameters.no_half_tick = false; //默认为半隔曲线
	if(parameters.refresh_time >= g_day_micsecs)
	{
		parameters.no_half_tick = true;
	}


	curve_resort(svg_curve);
	parameters.curve_count=svg_curve.children("curve").length;
	curve_count=parseInt(parameters.curve_count);//曲线数目
	for(var i=0;i<curve_count;i++)
	{   
		var curve_par = svg_curve.children('curve').eq(i);
		parameters.decimals.push(curve_par.attr("decimal"));
		parameters.decimals_x.push(curve_par.attr("decimal_x"));
		parameters.coord_maxs.push(curve_par.attr("coord_max"));
		parameters.coord_mins.push(curve_par.attr("coord_min"));
		parameters.dyn_params_x.push(curve_par.attr("dyn_param_x"));
		parameters.dyn_params.push(curve_par.attr("dyn_param"));
		parameters.curve_style.push(curve_par.attr("curve_style"));
		parameters.group_belonged.push(curve_par.attr("stack"));
		
		if (curve_par.attr("arith_type")) {
			parameters.arith_type.push(curve_par.attr("arith_type"));
		} else{
			parameters.arith_type.push("normal");
		};

		if(curve_par.attr("arith_type") != 'subtract')
		{
			parameters.no_half_tick = true;
		}

		//得到分组名字符串数组
		if (!parameters.group_names[0] && (parameters.group_belonged[i] != undefined)) {
			parameters.group_names = parameters.group_belonged[i] + '';
		} else {
			if (parameters.group_names.match(parameters.group_belonged[i]) == null) {
				parameters.group_names += ',' + parameters.group_belonged[i];
			}
		}
        
		parameters.dash_style.push(curve_par.attr("dash_style"));
		//判断曲线是否包含柱状图
		if (curve_par.attr("curve_style") == "column") {
			parameters.contain_column = true;
		};
		if(parameters.curve_type > 4098 && !(parameters.dyn_params_x[i] && parameters.dyn_params[i]))//曲线参数不对
		{
			parameters.is_valid.push(false);
		}else if(!parameters.dyn_params[i]){
			parameters.is_valid.push(false);
		}else{
			parameters.is_valid.push(true);
		}
		
		var to_yAxis=0;
		if(parameters.yAxis_count!=1){
			to_yAxis=curve_par.attr("yaxis_pos");
			if((to_yAxis!="")&&(to_yAxis!=undefined))parseInt(to_yAxis);
			else to_yAxis=i%2;//(20140419by唐作用)如果有3条曲线就糟了
			
			//(#23598)index不支持str
			to_yAxis = parseInt(to_yAxis);

			//用于判断第2个轴是否有用
			if(to_yAxis > 0)
			{
				parameters.yAxis_isMulti = true;
			}
		}
		parameters.y_decimals[parseInt(to_yAxis)] = Math.max(parameters.decimals[i], parameters.y_decimals[to_yAxis]);
		parameters.to_yAxiss.push(parseInt(to_yAxis));
		parameters.curve_colors.push(curve_par.attr("color"));
		parameters.sub_types.push(curve_par.attr("sub_type"));
		parameters.sub_types_x.push(curve_par.attr("sub_type_x"));
	}

	//单独处理curve_desc,为了实现在包含柱状图的曲线中line的图例不合并，但又区分实际风速和预测风速
	for (var i = 0; i < curve_count; i++) {
		var curve_par = svg_curve.children('curve').eq(i);
		if (parameters.sub_types[i] == '4098' && parameters.contain_column == true 
			&& parameters.curve_style[i] == 'line') {
			parameters.curve_names.push(curve_par.attr("curve_desc") + "(" + JSLocale.curve_forecast_data + ")");
		} else {
			parameters.curve_names.push(curve_par.attr("curve_desc"));
		}
	}

	parameters.group_names = parameters.group_names.split(","); //转化为数组

    for(var i=0;i<curve_count;i++){
        if(parameters.group_belonged[i] == parameters.group_names[0]) parameters.curve_belong_0_len++; //第一个分组的曲线的条数
		if(parameters.group_belonged[i] == parameters.group_names[1]) parameters.curve_belong_1_len++; //第二个分组的曲线的条数
    }

	parameters.curve_smooth=((is_display_smooth_curve=="1")?"spline":"line");
	parameters.gridLineWidth=((is_display_grid=="1")?1:0);
	parameters.title_display=(is_display_curve_title==1?true:false);
	parameters.title_display = parameters.title_display && svg_curve.attr("title");
	parameters.is_display_legend=(is_display_legend==0?false:true);//是否显示图例默认为显示，否则不能兼容以前的svg
	parameters.is_hide_xAxis = false;//是否在图例中显示图例
	if(svg_curve.attr("is_display_xmarks") == '0' || svg_curve.attr("hide_time") == 'true')
	{
		parameters.is_hide_xAxis = true;
	}	
		
//	var margin=30;
//	if(parameters.yAxis_count==2||parameters.curve_type>4098)margin=75;//双y轴和xy曲线给右边留多一点位置
//	//margin=75;
//	parameters.marginRight=margin;
//	parameters.marginTop=padding_top;
	//默认为只显示2端的时间
	parameters.xAxis_interval = parseInt(svg_curve.attr("x_axis_division")) || 1;
	
	parameters.xAxis_label_top='0px';//x标签的margin-top
	parameters.base_line_width="0";//准线宽度

	parameters.offset_x=0;//x坐标轴的偏移量
	parameters.xAxis_width=1;//x轴宽度
	parameters.zoomType=null;//是否可放大缩小
	if(parameters.curve_type<=4098)parameters.data_type_x="datetime";
	if(parameters.curve_type<=4098)//时间曲线
	{
		parameters.x_Format=g_x_Format;
		parameters.x_Format_tooltip="时间：%Y-%m-%d %H:%M:%S";//不能自适应
	}
	parameters.export_btn=false;
	parameters.from_curve=false;
	parameters.from_svg_curve=true;

	//#23067 2014-11-28 bowen.yin 当title设置为不显示时但要显示chenckbox时，给title加空格并且设为显示
	if (parameters.is_display_checkbox == "true" && (parameters.group_names.length > 0)){
		parameters.title = " ";  //给title加空格
		parameters.title_display = true;
	};

	//need_grained为1表示可进行年月日切换
	parameters.need_grained = svg_curve.attr('need_grained');

	return parameters;
}

//对于y轴的自适应，可以设成“auto”
function deal_yaxis_auto(value)
{
	if('auto' == value || ' ' == value)
	{
		return '';
	}
	return value;
}

//对每条曲线，保存其相关信息，用于刷新时调用
function save_refresh_pars(parameters,refresh_time)
{
	curve_map['parms_'+parameters.svg_name+'_'+parameters.svg_id]=parameters;//保存曲线参数，用于刷新曲线
	if(parameters.curve_type!="4096")return;
	var curve_count=parseInt(parameters.curve_count);//曲线数目
	for(var i=0;i<curve_count;i++)
	{
		if(parameters.is_valid && !parameters.is_valid[i])//对于没有声明动态字的曲线，不请求
		{
			continue;
		}
		curve_map[parameters.svg_id+"_curve_"+i]=[parameters.curve_type,parameters.dyn_params[i],parameters.decimals[i],refresh_time];
	}
}

/*
 * 根据highcharts生成曲线的预处理
 * 输入：生成highcharts所需要的参数
 * 输出：highcharts的y轴和空数据格式
 */
function pre_curve(parameters)
{
	var series_return={};
	
	var yAxis=[];//对y轴进行设置
	var tickPositions=[];
	if(parameters.use=="curve_tool")
	{
		curve_marge={
			righ_double:null,
			bottom:null,
			bottom_legend:20,
			top_legend:20, //bowen.yin
			top_title:20,
			top:null,
		};
	}
	for(var i=0;i<parameters.yAxis_count;i++)
	{
		//如果配置了最大最小值和刻度数，则进行刻度设置
		var min_tick = null;
		var tickInterval = null;
		var yAxis_max = null;
		var yAxis_min = null;

		if(parameters.yAxis_maxs&&parameters.yAxis_mins&&parameters.yAxis_mins[i]&&parameters.yAxis_maxs[i] && parameters.yAxis_maxs[i] != parameters.yAxis_mins[i] &&parameters.yAxis_divisions[i])
		{//对包含了最大最小值的y值进行刻度配置
			tickInterval = parseFloat(parameters.yAxis_maxs[i]) - parseFloat(parameters.yAxis_mins[i]);

			var min = parseFloat(parameters.yAxis_mins[i]),
	        max = parseFloat(parameters.yAxis_maxs[i]),
	        now = min,
	        count = parameters.yAxis_divisions[i],
			interval = (max-min)/count,
			min_tick = interval/5;

			tickInterval = interval;
			
			if(parameters.use=="curve_tool")
			{//曲线查询页面不要刻度值
				tickPositions=null;	
				min_tick=null;
			}
			else{
//				while(min<=max) {
//		        	tickPositions.push(min);
//		            min+=interval;//这个方法会产生很长的小数，不知道为什么
//		        }
				//var decimal = parameters.y_decimals[i] || 0;
				tickPositions.push(min);
		        for(var i_tick = 1; i_tick < count; i_tick++) {
		        	now = min + interval * i_tick;
		        	now = math_round2(now, 2);
		        	if(Math.abs(parseInt(now) - now) < 0.01)
		        	{
		        		now = math_round2(now, 1);
		        	}
		        	tickPositions.push(now);
		        }tickPositions.push(max);
	        }
		}else
		{
			tickPositions=null;
			parameters.alignTicks = true;

			if(parameters.yAxis_mins[i] != parameters.yAxis_maxs[i])
			{
				yAxis_min = $.isNumeric(parameters.yAxis_mins[i]) ? parseFloat(parameters.yAxis_mins[i]) : null;
				yAxis_max = $.isNumeric(parameters.yAxis_maxs[i]) ? parseFloat(parameters.yAxis_maxs[i]) : null;
			}
		}

		
		var yAxis_ = {
			//lineWidth:1,
			//lineColor:parameters.yAxis_colors[i],//y轴的坐标轴颜色和宽度
			gridLineColor:'#426666',
			gridLineWidth:1,
			//gridLineDashStyle:'dot',
			//tickColor:parameters.yAxis_colors[i],//刻度颜色
			title: {
				text: parameters.yAxis_names[i],	
			},
			tickPositions:tickPositions,
			tickInterval: tickInterval,
			/*
			plotLines: parameters.plotLines[i],
			labels: {
				y: 2,
                style: {
                	color: parameters.yAxis_scale_colors[i],
                	font:'Microsoft YaHei, Arial, Helvetica, sans-serif',
                }
            },
            tickPositions:tickPositions,
            tickLength:5,
            tickWidth: 1,
			minorGridLineWidth: 0,
			minorTickInterval: min_tick,//小刻度
            minorTickLength: 3,
            minorTickWidth: 1, 
            */
			opposite:i==1?true:false,
			reversed:parameters.yAxis_reversed,
			startOnTick: yAxis_min === null ? true : false,
			endOnTick: yAxis_max === null ? true : false,
			max: yAxis_max,
			min: yAxis_min,
			labels : {
				useHTML:false  //bowen.yin 若设为TRUE，则labels会显示在tooltip中
			}
		};

		// (#36544 20160301 by zuoyong.tang) 曲线的轴修改成白色
		if(!parameters.contain_column)
		{
			yAxis_ = $.extend(yAxis_, {
				lineWidth:1,
				lineColor: 'white',//y轴的坐标轴颜色和宽度
				gridLineColor:'white', // '#426666'
				gridLineDashStyle:'dot',
				tickPositions:tickPositions,
	            tickLength:5,
	            tickWidth: 1,
				tickColor: 'white',
				minorTickColor: 'white',
				minorGridLineWidth: 0,
				minorTickInterval: min_tick,//小刻度
	            minorTickLength: 3,
	            minorTickWidth: 1
			});
		}

		yAxis.push(yAxis_);
		tickPositions=[];
	}
	series_return.yAxis=yAxis;
	var series=[];//初始化曲线条数
	for (var i = 0; i <parameters.curve_count; i++) {
		series.push(
		{
			//(#25255 pattern把线宽改成1.5px)
			lineWidth:parameters.contain_column == true ? 2 : 1.5,
			yAxis:parameters.to_yAxiss[i],
			dashStyle:(parameters.dash_style && parameters.dash_style[i])? parameters.dash_style[i] : null,
			name: "curve" + i,//parameters.curve_names[i],
			data: {
			},
			stack: parameters.use == "curve_tool" ? null :parameters.group_belonged[i],

			//计算类型
			arith_type: parameters.arith_type[i],

			//使柱状图实现渐变色的效果(只为柱状图添加效果，line图没添加) bowen.yin 2014-9-22
			color: parameters.use == "curve_tool" ? parameters.curve_colors[i] : parameters.curve_style[i] == 'column' ? (parameters.group_belonged[i] == parameters.group_names[1] ? {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 1,
						y2: 0
					}, //横向渐变效果 如果将x2和y2值交换将会变成纵向渐变效果
					stops: [
						[0, Highcharts.Color(parameters.curve_colors[i]).setOpacity(1).get('rgba')],
						[0.5, Highcharts.Color(parameters.curve_colors[i]).setOpacity(0.6).get('rgba')],
						[1, Highcharts.Color(parameters.curve_colors[i]).setOpacity(1).get('rgba')]
					]
				} : {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 1,
						y2: 0
					}, //横向渐变效果 如果将x2和y2值交换将会变成纵向渐变效果
					stops: [
						[0, Highcharts.Color(parameters.curve_colors[i]).setOpacity(1).get('rgba')],
						[0.5, Highcharts.Color(parameters.curve_colors[i]).setOpacity(0.6).get('rgba')],
						[1, Highcharts.Color(parameters.curve_colors[i]).setOpacity(1).get('rgba')]
					]
				}) : parameters.curve_colors[i]
			//pointStart: Date.UTC(2010, 0, 1),
            //pointInterval: 3*24 * 3600 * 1000
		});
	}
	series_return.series=series;
	return series_return;
}
//刷新历史曲线的时候，要求重新求一下当前合适的高宽
function get_adpt_width(width,height)
{
	//如果是曲线查询页面，不执行
	if(typeof g_width_svg_related == 'undefined' || g_width_svg_related=={})
	{
		return [width,height];
	}else if(!g_width_svg_related.width || !g_width_svg_related.height || !g_width_svg_related.svg_W ||!g_width_svg_related.svg_H){
		return [width,height];		
	}else{
		var rate_x=g_width_svg_related.width/g_width_svg_related.svg_W;
		var rate_y=g_width_svg_related.height/g_width_svg_related.svg_H;
		return [width*rate_x,height*rate_y];
	}
}
//刷新历史曲线的时候，要求重新求一下当前合适的margin
function get_adpt_margin(parameters)
{
	//如果是曲线查询页面，不执行
	var margin=[curve_marge.top,
	            curve_marge.bottom,
	            ];
				
	if(typeof g_width_svg_related == 'undefined' || g_width_svg_related=={})
	{	1;//不用自适应，不处理
	}else if(!g_width_svg_related.width || !g_width_svg_related.height || !g_width_svg_related.svg_W ||!g_width_svg_related.svg_H){
		1;//没有reseze，暂不处理
	}else{
		var rate_x=g_width_svg_related.width/g_width_svg_related.svg_W;
		var rate_y=g_width_svg_related.height/g_width_svg_related.svg_H;
		margin[0] *= rate_y;
		margin[1] *= rate_y;
	}

	margin[0] += (parameters.is_display_legend ? curve_marge.top_legend : 0); //bowen.yin
	margin[0] += (parameters.title_display ? (parameters.is_tab_title == "true" ? curve_marge.top_title + 15 : curve_marge.top_title) : 0); //bowen.yin 修改
	margin[1] += (parameters.is_display_legend ? curve_marge.bottom_legend : 0);
	if(parameters.is_display_legend)
	{//bottom不做限制
		margin[1] = null;
	}
	return margin;
}
//根据曲线宽度计算字体大小
//曲线越宽，文字越大
function get_adpt_font(old_size, width, max_len)
{
	
	if(!width || max_len * old_size < width)//如果曲线够宽，不用缩放
	{
		return old_size;
	}else
	{
		return Math.max(width/max_len, 9);//tooltip，最小为9px
	}
	
//	if(typeof g_width_svg_related == 'undefined' || g_width_svg_related=={})
//	{	
//		return old_size;
//	}else if(!g_width_svg_related.width || !g_width_svg_related.height || !g_width_svg_related.svg_W ||!g_width_svg_related.svg_H){
//		return old_size;
//	}else{
//		if(width > 500)//曲线如果够宽，不会缩放字体
//		{
//			return old_size;
//		}
//		var rate_x=g_width_svg_related.width/g_width_svg_related.svg_W;
//		var rate_y=g_width_svg_related.height/g_width_svg_related.svg_H;
//		rate_x = Math.min(rate_x,rate_y);
//		if(rate_x < 1)
//		{
//			rate_x += (1 - rate_x) * (width- 200) / 500;//曲线宽度越小，字体越小
//		}
//		return old_size*rate_x;
//	}
}
/*
 * 根据highcharts生成曲线
 * 输入：生成highcharts所需要的参数
 * 输出：无
 */
function par2div(parameters)
{	
	var series_return=pre_curve(parameters);

	var this_chart_left = 0; //当前chart相对于网页左上角的left值
				var this_chart_top = 0; //当前chart相对于网页左上角的top值
				//var pointer_chart_left = 0; //鼠标相对于plot的left值
				//var pointer_chart_top = 0; //鼠标相对于plot的top值

				//ps:bowen.yin
				//跨浏览器事件对象
				var EventUtil = {
					addHandler: function(elem, type, handler) {
						if (elem.addEventListener) {
							elem.addEventListener(type, handler, false);
						} else if (elem.attachEvent) {
							elem.attachEvent("on" + type, handler);
						} else {
							elem["on" + type] = handler;
						}
					},
					removeHandler: function(elem, type, handler) {
						if (elem.removeEventListener) {
							elem.removeEventListener(type, handler, false);
						} else if (elem.detachEvent) {
							elem.detachEvent("on" + type, handler);
						} else {
							elem["on" + type] = null;
						}
					},
					getEvent: function(event) {
						return event ? event : window.event;
					},
					getTarget: function(event) {
						return event.target || event.srcElement;
					},
					preventDefault: function(event) {
						if (event, preventDefault) {
							event.preventDefault();
						} else {
							event.returnValue = false;
						}
					},
					stopPropagation: function(event) {
						if (event.stopPropagation) {
							event.stopPropagation();
						} else {
							event.cancelBubble = true;
						}
					}
				};

				var chart_div = document.getElementById("" + parameters.curve_div);
				EventUtil.addHandler(chart_div, "mousemove", function(event) {
					event = EventUtil.getEvent(event);
					var pageX = event.pageX;
					var pageY = event.pageY;
					if (pageX == undefined) {
						pageX = event.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
					}
					if (pageY == undefined) {
						pageY = event.clientY + document.body.scrollTop || document.documentElement.scrollTop;
					}
					//console.log("Page coordinates: " + pageX + "," + pageY);
					this_chart_left = $("#env_left").outerWidth() + parseFloat($('#' + parameters.curve_div).css('left'));
					this_chart_top = parseFloat($('#' + parameters.curve_div).css('top'));
					pointer_chart_left = pageX - this_chart_left;
					pointer_chart_top = pageY - this_chart_top;
				});

	$('#'+parameters.curve_div).empty();
	var width_height = get_adpt_width(parameters.width,parameters.height);//为画面刷新的问题
	var margin=get_adpt_margin(parameters);//为画面刷新的问题
		

	//$.ajaxSetup({async: false,cache:false});
	$('#'+parameters.curve_div).envcharts({
		exporting: {//导出按钮
			enabled: false,//parameters.export_btn,
		},
	    rangeSelector: {
	    	enabled: false,
            selected: 1,
            inputEnabled: false
        },
		chart: {//曲线区选项
			renderTo: parameters.curve_div,
			alignTicks: parameters.alignTicks,
			borderRadius:4,
			zoomType:parameters.zoomType,
			backgroundColor: parameters.use == "curve_tool" ? null :'rgba(12,35,42,0)',//当为曲线查询页面时不要背景，否则使用主题背景 
			borderColor:parameters.use == "curve_tool" ? null :parameters.border_color,
			borderWidth:(parameters.use == "curve_tool") || (parameters.borderWidth == 0) ? null :parameters.borderWidth,
			style: (parameters.use == "curve_tool") || (parameters.borderWidth == 0) ? null : {
                //boxShadow: '0px 0px 10px 5px rgba(19,49,57,0.5) inset',
                borderRadius:'3px'
            },
		    //plotBorderColor : null,
		    //plotBackgroundColor: null,
		    //plotBackgroundImage:null,
		    //plotBorderWidth: 0,
		    //plotShadow: false,  
			//plotBackgroundColor:parameters.coord_bgcolor,
			height:width_height[1],
			width:width_height[0],
			type: parameters.curve_smooth,//
			animation: Highcharts.svg, // don't animate in old IE
			marginTop: parameters.v_curve ? null : margin[0],
			marginBottom:parameters.v_curve ? null : margin[1],
			marginRight: (parameters.yAxis_count==1 || !parameters.yAxis_isMulti) ? 40 : null //双y轴也有可能第2个轴没有曲线
		},
		credits: {//版权信息
			enabled: false
		},
		title: {//框标题
			enabled:parameters.title_display,
			text: parameters.title_display?parameters.title:'',//enabled设为false没有用，这是个bug
			style:{
				curve_type:"4096",
				//color:parameters.title_color,
				font:'bold '+ parameters.title_font_size+' "'+parameters.title_font_family+'", Verdana, sans-serif'
			},
		},
		legend :parameters.use != "curve_tool" ? {//图例:如果为曲线查询页面保留原有的图例样式，否则使用新样式
			borderWidth: 0,
			//symbolHeight:8,
			//symbolWidth:8,
			//symbolRadius:4,
			//width:parameters.is_tab_title == "true" ? 370 : null ,
			enabled:parameters.is_display_legend,
			y: parameters.title_display? 30 : -5 ,  //bowen.yin
			x:-10,
			maxHeight: 60
		} : {
			borderWidth: 0,
			floating: false,
			y: 0,
			enabled:parameters.is_display_legend,
			align: "center",
			verticalAlign: "bottom",
			margin:4,
			padding:3,
			useHTML:false
			/*
			navigation: { //导航设置
				activeColor: '#3E576F', //分页箭头颜色（可用）
				animation: false, //是否有动态效果
				arrowSize: 12, //箭头大小
				inactiveColor: '#CCC', //分页箭头颜色（不可用）
				},
			*/
//			labelFormatter:function(){
//				var color=this.index%2?'':'color:red;';
//				color='';
//				return '<span style='+color+'>'+this.name+'</span>';
//			},
			//itemWidth:parameters.width/2-15,
			//align:'left',
		},
		plotOptions: { //绘图线条控制  
			column: {
				//pointWidth: 23, //控制每条柱子的宽度
				pointWidth: '1' == parameters.need_grained ? null : 18,//(parameters.group_names && parameters.group_names.length == 1 && parameters.is_stack == "normal") ? 23 :null,
				stacking: parameters.is_stack,
				dataLabels: {
					enabled: true,
					x: -6,
					y: -20,
					color:'rgba(255,255,255,0)',
					formatter:function(){
						if(this.y != 0) return "";
						else return this.y;
					}
				},
				borderWidth: 0
			},
			series: {

				//修改highcharts的tooltip导致legend不可点击的bug。 bowen.yin 2014-10-16
				point: {
					events: {
						mouseOver: function() {
							$("#" + parameters.curve_div + " g.highcharts-tooltip").css('display', 'block');
							$("#" + parameters.curve_div + " div.highcharts-tooltip").css('opacity', '1');
							
							var li = $("#" + parameters.curve_div).closest('li.svg_scroll_x');
							if(!li.attr('z_index'))
							{
								var z_index = li.css('z-index');
								li.attr('z_index', z_index);
							}

							li.css('z-index', 100);
						}
					}
				},
                events: {
                    mouseOut: function () {
                    	$("#" + parameters.curve_div + " g.highcharts-tooltip").css('display', 'none');
                        $("#" + parameters.curve_div + " div.highcharts-tooltip").css('opacity', '0');		

                        var li = $("#" + parameters.curve_div).closest('li.svg_scroll_x');
						var z_index = li.attr('z_index');
						if(z_index)
						{
							li.css('z-index', parseInt(z_index));
						}
                    }
                },

				//allowPointSelect :true,//是否允许选中点  
				animation: false, //是否在显示图表的时候使用动画  
				//cursor:'pointer',//鼠标移到图表上时鼠标的样式  
				dataLabels: {
					//enabled :true,//是否在点的旁边显示数据  
					rotation: 0
				},
				marker: {
					enabled: parameters.contain_column == true ? true : false, //是否显示点
					radius: 4, //点的半径  
					//fillColor:"#888"  
					//symbol: 'url(http://highcharts.com/demo/gfx/sun.png)',//设置点用图片来显示  
					states: {
						hover: {
							enabled: parameters.contain_column == true ? true : false //鼠标放上去点是否放大  
						},
					},
				},
				states: {
					hover: {
						enabled: parameters.contain_column == true ? true : false, //鼠标放上去线的状态控制  
						lineWidth: 3
					}
				},
			},
		},
		tooltip: //提示框  若不包含柱状图则使用原来的tooltip样式，否则使用新的tooltip样式 bowen.yin
		parameters.contain_column != true ? {
			backgroundColor: null,
			borderColor: null,
			borderWidth: 0,
			shadow: false,
			animation: false,
			enabled: true,
			crosshairs: {
				width: 2,
				dashStyle: "shortdot",
				color: "white"
			},
			style: {
                zIndex: 20
            },
			shared: true,
			formatter: function() {
				var x = this.x;

				//xy曲线暂不考虑差值问题
				if(x < 1000000000)
				{
					if (x > 1000000000) {
						x = new Date(x - g_time_area * 3600000).format();
						x = x.replace(':00', '');
					} else {
						//des_x=this.points[0].series.chart.xAxis[0].axisTitle.text;//"x轴描述";
					}
					var max_len = x.length;
					x = '<b style="color:#ffffff; z-index: 20;">' + x + '</b>'; //第一行：时间
					$.each(this.points, function(i, point) {
						var y = point.y;
						y = point.series.name + ': ' + g_num_add_comma.add_remove_comma(y);
						max_len = Math.max(max_len, y.length);
						x += '<br/><span style="color:' + point.series.color + '">' + y + '</span>'; //每行的内容
					});

					var width_curve = this.points[0].series.chart.chartWidth - this.points[0].series.chart.optionsMarginRight;
					var s = '<span style="font-size:' + get_adpt_font(g_curve_font_size, width_curve, max_len) + 'px"' +
						' class="high_font">' + x + '</span>';
					return s;
				}

				//(#23028 20141127 by zuoyong.tang差值曲线的tooltip要显示时间差)
				else
				{
					//(#23992 20150104改为采用refresh_time作为间隔)
					//对于可能有差值的情况，做一些运算
					var subtracts = [];
					$.each(this.points, function(i, point) {
						var last_time = x

						if(point.series.userOptions.arith_type == 'subtract')// && parameters.refresh_time != g_day_micsecs)
						{
							last_time = x + parameters.refresh_time;

							if('1' == parameters.need_grained && 'yYallALL'.indexOf(parameters.now_range) >= 0)
							{
								//对于当年和总发电量的情况，计算下一个点的时间
								last_time = graph_curve_extend.get_next_point(parameters.now_range, x);
							}
						}

						subtracts.push({
							last_time: last_time,
							point: point
						});
					});

					//按时间差值排序
					subtracts.sort(function(a, b){
						return b.last_time - a.last_time;
					});

					var now_subtract = -2;
					var time = new Date(x - g_time_area * 3600000).format().replace(':00', '');
					var max_len = x.length;

					var str = '';
					$.each(subtracts, function(i, point) {
						var last_time = point.last_time;
						var point = point.point;
						if(last_time != now_subtract)
						{
							now_subtract = last_time;

							var interval = parameters.refresh_time;
							if(last_time > x && interval && interval < g_day_micsecs)
							{
								//对于小时级的差值曲线，由于之前调大了时间，现在应调小一点
								x -= interval / 2;
								last_time -= interval / 2;
							}

							var time = new Date(x - g_time_area * 3600000).format().replace(':00', '');
							
							if(last_time > x)
							{
								//以下是差值的情况
								var second_time = new Date(last_time - g_time_area * 3600000).format().replace(':00', '');

								if(parameters.refresh_time == g_day_micsecs)
								{
									//差值曲线，如果采样周期为1天，tooltip中只显示对应天的日期 01/05/2015，不显示时间
									time = time.split(' ')[0];
									//second_time = second_time.split(' ')[0];
								}
								else
								{
									if(0 == parameters.refresh_time % g_day_micsecs && parameters.show_start_time && 0 == parameters.show_start_time % g_day_micsecs)
									{
										//如果采样周期是整天，则不显示时分：01/05/2015 ~ 02/01/2015
										time = time.split(' ')[0];

										//时间应往前推一天
										second_time = new Date(last_time - 1 - g_time_area * 3600000).format().replace(':00', '');
										second_time = second_time.split(' ')[0];
									}
									else if(parameters.refresh_time < g_day_micsecs)
									{
										if(parameters.show_start_time && parameters.show_end_time - parameters.show_start_time <= 86400000)
										{
											//如果采样周期为小于1天，并且总时间跨度在1天以内，tooltip中显示格式为 09:00 ~ 10:00
											time = time.split(' ')[1];
											second_time = second_time.split(' ')[1];
										}
									}
									time += ' ~ ' + second_time;
								}
							}
							else
							{
								if(parameters.refresh_time < g_day_micsecs)
								{
									if(parameters.show_start_time && parameters.show_end_time - parameters.show_start_time <= 86400000)
									{
										//如果采样周期为小于1天，并且总时间跨度在1天以内，tooltip中显示格式为 09:00 ~ 10:00
										time = time.split(' ')[1];
									}
								}
							}

							max_len = Math.max(max_len, time.length);
							str += '<br/><br/><b style="color:#ffffff; z-index: 20;">' + time + '</b>'; //时间
						}
						var y = point.y;
						y = point.series.name + ': ' + g_num_add_comma.add_remove_comma(y);
						max_len = Math.max(max_len, y.length);
						str += '<br/><span style="color:' + point.series.color + '">' + y + '</span>'; //每行的内容
					});

					str = str.replace(/^<br\/><br\/>/, '');

					var width_curve = this.points[0].series.chart.chartWidth - this.points[0].series.chart.optionsMarginRight;
					var str = '<span style="font-size:' + get_adpt_font(g_curve_font_size, width_curve, max_len) + 'px"' +
						' class="high_font">' + str + '</span>';
					return str;
				}
				
			},
			useHTML: true,
			valueDecimals: parameters.decimals[0],
			xDateFormat: parameters.x_Format_tooltip,
			pointFormat: '{series.name}: <b>{point.y}</b><br/>',
			valueSuffix: "", //提示框后缀
		} : {
			/*
			(#24380 20150108 by zuoyong.tang)
			1、对于差值曲线（或柱状图）
			    A、如果采样周期为1天，tooltip中只显示对应天的日期 01/05/2015，不显示时间
			    B、如果采样周期为 >1天（可能是1.5天），tooltip显示 01/05/2015 00:00 ~ 02/01/2015 00:00，如果采样周期是整天，则不显示时分：01/05/2015 ~ 02/01/2015
			    C、如果采样周期为小于1天，并且总时间跨度在1天以内，tooltip中显示格式为 09:00 ~ 10:00，如果时间跨度大于1天，仍显示 01/05/2015  09:00 ~ 01/05/2015 10:00
			2、对于非差值曲��（或柱状图）
			    A、如果采样周期 >=1天，tooltip中只显示与以前一样：01/05/2015  00:00
			    B、如果采样周期 <1天，并且总时间跨度在1天以内，tooltip中只显示格式为 09:00，如果时间跨度大于1天，仍显示 01/05/2015  09:00
			*/
			//followPointer: this.series.type == "column" ? true : null,
			positioner: function(boxWidth, boxHeight, point) {
				var chart = this.chart,
					plotLeft = chart.plotLeft,
					plotTop = chart.plotTop,
					plotWidth = chart.plotWidth,
					plotHeight = chart.plotHeight,
					distance = 5
					chartWidth = parseFloat($('#' + parameters.curve_div).css('width')),
					x = pointer_chart_left - boxWidth / 2,
					y = parameters.is_stack == "normal" ? point.plotY + 27 : point.plotY + 46;
				
				//tooltip超出上边界
				if (y < 38) {
					x = pointer_chart_left - boxWidth / 2;
					y = pointer_chart_top - boxHeight - 5;
				};

				//tooltip超出左边界
				if (x < 0) {
					x = 5;
				};

				//tooltip超出右边界
				if (x + boxWidth > chartWidth) {
					x = x - ((x + boxWidth) - chartWidth + 8);
				};

				return {
						x: x,
						y: y
					};
			},
			formatter: function() { //bowen.yin tip时间格式修改(有柱状图的情况)
				var x = this.x;
				if (x > 1000000000) {
					x = new Date(x - g_time_area * 3600000).format();
					x = x.replace(':00', '');

					if(this.series.userOptions.arith_type == 'subtract' && parameters.refresh_time == g_day_micsecs)
					{
						//差值曲线（或柱状图）如果采样周期为1天，tooltip中只显示对应天的日期 01/05/2015，不显示时间
						x = x.split(' ')[0];
					}

					if(this.series.userOptions.arith_type != 'subtract')
					{
						//对于非差值曲线，总时间跨度在1天以内，tooltip中只显示格式为 09:00
						if(parameters.show_start_time && parameters.show_end_time - parameters.show_start_time <= 86400000)
						{
							x = x.split(' ')[1];
						}
					}
				} else {
					//des_x=this.points[0].series.chart.xAxis[0].axisTitle.text;//"x轴描述";
				}

				var max_len = x.length;
				x = '<b>' + x + '</b>'; //第一行：时间

				//(#23028 20141127 by zuoyong.tang差值曲线的tooltip要显示时间差)
				//对于“差值”的柱子，需要求出当前点的上一个点时间
				//此方法可行的前提是：把无效点填充为null或者上个有效值
				//前提是：时间是有序的
				//如果没有上一个点，则用下一个点的间隔，再没有，则用parameters.refresh_time
				//(#23992 20150104改为采用refresh_time作为间隔)

				//差值曲线（或柱状图）如果采样周期为1天，tooltip中只显示对应天的日期 01/05/2015，不显示前后时间
				if(this.series.userOptions.arith_type == 'subtract' && parameters.refresh_time != g_day_micsecs)
				{
					x = this.x;
					var last_time = x + parameters.refresh_time;

					if('1' == parameters.need_grained && 'yYallALL'.indexOf(parameters.now_range) >= 0)
					{
						//对于当年和总发电量的情况，计算下一个点的时间
						last_time = graph_curve_extend.get_next_point(parameters.now_range, x);
					}

					var interval = parameters.refresh_time;
					if(interval && interval < g_day_micsecs)
					{
						//对于小时级的差值曲线，由于之前调大了时间，现在应调小一点
						x -= interval / 2;
						last_time -= interval / 2;
					}

					x = new Date(x - g_time_area * 3600000).format().replace(':00', '');
					second_time = new Date(last_time - g_time_area * 3600000).format().replace(':00', '');

					if(0 == parameters.refresh_time % g_day_micsecs && parameters.show_start_time && 0 == parameters.show_start_time % g_day_micsecs)
					{
						//如果采样周期是整天，则不显示时分：01/05/2015 ~ 02/01/2015
						x = x.split(' ')[0];

						//时间应往前推一天
						second_time = new Date(last_time - 1 - g_time_area * 3600000).format().replace(':00', '');
						second_time = second_time.split(' ')[0];
					}
					else if(parameters.refresh_time < g_day_micsecs)
					{
						if(parameters.show_start_time && parameters.show_end_time - parameters.show_start_time <= 86400000)
						{
							//如果采样周期为小于1天，并且总时间跨度在1天以内，tooltip中显示格式为 09:00 ~ 10:00
							x = x.split(' ')[1];
							second_time = second_time.split(' ')[1];
						}
					}

					x = '<b>' + x + ' ~ ' + second_time + '</b>'; //第一行：时间
				}
				
				if (this.series.options.stack && this.series.options.stack != '') {
                	var group_str = '(' + this.series.options.stack + ')'; //区分属于哪一个分组的字符串

				} else {
                	var group_str = '';    
				}

				if (this.series.type == "column" && parameters.is_stack == "normal") { //若为柱状图，添加总量信息
					var tip = '' + x + '<br/>' + this.series.name + ':' + g_num_add_comma.add_remove_comma(this.y) + '&nbsp;' + group_str + '<br/>' 
							+ JSLocale.total_pawer_loss + g_num_add_comma.add_remove_comma(this.point.stackTotal) + '<br/>';
				} else {
					var tip = '' + x + '<br/>' + this.series.name + ':' + g_num_add_comma.add_remove_comma(this.y) + '&nbsp;' + group_str + '<br/>';
				}

				return tip;

			},
			useHTML: true,
			style :{
				zIndex: 20
			}
		},
		xAxis: {//x轴设置
			lineWidth: parameters.contain_column ? undefined : 1, //parameters.xAxis_width,
			lineColor: parameters.contain_column ? undefined : 'white', //parameters.coord_color,
			//gridLineColor:parameters.grid_color,
			//gridLineWidth:parameters.gridLineWidth,
			//gridLineDashStyle:'dot',
			type:parameters.data_type_x,
			title: {
				text: null//parameters.xAxis_name,
			},
			labels: {
				maxStaggerLines: 1,
				overflow: "justify",
                style: {
                	//color: parameters.scale_color
                	},
                step: (parameters.use == "curve_tool" ? 2 :1),//(#20446)
                	
                //设置x轴（时间）的格式
				formatter: function() {
					return set_xAxis_time_foramt(this, parameters);
				},
				
				//#24743
				y:15,
                useHTML: true//parameters.curve_type != 4096
            },
            tickLength: 4,
            tickWidth: 1,
            tickColor: parameters.contain_column ? '#104a69' : 'white',
            //(#20024)
            //x坐标生成：只显示首尾
            tickPositioner: (parameters.use == "curve_tool" || parameters.curve_type > 4098) ? null : function () {
					var min = this.dataMin, max = this.dataMax;
					if (min !== null && max !== null) {

						if('1' == parameters.need_grained && 'mMyYallALL'.indexOf(parameters.now_range) >= 0)
						{
							//对于当月当年和总发电量的分隔数的特列算法
							return graph_curve_extend.get_tickPositioner(parameters.now_range, min, max)
						}

						if(parameters.xAxis_interval)
						{
							//实时刷新曲线不应该用show_start_time，而应该用数据自带的范围
							if(parameters.refresh_time < g_day_micsecs && parameters.curve_type != 4096)
							{
								min = parameters.show_start_time;
								max = parameters.show_end_time;
							}

							var interval = (parseFloat(max) - parseFloat(min)) / parameters.xAxis_interval;

							var tickPositions = [];
							tickPositions.push(min);
							for(var i_tick = 1; i_tick < parameters.xAxis_interval; i_tick++) 
							{
					        	var now = min + interval * i_tick;
					        	now = math_round2(now, 2);
					        	if(Math.abs(parseInt(now) - now) < 0.01)
					        	{
					        		now = math_round2(now, 1);
					        	}
					        	tickPositions.push(now);
					        }
					        tickPositions.push(max);
					        return tickPositions;
						}
						return [min, max];
					}
					return [];
				
            },
            
            //如果全是插值曲线，且间隔<86400
            //否则由于tick在data之外，first和last会不显示
            startOnTick: !parameters.no_half_tick,
            endOnTick: !parameters.no_half_tick,

            dateTimeLabelFormats:parameters.x_Format,
			min:parameters.xAxis_min,
			max:parameters.xAxis_max,
			//tickColor:parameters.coord_color,
			//tickPixelInterval:200,//parameters.xAxis_interval,
			offset:parameters.offset_x,
			//showLastLabel:parameters.showLastLabel=='false'?false:true,
			
		},
		yAxis: parameters.yAxis_count==1?series_return.yAxis[0]:series_return.yAxis,//y轴设定
		series: series_return.series//曲线空数据初始化
	});
	//$.ajaxSetup({async: true,cache:true});
	if(parameters.use!="curve_tool"){set_tab_title(parameters);}
}

//(#23028 20141127 by zuoyong.tang差值曲线的tooltip要显示时间差)
//计算差值曲线的差值
function cal_subtract(x, series, refresh_time)
{
	var last_time = x;
	var x_s = series.xData;
	if(typeof x_s != 'object' || x_s.length <= 1)
	{
		last_time = x - refresh_time;
	}
	else if(x == x_s[0])
	{
		last_time = x - (x_s[1] - x);
	}
	else
	{
		for(var i = 0; i < x_s.length; i++)
		{
			if(x == x_s[i])
			{
				last_time = x_s[i - 1];
			}
		}
	}

	return last_time;
}

//(#23028 20141127 by zuoyong.tang差值曲线的tooltip要显示时间差)
//计算差值曲线的差值
function cal_series_invertal(data)
{
	var interval = 0;
	if(typeof data != 'object' || data.length <= 1)
	{
		interval = 0;
	}
	else
	{
		interval = get_milliseconds(data[1].x) - get_milliseconds(data[0].x);
	}

	return interval;
}

/*
 * 设置x轴（时间）的格式
 * 1、如果svg中配置了hide_xAxis，则不显示
 * 2、xy曲线不处理
 * 3、v_graph中的实时、历史曲线，如果svg中有配置time_format，则使用time_format的格式，否则，用（4）中的格式
 * 4、v_graph中没有time_format的曲线、v_curve中的曲线，时间格式为：
 * （如果显示完整的时间，当时间跨度为17小时的时候v_curve页面会重叠）
 */
function set_xAxis_time_foramt(curve_tick, parameters){
	//1
	if(parameters.is_hide_xAxis)return '';
	
	//2 非时间曲线
	if(curve_tick.value < 1000000000)
	{
		return g_num_add_comma.add_remove_comma(curve_tick.value);
	}
	
	//3 graph*********************************************************************************
	if(parameters.time_format_svg)
	{
		if (!curve_tick.isFirst && !curve_tick.isLast && parameters.xAxis_interval == 1) {
			return '';
		}else{
			var time = new Date(curve_tick.value-g_time_area*3600000).format_mini(null, parameters.time_format_svg, parameters.timezone);
			
			//时区显示在“天”的00点
			if('1' == parameters.need_grained && 'dD'.indexOf(parameters.now_range) >= 0 && curve_tick.isFirst)
			{
				time += ' ' + fill_UTC_area(parameters.timezone, g_field_date.need_time_zone);
				
				var time_length = time.length;
				if (time_length >= 7) {
					for(var i = 0; i < time_length - 7; i++)
					{
						time = '&nbsp;&nbsp;' + time;
					}
				}
			}

			//对于“总”数据，如果中间出现有半年的情况，则不显示其标签
			if('1' == parameters.need_grained && 'allALL'.indexOf(parameters.now_range) >= 0 && new Date(curve_tick.value-g_time_area*3600000).getMonth() != 0)
			{
				time = '';
			}
			return time;
		}
	}
	
	//4
	else
	{
		var time = new Date(curve_tick.value-g_time_area*3600000).format();
		
		//尽量删除为0的时间
		//前提是时间部分不能是别的格式
		time = time.replace(/ 00:00:00$/,'');
		time = time.replace(/:00$/,'');
		
		//由于highcharts的bug，只设置2个值的时候，中间也会多出一个刻度，手动修改此刻度为空
		if (!curve_tick.isFirst && !curve_tick.isLast && parameters.xAxis_interval == 1) 
		{
			return '';
		}

		//总时间在一天内，去掉日期部分，如果时间字符太长的话
		if(curve_tick.axis.dataMax - curve_tick.axis.dataMin < 86400000 && time.length > 15)
		{ 
			//(#24245 20140105 by zuoyong.tang)
			//请求的时间跨度也小于1天的时候才取小时
			if(parameters.show_start_time && parameters.show_end_time - parameters.show_start_time < 86400000)
			{
				time = time.split(' ')[1];
			}
		}
		
		if(parameters.use == "curve_tool")
		{//tickPositions.length包含了没有lebel的吗？是的
			if(curve_tick.isLast || curve_tick.isFirst)//最后一个只要日期就可以
			{
				time = '';
			}
		}
		else if(curve_tick.isFirst && parameters.timezone != undefined && g_field_date.need_time_zone)
		{
			time += ' ' + fill_UTC_area(parameters.timezone, g_field_date.need_time_zone);
			//处理X轴标签跑到曲线框外面去的问题
			if (parameters.contain_column != true) {
				if (time.length >= 17) {
					time = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + time;
				}
			}
		}
//		if(time.split(' ').length > 1){
//			time = time.split(' ')[0]+'<br/>'+time.split(' ')[1];
//		}
		return time;
	}
}

function load_curve_data(parameters, firstGet)//加载曲线数据
{   
	var to_ws_data=pars2josn(parameters);

	var svg_options = $('#svg_content_' + parameters.svg_name).svg_options();
	
	if(firstGet && svg_options && 'scroll_x' == svg_options.type)
	{
		var container = parameters.svg_name;
		container = container.match(/_([^_]*)$/)[1];
		if(container)
		{
			if(container < 7)
			{
				container = container * 2000;
			}
			else
			{
				container = container * 2000;
			}
		}
	}
	
	container = container || 0;
	
	function getOldCurve()
	{
		ws_get_old_curve(to_ws_data,function f3(data){handle_old_curve(parameters,data);});
	}
	
	//向ws请求曲线的初始化数据（同步）
	setTimeout(function(){
		getOldCurve();

		// (#36165 20160121 by zuyong.tang) 即使曲线失败，下次也要再请求
		if(parameters.curve_type != "4096" && parameters.curve_type <= "4098")//别的非XY曲线
		{
			timeout_id["curve_"+parameters.svg_id]=setTimeout("refresh_history_curve('"+parameters.svg_id+"','"+parameters.svg_name+"')",my_history_curve_refresh_time);//实时刷新
		}
	}, container);
	
	
	//至少时间切换的时候是不需要redraw的
	if(!parameters.not_redraw)
	{
		$('#'+parameters.curve_div).highcharts().redraw();
	}
}

//生成ws请求数据
function pars2josn(parameters)
{
	var curve=[];

	for (var i = 0; i < parameters.curve_count; i++)
	{
		if(parameters.is_valid && !parameters.is_valid[i])//对于没有声明动态字的曲线，不请求
		{
			continue;
		}
		curve.push({
			id:""+i,
			key_x:parameters.dyn_params_x[0],
			decimal_x:parameters.decimals_x[0],
			sub_type_x:parameters.sub_types_x[0],
			key:parameters.dyn_params[i],
			decimal:parameters.decimals[i],
			sub_type:parameters.sub_types[i],
			arith_type:parameters.arith_type[i]
		});
	}

	var time_mode="0";
	if((parameters.start_time&&parameters.start_time.indexOf("{")<0) || '1' == parameters.need_grained)
	{
		time_mode="1";
	}

	var to_ws_data={
		id:parameters.svg_id,
		branch_para_list:"",//" F01.T1_L2.WTG002",
		template_para_list:"",//" F01.T1_L2.WTG001",
		sample_cycle:""+parameters.refresh_time/1000,
		curve_type:parameters.curve_type,
		time_mode: time_mode,
		curve:curve,
	};
	if(has_url(parameters.svg_name))
	{
		to_ws_data.branch_para_list=get_branch_par(parameters.svg_name);
		to_ws_data.template_para_list=$("#svg_content_"+parameters.svg_name+' svg').attr('template_para_list');
	}
	
	if(parameters.start_time)
	{
		to_ws_data.start_time=parameters.start_time;
		to_ws_data.end_time=parameters.end_time;
	}

	//对于设置时间范围的情况
	if('1' == parameters.need_grained)
	{
		var start_end = graph_curve_extend.get_sys_time_range(parameters.now_range, parameters.now_time_index);
		graph_curve_extend.show_now_range_str(parameters.curve_div, start_end.now_range_str, parameters.now_range);
		to_ws_data.start_time = start_end.start_time;
		to_ws_data.end_time = start_end.end_time;

		var sample_cycle = graph_curve_extend.get_curve_interval(parameters.now_range);
		to_ws_data.sample_cycle = sample_cycle.sample_cycle;
		to_ws_data.interval_type = sample_cycle.interval_type;
		parameters.refresh_time = sample_cycle.interval_seconds * 1000;
		parameters.xAxis_interval = graph_curve_extend.get_label_x_division(parameters.now_range);
		parameters.time_format_svg = graph_curve_extend.get_label_time_format(parameters.now_range);
	}

	to_ws_data.common_curve = parameters.common_curve;

	return to_ws_data;
}
//设置曲线的时间格式函数，添加右下角时区信息
function curve_time_format(chart,data,parameters)
{
	if(parameters.curve_type>4098) return;//x,y曲线不用设置时间格式
	Highcharts_dateFmt();
	
	if(!parameters.v_curve&&data.timezone!=undefined)//把时区加入参数信息
	{
		parameters.timezone=data.timezone;
	}
}

function Highcharts_dateFmt()
{
	Highcharts.dateFormats = {
			Y: function(timestamp){
				return new Date(timestamp-g_time_area*3600000).format_yy();
			},
			H: function(timestamp){
				return new Date(timestamp-g_time_area*3600000).format();
			},
			s: function(timestamp){
				return new Date(timestamp-g_time_area*3600000).format_hh();
			},
    };
}

//由于显示时间的时候向后位移了半个间隔，因此显示x轴的最大最小值的时候要恢复原时间
function store_show_time(parameters, data)
{
	if(data.start_time && data.end_time)
	{
		parameters.show_start_time = get_milliseconds(data.start_time, g_time_area);
		parameters.show_end_time = get_milliseconds(data.end_time, g_time_area);
	}
}

//其中data是原始数据，没有处理���
function handle_old_curve(parameters,data)//处理初始化曲线数据
{		
	close_overlay('#' + parameters.curve_div);
	refresh_all_type_curve(parameters, data);//曲线实时刷新
	if(!check_ws_data(data)||!data.data||data.data.length==0)
	{
		if('1' == parameters.need_grained)
		{
			var chart = $('#' + parameters.curve_div).highcharts();
			if(chart)
			{
				for(var i = 0; i < chart.series.length; i++)
				{
					chart.series[i].setData(null);
				}
			}
		}

		if(!data||!data.data)return;
	}

	// (#35537 20160229 by zuoyong.tang) 需要先缩小再画曲线
	var curve = $('#curve_div_' + data.id);
	resize_1_curve(parameters.svg_name, curve);

	if('1' == parameters.need_grained && 'allALL'.indexOf(parameters.now_range) >= 0)
	{
		//对于“总”曲线，如果以前的年份没有数据，应该删除
		graph_curve_extend.set_data_start(data);
	}
	if('1' == parameters.need_grained)
	{
		//对于非差值曲线，应该删除最后一个点
		graph_curve_extend.set_data_end(data, parameters);
	}
	//par2div(parameters);//根据参数生成一个曲线框
	
	data=fill_null_point(parameters,data);
	$.ajaxSetup({async: false,cache:false});//防止加载未完成就刷新实时曲线
	var curve_data=[];
	var curve_div="curve_div_"+data.id;
	var chart = temp_chart = $('#'+curve_div).highcharts();
	curve_time_format(chart,data,parameters);
	
	store_show_time(parameters, data);

	for(var j=0;j<data.data.length;j++)
	{
		curve_id=data.data[j].id;
		if(parameters.legend_from_svg != "true"){ //从后台获取图例的内容
			
			// (#39741 20160715 by zuoyong.tang) 去掉曲线图例中多余的曲线名
			if(data.data[j].desc && window.g_title_wtg && window.g_alias_wtg && g_alias_wtg.indexOf('.') < 0 && '1' == parameters.need_grained){
				var farmReg = new RegExp('^' + g_title_wtg + '\\s*' + '(全场统计\\s*)?');
				data.data[j].desc = data.data[j].desc.replace(farmReg, '');
			}

			if (parameters.sub_types[j] == '4098' && parameters.contain_column == true && parameters.curve_style[j] == 'line') {
				chart.series[curve_id].update({
					name: data.data[j].desc + "(" + JSLocale.curve_forecast_data + ")"
				}); 
				parameters.curve_names[j] = data.data[j].desc + "(" + JSLocale.curve_reality_data + ")";
			} else {
				chart.series[curve_id].update({
					name: data.data[j].desc
				}); 
				parameters.curve_names[j] = data.data[j].desc + "(" + JSLocale.curve_reality_data + ")";
			}
			
		}else{
			chart.series[curve_id].update({name:parameters.curve_names[j]});//加入曲线名,从curve_desc读取
		};
		chart.series[curve_id].update({type:parameters.use=="curve_tool"?null:parameters.curve_style[curve_id]});//更新曲线类型
		if(data.data[j].Points==null)continue;
		var length=data.data[j].Points.length;
		var last_y = get_first_valid_y(data.data[j].Points);
		
		//now_time用于与曲线的时间比较，如果无效点的时间超过now_time，则不再显示
		//3600000 * g_time_area是因为highcharts的时间也都加上了时区
		var now_time = g_field_date.time.getTime() + 3600000 * g_time_area;
		
		var interval = 0;
		//差值采样曲线
		if(!(parameters.curve_type > 4098 || parameters.curve_type == 4096) && parameters.arith_type[curve_id] == 'subtract')
		{
			interval = parameters.refresh_time;
		}

	    for (var i =0; i<length;i++) {
	    	var x=data.data[j].Points[i].x;
	    	
	    	if(parameters.curve_type > 4098)
	    	{
	    		//4098以上为xy曲线
	    		x=parseFloat(data.data[j].Points[i].x);
	    	}
	    	else 
	    	{
				//凡时间曲线，无论是否为填充值��都把时间格式转换为毫秒
	    		x = get_milliseconds(x, g_time_area);
	    		if(interval && interval < g_day_micsecs)
	    		{
	    			//对于小时级的差值曲线，调大时间
	    			x += interval / 2;
	    		}
	    	}
	    	
	    	/*
	    	 * 关于无效点：(20140417by唐作用)
	    	 * 默认为显示：（no_display_invalid_point="0"，或无此属性）则连一根线，在web上则删除此点
	    	 * 不 显示：（no_display_invalid_point="1"）则把无效点空着，在web上此点的数值为null
	    	 * 有一点不一样：如果为“显示”
	    	 * C/S端的的首尾会填上临近值
	    	 * web端要经过处理才能达到这个效果（暂未处理，我觉得不处理也可以）
	    	 * 
	    	 */
	    	var y=data.data[j].Points[i].y;
	    	if(!parameters.is_display_invalid)//不显示
	    	{
	    		curve_data.push([
	    					x,
	    					(!is_valid_y(y)) ?null:parseFloat(y),
	    				]);
	    	}else{//显示
	    		if(null == last_y)//如果本条曲线没有点
	    		{//修改数据加载方法，提高加载的效率(20140516by唐作用)
	    			curve_data.push([
    					x,
    					null,
    				]);
	    		}else if(is_valid_y(y))//如果有效点，正常显示
	    		{
	    			y = parseFloat(y);
	    			curve_data.push([
		    					x,
		    					y,
		    				]);
	    			last_y = y;
	    		}
	    		else {
	    			if(parameters.curve_type > 4098)
	    			{//xy曲线
	    				if(0 == i || length-1==i)//无效点，把首尾补上就行
		    			{
		    				curve_data.push([
		    					x,
		    					last_y,
		    				]);
		    			}
	    			}
	    			else
	    			{//时间曲线，即使显示无效点，也不应该显示当前时间之后的点
	    				if(now_time >= x || 0 == i)
		    			{	//中间若干个无效点都会被填充数据
		    				curve_data.push([
		    					x,
		    					last_y,
		    				]);
		    			}
		    			else if(length-1 == i)
		    			{//无效点，把首尾补上就行
		    				curve_data.push([
		    					x,
		    					null
		    				]);
		    			}
	    			}
	    			
	    		};
	    	}
		}
	    //chart.series[curve_id].update({title:{text:"x"},});
	    chart.series[curve_id].setData(curve_data);
	    curve_data=[];
	}
	$.ajaxSetup({async: true,cache:true});
	$(chart.container).css('overflow','visible');//解决遮挡的问题
	if(getFileName(window.location.href,'/','.')=='v_graph')
	{//以前出现过一次问题，需resieze之后曲线才能正常显示，为提高性能，只对这一条曲线进行resize
		var curve=$('div#'+curve_div);
		resize_1_curve(parameters.svg_name, curve);
	}
	
	//if(parameters.is_stack)
	//下面的代码有待优化，不一定所有情况都需要执行
	//(20150403 by zuoyong.tang)
	{
		parameters.legend_str = "";
		for (var i = 0; i < parameters.curve_count; i++) {
			if (!parameters.legend_str.match(parameters.curve_names[i])) {
				chart.series[i].update({
					showInLegend: true
				});
				parameters.legend_str += parameters.curve_names[i];
			} else {
				chart.series[i].update({
					showInLegend: false
				});
			}
		}

		if(parameters.contain_column)
		{
			//(#26425) 只有一条曲线的情况下，需redraw，否则柱子很宽
			chart.redraw();
			set_curve_width("svg_name");
		}
	}
	

	
}
//曲线实时刷新
function refresh_all_type_curve(parameters, data)
{
	if(parameters.v_curve)return;//曲线页面，不用刷新
	if(parameters.curve_type=="4096")//实时曲线才刷新
	{
		//(#24144 setTimeout中应该传一个字符串，不能是变量)
		timeout_id["curve_"+parameters.svg_id]=setInterval("get_curve_1point('"+parameters.svg_id+"','"+parameters.svg_name+"')",my_real_curve_refresh_time);//实时刷新
	}else if(parameters.curve_type <= "4098")//别的非XY曲线
	{
		// timeout_id["curve_"+parameters.svg_id]=setTimeout("refresh_history_curve('"+parameters.svg_id+"','"+parameters.svg_name+"')",my_history_curve_refresh_time);//实时刷新
	}
}
//本条曲线中第一个有效Y的值
function get_first_valid_y(points)
{
	for (var i =0; i<points.length;i++) {
		var y = points[i].y;
    	if(is_valid_y(y))return parseFloat(y);
	}
	return null;
}
//判断y值是否是一个有效的曲线值
function is_valid_y(y)
{
	if(y == null || y== undefined || y == '' || y== ' ')return false;
	return true;
}
//如果曲线失败，加入别名信息和时区信息
function curve_fail_des(parameters,data)
{
	if(parameters.use=="curve_tool")return;
	if(!data)return;
	if(data.data)
	{
		var curve_div="curve_div_"+data.id;
		var chart = $('#'+curve_div).highcharts();
		curve_time_format(chart,data,parameters);
		for(var j=0;j<data.data.length;j++)
		{
			
			var curve_id=data.data[j].id;
			chart.series[curve_id].update({name:data.data[j].desc});//加入曲线名
		}
	}
}

//如果存在有空的points，为其填充null数据
function fill_null_point(parameters,data)
{
	if(if_no_null(data))//约有部分null，或者全为非null
	{
		var points=null;
		for(var j=0;j<data.data.length;j++)
		{
			if(data.data[j].Points){
				points=data.data[j].Points;
				break;
			}
		}
		
		for(var j=0;j<data.data.length;j++)
		{//把null的point填充无效时间和无效数据
			if(!data.data[j].Points){
				data.data[j].Points=[];
				for(var i=0;i<points.length;i++)
				{
					//这里还不是最后的曲线数据，所以不能用[x, y]的形式
					data.data[j].Points.push({
						x:points[i].x,
						y:null,
					});
				}
			}
		}
	}
	else
	{//全为null
		if(parameters.curve_type!='4096')return data;//只对时实曲线进行时间填充
		var date = data.end_time;
		var x=get_milliseconds(date)-30*60*1000;
		
		for(var i=0;i<data.data.length;i++)
		{
			var curve_data=[];
			for(var j=0;j<30*60;j+=my_real_curve_refresh_time/1000)
			{
				//这里还不是最后的曲线数据，所以不能用[x, y]的形式
				curve_data.push({
					x: date_format2(new Date(x+j*1000)),
					y: null
				});
			}
			data.data[i].Points=curve_data;
			data.data[i].from_null=true;//表明是空曲线填充的
		}
	}
	return data;
}
//如果points全为空，返回false
function if_no_null(data)
{
	for(var j=0;j<data.data.length;j++)
	{
		if(data.data[j].Points){
			return true;
		}
	}
	return false;
}

//如果points全为实，返回true
function is_all_data(data)
{
	for(var j=0;j<data.data.length;j++)
	{
		if(!data.data[j].Points){
			return false;
		}
	}
	return true;
}

//历史曲线，每5分钟刷新一次
function refresh_history_curve(svg_id,svg_name)
{    
	var parameters = curve_map['parms_'+svg_name+'_'+svg_id];
	load_curve_data(parameters);//根据参数获取数据并生成曲线
	stop_loss_tab = true;
}

//对于每条曲线，分别请求add数据，定时在这里进行
//每一个svg曲线框都维护一个timer
function get_curve_1point(svg_id,svg_name)
{    
	var ws_paras = [];
	var curve_id=0;
	var refresh_time=0;
	$.each(curve_map, function(key, value) {
		if(key.indexOf(svg_id)>-1&&value[0]=="4096")
		{
			if($('g#'+svg_id).length<1)return;//如果此g元素已不存在，无需刷新，这和最初的svg影藏方案是互斥的（20140305by唐）
			ws_paras.push({
				id : key,
				key : value[1],
				decimal:value[2],
			});
			curve_id++;
			refresh_time=value[3];
		}
	});
	if(0==curve_id)return;//如果本曲线框不是4096曲线，不再刷新
	var ws_pars_all={};
	ws_pars_all.branch_para_list=get_branch_par(svg_name);
	ws_pars_all.template_para_list=$("#svg_content_"+svg_name+' svg').attr('template_para_list');//" F01.T1_L2.WTG001";

	ws_pars_all.data=ws_paras;
	ws_get_dyndata(ws_pars_all,refresh_curve,null);
	//timeout_id["curve_"+svg_id]=setTimeout("get_curve_1point('"+svg_id+"','"+svg_name+"')",refresh_time);
}

function refresh_curve(data_all)//刷新曲线数据
{
	if(!data_all||data_all.status!=undefined||data_all.code!="10000"||data_all.data==null)return;
	data=data_all.data;

	//svg_id需兼容各种形式
	var svg_id = data[0].id.replace(/_curve_\d*/, '');

	var chart = $('#curve_div_'+svg_id).highcharts();
	if(chart.series[0].points.length==0)
	{
		add_null_point(data_all);//给空曲线加入null数据
	}
	var date = data_all.current_date_time;
	var x=get_milliseconds(date,g_time_area);
	for(var i=0;i<data.length;i++)
	{
		date=data[i].timestamp;
		x=get_milliseconds(date,g_time_area);
		var y=parseFloat((''+data[i].display_value).replace(/\,/g,''));
		chart.series[i].addPoint([x,y],true,true);
	}
}
//给空曲线加入null数据
function add_null_point(data_all)
{
	data=data_all.data;
	var svg_id=data[0].id.split("_")[0];
	var chart = $('#curve_div_'+svg_id).highcharts();
	var date = data_all.current_date_time;
	var x=get_milliseconds(date,g_time_area)-30*60*1000;
	Highcharts_dateFmt();
	var curve_data=[];
	for(var i=0;i<data.length;i++)
	{
		for(var j=0;j<30*60;j+=my_real_curve_refresh_time/1000)
		{
			curve_data.push([
				x+j*1000,//板上钉钉，不要改了
				null
			]);
		}
		chart.series[i].setData(curve_data);
	    curve_data=[];
	}
}

//解决浏览器窗口缩放时y轴labels下移的问题 bowen.yin
$(window).resize(function() {
	return;
	// 不删除该功能，则曲线缩放时，会先执行该函数，导致labels先放大，导致x轴第一个标签往前靠，导致标签font再缩小的时候超出了


	if (temp_chart && temp_chart.yAxis[0]) {
		temp_chart.yAxis[0].update({
			labels: {
				y: 2
			}
		});
	}
	if (temp_chart && temp_chart.xAxis[0]) {
		temp_chart.xAxis[0].update({
			labels: {}
		});
	}
});


/**
 * 1)将svg中的<curve/>标签按stack进行重新排序
 * 2）stack值一样的放在一起
 */
function curve_resort(svg_curve) {
	var old_curves = svg_curve.children("curve"); //保存原来的curve标签
	svg_curve.empty(); //清除原来curve标签父节点里面的所有自己点
	for (var i = 0; i < old_curves.length; i++) {
		if (svg_curve.children("curve")
			.filter('[stack=\"' + old_curves.eq(i).attr("stack") + '\"]').length <= 0) {
			svg_curve.append(old_curves.eq(i));  //如果没找到stack相同的节点，则直接append到父节点
		} else {
			svg_curve.children("curve")
				.filter('[stack=\"' + old_curves.eq(i).attr("stack") + '\"]')
				.filter(":last").after(old_curves.eq(i)); //如果找到stack相同子节点，则将当前节点添加到stack值相同的节点中最后一个的后面
		};
	};
}


//扩展defaultLabelFormatter方法，使曲线坐标能加上逗号
(function(H) {
    H.wrap(H.Axis.prototype, 'defaultLabelFormatter', function(proceed){
    		var label = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    		var numericSymbols = ['k', 'M', 'G', 'T', 'P', 'E'];
    		if(label && label.indexOf)
    		{
    			label += '';
    			var last = label[label.length - 1];
    			if(numericSymbols.indexOf(last) >= 0)
    			{
    				label = label.substr(0, label.length - 1);
    				label = g_num_add_comma.add_remove_comma(label);
    				label += last;
    			}
    		}
		  	return g_num_add_comma.add_remove_comma(label);
	});
})(Highcharts);
