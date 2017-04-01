/**
 * @author zuoyong.tang
 * @version 3.1.0.6
 * @date 20150319
 * @function 实现graph曲线中的颗粒度切换功能
 */
var g_time_area = new Date().getTimezoneOffset() / 60 * -1;//东8区
var graph_curve_extend = {
    //当点击左按钮的时候，now_time_index减一
    //now_time_index: 0,
    //now_range: 'd',

    timeAreaMargin: g_time_area * 3600000,

    //返回日、周、月、年这些按钮的标签
    get_curve_ranges: function (svg_name) {
        var html;
        var sys_time = g_field_date.time;
        if ('object' != typeof sys_time) {
            sys_time = new Date();
        }
        sys_time = new Date();
        var max_year = sys_time.getFullYear();
        var max_month = sys_time.getMonth() + 1;
        var max_date = sys_time.getDate();
        var max_time = max_year + '-' + max_month + '-' + max_date;
        sys_time = sys_time.format_mini(null, 'yyyy-MM-dd');
        var d_format = graph_curve_extend.getYYYYMMDDFormat();
        html= '<ul class="range_switch_btns">' + '<li style="display:none;">' + JSLocale.curve_extend.range + '</li>' + '<li class="range_switch_btn btn_on" onclick="graph_curve_extend.set_curve_range.call(this, \'d\')">' + JSLocale.curve_extend.day + '</li>' + '<li class="range_switch_btn" onclick="graph_curve_extend.set_curve_range.call(this, \'w\')">' + JSLocale.curve_extend.week + '</li>' + '<li class="range_switch_btn" onclick="graph_curve_extend.set_curve_range.call(this, \'M\')">' + JSLocale.curve_extend.month + '</li>' + '<li class="range_switch_btn" onclick="graph_curve_extend.set_curve_range.call(this, \'y\')">' + JSLocale.curve_extend.year + '</li>' + '<li class="range_switch_btn" onclick="graph_curve_extend.set_curve_range.call(this, \'all\')">' + JSLocale.curve_extend.all + '</li>' + '<li class="left_right_bth left_btn" onclick="graph_curve_extend.set_curve_range.call(this, null, -1)"></li>' + '<li class="now_time_range"><input type="text" readonly="readonly" class="date_picker_97" style="width: 97px;" onclick="WdatePicker({readOnly:true, maxDate: \'' + max_time + '\',dateFmt:\'' + d_format + '\', onpicked: function(){graph_curve_extend.date_click_event.call(this, \'d\')}})" value="' + sys_time + '"></li>' + '<li class="left_right_bth right_btn range_disable" onclick="graph_curve_extend.set_curve_range.call(this, null, 1)"></li>' + '</ul>';
        return html;
    },

    //接收日、月或年等参数，修改当前的曲线范围
    set_curve_range: function (now_range, time_index) {
        var curve_div = $(this).closest('div.div_env_curve');
        var parameters = curve_div.data('parameters');

        if (parameters) {
            clearTimeout(timeout_id['curve_' + parameters.svg_id]);
            init_overlay({
                con_id: "#" + parameters.curve_div
            });


            if (!now_range) {
                parameters.now_time_index += time_index;
            } else {
                //点击日月年的情况
                parameters.now_range = now_range;
                parameters.now_time_index = 0;
                $(this).addClass('btn_on').siblings('li.range_switch_btn').removeClass('btn_on');
            }

            graph_curve_extend.show_left_right(now_range, parameters.now_time_index, parameters.curve_div);

            parameters.not_redraw = true;
            refresh_history_curve(parameters.svg_id, parameters.svg_name);
        }
    },

    show_left_right: function (now_range, time_index, curve_div) {
        if ('allALL'.indexOf(now_range) >= 0) {
            $('#' + curve_div + ' .left_right_bth').addClass('range_disable');
        } else {
            if (0 == time_index) {
                $('#' + curve_div + ' .left_btn').removeClass('range_disable');
                $('#' + curve_div + ' .right_btn').addClass('range_disable');
            }
            if (time_index < 0) {
                $('#' + curve_div + ' .left_btn').removeClass('range_disable');
                $('#' + curve_div + ' .right_btn').removeClass('range_disable');
            }
        }
    },

    getDay000: function (date) {
        return date.getTime() - (date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds());
    },

    //返回日、周、月、年这些参数的起始时间
    get_sys_time_range: function (range, time_index) {
        var sys_time = g_field_date.time;
        if ('object' != typeof sys_time) {
            sys_time = new Date();
        }

        var start_time = sys_time; // new Date(sys_time.getTime() + graph_curve_extend.timeAreaMargin);
        var end_time = sys_time.getTime;
        switch (range) {
            case 'd':
            case 'D':
            default:
                start_time = graph_curve_extend.getDay000(start_time);

                if (time_index) {
                    start_time += time_index * 86400000;
                }

                end_time = start_time + 86400000;

                //getTime()是按照UTC0的时间来算的，也就是说，北京Jan 01 1970 08:00:00时间，getTime()是0
                //start_time -= graph_curve_extend.timeAreaMargin;
                //end_time -= graph_curve_extend.timeAreaMargin;
                type = "d"; //类型不同时间选择框的宽度不一样
                break;
            case 'w':
            case 'W':
                var day = start_time.getDay();
                start_time = graph_curve_extend.getDay000(start_time) - day * 86400000;

                if (time_index) {
                    start_time += time_index * 7 * 86400000;
                }

                end_time = start_time + 7 * 86400000;
                //start_time -= graph_curve_extend.timeAreaMargin;
                //end_time -= graph_curve_extend.timeAreaMargin;
                type = "w"; //类型不同时间选择框的宽度不一样
                break;
            case 'M':
                var month = start_time.getMonth();
                var year = start_time.getYear() + 1900;

                if (time_index) {
                    if ((month += time_index) < 0) {
                        year--;
                        month += 12;
                    }
                }

                start_time = new Date(year, month, 1).getTime();
                month++;
                if (12 == month) {
                    month = 0;
                    year++;
                }
                end_time = new Date(year, month, 1).getTime();
                type = "M"; //类型不同时间选择框的宽度不一样
                break;
            case 'y':
            case 'Y':
                var year = start_time.getYear() + 1900;

                if (time_index) {
                    year += time_index;
                }

                start_time = new Date(year, 0, 1).getTime();
                year++;
                end_time = new Date(year, 0, 1).getTime();
                type = "y"; //类型不同时间选择框的宽度不一样
                break;
            case 'all':
            case 'ALL':
                var year = start_time.getYear() + 1900 + 1;
                start_time = new Date(2000, 0, 1).getTime();
                end_time = new Date(year, 0, 1).getTime();
                type = "all"; //类型不同时间选择框的宽度不一样
                break;
        }
        return {
            start_time: date_format2(new Date(start_time)),
            end_time: date_format2(new Date(end_time)),
            type: type,
            now_range_str: graph_curve_extend.get_now_range_str(start_time, range)
        };
    },

    //用于显示当前
    get_now_range_str: function (start_time, range) {
        var now_range_str = '';
        switch (range) {
            case 'd':
            case 'D':
                return new Date(start_time).format_mini(null, 'yyyy-MM-dd');
                break;
            case 'w':
            case 'W':
                start_time = new Date(start_time);
                //return (start_time.getYear() + 1900) + ', ' + JSLocale.curve_extend.weekst.replace('{1}', graph_curve_extend.getYearWeek(start_time));
                var year = start_time.getFullYear();
                var month = (start_time.getMonth() + 1) < 10 ? '0' + (start_time.getMonth() + 1) : start_time.getMonth() + 1;
                var date = start_time.getDate() < 10 ? '0' + start_time.getDate() : start_time.getDate();
                return year + '-' + month + '-' + date;
                break;
            case 'M':
                return new Date(start_time).format_mini(null, 'yyyy-MM');
                break;
            case 'y':
            case 'Y':
                return new Date(start_time).format_mini(null, 'yyyy');
                break;
            case 'all':
            case 'ALL':
            default:
                return '';
                break;
        }
    },

    show_now_range_str: function (curve_div, range, type) {
        //$('#' + curve_div + ' .now_time_range input.date_picker_97').attr('value', range);
        //$('#' + curve_div + ' .now_time_range input.date_picker_97').val(range);
        $('#' + curve_div + ' ul.range_switch_btns li.right_btn').css({
            position: 'static',
            marginLeft: '0px'
        });

        //设置时间选择器中日的格式
        var sys_time = g_field_date.time;
        if ('object' != typeof sys_time) {
            sys_time = new Date();
        }
        var max_year = sys_time.getFullYear();
        var max_month = sys_time.getMonth() + 1;
        var max_date = sys_time.getDate();
        var max_time = max_year + '-' + max_month + '-' + max_date;

        var d_format = graph_curve_extend.getYYYYMMDDFormat();

        $('#' + curve_div + ' ul.range_switch_btns>li.now_time_range').empty();
        if (type == 'd') {
            $('#' + curve_div + ' ul.range_switch_btns>li.now_time_range').append('<input type="text" class="date_picker_97" readonly="readonly" style="width: 97px;" onclick="WdatePicker({readOnly:true, maxDate: \'' + max_time + '\',dateFmt:\'' + d_format + '\', onpicked: function(){graph_curve_extend.date_click_event.call(this, \'d\')}})" value="' + range + '">');
        }
        ;
        if (type == 'w') {
            var picked_time = new Date(range); //将所选取的时间转换成时间对象
            var week_time = (picked_time.getYear() + 1900) + ', ' + JSLocale.curve_extend.weekst.replace('{1}', graph_curve_extend.getYearWeek(picked_time));
            $('#' + curve_div + ' ul.range_switch_btns>li.now_time_range').append('<input type="text" calss="display_input" style="width: 105px; height:21px;padding-left:5px;z-index:99;color:#fff; border: 1px solid #28c6de; background: #041c1f url(../common/images/arrow_down.png) right center no-repeat; position: absolute; top:11px;" value="' + week_time + '" />');
            $('#' + curve_div + ' ul.range_switch_btns>li.now_time_range').append('<input type="text"  class="date_picker_97 week" style="width: 105px; z-index:100;background:rgba(0,0,0,0);color:rgba(0,0,0,0);position: absolute; top:11px;" onclick="WdatePicker({readOnly:true, maxDate: \'' + max_time + '\',isShowWeek:true,errDealMode: 2, dateFmt:\'yyyy-MM-dd\', onpicked: function(){graph_curve_extend.date_click_event.call(this, \'w\')}})" value="' + range + '" />');
            $('#' + curve_div + ' ul.range_switch_btns li.right_btn').css('margin-left', '112px');
        }
        ;
        if (type == 'M') {
            $('#' + curve_div + ' ul.range_switch_btns>li.now_time_range').append('<input type="text" readonly="readonly" class="date_picker_97" style="width: 75px;" onclick="WdatePicker({readOnly:true, maxDate: \'' + max_time + '\',dateFmt:\'' + g_field_date.yyyy_MM + '\', onpicked: function(){graph_curve_extend.date_click_event.call(this, \'M\')}})" value="' + range + '">');
        }
        ;
        if (type == 'y') {
            $('#' + curve_div + ' ul.range_switch_btns>li.now_time_range').append('<input type="text" readonly="readonly" class="date_picker_97" style="width: 52px;" onclick="WdatePicker({readOnly:true, maxDate: \'' + max_time + '\',dateFmt:\'yyyy\', onpicked: function(){graph_curve_extend.date_click_event.call(this, \'y\', curve_div)}})" value="' + range + '">');
        }
        ;
    },

    //时间选择框的鼠标单击事件
    date_click_event: function (type) {
        var cur_curve_div = $(this).closest('div.div_env_curve').attr('id');
        var curve_div = $(this).closest('div.div_env_curve');
        var parameters = curve_div.data('parameters');

        if (parameters) {
            clearTimeout(timeout_id['curve_' + parameters.svg_id]);
            init_overlay({
                con_id: "#" + parameters.curve_div
            });

            var sys_time = g_field_date.time;
            if ('object' != typeof sys_time) {
                sys_time = new Date();
            }

            var time_before_pick = new Date(graph_curve_extend.getDay000(sys_time));
            var time_after_pick = new Date($dp.cal.getNewDateStr('yyyy-MM-dd'));
            time_after_pick = new Date(time_after_pick.getTime() - graph_curve_extend.timeAreaMargin);

            if (type == 'd') {
                $(this).attr('value', $(this).val());
                $(this).val($(this).val());
                parameters.now_time_index = (time_after_pick.getTime() - time_before_pick.getTime()) / 86400000;
            }
            ;
            if (type == 'w') {
                var picked_time = new Date($(this).val()); //将所选取的时间转换成时间对象
                var week_time = (picked_time.getYear() + 1900) + ', ' + JSLocale.curve_extend.weekst.replace('{1}', graph_curve_extend.getYearWeek(picked_time));
                curve_div.find('.display_input').attr('value', week_time);
                curve_div.find('.display_input').val(week_time);
                var day_before = time_before_pick.getDay();
                var day_after = time_after_pick.getDay();
                time_before_pick = time_before_pick.getTime() - (day_before - 0) * 86400000; //格式化为当前星期的星期一的时间（ms）
                time_after_pick = time_after_pick.getTime() - (day_after - 0) * 86400000; //格式化为当前星期的星期一的时间（ms）
                parameters.now_time_index = (time_after_pick - time_before_pick) / (7 * 86400000);
            }
            ;
            if (type == 'M') {
                $(this).attr('value', $(this).val());
                $(this).val($(this).val());
                var before_month = time_before_pick.getMonth(); //系统时间的月份
                var before_year = time_before_pick.getYear() + 1900; //系统时间��年份
                var after_month = time_after_pick.getMonth(); //所选择的时间的月份
                var after_year = time_after_pick.getYear() + 1900; //所选择的时间的年份
                parameters.now_time_index = after_year * 12 + after_month - (before_year * 12 + before_month);
            }
            ;
            if (type == 'y') {
                $(this).attr('value', $(this).val());
                $(this).val($(this).val());
                var before_year = time_before_pick.getYear() + 1900; //系统时间的年份
                var after_year = time_after_pick.getYear() + 1900; //所选择的时间的年份
                parameters.now_time_index = after_year - before_year;
            }
            ;
            graph_curve_extend.show_left_right(type, parameters.now_time_index, parameters.curve_div);
            refresh_history_curve(parameters.svg_id, parameters.svg_name);
        }
        ;
    },

    getYearWeek: function (date) {
        var date1 = date,
            date2 = new Date(date.getYear() + 1900, 0, 1),
            d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
        return Math.ceil((d + ((date2.getDay() + 1))) / 7);
    },

    //算出合适的间隔，返回的是一个对象
    get_curve_interval: function (now_range) {
        var sample_cycle, interval_type, interval_seconds;

        switch (now_range) {
            case 'd':
            case 'D':
            default:
                sample_cycle = 3600;
                interval_type = 0;
                interval_seconds = 3600;
                break;
            case 'w':
            case 'W':
                sample_cycle = 86400;
                interval_type = 0;
                interval_seconds = 86400;
                break;
            case 'M':
                sample_cycle = 86400;
                interval_type = 0;
                interval_seconds = 86400;
                break;
            case 'y':
            case 'Y':
                sample_cycle = 1;
                interval_type = 3;
                interval_seconds = 86400 * 31;
                break;
            case 'all':
            case 'ALL':
                sample_cycle = 1;
                interval_type = 4;
                interval_seconds = 86400 * 365;
                break;
        }

        return {
            sample_cycle: sample_cycle,
            interval_type: interval_type,
            interval_seconds: interval_seconds
        };
    },

    //算出合适的x轴刻度分布
    get_tickPositioner: function (now_range, min, max) {
        //由于highcharts的原因，min和max比实际highcharts显示的时间多8小时
        var tickPositions = [];
        switch (now_range) {
            case 'w':
            case 'M':
            default:
                var day = 1;
                while ((max - min) / 86400000 > 3) {
                    tickPositions.push(min);
                    min += 5 * 86400000;
                    day += 5;
                }
                tickPositions.push(max);
                return tickPositions;
            case 'y':
            case 'Y':
                var month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                month_days = [59, 61, 61, 62, 61, 61];
                var year = new Date(min - graph_curve_extend.timeAreaMargin).getYear();
                if (0 == year % 4) {
                    month_days[0] = 60;
                }
                for (var i = 0; i < 6; i++) {
                    tickPositions.push(min);
                    min += month_days[i] * 86400000;
                }
                return tickPositions;
            case 'all':
            case 'ALL':
                var year_min = new Date(min - graph_curve_extend.timeAreaMargin).getYear();
                var year_max = new Date(max - graph_curve_extend.timeAreaMargin).getYear();
                while (year_min <= year_max) {
                    var year_micoseconds = 365 * 86400000;
                    if (0 == year_min % 4) {
                        year_micoseconds = 366 * 86400000;
                    }
                    tickPositions.push(min);
                    min += year_micoseconds;
                    year_min++;
                }
                return tickPositions; //[new Date(2014, 0, 1).getTime(), new Date(2015, 0, 1).getTime(), new Date(2016, 0, 1).getTime()]//tickPositions;
        }
    },

    //对于当年和总发电量的情况，计算下一个点的时���
    get_next_point: function (now_range, x) {
        switch (now_range) {
            case 'y':
            case 'Y':
            default:
                var month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var year = new Date(x - graph_curve_extend.timeAreaMargin).getYear();
                var month = new Date(x - graph_curve_extend.timeAreaMargin).getMonth();
                if (0 == year % 4) {
                    month_days[1] = 29;
                }
                return x + (month_days[month]) * 86400000;
            case 'all':
            case 'ALL':
                var year_days = 365;
                var year = new Date(x - graph_curve_extend.timeAreaMargin).getYear();
                if (0 == year % 4) {
                    year_days = 366;
                }
                return x + (year_days) * 86400000;
        }
    },

    getYYYYMMDDFormat: function () {
        var format = g_field_date.yyyy_MM_dd_format || '';
        return format.toLowerCase().replace('mm', 'MM');
    },

    //返回x轴时间的格式
    get_label_time_format: function (now_range) {
        var time_format = 5;

        switch (now_range) {
            case 'd':
            case 'D':
            default:
                time_format = 'hh:mm';
                break;
            case 'w':
            case 'W':
                time_format = 'MM-dd';
                break;
            case 'M':
                time_format = 'MM-dd';
                break;
            case 'y':
            case 'Y':
                time_format = 'yyyy-MM'
                break;
            case 'all':
            case 'ALL':
                time_format = 'yyyy';
                break;
        }

        return time_format;
    },

    //返回x轴应该显示的间隔数
    get_label_x_division: function (now_range) {
        var x_division = 5;

        switch (now_range) {
            case 'd':
            case 'D':
            default:
                x_division = 4;
                break;
            case 'w':
            case 'W':
                x_division = 6;
                break;
            case 'M':
                x_division = '';
                break;
            case 'y':
            case 'Y':
                x_division = 6;
                break;
            case 'all':
            case 'ALL':
                x_division = '';
                break;
        }

        return x_division;
    },

    set_data_start: function (json) {
        var data = json.data;
        if (data.length > 0) {
            get_first_year: for (var i = 0; i < data[0].Points.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if ('' != data[j].Points[i].y) {
                        var first = i && i - 1;
                        //first = first && first - 1;
                        json.start_time = data[j].Points[first].x;
                        for (var k = 0; k < data.length; k++) {
                            data[k].Points = data[k].Points.slice(first);
                        }
                        //break get_first_year;
                        return;
                    }
                }
            }
        }

        //解决返回结果为空的问题
        if (data.length > 0 && data[0].Points.length > 3) {
            for (var k = 0; k < data.length; k++) {
                data[k].Points = data[k].Points.slice(data[k].Points.length - 3);
            }
        }
    },

    set_data_end: function (data, parameters) {
        data = data.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i] && data[i].Points && 'subtract' != parameters.arith_type[data[i].id]) {
                data[i].Points.length = data[i].Points.length - 1;
            }
        }
    }

};

//扩展柱状图的宽度计算方法，否则当显示为“周”的时候，柱子太宽了
(function (H) {
    H.wrap(H.seriesTypes.column.prototype, 'getColumnMetrics', function (proceed) {
        var widths = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        if (widths && widths.width > 25 && widths.width - 2 * Math.abs(widths.offset) < 0.0001) {
            widths.width = 25;
            widths.offset = -12.5;
        }
        return widths;
    });
})(Highcharts);