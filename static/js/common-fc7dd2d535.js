function getQueryString(name) {
    var reg = new RegExp("(^|&|\\?)" + name + "=([^&\\?]*)(&|\\?|$)", "i"), r = window.location.search.substr(1).match(reg);
    if (null != r) {
        var value = r[2] || "";
        return value.indexOf("%u") >= 0 ? unescape(value) : decodeURIComponent(value)
    }
    return null
}
function getFileName(str, firstChar, lastChar) {
    if (!str || "string" != typeof str)return "";
    str.indexOf("?") >= 0 && (str = str.substring(0, str.indexOf("?")));
    var fileName = str.substring(str.lastIndexOf(firstChar) + 1, str.lastIndexOf(lastChar));
    return fileName
}
function test_html5() {
    var id = "Canvas_" + (new Date).getTime();
    return $("head").append('<canvas id="' + id + '" style="display:none"></canvas>'), !!document.getElementById(id).getContext
}
function set_local_value(key, val) {
    localStorage.setItem(key, val)
}
function get_local_value(key) {
    return localStorage.getItem(key)
}
function set_session_value(key, val) {
    "sub_nodes" == key && (window.sub_nodes_str = val), val && val.length > 1e6 && window.compressStr && (val = compressStr.compress(val) + "_compressStr"), sessionStorage[key] = val
}
function get_session_value(key) {
    var val = sessionStorage[key];
    return val && /_compressStr$/.test(val) && (val = val.replace(/_compressStr$/, ""), val = compressStr.decompress(val)), val
}
function setCookie(name, value) {
    var Days = 30, exp = new Date;
    exp.setTime(exp.getTime() + 24 * Days * 60 * 60 * 1e3), document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/"
}
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=?([^;=]*)(;|$)"));
    return null != arr ? unescape(arr[2]) : null
}
function ws_login_test(reason, sessionId, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !1,
        url: ws_url + now_time_tail("checksession") + "?" + reason,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 8e3,
        beforeSend: function (req) {
        },
        success: callback_ok,
        error: callback_err
    })
}
function ws_get_field_time(parm, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !1,
        url: ws_url + now_time_tail("localtime?" + parm),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_auth_time(parm, callback_ok, callback_err) {
    parm += "&check_export=1&username=" + get_local_value("username"), $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_graph_auth_and_time?" + parm),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_site_tree(type, callback_ok, callback_err, no_field) {
    type = "" == type ? "" : "?type=" + type;
    var node_name_list = "";
    sessionStorage.node_name_list && (node_name_list = "node_name_list=" + sessionStorage.node_name_list, node_name_list = ("" == type ? "?" : "&") + node_name_list), !no_field && g_field_parm && (node_name_list = "node_name_list=" + g_field_parm, node_name_list = ("" == type ? "?" : "&") + node_name_list), $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_tree" + type + node_name_list),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            g_node_name_sort.sort_tree_data(data), callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_nav_tree(type, callback_ok, callback_err, no_field) {
    var url = "get_tree?_t=" + (new Date).getTime();
    url += "" == type ? "" : "&type=" + type, !no_field && g_field_parm && (node_name_list = "&node_name_list=" + g_field_parm, url += node_name_list, url = now_time_tail(url)), $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + add_appName_esb(url),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            g_node_name_sort.sort_tree_data(data), callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_farm_tree(complete) {
    env_ajax_get({
        url: ws_url + "get_tree?type=onlytofac", complete: function (data) {
            g_node_name_sort.sort_tree_data(data), complete(data)
        }, async: !1, central: !0
    })
}
function ws_getPortalMenu(mdm_id, callback_ok) {
    env_ajax_get({url: portalUrl + "menus?region=" + mdm_id, complete: callback_ok, async: !1})
}
function ws_get_tree_filterbystation(param, callback_ok, callback_err, beforeSend, complete) {
    var str = "";
    $.each(param, function (k, v) {
        str += ("" != str ? "&" : "") + k + "=" + v
    }), str = str && "?" + str, $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_tree" + str),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            g_node_name_sort.sort_tree_data(data), callback_login(data, callback_ok)
        },
        error: callback_err,
        beforeSend: beforeSend,
        complete: complete
    })
}
function ws_get_popup_menu(popmenu_paras, callback_ok, callback_err, complete) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_popup_menu?" + popmenu_paras),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_token_list(field, callback_ok, callback_err) {
    env_ajax_get({url: ws_url + "token_info" + field, callback_ok: callback_ok, callback_err: callback_ok})
}
function ws_set_token(params, callback_ok, callback_err) {
    env_ajax_get({url: ws_url + "handle_popup_menu" + params, callback_ok: callback_ok, callback_err: callback_err})
}
function env_ajax_get(params) {
    env_ajax_request(params)
}
function env_ajax_post(params) {
    params && (params.get_post = "post", env_ajax_request(params))
}
function env_ajax_request(params) {
    if (params) {
        var get_post = "post" == params.get_post ? "post" : "get", async = !params.sync, url = params.url || "", callback_ok = params.callback_ok || void 0, callback_err = params.callback_err || void 0, complete = params.complete || void 0, data_json = params.data || params.data_json || void 0, timeout = params.timeout || void 0, central = params.central || !1;
        async = void 0 === params.async ? async : !!params.async, url = central ? now_time_tail_central(url) : now_time_tail(url), data_json && "object" == typeof data_json && (data_json = JSON.stringify(data_json)), $.ajax({
            type: get_post,
            async: !!async,
            url: url,
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            data: data_json,
            timeout: timeout,
            success: function (data) {
                "function" == typeof callback_ok && callback_login(data, callback_ok)
            },
            error: function (data) {
                "function" == typeof callback_err && callback_login(data, callback_err)
            },
            complete: function (data) {
                if ("function" == typeof complete) {
                    var resp = null;
                    if (data)try {
                        resp = JSON.parse(data && data.responseText)
                    } catch (e) {
                    }
                    resp ? callback_login(resp, complete) : callback_login({}, complete)
                }
            }
        })
    }
}
function ws_get_datalist(data_json, callback_ok, callback_err) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_wtgtable"),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            if ("farmAbove" !== data_json.data_level && "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled && data && "[object Array]" === Object.prototype.toString.call(data.data) && data.data.length > 0)for (var i = 0, l = data.data.length; i < l; i++) {
                var d = data.data[i];
                "true" === d.isLeaf && d["Farm.Name"] && (d["WTG.Name"] && (d["WTG.Name"] = d["Farm.Name"] + " " + d["WTG.Name"]), d["WTG Para:1"] && (d["WTG Para:1"] = d["Farm.Name"] + " " + d["WTG Para:1"]))
            }
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_phaseinfo(farmAlias, callback_ok, callback_err) {
    $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_phase_feeder?region=" + farmAlias),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_all_filter_values(dl_filter_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(dl_filter_paras);
    $.ajax({
        type: "POST",
        async: !1,
        url: ws_url + now_time_tail("get_infoByAlias"),
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_alarm(data_json, callback_ok, callback_err, beforeSend, complete) {
    data_json.node_list = void 0, "alarm_view" == data_json.grid_id && g_field_parm && (data_json.node_name_list = g_field_parm), "alarm_view" != data_json.grid_id && "alarm_dialog" != data_json.grid_id || data_json.node_name_list || !sessionStorage.node_name_list || (data_json.node_name_list = sessionStorage.node_name_list);
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_alarm"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            if (data && "[object Array]" === Object.prototype.toString.call(data.data) && data.data.length > 0)for (var i = 0, l = data.data.length; i < l; i++) {
                var d = data.data[i];
                d.farm_name && (d.wtg_name = d.farm_name + " " + d.wtg_name)
            }
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_alarm2(data_json, callback_ok, callback_err, beforeSend, complete) {
    data_json.node_list = void 0;
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + add_site_node("get_alarm?nowTime=" + (new Date).getTime()),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            if (data && "[object Array]" === Object.prototype.toString.call(data.data) && data.data.length > 0)for (var i = 0, l = data.data.length; i < l; i++) {
                var d = data.data[i];
                d.farm_name && (d.wtg_name = d.farm_name + " " + d.wtg_name)
            }
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_alarm_set(url, data, callback_ok, complete, beforeSend, callback_err) {
    var s_url = get_web_cfg("http_url_config"), dataStr = "";
    $.each(data, function (k, v) {
        dataStr += (dataStr ? "&" : "") + k + "=" + v
    }), $.ajax({
        type: "GET",
        async: !0,
        url: s_url + now_time_tail(url),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: dataStr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_active_sc(para, callback_ok, callback_err) {
    $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_active_sc" + para),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_alarm_tab(paras, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_alarm_tab" + paras),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_confirm_alarm(confirm_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(confirm_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("confirm_alarm"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_warn_template(callback_ok, callback_err) {
    $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_warn_template"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_maindata_get(url, data, callback_ok, beforeSend, complete, callback_err) {
    var dataStr = "";
    $.each(data, function (k, v) {
        dataStr += (dataStr ? "&" : "") + k + "=" + v
    }), $.ajax({
        type: "GET",
        async: !0,
        url: mdm_url + now_time_tail(url),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: dataStr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_maindata_post(url, update_paras, callback_ok, beforeSend, complete, callback_err) {
    var jsonstr = $.toJSON(update_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: mdm_url + now_time_tail(url),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_tpcset(tpcset, callback_ok, callback_err, beforeSend) {
    $.ajax({
        type: "GET",
        async: !0,
        url: mdm_url + now_time_tail("tpcset?tpcset=" + tpcset),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_update_tpcset(update_paras, callback_ok, callback_err, beforeSend) {
    var jsonstr = $.toJSON(update_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: mdm_url + now_time_tail("tpcset/update"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_warn(wv_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(wv_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_warn"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_backlogs(backlog_paras, callback_ok, callback_err, beforeSend) {
    var jsonstr = $.toJSON(backlog_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: eam_url + now_time_tail("get_backlogs?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_statistics(statistics_paras, callback_ok, callback_err, beforeSend) {
    var jsonstr = $.toJSON(statistics_paras);
    $.ajax({
        type: "POST",
        async: !1,
        url: eam_url + now_time_tail("get_statistics?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_report_template(callback_ok, callback_err) {
    $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_report_temp"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_gen_report(rv_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(rv_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_report"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_report_custom_template(callback_ok, callback_err) {
    $.ajax({
        type: "GET",
        async: !0,
        url: rs_url + now_time_tail("report/template"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_report_custom_inquire(param, callback_ok, callback_err, beforeSend, complete) {
    var str = "";
    $.each(param, function (k, v) {
        str += ("" != str ? "&" : "") + k + "=" + encodeURIComponent(v)
    }), str += ("" != str ? "&" : "") + "sessionId=" + get_local_value("sessionId"), $.ajax({
        type: "GET",
        async: !0,
        url: rs_url + now_time_tail("report?" + str, !0),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        beforeSend: beforeSend,
        complete: complete,
        error: callback_err
    })
}
function ws_get_warn_tol(callback_ok, callback_err, beforeSend) {
    $.ajax({
        type: "GET",
        async: !0,
        url: ws_url + now_time_tail("get_warn_template_option_list"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_warn_tempCon(template_name, callback_ok, callback_err) {
    var _a = {warn_template_name: template_name}, jsonstr = $.toJSON(_a);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_warn_template_content"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_warn_template_config(params, callback_ok, callback_err, beforeSend) {
    var jsonstr = $.toJSON(params);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("warn_template_config"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_cos(wv_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(wv_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_cos_warn"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_active_code(wv_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(wv_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_event_warn"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_history(wv_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(wv_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_warn/history"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_export_sample(savetype, ws_paras, callback_ok, callback_err, beforeSend) {
    ws_paras.row_begin = "1", ws_paras.row_count = parseInt(ws_paras.row_count) > 1e5 ? ws_paras.row_count : "100000";
    var jsonstr = $.toJSON(ws_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("sample_data_search?savetype=" + savetype),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_warn_export(wsname, savetype, wv_paras, callback_ok, callback_err) {
    wv_paras.row_begin = "1", wv_paras.row_count = parseInt(wv_paras.row_count) > 1e5 ? wv_paras.row_count : "100000";
    var jsonstr = $.toJSON(wv_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail(wsname + "?savetype=" + savetype),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_oper_info(opt_str, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_operation_info?" + opt_str),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: " ",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_user_confirm(check_param, callback_ok, callback_err) {
    var jsonstr = $.toJSON(check_param);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("user_confirm"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_do_operation(exe_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(exe_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("do_operation"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_dyndata(data_json, callback_ok, callback_err, sync, timeout) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !sync,
        url: scadaserviceUrl + now_time_tail("get_dyndata"),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        timeout: timeout || 4e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_dyndata_central(data, complete) {
    env_ajax_post({url: scadaserviceUrl + "get_dyndata", data: data, complete: complete, central: !0})
}
function wsGetLightWords(data, complete) {
    env_ajax_post({url: ws_url + "get_lightwords", data_json: data, complete: complete})
}
function ws_get_expression_dyndata(data_json, callback_ok, callback_err, timeout) {
    var global_id = "";
    getCookie("global_id") && (global_id = "global_id=" + getCookie("global_id"));
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: webcal_url + now_time_tail("statistics?" + global_id),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        timeout: timeout || 4e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_infoByAlias(exe_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(exe_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_infoByAlias"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_check_sample(ws_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(ws_paras);
    $.ajax({
        type: "POST",
        async: !1,
        url: ws_url + now_time_tail("get_infoByAlias"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_display_name(ws_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(ws_paras);
    $.ajax({
        type: "POST",
        async: !1,
        url: ws_url + now_time_tail("get_infoByAlias"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_csxx(ws_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(ws_paras);
    $.ajax({
        type: "POST",
        async: !1,
        url: ws_url + now_time_tail("get_infoByAlias"),
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_old_curve(to_ws_data, callback_ok) {
    if ("true" == to_ws_data.common_curve)return void ws_get_common_curve(to_ws_data, callback_ok);
    var jsonstr2 = $.toJSON(to_ws_data);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_curve"),
        contentType: "application/json; charset=utf-8",
        data: jsonstr2,
        dataType: "json",
        timeout: 68e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_ok
    })
}
function ws_get_common_curve(to_ws_data, callback_ok) {
    var objType, scdAlias = (get_web_cfg("http_url_config"), to_ws_data.curve[0].key.split(":")[2].split("."));
    "Farm" == scdAlias[1] && "Statistics" == scdAlias[2] ? (objType = "SITE", scdAlias = scdAlias[0]) : (objType = "INV", scdAlias = scdAlias.splice(0, 3).join("."));
    var oreq = {
        scdIds: [scdAlias],
        objType: objType,
        returnType: objType,
        beginTime: to_ws_data.start_time,
        endTime: to_ws_data.end_time,
        kpis: ["prod", "accumuIrrad"],
        timeGroup: void 0
    };
    0 == to_ws_data.interval_type ? 3600 === to_ws_data.sample_cycle ? oreq.timeGroup = "H" : oreq.timeGroup = "D" : 3 == to_ws_data.interval_type ? oreq.timeGroup = "M" : oreq.timeGroup = "Y", $.ajax({
        url: get_web_cfg("http_url_config") + "apollohds/ws/rest/timeSeqKpisV2",
        data: $.toJSON(oreq),
        type: "post",
        async: !0,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 68e3,
        error: callback_err,
        success: function (data) {
            callback_login(data, function () {
                function finishTime(t) {
                    switch (oreq.timeGroup) {
                        case"H":
                            return t + ":00:00";
                        case"D":
                            return t + " 00:00:00";
                        case"M":
                            return t + "-01 00:00:00";
                        case"Y":
                            return t + "-01-01 00:00:00"
                    }
                    return t
                }

                var o = {
                    code: "10000",
                    id: to_ws_data.id,
                    start_time: to_ws_data.start_time,
                    end_time: to_ws_data.end_time,
                    timezone: "8",
                    is_dst: "0",
                    data: [{
                        id: "0",
                        key: to_ws_data.curve[0].key,
                        desc: "发电量(kWh)",
                        timezone: "8",
                        is_dst: "0",
                        Points: []
                    }, {
                        id: "1",
                        key: to_ws_data.curve[1].key,
                        desc: "辐照度累计(Wh/m2)",
                        timezone: "8",
                        is_dst: "0",
                        Points: []
                    }]
                };
                Date.prototype.Format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1,
                        "d+": this.getDate(),
                        "H+": this.getHours(),
                        "m+": this.getMinutes(),
                        "s+": this.getSeconds(),
                        "q+": Math.floor((this.getMonth() + 3) / 3),
                        S: this.getMilliseconds()
                    };
                    /(y+)/.test(fmt) && (fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
                    for (var k in o)new RegExp("(" + k + ")").test(fmt) && (fmt = fmt.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt
                };
                for (var i = new Date(to_ws_data.start_time); i < new Date(to_ws_data.end_time);)switch (o.data[0].Points.push({
                    x: i.Format("yyyy-MM-dd HH:mm:ss"),
                    y: 0
                }), o.data[1].Points.push({x: i.Format("yyyy-MM-dd HH:mm:ss"), y: 0}), oreq.timeGroup) {
                    case"H":
                        i.setHours(i.getHours() + 1);
                        break;
                    case"D":
                        i.setDate(i.getDate() + 1);
                        break;
                    case"M":
                        i.setMonth(i.getMonth() + 1);
                        break;
                    case"Y":
                        i.setYear(i.getFullYear() + 1)
                }
                if (data.data.length > 0)for (var prods = data.data[0].prod, irrads = data.data[0].accumuIrrad, i = 0; i < o.data[0].Points.length; i++)for (var prodObj = o.data[0].Points[i], irradObj = o.data[1].Points[i], j = 0; j < Math.max(irrads.length, prods.length); j++) {
                    var prod = prods[j], irrad = irrads[j];
                    if (finishTime(prod.time) == prodObj.x) {
                        prodObj.y = Math.round(prod.value), irradObj.y = Math.round(irrad.value);
                        break
                    }
                }
                callback_ok(o)
            })
        }
    })
}
function ws_export_curve(savetype, to_ws_data, callback_ok, callback_err) {
    if (!savetype)return void callback_err();
    var jsonstr2 = $.toJSON(to_ws_data);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_curve?savetype=" + savetype),
        contentType: "application/json; charset=utf-8",
        data: jsonstr2,
        dataType: "json",
        timeout: 68e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_batch_oper(ws_data, callback_ok, callback_err) {
    var jsonstr = $.toJSON(ws_data);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("do_operation"),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_point_search(data_json, callback_ok, callback_err, beforeSend, complete) {
    if ("function" != typeof beforeSend || 0 != beforeSend()) {
        sessionStorage.node_name_list && (data_json.node_name_list = sessionStorage.node_name_list);
        var new_model = "undefined" != typeof data_json.new_model && data_json.new_model;
        data_json.node_list = void 0, g_field_parm && (data_json.node_name_list = g_field_parm);
        var jsonstr = $.toJSON(data_json);
        $.ajax({
            type: "post",
            async: !0,
            url: ws_url + now_time_tail("point_search?new_model=" + new_model),
            contentType: "application/json; charset=utf-8",
            data: jsonstr,
            dataType: "json",
            success: function (data) {
                callback_login(data, callback_ok)
            },
            error: callback_err,
            complete: complete
        })
    }
}
function callback_err() {
}
function ws_get_sample(data_json, callback_ok, callback_err, beforeSend) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("sample_data_search"),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_login(data_json, callback_ok, callback_err) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("login"),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        success: callback_ok,
        error: callback_err,
        timeout: 4e4
    })
}
function ws_get_loginfo(callback_ok, sync) {
    $.ajax({
        type: "get",
        async: !sync,
        url: ws_url + add_appName_esb("login/info?_v=" + (new Date).getTime()),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback_ok,
        error: callback_ok,
        timeout: 8e3
    })
}
function ws_get_cas_ticket(data_json, callback_ok, callback_err) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_ticket"),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        success: callback_ok,
        error: callback_err
    })
}
function ws_get_ST_by_TGT(data, callback_ok, callback_err) {
    var get_url = "?TGT=" + data.TGT;
    $.ajax({
        type: "get",
        async: !!data.async,
        url: ws_url + now_time_tail("get_ST_by_TGT" + get_url),
        contentType: "application/json; charset=utf-8",
        data: "",
        dataType: "json",
        success: callback_ok,
        error: callback_err
    })
}
function ws_get_user_url(data_json, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !1,
        url: ws_url + now_time_tail("get_user_url?username=" + data_json.user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback_ok,
        error: callback_err
    })
}
function ws_logout(data_json, callback_ok, callback_err) {
    var post_url = "";
    data_json.TGT && (post_url = "?broadcast=true&TGT=" + data_json.TGT);
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        url: ws_url + now_time_tail("logout" + post_url),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        success: callback_ok,
        error: callback_err,
        timeout: 1e3
    })
}
function ws_get_temp_names(callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("sample_template"),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_temp(temp_name, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("sample_template?name=" + temp_name),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_downtime_config(callback_ok, callback_err, beforeSend, complete) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_downtime_config"),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 1e4,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        beforeSend: beforeSend,
        complete: complete
    })
}
function ws_get_downTime(data_json, callback_ok, callback_err, beforeSend, complete) {
    var isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled;
    isFullName && (data_json.isfullname = !0);
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_downTime"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_export_downtime(savetype, ws_paras, callback_ok, callback_err, beforeSend, complete) {
    var isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled;
    isFullName && (ws_paras.isfullname = !0), ws_paras.row_begin = "1", ws_paras.row_count = parseInt(ws_paras.row_count) > 6e4 ? ws_paras.row_count : "60000";
    var jsonstr = $.toJSON(ws_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: ws_url + now_time_tail("get_downTime?savetype=" + savetype),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_confirm_downtime(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("confirm_downtime"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_delete_downTime(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("delete_downTime"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_historyDownTime(head_id, callback_ok, callback_err, beforeSend, complete) {
    var isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled;
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_historyDownTime?head_id=" + head_id + (isFullName ? "&isfullname=true" : "")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_insert_downTime(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("insert_downTime"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_SCByModel(data_json, callback_ok, beforeSend, complete, syn, callback_err) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !syn,
        url: ws_url + now_time_tail("get_SCByModel"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_newDt(data_json, callback_ok, beforeSend, complete, callback_err) {
    var s_url = get_web_cfg("http_url_config"), jsonstr = $.toJSON(data_json), isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled, isfullname = isFullName ? "&isfullname=true" : "";
    $.ajax({
        type: "post",
        async: !0,
        url: s_url + now_time_tail("downtime/record?sessionId=" + get_local_value("sessionId") + isfullname),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_newDt_update(data_json, callback_ok, beforeSend, complete, callback_err) {
    var s_url = get_web_cfg("http_url_config"), jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: s_url + now_time_tail("downtime/record/update?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_newDt_insert(data_json, callback_ok, beforeSend, complete, callback_err) {
    var s_url = get_web_cfg("http_url_config"), jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: s_url + now_time_tail("downtime/record/insert?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_newDt_gettime(data_json, callback_ok, beforeSend, complete, callback_err) {
    var s_url = get_web_cfg("http_url_config"), jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: s_url + now_time_tail("downtime/record/update_time?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_dt3(opt) {
    var jsonstr, s_url = get_web_cfg("http_url_config"), type = opt.type, isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled;
    return type ? (jsonstr = "get" === type.toLowerCase() ? opt.data || {} : opt.data ? $.toJSON(opt.data) : $.toJSON({}), isFullName = (opt.url.indexOf("downtime/query_downtime") > -1 || opt.url.indexOf("downtime/query_downtime_detail") > -1) && isFullName ? "&isfullname=true" : "", $.ajax({
            type: type,
            async: !0,
            url: s_url + now_time_tail(opt.url + "?sessionId=" + get_local_value("sessionId") + isFullName),
            contentType: "application/json;charset=utf-8",
            data: jsonstr,
            dataType: "json",
            beforeSend: opt.beforeSend,
            success: function (data) {
                callback_login(data, opt.success)
            },
            error: function (xhr, status, errorThrown) {
                4 === xhr.readyState && 200 === xhr.status || !window.console || console.log(status + ":" + errorThrown)
            },
            complete: opt.complete
        })) : void(window.console && console.log("Type must be needed in " + opt.url + " !"))
}
function ws_alarm_set_cfg(callback_ok, callback_err, beforeSend, complete) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("getAlarmModifyConfig"),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        beforeSend: beforeSend,
        complete: complete
    })
}
function ws_alarm_set_api(apiName, data, callback_ok, beforeSend, complete, callback_err) {
    var jsonstr = (location.protocol + "//" + window.location.hostname + ":15001/", $.toJSON(data));
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("webServiceAdapter/" + apiName),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_newDt_getsc(data_json, callback_ok, beforeSend, complete, callback_err) {
    var s_url = get_web_cfg("http_url_config"), jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: s_url + now_time_tail("downtime/getSC_ID?&sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_privilege(param, callback_ok, callback_err, complete, async) {
    var url_param = param ? "?area=" + param : "";
    $.ajax({
        type: "get",
        async: !!async,
        url: ws_url + now_time_tail("get_privilege" + url_param),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 5e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_privilege_async(param, callback_ok, callback_err, complete) {
    ws_get_privilege(param, callback_ok, callback_err, complete, !0)
}
function ws_task_needcomplete(region, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: task_url + now_time_tail("needComplete?region=" + region + "&sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 5e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_task_common(callback_ok, complete, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: task_url + now_time_tail("common?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 5e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_task_detail(data_json, callback_ok, beforeSend, complete, callback_err) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: task_url + now_time_tail("detail?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_report_template(report, callback_ok, callback_err, syn, complete) {
    $.ajax({
        type: "get",
        async: !syn,
        url: mr_url + now_time_tail("report_template?report=" + report + "&sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 5e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_mr_template(report, callback_ok, callback_err, beforeSend, complete) {
    report = report + (report.indexOf("?") > -1 ? "&" : "?") + "sessionId=" + get_local_value("sessionId"), $.ajax({
        type: "get",
        async: !0,
        url: mr_url + now_time_tail(report),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 5e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        beforeSend: beforeSend,
        complete: complete
    })
}
function ws_get_pcc(callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: mr_url + now_time_tail("get_pcc_name?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_mr(report, data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json), timeout = 36e5, isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled, isfullname = isFullName ? "&isfullname=true" : "";
    $.ajax({
        type: "post",
        async: !0,
        url: mr_url + now_time_tail(report + (report.indexOf("?") > -1 ? "&" : "?") + "sessionId=" + get_local_value("sessionId") + isfullname),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        timeout: timeout,
        success: function (data) {
            if (report.indexOf("statistic/") == -1 && "firstfault" !== report && "powercurve" !== report && "contractavailability?type=contractdetail" !== report && isFullName && data && "[object Array]" === Object.prototype.toString.call(data.data) && data.data.length > 0)for (var i = 0, l = data.data.length; i < l; i++) {
                var d = data.data[i];
                d.wtg_name && d.fac_name && (d.wtg_name = d.fac_name + " " + d.wtg_name)
            }
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_mr_export(report, savetype, ws_paras, callback_ok, callback_err, beforeSend) {
    ws_paras.row_begin = "1", ws_paras.row_count = parseInt(ws_paras.row_count) > 1e4 ? ws_paras.row_count : "10000";
    var jsonstr = $.toJSON(ws_paras), isfullname = "";
    "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled && (isfullname = "&isfullname=true"), $.ajax({
        type: "POST",
        async: !0,
        url: mr_url + now_time_tail(report + (report.indexOf("?") > -1 ? "&" : "?") + "sessionId=" + get_local_value("sessionId") + "&savetype=" + savetype + isfullname),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_solar(dJson, callback_ok, beforeSend, complete, callback_err) {
    var isFullName = "undefined" != typeof universalizeWtgName && universalizeWtgName && universalizeWtgName.enabled, farmName = "undefined" != typeof $ && $ && $.envtool && $.envtool.getOnlyFarmName ? $.envtool.getOnlyFarmName() : "", str = "type=" + dJson.type + "&date=" + dJson.date + "&fac=" + dJson.fac;
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("apollo/energy?" + str),
        contentType: "application/json;charset=utf-8",
        data: "",
        dataType: "json",
        success: function (data) {
            if (data && "[object Array]" === Object.prototype.toString.call(data.data) && data.data.length > 0 && isFullName)for (var i = 0, l = data.data.length; i < l; i++) {
                var d = data.data[i];
                d.bay && (d.bay = (farmName ? farmName + " " : "") + d.bay)
            }
            callback_login(data, callback_ok)
        },
        error: callback_err,
        beforeSend: beforeSend,
        complete: complete
    })
}
function ws_wpi(param, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(param);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("wpi"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_dataexport_get_config(model, callback_ok, callback_err) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_data_export_config?model=" + model),
        contentType: "application/json;charset=utf-8",
        data: "",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_dataexport_get_data(para, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(para);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_data_export"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_model_list(callback_ok, callback_err) {
    var node_name_list = "";
    sessionStorage.node_name_list && (node_name_list = "?node_name_list=" + sessionStorage.node_name_list), g_field_parm && (node_name_list = "?node_name_list=" + g_field_parm), $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_model" + node_name_list),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_device_point(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_device_point"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        complete: complete,
        error: callback_err
    })
}
function ws_user_get(module, callback_ok, callback_err, beforeSend, complete) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail(module),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        complete: complete,
        error: callback_err
    })
}
function ws_userconfig(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("user_config"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        complete: complete,
        error: callback_err
    })
}
function ws_usergroupconfig(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("user_group_config"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        complete: complete,
        error: callback_err
    })
}
function ws_user_preference(opt_type, data_json, callback_ok, callback_err, beforeSend, sync, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !sync,
        url: ws_url + now_time_tail("user_preference/" + opt_type),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_preference(opt_type, params) {
    var jsonstr = $.toJSON(params.data);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail_central("user_preference/" + opt_type),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: params.beforeSend,
        success: function (data) {
            callback_login(data, params.success)
        },
        error: params.error,
        complete: params.complete
    })
}
function ws_user_preference_config(name, callback_ok, callback_err, sync) {
    var str = "" != name ? "?name=" + name : "";
    $.ajax({
        type: "get",
        async: !sync,
        url: ws_url + now_time_tail("user_preference/config" + str),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_sea_weather(sea_parms, callback_ok, callback_err) {
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_farm_weather?farm_alais=" + sea_parms.target_farm),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 8e3,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_get_history_data(strJson, callback_ok, callback_err, beforeSend, complete) {
    var str = "";
    $.each(strJson, function (key, val) {
        str += "" == str ? key + "=" + val : "&" + key + "=" + val
    }), $.ajax({
        type: "get",
        async: !0,
        url: scadaserviceUrl + now_time_tail("history_data?" + str),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_localtime(alias, callback_ok, callback_err, beforeSend, complete) {
    callback_ok({code: 1e4})
}
function ws_check_auth(data_json, callback_ok, callback_err, beforeSend, complete, asyn) {
    $.ajax({
        type: "get",
        async: "undefined" == typeof asyn || asyn,
        url: ws_url + now_time_tail("check_auth?id=" + data_json.id + ("undefined" != typeof data_json.region && null != data_json.region && "" != data_json.region ? "&region=" + data_json.region : "")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_pagemenu(roleId, callback_ok, callback_err, beforeSend, complete) {
    $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("pages" + ("undefined" != typeof roleId && "" != roleId ? "?role_id=" + roleId : "")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_updatepage(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("pages/update"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_menu(region, callback_ok, callback_err, beforeSend, complete) {
    $.ajax({
        type: "get",
        async: !1,
        url: ws_url + now_time_tail("menu" + ("undefined" != typeof region && "" != region ? "?region=" + region : "")),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_allMenu(complete) {
    env_ajax_get({url: ws_url + "apps", complete: complete, async: !1, central: !0})
}
function ws_get_save_file_by_data(data_json, callback_ok, callback_err, beforeSend) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("get_save_file_by_data"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_for_log(data_json) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("write_log"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        timeout: 5e3
    })
}
function wsGetColorCfg(strJson, callback_ok, callback_err, beforeSend, complete) {
    var str = "";
    $.each(strJson, function (key, val) {
        str += (str ? "&" : "") + key + "=" + val
    }), $.ajax({
        type: "get",
        async: !0,
        url: ws_url + now_time_tail("get_color_config?" + str),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function wsConfirmSignal(data_json, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(data_json);
    $.ajax({
        type: "post",
        async: !0,
        url: ws_url + now_time_tail("confirm_signal"),
        contentType: "application/json;charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function callback_login(data, callback_ok) {
    if (null != data && "30000" == data.code) {
        var message;
        message = callback_ok ? 3e4 + callback_ok.toString() : 3e4, try_to_login("error", message, data)
    } else sessionStorage.region_list = get_local_value("region_list"), "function" == typeof callback_ok && callback_ok(data)
}
function add_tail() {
    return "?nowTime=" + (new Date).getTime()
}
function add_tail_brother() {
    return "&nowTime=" + (new Date).getTime()
}
function now_time_tail(url, nocode) {
    if (url = url || "", url += url.indexOf("?") >= 0 ? "&nowTime=" + (new Date).getTime() : "?nowTime=" + (new Date).getTime(), is_portal2_login() && get_local_value("nodeRole")) {
        var nodeRole = get_local_value("nodeRole");
        url += "&nodeRole=" + (nocode ? encodeURIComponent(nodeRole) : nodeRole)
    }
    return nocode ? add_site_node(url) : encodeURI(add_site_node(url))
}
function now_time_tail_central(url) {
    return url = now_time_tail(url), removeUrlValue(url, "site_node")
}
function treeOrderDefault(a, b) {
    if ("undefined" != typeof a.display_name && null != a.display_name && "undefined" != typeof b.display_name && null != b.display_name)return a.display_name < b.display_name ? -1 : a.display_name > b.display_name ? 1 : 0
}
function treeOrderSpell(a, b) {
    if ("undefined" != typeof a.display_name && null != a.display_name && "undefined" != typeof b.display_name && null != b.display_name)return a.display_name.localeCompare(b.display_name)
}
function ws_get_quick_agc_info(callback_ok, callback_err, beforeSend) {
    $.ajax({
        type: "get",
        async: !0,
        url: ems_url + now_time_tail("get_quick_agc_info?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_operate_quick_agc(operatePara, callback_ok, callback_err, beforeSend, complete) {
    var jsonstr = $.toJSON(operatePara);
    $.ajax({
        type: "post",
        async: !0,
        url: ems_url + now_time_tail("operate_quick_agc?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json; charset=utf-8",
        data: jsonstr,
        dataType: "json",
        beforeSend: beforeSend,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err,
        complete: complete
    })
}
function ws_get_wfpc_info(parm, callback_ok, callback_err) {
    $.ajax({
        type: "GET",
        async: !0,
        url: wfpc_url + now_time_tail("get_wfpc_info?farm_alias=" + parm + "&sessionId=" + get_local_value("sessionId")),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function ws_save_wfpc_info(save_paras, callback_ok, callback_err) {
    var jsonstr = $.toJSON(save_paras);
    $.ajax({
        type: "POST",
        async: !0,
        url: wfpc_url + now_time_tail("save_wfpc_info?sessionId=" + get_local_value("sessionId")),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: jsonstr,
        success: function (data) {
            callback_login(data, callback_ok)
        },
        error: callback_err
    })
}
function test_home_page() {
    "function" != typeof home_ticket_login || window.isToOtherPage || home_ticket_login()
}
function set_min_width(width) {
    $("#header").css({"min-width": width + "px"}), $("#bottom").css({"min-width": width + "px"}), $("#center").css({"min-width": width + "px"})
}
function get_pages_map() {
    return {
        v_graph: "graph_view",
        v_alarm: "alarm_view",
        v_manage: "manage_report",
        v_powercurve: "power_curve",
        v_poweranalyze: "power_curve",
        v_report: "report_view",
        v_parts: "parts_view",
        v_downtime: "downtime_view",
        v_warn: "warn_view",
        v_sample: "sample_view",
        v_curve_xy: "XY_plot",
        v_curve: "curve_view",
        v_dataexporter: "data_exporter",
        v_solar: "solar_report",
        v_curve_di: "curve_di",
        v_reportcustom: "report_custom",
        v_task: "task_view"
    }
}
function check_page_auth(menu) {
    var pages = get_pages_map(), pageid = "", region = g_field_parm, page = getFileName(window.location.href, "/", ".");
    if (menu && menu.constructor == Array && menu.length > 0)return pageid = pages[page], void(pageid && $.each(menu, function (key, obj) {
        var mc = obj.children;
        obj.id == pageid && "0" == obj.show && (window.location.href = add_version_tail("../error/error.html")), mc && mc.constructor == Array && mc.length > 0 && $.each(mc, function (i, v) {
            v.id == pageid && "0" == v.show && (window.location.href = add_version_tail("../error/error.html"))
        })
    }));
    if ("v_graph" == page) {
        var firstsvg = getQueryString("first_svg");
        firstsvg ? (firstsvg = firstsvg.split("/"), pageid = pages[page] + "," + firstsvg[firstsvg.length - 1]) : pageid = pages[page]
    } else if ("v_curve" == page) {
        var for_XY = getQueryString("for_XY");
        pageid = 1 == for_XY ? pages.v_curve_xy : pages[page]
    } else pageid = pages[page];
    if (pageid) {
        var data_json = {id: pageid, region: region};
        ws_check_auth(data_json, function (record) {
            record && "10000" != record.code && (window.history.go(-1), window.location.href = add_version_tail("../error/error.html"))
        }, null, null, null, !0)
    }
}
function test_web_cfg() {
    get_web_cfg("to_login") && "login" != getFileName(window.location.href, "/", ".") && try_to_login("error", g_web_cfg.to_login.toString())
}
function test_IE(login_btn) {
    return !!test_html5() || (test_html5() || "login" == getFileName(window.location.href, "/", ".") || try_to_login("warn", "test_IE failed!"), !test_html5() && login_btn ? (alert(JSLocale.test_IE_inter), !1) : void 0)
}
function hide_body() {
    $("body").css({visibility: "hidden"}), $("body").css("display", "block")
}
function show_body() {
    $("body").css({visibility: "visible"}), $("body").show()
}
function show_center() {
    $("#center").css({visibility: "visible"})
}
function tryto_show_body() {
    test_session_no--, 0 == test_session_no && show_body()
}
function check_user_config() {
    (!/^-?\d+$/.test("" + my_history_curve_refresh_time) && !/^(-?\d+)(\.\d+)?$/.test("" + my_history_curve_refresh_time) || my_history_curve_refresh_time <= 5e3) && (my_history_curve_refresh_time = 3e5)
}
function get_url_language() {
    scada_language_config = get_web_cfg("scada_language_config");
    var lan = getCookie("portallanguage") || getCookie("locale"), url_lang = getQueryString("lang") || getQueryString("language");
    if (enable_language_switch) {
        "" !== lan && null !== lan && (scada_language_config = lan.substring(0, 2).toLowerCase());
        var langType = "undefined" == typeof g_web_cfg.languageType ? [] : g_web_cfg.languageType;
        if (langType && langType.length > 0) {
            for (var i = 0; i < langType.length; i++)if (url_lang === langType[i].name) {
                scada_language_config = url_lang;
                break
            }
        } else switch (url_lang) {
            case"zh":
            case"en":
            case"es":
                scada_language_config = url_lang
        }
    } else switch (url_lang) {
        case"zh":
        case"en":
        case"es":
            scada_language_config = url_lang
    }
}
function load_page() {
    $.ajaxSetup({async: !1});
    try {
        "user" != getFileName(window.location.href, "/", ".") && $("#header").length > 0 && $("#header").load(add_version_tail("../header/header.html")), "user" == getFileName(window.location.href, "/", ".") && $("#exit").length <= 0 && $("#header_right").load(add_version_tail("../header/header.html") + " #exit"), $("#bottom").length > 0 && $("#bottom").load(add_version_tail("../footer/footer.html"))
    } catch (err) {
    }
    $.ajaxSetup({async: !0})
}
function get_user_first_svg() {
    g_user_first_svg = uncertain_local_data("first_svg"), g_user_first_svg = fill_firstpage_param(g_user_first_svg)
}
function get_now_field() {
    if (!is_login_home_page()) {
        if (window.gNodeMenuShow && gNodeMenuShow.nowNode) {
            var field = gNodeMenuShow.nowNode.alias || gNodeMenuShow.nowNode.name || "";
            return field = "System" == field || "system" == field ? "" : field, void(sessionStorage.local_current_filed = sessionStorage.node_name_list = g_field_parm = field)
        }
        if ("1" == getQueryString("from_parent_system")) {
            var svg = getQueryString("first_svg");
            has_url(svg) && (sessionStorage.first_svg = svg)
        }
        var field_parm = uncertain_local_data("field_parm");
        if (has_url(field_parm) && uncertain_local_data("field_parm") == uncertain_local_data("farm_list"))return sessionStorage.local_current_filed = sessionStorage.node_name_list = g_field_parm = field_parm, g_field_parm;
        if ("v_graph" != g_now_html_name || getQueryString("outer_url"))if (getQueryString("gFieldParm")) field_parm = getQueryString("gFieldParm"); else {
            if (sessionStorage.local_current_filed)return void(g_field_parm = sessionStorage.local_current_filed);
            var first_svg = g_user_first_svg;
            has_url(first_svg) && first_svg.indexOf("/") >= 0 && (field_parm = first_svg.split("/")[0])
        } else {
            var first_svg = getQueryString("first_svg");
            has_url(first_svg) || (first_svg = g_user_first_svg), has_url(first_svg) && first_svg.indexOf("/") >= 0 && (field_parm = first_svg.split("/")[0])
        }
        return field_parm = field_parm || "", sessionStorage.local_current_filed = sessionStorage.node_name_list = g_field_parm = field_parm, g_field_parm
    }
}
function get_next_field(tree_node) {
    if (tree_node) {
        var field_parm = "";
        if (!has_farm_parent(tree_node) || "FACTORY" == tree_node.node_type)return field_parm = tree_node.alias || tree_node.name, sessionStorage.local_current_filed = sessionStorage.node_name_list = field_parm
    }
}
function get_parent_farm(tree_node) {
    if (tree_node)for (; tree_node = tree_node.getParentNode();)if ("FACTORY" == tree_node.node_type)return tree_node;
    return null
}
function set_menu_field_url(menus) {
    if (menus && menus.length > 0) {
        var farm_list = uncertain_local_data("farm_list") || "";
        farm_list = farm_list.split(","), farm_list = array_remove_null(farm_list), $.each(menus, function (i, item) {
            "1" == item.level && g_field_parm && farm_list && farm_list.indexOf(g_field_parm) >= 0 && (item.show = "0", item.url = ""), "2" == item.level && (!g_field_parm || g_field_parm && farm_list && farm_list.indexOf(g_field_parm) < 0) && (item.show = "0", item.url = ""), "0" != item.show, item = item.children, set_menu_field_url(item)
        })
    }
}
function url_add_field(item) {
    url = item.url;
    var first_svg = getUrlValue(url, "first_svg"), old_svg = first_svg;
    if (g_field_parm && first_svg && first_svg.indexOf("/") < 0 && (first_svg = replace_name_space(g_field_parm) + "/" + first_svg), first_svg && g_field_parm) {
        var values = first_svg.split(" ");
        values = array_remove_null(values), 1 == values.length && (first_svg += " " + replace_name_space(g_field_parm))
    }
    item.url = url.replace("first_svg=" + old_svg, "first_svg=" + encodeURIComponent(first_svg))
}
function is_login_home_page() {
    return "login" == g_now_html_name || "home" == g_now_html_name
}
function updateMenuTextByi18n(menuInfo) {
    for (var i = 0; i < menuInfo.length; i++)menu = menuInfo[i], menu.text = window.i18nMenuInfo[menu.id] || menu.text, menu.children && updateMenuTextByi18n(menu.children);
    return menuInfo
}
function handleCopyright(copyright) {
    var regExp = new RegExp(/\{[^\}]+\}/g);
    if (!regExp.test(copyright))return copyright;
    var year = (new Date).getFullYear();
    if (g_field_date && g_field_date.time) {
        var tempYear = new Date(g_field_date.time).getFullYear();
        isNaN(tempYear) || (year = tempYear)
    }
    return copyright.replace(regExp, year)
}
function init_page_menuItem() {
    return is_login_home_page() ? void(g_head_cfg && g_head_cfg.copyright && (enable_language_switch && JSLocale.copyright_inter.html, $("#env_copyright").html(handleCopyright(g_head_cfg.copyright[scada_language_config || "zh"])))) : (gNodeMenuShow.isNodeAppCfg() || gGetWindOrPortalMenu.getWindOrPortalMenu(g_field_parm, function (record) {
            "undefined" != typeof record && record || (g_head_cfg.menu = []), record.menu && "function" == typeof sort_head && (g_head_cfg.menu = record.menu, gNodeMenuShow.allMenus = gNodeMenuShow.copyMenus2(g_head_cfg.menu), g_show_app_menu.get_now_app_menu(g_head_cfg.menu), gNodeMenuShow.findNowMenu(g_head_cfg.menu), gNodeMenuShow.allApps = gNodeMenuShow.copyMenus2(g_head_cfg.app_menu), gNodeMenuShow.nowMenus = gNodeMenuShow.copyMenus2(g_head_cfg.menu))
        }), sort_head(g_head_cfg), set_menu_field_url(g_head_cfg.menu), $("#env_menu").empty(), enable_language_switch && window.i18nMenuInfo && (g_head_cfg.menu = updateMenuTextByi18n(g_head_cfg.menu)), init_accordion_dom({
            res_path: null,
            menu: g_head_cfg.menu
        }, !1), init_accordion_event(), load_set_event(), load_newpage(), void show_center())
}
function load_newpage() {
    if (g_head_cfg) {
        if ("[object Array]" == Object.prototype.toString.call(g_head_cfg.tree_color_cfg)) {
            for (var treeColor = g_head_cfg.tree_color_cfg, media = {}, i = 0, l = treeColor.length; i < l; i++) {
                var treeColorElem = treeColor[i];
                treeColorElem.bay_type && treeColorElem.font_color && (media[treeColorElem.bay_type.toLowerCase()] = treeColorElem.font_color)
            }
            g_head_cfg.tree_color_cfg = media, media = null
        }
        handle_newpage_menu(), enable_language_switch && JSLocale.copyright_inter.html, $("#env_copyright").html(handleCopyright(g_head_cfg.copyright[scada_language_config || "zh"]));
        var web_site = getFileName(window.location.href, "/", ".");
        if ("login" != web_site && "home" != web_site) {
            var option = {
                wind_farm_name: "",
                menu_data: {res_path: null, menu: g_head_cfg.menu},
                user_info: {username: get_local_value("username") || ""},
                user_logo: get_local_value("user_logo") || "",
                new_tab: !1,
                need_shortcuts: !1,
                need_fixed_top: !1,
                need_fixed_bottom: !1,
                multi_language: scada_language_config || "zh",
                set_wf_time: function () {
                },
                logout: function () {
                    scada_logout()
                },
                clickFarm: function () {
                    var treeArr = [];
                    try {
                        treeArr = JSON.parse(sessionStorage.nodes)
                    } catch (e) {
                        console.log(e)
                    }
                    if (!(treeArr.length <= 0)) {
                        var t = [];
                        try {
                            t = JSON.parse(sessionStorage.expand_node_id)
                        } catch (e) {
                        }
                        if (t.length > 0)for (var i = 0, len = treeArr.length; i < len; i++)(treeArr[i].alias && $.inArray(treeArr[i].alias, t) > -1 || $.inArray(treeArr[i].name, t) > -1) && (treeArr[i].open = !0);
                        var setting = {
                            callback: {
                                onClick: click_tree_node,
                                onExpand: function (event, treeId, treeNode) {
                                    var t = JSON.parse(sessionStorage.expand_node_id);
                                    t.push(treeNode.name), treeNode.alias && t.push(treeNode.alias), sessionStorage.expand_node_id = JSON.stringify(t), sessionStorage.isOperateTree = !0
                                },
                                onCollapse: function (event, treeId, treeNode) {
                                    var t = JSON.parse(sessionStorage.expand_node_id);
                                    t.scadaRemove(treeNode.name), treeNode.alias && t.scadaRemove(treeNode.alias), sessionStorage.expand_node_id = JSON.stringify(t), sessionStorage.isOperateTree = !0
                                }
                            }, view: {
                                fontCss: function (treeId, treeNode) {
                                    var nodeLevel = treeNode.level, nodeType = treeNode.node_type;
                                    treeNode.isParent;
                                    if (gNodeMenuShow.isGrayNode(treeNode))return {
                                        color: "gray",
                                        opacity: .8,
                                        cursor: "default",
                                        "text-decoration": "none",
                                        color: "gray!important"
                                    };
                                    if (0 == nodeLevel && (nodeType = "root"), nodeType && g_head_cfg.tree_color_cfg) {
                                        var nodeColor = g_head_cfg.tree_color_cfg[nodeType.toLowerCase()];
                                        if (nodeColor)return {color: nodeColor}
                                    }
                                    return {}
                                }
                            }
                        }, newTree = init_env_nav_tree(setting, treeArr, null, null);
                        sessionStorage.isOperateTree || 1 != get_web_cfg("if_expand") || expandAnyLevelNode(newTree, "FACTORY");
                        var farmNodes = farmCommSts.getFarmNodes();
                        farmNodes && farmNodes.length <= 0 && (farmNodes = newTree.getNodesByParam("node_type", "FACTORY"), farmCommSts.updateFarmNodes(farmNodes), farmCommSts.stopTimer(), farmCommSts.getFarmCommSts())
                    }
                }
            };
            init_env_nav_menu2(option), $.envtool.getFarmName(30, g_field_parm), enable_language_switch && JSLocale.copyright_inter.html, $("#env_copyright").html(handleCopyright(g_head_cfg.copyright[scada_language_config || "zh"])), "function" == typeof resize_menu && resize_menu(), load_set_event()
        }
    }
}
function expandAnyLevelNode(treeObj, node_type) {
    for (var node = treeObj.getNodesByParam("node_type", node_type, null), level = node[0].level, allNode = treeObj.transformToArray(treeObj.getNodes()), i = 0; i < allNode.length; i++)allNode[i].level < level && treeObj.expandNode(allNode[i], !0, !1, !0, !0)
}
function load_set_event() {
    $("#changePwd").unbind("click").bind("click", changePwd), click_graph(), hide_change_password(), $("#about_view").length > 0 && $("#about_view").unbind("click").bind("click", function (e) {
        var _this = $(this);
        Util.Dialog({
            title: _this.text(),
            boxID: "envisionInfo",
            width: 450,
            height: 200,
            fixed: !0,
            content: 'text:<div class="eaboutus"><p id="envisonLogo" class="elogo"></p><p id="envisonVersion" class="eversion"></p><p id="envisonCopyright" class="ecopyright"></p></div>',
            showbg: !0,
            ofns: function () {
                $("#envisonLogo").html('<img src="' + JSLocale.general_aboutus_logo_path + '"/>'), $("#envisonVersion").html(g_head_cfg.version.version), $("#envisonCopyright").html(handleCopyright(g_head_cfg.copyright[scada_language_config || "zh"]))
            },
            yesBtn: ["<span class='submit_btn_inter inter'>" + JSLocale.submit_btn_inter.label_class + "<span>", function () {
                return !0
            }],
            noBtn: null
        })
    })
}
function handle_newpage_menu() {
    var menu = g_head_cfg.menu, lang = scada_language_config || "zh";
    set_menu_field_url(menu), check_page_auth(menu), $.each(menu, function (i) {
        menu[i].text = menu[i][lang], menu[i].new_tab = !(!menu[i].openmode || "1" != menu[i].openmode), "" != menu[i].url.trim() && "#" != menu[i].url.trim() && (menu[i].url = add_version_tail(menu[i].url)), "" != menu[i].icon.trim() && (menu[i].icon = add_version_tail(menu[i].icon));
        var children = menu[i].children;
        if (children && children.length > 0) {
            for (var k = 0; k < children.length; k++)children[k].text = children[k][lang], children[k].new_tab = !(!children[k].openmode || "1" != children[k].openmode), "" != children[k].url.trim() && "#" != children[k].url.trim() && (children[k].url = add_version_tail(children[k].url)), "" != children[k].icon.trim() && (children[k].icon = add_version_tail(children[k].icon));
            menu[i].children = children
        }
    }), g_head_cfg.menu = menu;
    var needset = !(!g_head_cfg.show_setting || !g_head_cfg.show_setting.ifshow || "1" != g_head_cfg.show_setting.ifshow);
    if (needset) {
        var setChild = [];
        if ("1" == get_local_value("is_supper") && "" != get_local_value("node_list") && ($("#user_manage").hide(), setChild.push({
                children: [],
                icon: add_version_tail("../project/images/menu/scada_useradmin.png"),
                id: "user_manage",
                show: "1",
                priv_type: -1,
                new_tab: !0,
                text: JSLocale.umdocumenttitle.label_class,
                url: add_version_tail("../user/user.html")
            })), is_portal2_login() || setChild.push({
                children: [],
                icon: add_version_tail("../project/images/menu/scada_password.png"),
                id: "changePwd",
                show: "1",
                priv_type: -1,
                text: JSLocale.changePwd.label_class,
                url: ""
            }), "1" == get_local_value("is_supper") && setChild.push({
                children: [],
                icon: add_version_tail("../project/images/menu/scada_useradmin.png"),
                id: "system_set",
                show: "1",
                priv_type: -1,
                text: JSLocale.set_page.system,
                url: "../v_set/system.html",
                openmode: 1,
                new_tab: !0
            }), "undefined" != typeof g_head_cfg && g_head_cfg && g_head_cfg.set_preference && "true" === g_head_cfg.set_preference.enabled && setChild.push({
                children: [],
                icon: add_version_tail("../project/images/menu/scada_useradmin.png"),
                id: "wtg_name_set",
                show: "1",
                priv_type: -1,
                text: JSLocale.g_change_name_set,
                url: "../v_set/",
                openmode: 1,
                new_tab: !0
            }), setChild.push({
                children: [],
                icon: add_version_tail("../project/images/menu/scada_about.png"),
                id: "about_view",
                show: "1",
                priv_type: -1,
                text: JSLocale.general_aboutus,
                url: ""
            }), "v_graph" == g_now_html_name && setChild.push({
                children: [],
                icon: add_version_tail("../project/images/menu/scada_password.png"),
                id: "check_all_svg",
                show: "1",
                priv_type: -1,
                text: JSLocale.check_svg_inter.label_class,
                url: ""
            }), setChild.length > 0) {
            var p = {
                children: setChild,
                icon: add_version_tail("../project/images/menu/scada_set.png"),
                id: "",
                show: "1",
                priv_type: -1,
                text: JSLocale.general_settings,
                url: ""
            };
            if (g_head_cfg.menu.length > 0) {
                for (var count = 0, i = 0; i < g_head_cfg.menu.length; i++)if ("about_view" == g_head_cfg.menu[i].id) {
                    g_head_cfg.menu[i].show = !1, count++;
                    break
                }
                g_head_cfg.menu.push(p)
            } else g_head_cfg.menu.push(p)
        }
    }
}
function try_to_init_tree() {
    is_login_home_page() || "function" == typeof init_site_tree && "home" != g_now_html_name && init_site_tree()
}
function click_menu_href(a) {
    if (a && a.getAttribute) {
        var url = a.getAttribute("url"), _blank = "_self";
        ("_blank" == a.getAttribute("url_target") || event && event.ctrlKey) && (_blank = "_blank"), url && url.indexOf(".html") >= 0 ? window.open(add_version_tail(url), _blank) : "#" == url && window.open(url, _blank)
    }
}
function getLangConfig(langType) {
    for (var langConfig = [], i = 0; i < langType.length; i++)langConfig.push({
        value: langType[i].dispName,
        flag: langType[i].name
    });
    return langConfig
}
function init_language() {
    if (get_url_language(), "undefined" != typeof Easy_inter) {
        $.ajaxSetup({async: !1, cache: !0});
        var langType = "undefined" == typeof g_web_cfg.languageType ? [] : g_web_cfg.languageType;
        enable_language_switch && langType && langType.length > 0 ? Easy_inter.language = getLangConfig(langType) : Easy_inter.language = [{
                value: "English",
                flag: "en"
            }, {value: "中文", flag: "zh"}, {
                value: "Spanish",
                flag: "es"
            }], Easy_inter.def_language = scada_language_config, Easy_inter.init(), $.ajaxSetup({
            async: !0,
            cache: !0
        }), window.setCookie && setCookie("windosWebLang", scada_language_config)
    }
}
function init_pop_language(container, parent_obj) {
    "undefined" != typeof Easy_inter && "undefined" != typeof JSLocale && (Easy_inter.container = container, Easy_inter.traverse_json(parent_obj ? parent_obj : JSLocale, "all"))
}
function try_to_login(level, reason, data) {
    is_portal2_login() && sessionStorage.region_list && (window.isPortalLogout = !0);
    var ws_log = {level: level, message: reason};
    return ws_for_log(ws_log), empty_buf(), is_new_portal2() ? (setFleetHistory(), void to_portal_page()) : !isPortal2Logout() || "login" == g_now_html_name && "1" == getQueryString("clear_portal") ? "login" != g_now_html_name ? (set_local_value("historyurl", window.location.href), setFleetHistory(), void window.open(re_url + add_version_tail("login/login.html?history=1"), "_self")) : void show_body() : void(window.location.href = get_web_cfg("portal_login_url"))
}
function getFleetHistory() {
    var fleetmdmid = getQueryString("fleetmdmid");
    if (!fleetmdmid) {
        var graph_svg = get_local_value("graph_svg");
        getQueryString("from_portal") && graph_svg && getUrlValue(graph_svg, "fleetmdmid") && (fleetmdmid = getUrlValue(graph_svg, "fleetmdmid"))
    }
    return fleetmdmid = fleetmdmid && gNodeMenuShow.farmTreeObject ? gNodeMenuShow.farmTreeObject.getNodeByParam("mdm_id", fleetmdmid) : ""
}
function setFleetHistory() {
    "login" != g_now_html_name && (getQueryString("fleetmdmid") ? set_local_value("graph_svg", window.location.href) : set_local_value("graph_svg", ""))
}
function to_history(url) {
    var historyurl = get_local_value("graph_svg");
    if ("1" == uncertain_local_data("is_supper")) {
        if (!uncertain_local_data("node_list"))return void(window.location.href = add_version_tail(re_url + "user/user.html"))
    } else"user" == getFileName(historyurl, "/", ".") && (set_local_value("historyurl", ""), historyurl = "");
    return has_url(historyurl) && getUrlValue(historyurl, "fleetmdmid") ? "error" == getFileName(historyurl, "/", ".") || "v_graph" == getFileName(historyurl, "/", ".") && !get_local_value("graph_svg") ? void to_graph_html() : (window.location.href = add_version_tail(historyurl), void set_local_value("graph_svg", "")) : void(url && url.indexOf(".html") >= 0 ? (url = add_version_tail(url), window.location.href = url) : to_graph_html())
}
function scada_logout(event) {
    event && event.target && is_portal2_login() && (window.isPortalLogout = !0);
    var user_name = get_local_value("username");
    $("#user_name").html("");
    var ws_data = {user_name: user_name ? user_name : "", time_stamp: date_format2(new Date)};
    is_CAS_login() && (ws_data.broadcast = "true", ws_data.TGT = get_local_value("TGTticket"));
    var ws_log = {level: "info", message: "logout success!"};
    return ws_for_log(ws_log), ws_logout(ws_data, null, null), logout_to_login(), !1
}
function logout_to_login(data) {
    var web_site = getFileName(window.location.href, "/", ".");
    return "login" != web_site && set_local_value("historyurl", window.location.href), is_new_portal2() ? void to_portal_page() : (!isPortal2Logout() || "login" == g_now_html_name && "1" == getQueryString("clear_portal") ? try_to_login("info", "logout success!") : window.location.href = get_web_cfg("portal_login_url"), void empty_buf())
}
function get_url_field(url) {
    if (!url)return "";
    var regex = /:\/\/[^&^\?^\/]*/, match = url.match(regex);
    return match || match.length > 0 ? url.substring(0, match.index) + match[0] : ""
}
function clear_important_cache() {
    del_local_value("username"), del_local_value("first_svg"), del_local_value("field_parm"), del_local_value("node_list"), del_local_value("is_supper"), del_local_value("farm_list"), del_local_value("region_list"), del_local_value("nodeRole"), del_local_value("windos_app_name"), deleteCookie("global_id"), deleteCookie("userName"), deleteCookie("ESBID"), deleteCookie("userId");
    var session_vid = get_session_value("session_vid"), clear_portal = get_session_value("clear_portal");
    sessionStorage.clear(), is_login_home_page() && (set_session_value("session_vid", session_vid), "1" == clear_portal && set_session_value("clear_portal", clear_portal))
}
function setLangCookie(lang) {
    lang && (setCookie("portallanguage", lang), setCookie("lang", lang), setCookie("locale", lang))
}
function empty_buf() {
    if (clear_total_tree(), is_new_portal2())return void clear_important_cache();
    var lan = getCookie("portallanguage") || getCookie("locale");
    clearCookie(), "null" !== lan && null !== lan && setLangCookie(lan);
    var session_vid = get_session_value("session_vid");
    sessionStorage.clear();
    var history = get_local_value("historyurl"), portal2 = get_local_value("portal2"), web_config = get_local_value("g_web_cfg"), head_config = get_local_value("g_head_cfg"), app_page_cfg = get_local_value("app_page_cfg"), graph_svg = get_local_value("graph_svg"), page_count = localStorage.page_count;
    localStorage.clear(), localStorage.page_count = page_count, set_local_value("historyurl", history), set_local_value("portal2", portal2), set_local_value("graph_svg", graph_svg);
    getFileName(window.location.href, "/", ".");
    is_login_home_page() && (set_local_value("g_web_cfg", web_config), set_local_value("g_head_cfg", head_config), set_local_value("app_page_cfg", app_page_cfg), set_session_value("session_vid", session_vid))
}
function init_header_user() {
    $("#header").length <= 0 || (show_user_url(), $("#user_name").click(function () {
        $(".child_list_div").toggle()
    }), addEventHandler(document, "click", function (event) {
        var e = event || window.event, obj = e.srcElement ? e.srcElement : e.target;
        obj && "user_name" == obj.id || $(".child_list_div").hide()
    }))
}
function ckeck_page_url() {
    var temp = getFileName(window.location.href, "/", ".");
    "v_graph" != temp && (delete sessionStorage.ad_records, delete sessionStorage.ad_last_no, delete sessionStorage.alarm_sounds), "v_graph" == temp && "undefined" != typeof sessionStorage.pager && "v_graph" != sessionStorage.pager ? (sessionStorage.other_to_graph = !0, sessionStorage.ad_last_no = 0, sessionStorage.alarm_sounds = JSON.stringify([])) : sessionStorage.other_to_graph = !1, sessionStorage.pager = temp
}
function check_nodenamelist() {
    g_field_parm && "v_graph" != g_now_html_name && ws_get_infoByAlias({
        alias_list: [{alias: g_field_parm}],
        para_list: [{para: "disp_name"}]
    }, handle_tab_title, null)
}
function handle_tab_title(result) {
    if (result && result.code && "10000" == result.code.toString() && result.data && result.data[0]) {
        var old_title = $("title").text(), last_title = result.data[0].disp_name || g_field_parm;
        last_title && old_title.indexOf("(") <= 0 && $("title").text(old_title + "(" + last_title + ")")
    }
}
function click_tree_node(e, treeId, treeNode, new_tab, is_btn) {
    return !gNodeMenuShow.isGrayNode(treeNode) && (new_tab = "new_tab" == new_tab, new_tab = e && e.ctrlKey || new_tab, gNodeMenuShow.is_app_page_modle() ? void gNodeMenuShow.switchPageWidthApp(treeNode, new_tab, is_btn) : void toTreeGraphPage(treeNode, new_tab, is_btn))
}
function toTreeGraphPage(treeNode, new_tab) {
    return "-/-" == treeNode.graph_file ? (sessionStorage.removeItem("first_svg"), void to_url_with_new_tab("../v_graph/v_graph.html", new_tab)) : (new_tab && (new_tab = "new_tab"), node_local_url(treeNode, new_tab), treeNode.old_svg && (treeNode.graph_file = treeNode.old_svg), void(treeNode.to_graph_app = void 0))
}
function node_local_url(treeNode, new_tab) {
    if (!has_graph_file(treeNode))return !1;
    var url = btn_param2url(treeNode.graph_file, treeNode);
    to_url_with_new_tab(url, new_tab)
}
function has_graph_file(treeNode) {
    return !(!treeNode || !treeNode.graph_file) || (alert(JSLocale.no_svg_inter), !1)
}
function switch_to_new_svg(btn_param, new_tab) {
    if (is_portal2_login()) {
        var svg_name = btn_param.split(" ");
        svg_name = array_remove_null(svg_name), svg_name = svg_name[0];
        var field_parm = "";
        svg_name.indexOf("/") >= 0 && (field_parm = svg_name.split("/")[0]);
        var treeNode = get_node_from_tree(null, field_parm, field_parm, btn_param), treeNodes = get_nodes_from_tree(null, field_parm, field_parm, svg_name);
        if (treeNode && treeNodes && 1 == treeNodes.length)return treeNode.old_svg = treeNode.graph_file, treeNode.graph_file = btn_param, node_local_url(treeNode, new_tab), void(treeNode.old_svg && (treeNode.graph_file = treeNode.old_svg, treeNode.old_svg = void 0))
    }
    var url = btn_param2url(btn_param);
    to_url_with_new_tab(url, new_tab)
}
function clickMenuOrApp(href, new_tab, nodeFiled) {
    if (href = href || "", href.indexOf("v_graph.html") > 0) {
        var first_svg = getUrlValue(href, "first_svg");
        click_svg_href(first_svg, href, new_tab, nodeFiled)
    } else to_url_with_new_tab(href, new_tab, nodeFiled)
}
function click_svg_href(svg_name, href, new_tab, nodeFiled) {
    svg_name = svg_name || "";
    var field_parm = nodeFiled || g_field_parm;
    if (svg_name.indexOf("/") >= 0 && (field_parm = svg_name.split("/")[0]), !field_parm) {
        var region_list = uncertain_local_data("region_list");
        region_list && region_list.indexOf(",") < 0 && (field_parm = region_list)
    }
    if (!field_parm || "system" == nodeFiled || "System" == nodeFiled) {
        svg_name.indexOf(" ") < 0 && (svg_name += " " + replace_name_space(uncertain_local_data("region_list")));
        var svg = encodeURIComponent(btn_param2svg(svg_name, treeNode));
        return url = href.replace(/first_svg=[^\?&]*/, "first_svg=" + svg), void to_url_with_new_tab(url, new_tab, nodeFiled)
    }
    var treeNode = get_node_from_tree(null, recover_name_space(field_parm), recover_name_space(field_parm), null);
    if (treeNode) {
        var new_svg = replace_tree_svg(treeNode, svg_name), svg = encodeURIComponent(btn_param2svg(new_svg, treeNode));
        url = href.replace(/first_svg=[^\?&]*/, "first_svg=" + svg), to_url_with_new_tab(url, new_tab)
    } else {
        if (!tree_object)return;
        alert(JSLocale.now_field_error)
    }
}
function replace_tree_svg(treeNode, svg_name) {
    var old_svg = treeNode.graph_file;
    if (old_svg) {
        if (old_svg = old_svg.split(" "), old_svg = array_remove_null(old_svg), svg_name.indexOf(" ") > 0 && (old_svg = [old_svg[0]]), svg_name.indexOf("/") >= 0) old_svg[0] = svg_name; else {
            var svg = old_svg[0];
            svg.indexOf("/") <= 0 ? old_svg[0] = svg_name : old_svg[0] = svg.split("/")[0] + "/" + svg_name
        }
        old_svg = old_svg.join(" ")
    } else old_svg = svg_name;
    return old_svg
}
function get_node_from_tree(alias, node_name, field_parm, svg_name) {
    var tree_node = null;
    if (tree_object) {
        if (alias && (tree_node = tree_object.getNodeByParam("alias", alias)))return tree_node;
        if (field_parm && (tree_node = tree_object.getNodeByParam("alias", field_parm)))return tree_node;
        if (node_name && (tree_node = tree_object.getNodeByParam("name", node_name)))return tree_node;
        if (svg_name) {
            if (tree_node = tree_object.getNodeByParam("graph_file", svg_name))return tree_node;
            var tree_nodes = JSON.parse(sessionStorage.nodes);
            if (tree_nodes) {
                svg_name = svg_name.split(" "), svg_name = array_remove_null(svg_name), svg_name = svg_name[0];
                for (var node in tree_nodes) {
                    tree_node = tree_nodes[node];
                    var graph_file = tree_node.graph_file;
                    if (graph_file && (graph_file = graph_file.split(" "), graph_file = array_remove_null(graph_file), graph_file = graph_file[0], svg_name == graph_file))return tree_node = get_node_from_tree(tree_node.alias, tree_node.name, null, tree_node.graph_file)
                }
            }
            if (tree_node)return tree_node
        }
    }
    return tree_node
}
function get_nodes_from_tree(alias, node_name, field_parm, svg_name) {
    var tree_node = null;
    if (tree_object) {
        if (alias && (tree_node = tree_object.getNodesByParam("alias", alias), tree_node && tree_node.length > 0))return tree_node;
        if (field_parm && (tree_node = tree_object.getNodesByParam("alias", field_parm), tree_node && tree_node.length > 0))return tree_node;
        if (node_name && (tree_node = tree_object.getNodesByParam("name", node_name), tree_node && tree_node.length > 0))return tree_node;
        if (svg_name && (svg_name = svg_name.split(" "), svg_name = array_remove_null(svg_name), svg_name = svg_name[0], tree_node = tree_object.getNodesByFilter(function (node) {
                if (node && node.graph_file) {
                    var graph_file = node.graph_file;
                    return !(!graph_file || (graph_file = graph_file.split(" "), graph_file = array_remove_null(graph_file), graph_file = graph_file[0], svg_name != graph_file))
                }
            }), tree_node && tree_node.length > 0))return tree_node
    }
    return tree_node
}
function init_field_time() {
    if ("home" != getFileName(window.location.href, "/", ".") && !try_to_logout()) {
        var url = get_time_url();
        set_field_time(url)
    }
}
function try_to_logout() {
    var sessionId = uncertain_local_data("username");
    if (has_url(sessionId) && g_web_cfg)return !1;
    if ("login" != g_now_html_name) {
        var show = "";
        $.each(localStorage, function (key, value) {
            value = value || "", value = value.substr(0, 10), show += key + "=" + value + "\n"
        }), set_local_value("historyurl", location.href);
        var version = get_web_cfg("vid") || (new Date).getTime();
        return window.open("../login/login.html?history=1&_v=" + version, "_self"), !0
    }
    var ws_log = {level: "error", message: "no session"};
    return ws_for_log(ws_log), scada_logout(), try_to_login("error", "no session"), !0
}
function set_field_time(url) {
    "login" == getFileName(window.location.href, "/", ".") && "1" == getQueryString("loginfo") && (g_login_info.info = !1, ws_get_loginfo(handle_loginfo)), ws_get_auth_time("", function (data) {
        hander_server_vid(data)
    }, null), ws_get_field_time(url, function (data) {
        hander_field_time(data, url)
    }, function (data) {
        hander_field_time(data, url)
    }), "DEMC.Farm.Statistics" != g_field_parm && $("#env_task_number").length > 0 && ws_task_needcomplete(g_field_parm, function (data) {
        if ("undefined" != typeof data && data && data.code && "10000" == data.code && data.count && 0 != parseInt(data.count)) {
            var count = parseInt(data.count);
            count > 0 ? $("#env_task_number").show().html(count) : $("#env_task_number").hide().html("")
        }
    })
}
function get_time_url() {
    var url = "alias=";
    return g_field_parm && (url = "alias=" + g_field_parm), url
}
function hander_field_time(data, url) {
    hander_session_auth(data, url) && (handle_server_time(data, url), setTimeout(function () {
        set_field_time(url)
    }, get_web_cfg("my_time_compare_time")))
}
function hander_session_auth(data, url) {
    if (g_field_date.time_format)return !0;
    if (!check_ws_data(data)) {
        if (try_to_test_login--, try_to_test_login > 0)return set_field_time(url), !1;
        alert(JSLocale.now_field_error), 0 == try_to_test_login && (url = "alias=", set_field_time(url), $("#center").hide())
    }
    if (check_ws_data(data)) {
        if ("1" == uncertain_local_data("is_supper") && !uncertain_local_data("node_list") && "user" != getFileName(window.location.href, "/", "."))return window.location.href = add_version_tail(re_url + "user/user.html"), !1;
        if ("login" == getFileName(window.location.href, "/", "."))return g_login_info.login = !0, try_to_history(), !1;
        show_normal_page()
    }
    return !0
}
function hander_server_vid(data) {
    if (check_ws_data(data)) {
        if (!g_field_date.has_check_vid) {
            if (!check_version(data))return;
            g_field_date.debug_mode = data.debug_mode, g_field_date.has_check_vid = !0
        }
        if (get_web_cfg("globalHeartBeat") && $("#data_export_number").length > 0) {
            var ex_cnt = parseInt(data.new_export_count);
            ex_cnt > 0 ? $("#data_export_number").css("display", "block").html(ex_cnt) : $("#data_export_number").css("display", "none").html("")
        }
    }
}
function handle_loginfo(data) {
    if (g_login_info.info = !0, check_ws_data(data) && data.user) {
        var node_name_list = sessionStorage.node_name_list;
        data.user.username = uncertain_local_data("username"), store_user_info(data, node_name_list), data.menu && "function" == typeof sort_head && (g_head_cfg.menu = data.menu, sort_head(g_head_cfg))
    }
    alert_20001_message(data), try_to_history()
}
function try_to_history() {
    if (g_login_info.login && g_login_info.info)return to_history(), !1
}
function is_use_svg() {
    return !(!svg_name_first || !svg_name_first.trim()) && !(svg_name_first.indexOf("/") >= 0 && !svg_name_first.split("/")[1].trim())
}
function set_footer_site() {
    $("#bottom").css({position: "absolute"})
}
function try_to_graph(data) {
    if (null != data && "10000" == data.code) {
        var web_site = getFileName(window.location.href, "/", ".");
        return "login" == web_site ? (to_graph_html(), !1) : (show_normal_page(), !0)
    }
}
function to_graph_html(tail) {
    var href = get_graph_url(tail);
    window.location.href = href
}
function get_graph_url(tail) {
    var href = "../v_graph/v_graph.html";
    return tail && ("&" == tail[0] ? tail[0] = "?" : "?" == tail[0] || (tail = "?" + tail), href += tail), href = add_version_tail(href)
}
function add_version_tail(url) {
    if (url || (url = ""), "#" == url[0])return url;
    var hash = "";
    return url.indexOf("#") >= 0 && (hash = url.split("#")[1], url = url.split("#")[0]), url = removeUrlValue(url, "_v"), url.indexOf("_v=") < 0 && (url += (url.indexOf("?") > 0 ? "&" : "?") + "_v=" + get_web_cfg("vid")), hash && (url = url + "#" + hash), url
}
function check_version(data) {
    var tomcat_vid = data.vid;
    if (!tomcat_vid)return !0;
    var url_version = get_web_cfg("vid");
    return tomcat_vid == url_version || !g_head_cfg || (clear_total_tree(), g_web_cfg.vid = tomcat_vid, gLoadWebConfig.loadWebConfig(), ws_get_loginfo(handle_loginfo, "sync"), window.open(add_version_tail(location.href), "_self"), !1)
}
function clear_total_tree() {
    try {
        localStorage.farm_tree = "", sessionStorage.removeItem("sub_nodes");
        for (var key, keys = [], i = 0; key = sessionStorage.key(i); i++)key && /^sub_tree.*/.test(key) && keys.push(key);
        for (var key, i = 0; key = keys[i]; i++)sessionStorage.removeItem(key);
        sessionStorage.removeItem("allMenus"), sessionStorage.removeItem("nodeAppMenus"), sessionStorage.removeItem("mainTree")
    } catch (e) {
    }
}
function clear_app_name() {
    is_login_home_page() && "1" != getQueryString("loginfo") && (localStorage.removeItem("windos_app_name"), sessionStorage.removeItem("windos_app_name"))
}
function get_web_cfg(key) {
    if (key)return g_web_cfg ? g_web_cfg[key] : void 0
}
function show_normal_page() {
    tryto_show_body(), $("#changePwd").unbind("click"), $("#exit_btn").unbind("click"), $("#exit_btn").click(scada_logout), $("#changePwd").click(changePwd), null != get_local_value("username") && "" != get_local_value("username") && $("#user_name").html(get_local_value("username"))
}
function is_forwardding_ajax(data) {
    return 0 == data.status && 0 == data.readyState && "error" == data.statusText && "" == data.responseText
}
function to_default_graph(url) {
    is_default_graph() || to_graph_html()
}
function is_default_graph() {
    var now_url = window.location.href.trim();
    return now_url = now_url.replace("?_v=", ""), now_url = now_url.replace("&_v=", ""), !(now_url.indexOf("?") >= 0 || now_url.indexOf("&") >= 0)
}
function handle_server_time(data) {
    data = data.data, data && (g_field_date.time_format || (g_field_date.yyyy_MM_dd_format = time_adjust_format(data.date_format, "yy"), g_field_date.hh_mm_ss_format = time_adjust_format(data.time_format, "HH"), g_field_date.yyyy_MM = time_adjust_format(data.date_format.replace(/(-|\/)?dd/gi, ""), "MM"), g_field_date.time_format = g_field_date.yyyy_MM_dd_format + " " + g_field_date.hh_mm_ss_format, g_field_date.time_zone = data.time_zone.match(/^-?|=?\d+$/) ? data.time_zone : "false", g_field_date.need_time_zone = "true" == data.need_time_zone, my97_format(), "undefined" != typeof fill_page_time && fill_page_time()), has_url(data.time_stamp) && (g_field_date.time = new Date(get_milliseconds(data.time_stamp, 0)), $("#env_copyright").html(handleCopyright(g_head_cfg.copyright[scada_language_config || "zh"])), fill_field_time(), init_js_timer()))
}
function my97_format(format) {
    format || (format = g_field_date.time_format), format || (format = default_time_format), "v_dataexporter" == getFileName(window.location.href, "/", ".") && (format = g_field_date.yyyy_MM_dd_format), "v_powercurve" == getFileName(window.location.href, "/", ".") && (format = g_field_date.yyyy_MM_dd_format), "v_repair_dd" == getFileName(window.location.href, "/", ".") && (format = g_default_format.yyyy_MM_dd_format + " HH:mm");
    var my97_input = $("input[onclick*=WdatePicker]");
    $.each(my97_input, function (par, input) {
        var my97_opt = $(input).attr("onclick");
        my97_opt = my97_opt.substring(my97_opt.indexOf("(") + 1, my97_opt.lastIndexOf(")")), my97_opt.replace(/ /g, ""), my97_opt || (my97_opt = "{dateFmt:'yyyy-MM-dd HH:mm:ss'}"), my97_opt = eval("(" + my97_opt + ")"), my97_opt.dateFmt = format, my97_opt = $.toJSON(my97_opt), $(input).attr("onclick", "WdatePicker(" + my97_opt + ")")
    })
}
function init_js_timer() {
    g_field_date.timeoutId && clearInterval(g_field_date.timeoutId), g_field_date.timeoutId = setInterval(function () {
        g_field_date.time = new Date(g_field_date.time.getTime() + 1e3), fill_field_time()
    }, 1e3)
}
function fill_field_time() {
    var time = g_field_date.time.format();
    g_field_date.need_time_zone && (time += " " + fill_UTC_area(g_field_date.time_zone, g_field_date.need_time_zone)), $("#" + g_field_date.id).html(time)
}
function delete_split_char(format) {
    var yymmdd = format.split(" ")[0], hhmmss = format.split(" ")[1];
    yymmdd = yymmdd.replace(/^[:\/-]|[:\/-]$/g, ""), yymmdd = yymmdd.replace(/^[:\/-]|[:\/-]$/g, ""), hhmmss = hhmmss.replace(/^[:\/-]|[:\/-]$/g, ""), hhmmss = hhmmss.replace(/^[:\/-]|[:\/-]$/g, ""), format = yymmdd + " " + hhmmss, format = format.trim();
    for (var last_chart = "", temp_format = "", i = 0; i < format.length; i++)last_chart == format[i] && /[:\/-]/.test(last_chart) || (temp_format += format[i]), last_chart = format[i];
    return temp_format
}
function time_adjust_format(format, date_or_time) {
    if (!format)switch (date_or_time) {
        case"yy":
            format = g_default_format.yyyy_MM_dd_format;
            break;
        case"HH":
            format = g_default_format.hh_mm_ss_format;
            break;
        case"MM":
            format = g_default_format.yyyy_MM;
            break;
        default:
            format = g_default_format.time_format
    }
    return format = format.replace(/.fff/g, ""), format = format.replace(/S/g, "s"), format = format.replace(/D/g, "d"), format = format.replace(/Y/g, "y"), format = format.replace(/h/g, "H")
}
function time_format2date(time_str, format) {
    if (!time_str)return new Date;
    var format = g_field_date.time_format;
    has_url(format) || (format = default_time_format);
    var return_time = [], o = {
        yy: "yy",
        "M+": "MM",
        "d+": "dd",
        "D+": "DD",
        "h+": "hh",
        "H+": "HH",
        "m+": "mm",
        "s+": "ss",
        "S+": "SS"
    };
    new RegExp("(yyyy)").test(format) && (return_time.push(time_str.substr(format.indexOf("yyyy"), 4)), time_str = time_str.replace(time_str.substr(format.indexOf("yyyy"), 4), ""), format = format.replace("yyyy", ""));
    for (var k in o)new RegExp("(" + k + ")").test(format) && return_time.push("" + time_str.substr(format.indexOf(o[k]), 2));
    return format = "", format = (return_time[0].length > 2 ? return_time[0] : "20" + return_time[0]) + "/" + return_time[1] + "/" + return_time[2] + " " + return_time[3] + ":" + return_time[4] + ":" + return_time[5], new Date(Date.parse(format))
}
function time_format_yy2date(time_str, format) {
    var format = g_field_date.yyyy_MM_dd_format;
    has_url(format) || (format = g_default_format.yyyy_MM_dd_format);
    var return_time = [], o = {yy: "yy", "M+": "MM", "d+": "dd", "D+": "DD"};
    new RegExp("(yyyy)").test(format) && (return_time.push(time_str.substr(format.indexOf("yyyy"), 4)), time_str = time_str.replace(time_str.substr(format.indexOf("yyyy"), 4), ""), format = format.replace("yyyy", ""));
    for (var k in o)new RegExp("(" + k + ")").test(format) && return_time.push("" + time_str.substr(format.indexOf(o[k]), 2));
    return format = "", format = (return_time[0].length > 2 ? return_time[0] : "20" + return_time[0]) + "/" + return_time[1] + "/" + return_time[2], new Date(Date.parse(format + " 00:00:00"))
}
function time_format2auto(time_str, format) {
    return date_format2(time_format2date(time_str, format))
}
function time_html2php(format, php) {
    return "%W"
}
function time_html2my97(format) {
    var format = g_field_date.time_format;
    has_url(format) || (format = default_time_format);
    var o = {"h+": "HH"};
    for (var k in o)new RegExp("(" + k + ")").test(format) && (format = format.replace(RegExp.$1, o[k]));
    return format
}
function time_auto2format(time, format) {
    var format = g_field_date.time_format;
    return has_url(format) || (format = default_time_format), new Date(Date.parse(time.replace(/-/g, "/"))).format(format)
}
function date_format(date) {
    if ("object" != typeof date)return "0000-00-00";
    var now = date.getFullYear() + "-";
    return now = now + (date.getMonth() > 8 ? "" : "0") + (date.getMonth() + 1) + "-", now = now + (date.getDate() > 9 ? "" : "0") + date.getDate()
}
function date_format2(date) {
    return "object" != typeof date ? "0000-00-00 00:00:00" : date_format(date) + " " + get_today_time(date)
}
function get_today_time(date) {
    if ("object" != typeof date)return "00:00:00";
    var now = (date.getHours() < 10 ? "0" : "") + date.getHours() + ":";
    return now = now + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ":", now = now + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds()
}
function get_milliseconds(date, time_area) {
    return "string" != typeof date ? 0 : (time_area || (time_area = 0), Date.parse(date.replace(/-/g, "/")) + 36e5 * time_area)
}
function default_str_2_date(str) {
    return new Date(get_milliseconds(str))
}
function cal_time_def(date1, date2) {
    return "string" != typeof date1 || "string" != typeof date2 ? -1 : (get_milliseconds(time_format2auto(date2)) - get_milliseconds(time_format2auto(date1))) / 6e4
}
function get_milliseconds_new(date, time_area) {
    if ("string" != typeof date)return 0;
    time_area || (time_area = 0);
    var pattern = /\.(\d{1,3})/g, isoDate = date.replace(pattern, ""), millisecond = null != date.match(pattern) ? date.match(pattern)[0].replace(/\./g, "") : "0";
    return Date.parse(isoDate.replace(/-/g, "/")) + parseInt(millisecond) + 36e5 * time_area
}
function test_time_format(time_str, format) {
    return format || "undefined" == typeof g_field_date.time_format || (format = g_field_date.time_format), !(!format || !time_str) && (format = format.replace(/y|Y|m|M|d|D|h|H|s|S/g, "\\d"), format = "^" + format + "$", format = new RegExp(format), !!format.test(time_str) && !!get_milliseconds(time_str))
}
function to_portal_page() {
    if ("1" != sessionStorage.getItem("clear_portal") && "1" != getQueryString("clear_portal")) {
        empty_buf();
        var portal_login_url = get_web_cfg("portal_login_url"), new_url = location.href;
        new_url = new_url.replace(/\/[^\/]*\/[^\.\/]*\.html/, "/v_graph/v_graph.html"), "1" != getUrlValue("from_portal") && (new_url += (new_url.indexOf("?") >= 0 ? "&" : "?") + "from_portal=1"), window.location.href = portal_login_url + (portal_login_url.indexOf("?") >= 0 ? "&" : "?") + "return_url=" + new_url
    }
}
function is_new_portal2() {
    return "true" == get_web_cfg("enable_portal")
}
function isPortal2Logout() {
    return window.isPortalLogout
}
function is_portal2_login() {
    return "yes" == get_local_value("portal2")
}
function is_CAS_login() {
    return !!get_local_value("TGTticket")
}
function is_from_ST() {
    return "1" == sessionStorage.STticket
}
function can_mult_sys() {
    return !!get_web_cfg("cas_model_cfg")
}
function get_scada_field(treeNode, is_parent) {
    if (!treeNode)return "";
    if (treeNode.node_type == g_field_val)return treeNode.alias;
    if (treeNode.getParentNode) {
        var parent_field = get_scada_field(treeNode.getParentNode(), "is_parent");
        if (parent_field)return parent_field
    }
    return !is_parent && is_wtg_level(treeNode.node_type) && treeNode.alias.indexOf(".") > 0 ? treeNode.alias.split(".")[0] : ""
}
function changePwd() {
    Util.Dialog({
        title: '<span style="font-size:12px;" class="changePwd inter">' + JSLocale.changePwd.label_class + "</span>",
        width: 400,
        height: "auto",
        fixed: !0,
        content: 'text:<div id="pwdForm" class="pwdForm"></div>',
        showbg: !0,
        ofns: function () {
            var str = "";
            str += "<fieldset>", str += "<legend>" + JSLocale.um_changepass + "</legend>", str += '<form name="changePwd">', str += '<table width="100%" cellpadding="0" cellspacing="0">', str += '<tr><td class="pwdForm_left">' + JSLocale.um_username + "</td><td>" + (get_local_value("username") ? get_local_value("username") : "") + '</td><td style="width:10px;"></td></tr>', str += '<tr><td class="pwdForm_left">' + JSLocale.um_oldpass + '</td><td><input type="password" name="oldpwd" value=""/></td><td></td></tr>', str += '<tr><td class="pwdForm_left">' + JSLocale.um_newpass + '</td><td><input type="password" name="newpwd" value="" onkeyup="pwdAuth(this,\'repeatpwd\')" onpaste="pwdAuth(this,\'repeatpwd\')"/></td><td></td></tr>', str += '<tr><td class="pwdForm_left">' + JSLocale.um_repeatpass + '</td><td><input type="password" name="repeatpwd" value="" onkeyup="pwdAuth(this,\'newpwd\')" onpaste="pwdAuth(this,\'newpwd\')"/></td><td><span id="same_tip"></span></td></tr>', str += '<tr><td class="pwdForm_left"></td><td style="word-wrap:break-word;white-space:normal;"><span id="erro_tip" style="color:red"></span><span id="pwd_process"></span><span id="pwd_process_erro" style="color:red"></span></td><td></td></tr>', str += "</table>", str += "</form>", str += "</fieldset>", $("#pwdForm").html(str)
        },
        yesBtn: ["<sapn class='submit_btn_inter inter'>" + JSLocale.submit_btn_inter.label_class + "</span>", function () {
            var repeat_password = document.forms.changePwd.elements.repeatpwd.value, new_password = document.forms.changePwd.elements.newpwd.value;
            if (/(\s+)/.test(new_password))return !1;
            if (/(\s+)/.test(repeat_password))return !1;
            if (repeat_password != new_password)return !1;
            var o = {
                action: 4,
                session_id: get_local_value("sessionId"),
                old_password: document.forms.changePwd.elements.oldpwd.value,
                new_password: new_password
            };
            return $("#same_tip").html(""), $("#erro_tip").html(""), ws_userconfig(o, handle_pwd(), null, function () {
                $("#pwd_process").html(JSLocale.um_processing)
            }), !1
        }],
        noBtn: ["<sapn class='cancel_btn_inter inter'>" + JSLocale.cancel_btn_inter.label_class + "</span>", function () {
            return !0
        }]
    })
}
function pwdAuth(obj, compare) {
    if ("object" == typeof obj) {
        if (/(\s+)/.test(obj.value))return $("#erro_tip").html(JSLocale.um_alert.passnotspace), void $("#same_tip").html("");
        obj.value == document.forms.changePwd.elements[compare].value ? ($("#same_tip").html("&radic;"), $("#erro_tip").html("")) : ($("#erro_tip").html(JSLocale.um_notsamepass), $("#same_tip").html(""))
    }
}
function handle_pwd() {
    return function (record) {
        "undefined" != typeof record && record && ("10000" == record.code ? (document.forms.changePwd.reset(), $("#pwd_process").html(JSLocale.alert_oper_succeed_inter), setTimeout(function () {
                $("#pwd_process").html("")
            }, 3e3)) : ($("#pwd_process").html(""), $("#pwd_process_erro").html(record.message), setTimeout(function () {
                $("#pwd_process_erro").html("")
            }, 5e3)))
    }
}
function del_local_value(key) {
    localStorage.removeItem(key)
}
function set_local_value(key, val) {
    localStorage.setItem(key, val)
}
function get_local_value(key) {
    return localStorage.getItem(key)
}
function setCookie(name, value) {
    var Days = 30, exp = new Date;
    exp.setTime(exp.getTime() + 24 * Days * 60 * 60 * 1e3), document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/"
}
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=?([^;=]*)(;|$)"));
    return null != arr ? unescape(arr[2]) : null
}
function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys)for (var i = keys.length; i--;)document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString() + "; path=/"
}
function deleteCookie(name) {
    document.cookie = name + "=0;expires=" + new Date(0).toUTCString() + "; path=/"
}
function tranNull2Null(str) {
    if ("undefined" !== str && "null" !== str)return str
}
function getFileName(str, firstChar, lastChar) {
    if (!str || "string" != typeof str)return "";
    str.indexOf("?") >= 0 && (str = str.substring(0, str.indexOf("?")));
    var fileName = str.substring(str.lastIndexOf(firstChar) + 1, str.lastIndexOf(lastChar));
    return fileName
}
function getItemName() {
    return window.location.href.split(":")[2].split("/")[1]
}
function getQueryString(name) {
    var reg = new RegExp("(^|&|\\?)" + name + "=([^&\\?]*)(&|\\?|$)", "i"), r = window.location.search.substr(1).match(reg);
    if (null != r) {
        var value = r[2] || "";
        return value.indexOf("%u") >= 0 ? unescape(value) : decodeURIComponent(value)
    }
    return null
}
function removeUrlValue(url, name) {
    url = url || "", name = name || "";
    var reg = new RegExp(name + "=[^&\\?]*(\\?|&|$)", "i");
    return url = url.replace(reg, ""), url.replace(/(&|\?)$/, "")
}
function getUrlValue(url, name) {
    var reg = new RegExp(name + "=([^&\\?]*)(\\?|&|$)", "i"), r = url.substr(1).match(reg);
    if (null != r) {
        var value = r[1] || "";
        return value.indexOf("%u") >= 0 ? unescape(value) : decodeURIComponent(value)
    }
    return null
}
function show_head_class(view_name) {
    document.title = $("#" + view_name).text()
}
function addEventHandler(target, type, func) {
    target.addEventListener ? target.addEventListener(type, func, !1) : target.attachEvent ? target.attachEvent("on" + type, func) : target["on" + type] = func
}
function node_filter(nodes) {
    $.each(nodes, function (i, node) {
        "" == node.graph_file && node.alias.indexOf("Statistics") > -1 && batch_tree.hideNode(node), node.isParent && node_filter(node.children)
    })
}
function tree_add_icon(id_node_map, json) {
    for (var tree_path = get_web_cfg("tree_path"), tree_icon_map = get_web_cfg("tree_icon_map"), i = 0; i < json.data.length; i++) {
        var temp = json.data[i];
        "undefined" == typeof temp.icon || "" == temp.icon ? "0" != temp.pid && "undefined" != typeof id_node_map[temp.pid] || "CONTAINER" != temp.node_type ? "BAY_STATISTIC" != temp.node_type && "FACTORY" != temp.node_type ? "0" != temp.pid && "CONTAINER" == temp.node_type && temp.graph_file.length > 0 ? json.data[i].icon = add_version_tail(tree_path + tree_icon_map[2]) : "0" == temp.pid || "CONTAINER" != temp.node_type || 0 != temp.graph_file.length ? "BAY_TURBINE" != temp.node_type && "BAY_OTHER" != temp.node_type || (json.data[i].icon = add_version_tail(tree_path + tree_icon_map[4])) : json.data[i].icon = add_version_tail(tree_path + tree_icon_map[3]) : json.data[i].icon = add_version_tail(tree_path + tree_icon_map[1]) : json.data[i].icon = add_version_tail(tree_path + tree_icon_map[0]) : json.data[i].icon = add_version_tail(tree_path + temp.icon)
    }
}
function Is_positive_num(str) {
    var reg = /^\d+$/;
    return reg.test(str)
}
function init_overlay(opts) {
    "function" != typeof require || $("body").showEnvLoading ? start_env_loading(opts) : require(["env_loading"], function () {
            start_env_loading(opts)
        })
}
function start_env_loading(opts) {
    opts && opts.con_id && $(opts.con_id).showEnvLoading && $(opts.con_id).showEnvLoading()
}
function add_css_version(selecter) {
}
function close_overlay(con_id) {
    "function" != typeof require || $("body").showEnvLoading ? con_id && $(con_id).hideEnvLoading && $(con_id).hideEnvLoading() : require(["env_loading"], function () {
            con_id && $(con_id).hideEnvLoading && $(con_id).hideEnvLoading()
        })
}
function alert_20001_message(data) {
    data && "20001" == data.code && data.message && alert(data.message)
}
function check_ws_data(data) {
    return !(!data || "10000" != data.code)
}
function alert_data_fail(data, alert_message) {
    data ? data.code ? "10000" != data.code && alert_dialog(data.message ? data.message : JSLocale.alert_unknow_error_inter) : alert_dialog(JSLocale.alert_callback_error_inter) : alert_dialog(alert_message ? alert_message : JSLocale.alert_unknow_error_inter)
}
function alert_dialog(alert_message) {
    alert(alert_message)
}
function export_file(my_function, after_dialog) {
    Util.Dialog({
        title: "<sapn id='export_type_inter' class='inter'>" + JSLocale.export_type_inter + "</span>",
        width: 350,
        height: 80,
        content: "url:get?../v_warn/sel_export_type.html?_=" + (new Date).getTime(),
        showbg: !0,
        yesBtn: ["<sapn class='submit_btn_inter inter'>" + JSLocale.submit_btn_inter.label_class + "</span>", my_function],
        noBtn: ["<sapn class='cancel_btn_inter inter'>" + JSLocale.cancel_btn_inter.label_class + "</span>", function () {
            return !0
        }],
        ofns: after_dialog
    })
}
function export_common(result) {
    if (check_ws_data(result)) {
        var file_path = result.file_path || "";
        if (file_path.indexOf("service_save/") >= 0) {
            var fileName = file_path.replace(/service_save\//, "");
            fileName = fileName.replace(/(([^\/]*)\/){1,3}/, "");
            var path = file_path.replace(fileName, "");
            file_path = get_web_cfg("http_url_config") + path + encodeURIComponent(fileName)
        } else file_path = get_web_cfg("http_dataexport_download") + get_local_value("username").trim().toLowerCase() + "/" + encodeURIComponent(file_path);
        window.open(add_site_node(file_path), "_blank")
    } else alert(JSLocale.alert_file_false_inter)
}
function export_common_extra(result) {
    if (check_ws_data(result)) {
        var file = result.file_path;
        try {
            var site = file.lastIndexOf("/"), md = file.substring(0, site + 1), name = file.substring(site + 1);
            file = md + encodeURIComponent(name)
        } catch (e) {
        }
        var file_path = get_web_cfg("http_report_download") + get_local_value("username").trim().toLowerCase() + "/" + file;
        window.open(add_site_node(file_path), "_blank")
    } else alert(JSLocale.alert_file_false_inter)
}
function add_site_node(url) {
    if (!url)return "";
    var flag = "?";
    return url.indexOf("?") >= 0 && (flag = "&"), sessionStorage.node_name_list && getCookie("global_id") && (url += flag + "site_node=" + sessionStorage.node_name_list), add_appName_esb(url)
}
function add_appName_esb(url) {
    if (!url)return "";
    var flag = "?";
    return url.indexOf("?") >= 0 && (flag = "&"), get_web_cfg("appName_esb") && (url += flag + "appName=" + get_web_cfg("appName_esb")), url
}
function clone(myObj) {
    if (!myObj)return myObj;
    if ("object" != typeof myObj)return myObj;
    if (myObj.constructor == Array) {
        if (null == myObj)return myObj;
        for (var myNewObj = new Array, i = 0; i < myObj.length; i++)myNewObj[i] = clone(myObj[i]);
        return myNewObj
    }
    var myNewObj = new Object;
    for (var i in myObj)myNewObj[i] = clone(myObj[i]);
    return myNewObj
}
function cal_len_with_UTC(str) {
    var len = g_field_date.need_time_zone ? 11 : 0;
    return cal_len(str) + len
}
function cal_len(str) {
    return str.length + .8 * (escape(str).split("%u").length - 1)
}
function has_url(url) {
    return "undefined" != typeof url && !(!url || "undefined" == url || "null" == url)
}
function fill_UTC_area(val, has_utc) {
    if (!has_utc)return "";
    if (null == val || void 0 == val)return "";
    if (val = "" + val, !val.match(/^((-|\+)?\d+)(\.\d+)?$/))return "";
    if (0 == val)return "(UTC)";
    var plus = "", inte = parseInt(val);
    plus = inte >= 0 ? "+" : "-", inte = Math.abs(inte), inte = (inte >= 10 ? "" : "0") + inte;
    var floa = parseInt(parseFloat(Math.abs(val)) % 1 * 60);
    return floa = (floa >= 10 ? "" : "0") + floa, "(UTC" + plus + inte + ":" + floa + ")"
}
function add_file_reference(lang, filePath) {
    var file, temp = filePath.lastIndexOf(".");
    if (!(temp < 0)) {
        var fileName = filePath.substring(0, temp), suffix = filePath.substring(temp);
        "string" == typeof lang && "" != lang ? (fileName = fileName + "_" + lang, file = fileName + suffix) : file = filePath, ".js" == suffix.trim().toLowerCase() ? $("head").append('<script type="text/javascript" src="' + file + '"></script>') : ".css" == suffix.trim().toLowerCase() && $("head").append('<link rel="stylesheet" type="text/css" href="' + file + '"/>')
    }
}
function getElementPos(el) {
    var box = el.getBoundingClientRect(), doc = el.ownerDocument, body = doc.body, html = doc.documentElement, clientTop = html.clientTop || body.clientTop || 0, clientLeft = html.clientLeft || body.clientLeft || 0, top = box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop, left = box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft;
    return [top, left]
}
function click_graph() {
    "" == $("#graph_view").next().html() && ($("#graph_view").unbind("click"), $("#graph_view").click(function (event) {
        return "v_graph" != getFileName(window.location.href, "/", ".") && sessionStorage.history_svg ? "1" == getGraphOpenMode() ? window.open(sessionStorage.history_svg, "_blank") : location.href = sessionStorage.history_svg : "1" == getGraphOpenMode() ? window.open(get_graph_url(), "_blank") : location.href = get_graph_url(), event.preventDefault(), !1
    }))
}
function getGraphOpenMode() {
    var mode = "1";
    if (g_head_cfg && g_head_cfg.menu)for (var _m = g_head_cfg.menu, len = _m.length, i = 0; i < len; i++)if ("graph_view" == _m[i].id.trim()) {
        mode = _m[i].openmode;
        break
    }
    return mode
}
function format_number(number) {
    for (var str = "", temp = MAXLENGTH - String(number).length, i = 0; i < temp; ++i)str += "0";
    return str += String(number)
}
function arr_removesame(arr) {
    for (var i = 0; i < arr.length; i++)for (var j = i + 1; j < arr.length; j++)arr[i] === arr[j] && (arr.splice(j, 1), j--);
    return arr
}
function hide_change_password() {
    is_from_ST() && $("#changePwd").remove()
}
function init_username_test() {
    setTimeout(function () {
        before_ws_send(), init_username_test()
    }, 1e3)
}
function before_ws_send() {
    if (!($("#user_name").length <= 0) && $("#user_name").html() && get_local_value("username") && get_local_value("username") != $("#user_name").html())return "1" == uncertain_local_data("is_supper") && "user" != getFileName(window.location.href, "/", ".") ? void(window.location.href = add_version_tail(re_url + "user/user.html")) : "1" != uncertain_local_data("is_supper") && "user" == getFileName(window.location.href, "/", ".") ? void to_graph_html() : void location.reload()
}
function store_user_info(data, node_name_list) {
    data && data.user && data.user.first_svg && (data.user.first_svg = data.user.first_svg.replace(/[\s]*\|{2}[^\s]*/g, "")), clear_total_tree(), has_url(data.user.first_svg) || (data.user.first_svg = ""), has_url(data.user.windfarm) || (data.user.windfarm = ""), has_url(node_name_list) || (node_name_list = ""), has_url(data.user.node_list) || (data.user.node_list = ""), has_url(data.user.is_supper) || (data.user.is_supper = ""), has_url(data.user.farm_list) || (data.user.farm_list = ""), has_url(data.user.region_list) || (data.user.region_list = ""), has_url(data.nodeRole) || (data.nodeRole = ""), sessionStorage.first_svg = data.user.first_svg, sessionStorage.field_parm = data.user.windfarm, sessionStorage.node_list = data.user.node_list, sessionStorage.is_supper = data.user.is_supper, sessionStorage.farm_list = data.user.farm_list, sessionStorage.region_list = data.user.region_list, node_name_list && (sessionStorage.node_name_list = node_name_list), sessionStorage.nodeRole = data.nodeRole, set_local_value("sessionId", data.user.session_id), set_local_value("username", data.user.username), set_local_value("user_logo", data.user.logo ? data.user.logo : ""), set_local_value("first_svg", data.user.first_svg), set_local_value("field_parm", data.user.windfarm), set_local_value("node_list", data.user.node_list), set_local_value("is_supper", data.user.is_supper), set_local_value("farm_list", data.user.farm_list), set_local_value("region_list", data.user.region_list), set_local_value("nodeRole", data.nodeRole), set_glogal_id(data)
}
function set_glogal_id(data) {
    var global_id = data.global_id;
    global_id ? setCookie("global_id", global_id) : deleteCookie("global_id")
}
function change_user_info(data, node_name_list) {
    if ("home" == g_now_html_name) {
        var btn_param = getUrlValue(location.href, "first_svg");
        btn_param && (data.first_svg = btn_param)
    }
}
function set_local_value_if_no(name, value) {
    null === get_local_value(name) && set_local_value(name, value)
}
function show_user_url() {
    "1" == uncertain_local_data("is_supper") && (uncertain_local_data("node_list") ? $("#header").length > 0 && ("user" != getFileName(window.location.href, "/", ".") ? ($("#user_manage").css({display: "block"}), href_to_click($("#user_manage>a"))) : ($("#graph_view_user").css({display: "block"}), href_to_click($("#graph_view_user>a")))) : ($("#user_manage").hide(), $("#graph_view_user").hide()))
}
function href_to_click($_element) {
    if ($_element && $_element.length > 0) {
        var url = $_element.attr("href");
        if (url && url.indexOf(".html") >= 0) {
            url = add_version_tail(url), $_element.attr("url", url), $_element.attr("href", "javascript:void(0);");
            var url_target = $_element.attr("target") || "";
            $_element.attr("url_target", url_target), $_element.click(function () {
                click_menu_href(this)
            })
        }
    }
}
function uncertain_local_data(name) {
    return void 0 !== sessionStorage[name] ? sessionStorage[name] : get_local_value(name)
}
function login_err(data, no_alert) {
    no_alert || alert_data_fail(data, JSLocale.alert_login_fail_inter), $("#login_button").removeAttr("disabled"), $("#login_button").addClass("nohover")
}
function get_screen_width() {
    var winHeight = 0, winWidth = 0;
    return window.innerWidth ? winWidth = window.innerWidth : document.body && document.body.clientWidth && (winWidth = document.body.clientWidth), window.innerHeight ? winHeight = window.innerHeight : document.body && document.body.clientHeight && (winHeight = document.body.clientHeight), document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth && (winHeight = document.documentElement.clientHeight, winWidth = document.documentElement.clientWidth), [winWidth, winHeight]
}
function isArray(obj) {
    return "[object Array]" == Object.prototype.toString.call(obj)
}
function array_remove_null(array) {
    if (!isArray(array))return array;
    for (var temp = [], i = 0; i < array.length; i++)("string" != typeof array[i] || array[i].trim()) && temp.push(array[i].trim());
    return array = temp
}
function math_round2(number, precision) {
    var b = 1;
    if (isNaN(number))return number;
    number < 0 && (b = -1);
    var multiplier = Math.pow(10, precision);
    return (Math.round(Math.abs(number) * multiplier) / multiplier * b).toFixed(precision)
}
function getDigits(number) {
    if (isNaN(number))return null;
    for (var digits = []; number;) {
        var digit = number % 10;
        digits.push(digit), number = (number - digit) / 10
    }
    return digits
}
function initWeather() {
    var ifEnabled = !1, serviceBaseUrl = "", refreshCycle = 30;
    g_head_cfg && g_head_cfg.real_time_weather_config && (ifEnabled = "true" == g_head_cfg.real_time_weather_config.if_enabled, serviceBaseUrl = g_head_cfg.real_time_weather_config.base_url || "", refreshCycle = parseFloat(g_head_cfg.farm_comm_status_config.refresh_cycle) || 30);
    var $weather = $("#wf_time_icon");
    ifEnabled && g_field_parm && isFactory(g_field_parm) ? "function" != typeof $weather.weather ? require(["weather"], function () {
                getWeather($weather, serviceBaseUrl, refreshCycle)
            }) : getWeather($weather, serviceBaseUrl, refreshCycle) : $weather.addClass("wf-time-icon")
}
function isFactory(field_parm) {
    var tree_node = null;
    if (g_tree_object)if (tree_node = g_tree_object.getNodeByParam("alias", field_parm)) {
        if ("FACTORY" === tree_node.node_type)return !0
    } else {
        if (tree_node = g_tree_object.getNodeByParam("name", field_parm), !tree_node)return !1;
        if ("FACTORY" === tree_node.node_type)return !0
    }
    return !1
}
function getWeather($weather, serviceBaseUrl, refreshCycle) {
    $weather.removeClass("wf-time-icon").addClass("wf-weather-icon"), "function" == typeof $weather.weather && ($weather.weather(g_field_parm, serviceBaseUrl), setInterval(function () {
        $weather.removeClass(function (index, oldClass) {
            return oldClass && oldClass.split(" ").filter(function (o) {
                    return 0 === o.indexOf("weather")
                }).join(" ")
        }), $weather.weather(g_field_parm, serviceBaseUrl)
    }, 60 * refreshCycle * 1e3))
}
function btn_param2param_list(params, treeNode) {
    params = params || "";
    var values = params.trim().split(" ");
    if (params = params.replace(values[0], ""), params.indexOf("=") >= 0) {
        var return_value = {param_type: "key_values", param_list: {}};
        params = params.split(" "), params = array_remove_null(params);
        for (var i = 0; i < params.length; i++)if (params[i].indexOf("=") > 0) {
            var key = params[i].split("=")[0].trim().toLowerCase(), value = params[i].split("=")[1].trim();
            key && value && (key = get_at_value(key, treeNode), value = get_at_value(value, treeNode), return_value.param_list[key] = value)
        }
    } else {
        var return_value = {param_type: "values", param_list: []};
        params = params.split(" "), params = array_remove_null(params), $.each(params, function (i, value) {
            value = get_at_value(value, treeNode), return_value.param_list.push(value)
        })
    }
    return return_value
}
function get_at_value(value, treeNode) {
    if (value = value || "", value = value.trim(), value.indexOf("@") < 0)return value;
    var svg_file = "";
    if (value.indexOf("/") >= 0 && (svg_file = "/" + value.split("/")[1], value = value.split("/")[0]), value.indexOf("@node::") >= 0) {
        if (!treeNode)return value;
        var key = value.replace("@node::", "");
        value = get_node_at_value(key, treeNode)
    } else if (value.indexOf("@user::") >= 0) {
        var key = value.replace("@user::", "");
        value = get_user_at_value(key)
    }
    return value + svg_file
}
function get_user_at_value(key) {
    key = key || "", key = key.trim(), key = key.toLowerCase();
    var value = "";
    switch (key) {
        case"name":
            return value = uncertain_local_data("username") || "";
        case"region_list":
            return value = replace_name_space(uncertain_local_data("region_list")) || "";
        case"farm_list":
            return value = uncertain_local_data("farm_list") || "";
        case"mdm_farm_list":
            if (window.gNodeMenuShow && gNodeMenuShow.farmTreeObject) {
                for (var farm, childFarms = gNodeMenuShow.farmTreeObject.getNodesByParam("node_type", "FACTORY"), mdmList = [], i = 0; farm = childFarms[i]; i++)farm.mdm_id && mdmList.push(farm.mdm_id);
                return mdmList.join(",")
            }
            return "";
        case"global_id":
            return value = getCookie("global_id") || ""
    }
    return key
}
function get_node_at_value(key, treeNode) {
    function unique(arr) {
        for (var elem, result = [], hash = {}, i = 0; null != (elem = arr[i]); i++)hash[elem] || (result.push(elem), hash[elem] = !0);
        return result
    }

    if (key = key || "", key = key.trim(), key = key.toLowerCase(), !treeNode)return key;
    var value = "";
    switch (key) {
        case"alias":
            return value = treeNode.alias;
        case"name":
            return value = replace_name_space(treeNode.name);
        case"type":
            return value = treeNode.node_type;
        case"latitude":
            return value = treeNode.lat;
        case"longitude":
            return value = treeNode.lon;
        case"graph_file":
            return value = treeNode.graph_file, value = value.trim(), value = value.split(" ")[0], value.indexOf("/") >= 0 && (value = value.split("/")[1]), value;
        case"time_zone":
            return value = treeNode.time_zone;
        case"farm":
            for (var farm = treeNode; farm;) {
                if ("FACTORY" == farm.node_type)return farm.alias;
                farm = farm.getParentNode()
            }
            return "";
        case"mdm_farm_list":
            if ("FACTORY" == treeNode.node_type)return treeNode.mdm_id || "";
            if (has_farm_parent(treeNode)) {
                for (var farm = treeNode; farm;) {
                    if ("FACTORY" == farm.node_type)return farm.mdm_id;
                    farm = farm.getParentNode()
                }
                return ""
            }
            if (tree_object) {
                var childFarms = tree_object.getNodesByParam("node_type", "FACTORY", treeNode), mdmList = [];
                0 == childFarms.length && window.gNodeMenuShow && gNodeMenuShow.farmTreeObject && (childFarms = gNodeMenuShow.farmTreeObject.getNodesByParam("node_type", "FACTORY", treeNode));
                for (var farm, i = 0; farm = childFarms[i]; i++)farm.mdm_id && mdmList.push(farm.mdm_id);
                return unique(mdmList).join(",")
            }
            return "";
        default:
            if (void 0 !== treeNode[key])return treeNode[key] || ""
    }
    return key
}
function btn_param2svg(btn_param, treeNode) {
    btn_param = btn_param || "";
    var values = btn_param.trim().split(" ");
    return values = array_remove_null(values), treeNode && (btn_param = fill_defalut_param(btn_param, treeNode)), btn_param = parse_node_param(btn_param, treeNode)
}
function btn_param2url(btn_param, treeNode) {
    btn_param = btn_param2svg(btn_param, treeNode);
    var url = "../v_graph/v_graph.html?first_svg=" + encodeURIComponent(btn_param);
    return add_version_tail(url)
}
function fill_defalut_param(btn_param, treeNode) {
    if (!treeNode || !btn_param)return "";
    btn_param = btn_param || "";
    var values = btn_param.trim().split(" ");
    values = array_remove_null(values);
    var svg_path_name = values[0];
    if (svg_path_name.indexOf("/") < 0) {
        var path = get_default_path(treeNode);
        path += path && "/", svg_path_name = path + svg_path_name, values[0] = svg_path_name
    }
    if (values.length <= 1) {
        var value = get_default_template_value(treeNode);
        value && values.push(value)
    }
    return values.join(" ")
}
function get_default_path(treeNode) {
    if (!treeNode)return "";
    var type = treeNode.node_type;
    switch (type) {
        case"FACTORY":
            return "@node::alias";
        default:
            if (has_farm_parent(treeNode))return "@node::farm";
            var alias = treeNode.alias;
            return alias ? "@node::alias" : "@node::name"
    }
}
function has_farm_child(treeNode) {
    if (!tree_object || !treeNode)return !1;
    var farm = tree_object.getNodeByParam("node_type", "FACTORY", treeNode);
    return farm || treeNode.is_farm_above
}
function has_farm_parent(treeNode) {
    if (!treeNode)return !1;
    var parentNode = treeNode.getParentNode && treeNode.getParentNode();
    return parentNode && "FACTORY" == parentNode.node_type ? parentNode : has_farm_parent(parentNode)
}
function get_default_template_value(treeNode) {
    if (!treeNode)return "";
    var type = treeNode.node_type;
    switch (type) {
        case"FACTORY":
            return "@node::alias";
        default:
            var alias = treeNode.alias;
            return has_farm_parent(treeNode) ? alias ? "@node::alias" : "@node::farm" : alias ? "@node::alias" : "@node::name"
    }
}
function switch_to_treeNode(alias, new_tab, back_svg) {
    if (alias && tree_object) {
        var treeNode = tree_object.getNodesByParam("alias", alias, null);
        if ((!treeNode || treeNode.length <= 0) && (alias = alias.split(".")[0], treeNode = tree_object.getNodesByParam("alias", alias, null)), treeNode.length > 0)if (back_svg) {
            var back_svg = replace_tree_svg(treeNode[0], back_svg), url = btn_param2url(back_svg, treeNode[0]);
            to_url_with_new_tab(url, new_tab)
        } else click_tree_node(null, null, treeNode[0], new_tab, "is_btn")
    }
}
function switchToTreeNodeByMdmid(id, new_tab, back_svg) {
    if (id && tree_object) {
        var treeNode = tree_object.getNodesByParam("mdm_id", id, null);
        if ((!treeNode || treeNode.length <= 0) && (id = id.split(".")[0], treeNode = tree_object.getNodesByParam("mdm_id", id, null)), treeNode.length > 0)if (back_svg) {
            var back_svg = replace_tree_svg(treeNode[0], back_svg), url = btn_param2url(back_svg, treeNode[0]);
            to_url_with_new_tab(url, new_tab)
        } else click_tree_node(null, null, treeNode[0], new_tab, "is_btn")
    }
}
function dl_shift2ena1(wtg_alias) {
    var event = window.event || arguments.callee.caller.arguments[0];
    event.ctrlKey ? switch_to_treeNode(wtg_alias, "new_tab") : switch_to_treeNode(wtg_alias);
    var e = event;
    e && e.preventDefault ? e.preventDefault() : e.returnValue = !1, e && e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
}
function to_url_with_new_tab(url, new_tab, next_field) {
    if (url = parse_node_param(url), gNodeMenuShow.is_app_page_modle()) {
        var app_key = getQueryString("app_key");
        !getUrlValue(url, "app_key") && app_key && "null" != app_key && (url += url.indexOf("?") >= 0 ? "&" : "?");
        var show_type = getQueryString("show_type");
        !getUrlValue(url, "show_type") && show_type && "null" != show_type && (url += url.indexOf("?") >= 0 ? "&" : "?", url += "show_type=" + show_type)
    }
    next_field && (url = replace_url_value({
        url: url,
        key: "gFieldParm",
        value: next_field,
        force: !0
    })), g_show_app_menu.isClickApp ? url = replace_url_value({
            url: url,
            key: "windos_app_name",
            value: g_show_app_menu.isClickApp,
            force: !0
        }) : getUrlValue(url, "app_key") || (url = replace_url_value({
            url: url,
            key: "app_key",
            value: getQueryString("app_key"),
            force: !0
        })), url = add_version_tail(url), new_tab || gNodeMenuShow.new_tab ? (gNodeMenuShow.new_tab = void 0, sessionStorage.local_current_filed = sessionStorage.node_name_list = g_field_parm, window.open(url, "_blank")) : window.location.href = url
}
function replace_url_value(option) {
    if (option && option.value && option.key && option.url) {
        "{empty}" == option.value ? option.value = "" : 1;
        var url = (getUrlValue(option.url, option.key) || "", option.url), reg = new RegExp("([?&])" + option.key + "=([^?&$])*");
        return url.match(reg) ? url = url.replace(reg, "$1" + option.key + "=" + option.value) : option.force && (url += url.indexOf("?") >= 0 ? "&" : "?", url += option.key + "=" + option.value), url
    }
    return option.url
}
function parse_node_param(params, treeNode) {
    params = params || "";
    var keys = params.match(/@[^=$\/\s&]*/g);
    return keys && $.each(keys, function (i, at) {
        var key = at;
        key = key.trim();
        var value = get_at_value(key, treeNode);
        key && value && (params = params.replace(at, value))
    }), params
}
function is_wtg_level(type) {
    return "BAY_TURBINE" == type || "BAY_INVERTER" == type
}
function fill_firstpage_param(btn_param) {
    if (!btn_param)return "";
    btn_param = btn_param || "";
    var values = btn_param.trim().split(" ");
    values = array_remove_null(values);
    var svg_path_name = values[0];
    if (svg_path_name.indexOf("/") < 0) {
        var path = uncertain_local_data("region_list");
        path && path.indexOf(",") < 0 && (svg_path_name = replace_name_space(path) + "/" + svg_path_name, values[0] = svg_path_name)
    }
    if (values.length <= 1) {
        var value = uncertain_local_data("region_list");
        value && values.push(replace_name_space(value))
    }
    return values.join(" ")
}
function replace_name_space(name) {
    return name = name || "", name.indexOf("~~") >= 0 || name.indexOf("~1") >= 0 ? name : (name = name.replace(/~/g, "~~"), name = name.replace(/ /g, "~1"))
}
function recover_name_space(name) {
    name = name || "";
    for (var ret = [], i = 0; i < name.length; i++) {
        var now = name[i];
        if ("~" == now) {
            var next = name[i + 1];
            if ("~" == next) {
                ret.push("~"), i++;
                continue
            }
            if ("1" == next) {
                ret.push(" "), i++;
                continue
            }
        }
        ret.push(now)
    }
    return ret.join("")
}
function sort_head(g_head_cfg) {
    var menu = g_head_cfg.menu, lang = g_head_cfg.scada_language_config;
    menu = menu || [];
    var menuChildren = function (menu) {
        return menu = menu.sort(function (a, b) {
            return a.seq - b.seq
        }), $.each(menu, function (i) {
            menu[i].text = menu[i][lang], menu[i].icon = menu[i].icon ? menu[i].icon : "", menu[i].show = menu[i].ifshow;
            var children = menu[i].children || [];
            children && children.length > 0 && menuChildren(children)
        }), menu
    };
    g_head_cfg.menu = menuChildren(menu)
}
function addUserHabits() {
    if (g_head_cfg) {
        var uac = g_head_cfg.user_analytics_config, ufc = g_head_cfg.user_feedback_config;
        if (uac && "true" == uac.enable && uac.server && uac.site_id) {
            var server = uac.server, siteid = parseFloat(uac.site_id);
            $("body").append("<!-- Piwik --><script type=\"text/javascript\">  var _paq = _paq || [];  _paq.push(['trackPageView']);  _paq.push(['enableLinkTracking']);  (function() {    var u=\"//" + server + "/\";    _paq.push(['setTrackerUrl', u+'piwik.php']);    _paq.push(['setSiteId', " + siteid + "]);    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);  })();</script><noscript><p><img src=\"//" + server + "/piwik.php?idsite=" + siteid + '" style="border:0;" alt="" /></p></noscript><!-- End Piwik Code -->')
        }
        if (ufc && "true" == ufc.enable && "login" != getFileName(window.location.href, "/", ".")) {
            var httpurl = ufc.file_server, suffix = "", nowtime = new Date, ver = nowtime.getFullYear().toString() + (nowtime.getMonth() + 1).toString() + nowtime.getDate().toString(), _p = {};
            _p[0] = scada_language_config && "zh" != scada_language_config ? "lang=" + scada_language_config : "", _p[1] = ufc.feedbutton && "" != ufc.feedbutton && ufc.feedbutton.indexOf(".") >= -1 && ufc.feedbutton.indexOf("#") >= -1 ? "feedbutton=" + encodeURIComponent(ufc.feedbutton) : "", _p[2] = ufc.highlight && "false" == ufc.highlight ? "hl=0" : "", _p[3] = ufc.draggable && "false" == ufc.draggable ? "draggable=0" : "", _p[4] = ufc.button_pos && "" != ufc.button_pos ? "pos=" + ("0" == ufc.button_pos ? "rb" : "1" == ufc.button_pos ? "rt" : "2" == ufc.button_pos ? "lb" : "3" == ufc.button_pos ? "lt" : "rb") : "", _p[5] = ufc.theme && "" != ufc.theme ? "theme=" + ("1" == ufc.theme ? "fashion" : "tradition") : "", _p[6] = ufc.feedback_server && "" != ufc.feedback_server ? "ajaxurl=" + ufc.feedback_server : "", _p[7] = "_v=" + ver, $.each(_p, function (k, v) {
                suffix += "" != v ? ("" != suffix ? "&" : "?") + v : ""
            }), $("body").append('<script id="envision_feedback_' + nowtime.getTime() + '" src="' + httpurl + "load.js" + suffix + '"></script>')
        }
    }
}
function portal_sys_memu() {
    is_login_home_page() || $("#env_r_cnt").load_multi_sys_memu({
        username: uncertain_local_data("username"),
        appName_esb: get_web_cfg("appName_esb"),
        logout_callback: scada_logout,
        lang: scada_language_config,
        app_list: g_head_cfg.app_menu
    })
}
function check_logined_user_count(user_count) {
    if (g_head_cfg && g_head_cfg.limit_user_and_tab_num && "true" == g_head_cfg.limit_user_and_tab_num.if_enabled) {
        var max_user_num = g_head_cfg && g_head_cfg.limit_user_and_tab_num && parseInt(g_head_cfg.limit_user_and_tab_num.max_user_num) || 1e3;
        user_count > max_user_num && alert(JSLocale.user_over_limitation.replace("{0}", max_user_num))
    }
}
function init_env_nav_menu1(options) {
    return function (menu_data) {
        var defaults = {
            wind_farm_name: "",
            user_info: "",
            user_logo: "",
            new_tab: !1,
            need_shortcuts: !0,
            need_fixed_top: !1,
            need_fixed_bottom: !1,
            set_wf_time: null,
            logout: null,
            clickFarm: null
        };
        options = $.extend(!0, {}, defaults, options), init_left_dom(options), init_right_dom(options.need_fixed_top, options.need_fixed_bottom), menu_data && menu_data.menu ? (init_accordion_dom(menu_data, options.new_tab), init_accordion_event()) : resize_menu()
    }
}
function init_env_nav_menu2(options) {
    var defaults = {
        menu_data: {res_path: "", menu: []},
        wind_farm_name: "",
        user_info: "",
        user_login: "",
        new_tab: !1,
        need_shortcuts: !0,
        need_fixed_top: !1,
        need_fixed_bottom: !1,
        set_wf_time: null,
        logout: null,
        clickFarm: null
    };
    options = $.extend(!0, {}, defaults, options), init_left_dom(options), init_right_dom(options.need_fixed_top, options.need_fixed_bottom), options.menu_data && options.menu_data.menu ? (init_accordion_dom(options.menu_data, options.new_tab), init_accordion_event()) : resize_menu(), $("#env_menu").contextmenu(function (event) {
        return event.preventDefault(), !1
    })
}
function init_env_nav_tree(setting, treeArray, currentFarm, currentWtg) {
    var t = $("#envNavTreeDiv"), tree = $.fn.zTree.getZTreeObj("envNavTree");
    if (!tree) {
        g_nav_tree.hide_cfg_nodes(g_tree_object);
        for (var treeItem, treeTemp = [], i = 0; treeItem = treeArray[i]; i++) {
            var oldItem = g_tree_object.getNodeByParam("name", treeItem.name);
            oldItem && !oldItem.isHidden && treeTemp.push(treeItem)
        }
        if (treeArray = treeTemp, tree = $.envtool.navTree(setting, treeArray, currentFarm, currentWtg), function () {
                $("#envNavTree").parent().envSearchTree({
                    treeId: ["envNavTree"],
                    treeContainer: "#envNavTreeDiv>.envNavTreeIe"
                })
            }(), !tree)return tree;
        var nowFarm = tree.getNodeByParam("sub_root_showed", !0) || tree.getNodeByParam("level", 0);
        nowFarm && tree.selectNode(nowFarm)
    }
    var el = document.getElementById("env_wf_info"), p = $.envtool.getElementPos(el);
    return t.css({left: p.left + $(el).width() - 1 + "px", top: p.top + "px"}).fadeIn(), tree
}
function bindMenuClickById(bind_menu_id, click_event) {
    bind_menu_event_map[bind_menu_id] = click_event, "string" == typeof bind_menu_id && $("#" + bind_menu_id).unbind("click").click(function () {
        menu_clicked(bind_menu_id, click_event)
    })
}
function menu_clicked(bind_menu_id, click_event) {
    var $bind_menu = $("#" + bind_menu_id);
    if ("1" == $bind_menu.attr("level").toString()) $bind_menu.next().html() ? $bind_menu.next().is(":visible") ? $bind_menu.removeClass("current").next().hide() : $bind_menu.next().show().parent().siblings().children("a").next().hide() : ($bind_menu.addClass("current").next().show().parent().siblings().children("a").removeClass("current").next().hide(), $("a[level=2] > span").attr("is_hover", !1).each(function () {
            $(this).css({background: "url(" + $(this).attr("icon") + ") no-repeat"})
        }), $("a[level=2]").css("color", "#959595")); else if ("2" == $bind_menu.attr("level").toString()) {
        var $cur_lv1_menu = $bind_menu.closest(".menu .level1").find("a").first();
        $cur_lv1_menu.addClass("current").parent().siblings().children("a").removeClass("current").next().hide(), $("a[level=2] > span").attr("is_hover", !1).each(function () {
            $(this).css({background: "url(" + $(this).attr("icon") + ") no-repeat"})
        });
        var $cur_icon_span = $bind_menu.find("span").first(), lv2_hover_icon = $cur_icon_span.attr("hover_icon") ? $cur_icon_span.attr("hover_icon") : "";
        $cur_icon_span.css({background: "url(" + lv2_hover_icon + ") no-repeat"}).attr("is_hover", !0), $("a[level=2]").css("color", "#959595"), $bind_menu.css("color", "#dc5d03"), sessionStorage.bind_menu_id = bind_menu_id, bind_shortcut_event()
    }
    click_event()
}
function bind_shortcut_event() {
    for (var shortcut_menus = sessionStorage.shortcut_menus ? JSON.parse(sessionStorage.shortcut_menus) : [], i = 0; i < shortcut_menus.length; i++)bind_menu_event_map[shortcut_menus[i].id] && "function" == typeof bind_menu_event_map[shortcut_menus[i].id] && ($("#" + shortcut_menus[i].id + "_shortcuts_icon").unbind("click").click(function () {
        shortcut_menu_clicked($(this)[0].id)
    }), $("#" + shortcut_menus[i].id + "_shortcuts_text").unbind("click").click(function () {
        shortcut_menu_clicked($(this)[0].id)
    }))
}
function shortcut_menu_clicked(short_menu_id) {
    var lv2_menu_id = short_menu_id;
    if (null != short_menu_id.match("shortcuts")) {
        var temp = short_menu_id.split("_");
        lv2_menu_id = "";
        for (var i = 0; i < temp.length - 2; ++i)lv2_menu_id += temp[i] + (i == temp.length - 3 ? "" : "_")
    }
    var $bind_lv2_menu = $("#" + lv2_menu_id), $cur_lv1_menu = $bind_lv2_menu.closest(".menu .level1").find("a").first();
    $cur_lv1_menu.addClass("current").next().show().parent().siblings().children("a").removeClass("current").next().hide(), update_menu_and_bg_height($cur_lv1_menu), $("a[level=2]").css("color", "#959595"), $bind_lv2_menu.css("color", "#dc5d03"), sessionStorage.bind_menu_id = lv2_menu_id, bind_shortcut_event();
    var lv2_menu_click_event = bind_menu_event_map[lv2_menu_id];
    lv2_menu_click_event()
}
function update_menu_and_bg_height($cur_lv1_menu) {
    var menu = document.getElementById(menu_id), env_cnt_height = $("#" + right_id).height(), total_height = Math.max(env_cnt_height, window.innerHeight), menu_max_height = total_height - $("#env_user_logo").height() - $("#env_app_logo").height() - $("#env_wf_info").height() - $("#env_wf_time").height() - $("#env_user_info").height() - $("#" + shortcut_menu_id).height() - $("#env_left_bottom").height(), menu_minHeight = parseFloat(menu.style.minHeight.replace("px", ""));
    if (menu_minHeight + $cur_lv1_menu.next().height() > parseFloat(menu.style.height.replace("px", ""))) {
        menu.style.minHeight = 50 * $(".menu .level1").length + $cur_lv1_menu.next().height() + "px", menu.style.height = parseFloat(menu.style.minHeight.replace("px", "")) > menu_max_height ? menu.style.minHeight : menu_max_height + "px";
        var svg_height = parseFloat(menu.style.height.replace("px", "")) + $("#env_user_logo").height() + $("#env_app_logo").height() + $("#env_wf_info").height() + $("#env_wf_time").height() + $("#env_user_info").height() + $("#" + shortcut_menu_id).height() + $("#env_left_bottom").height();
        $("#left_svg_bg").attr("height", svg_height), $("#right_svg_bg").attr("height", svg_height);
        var svg_width = getTotalWidth() - $("#" + menu_id).width();
        $("#left_svg_bg").attr("width", $("#svg_1eft").attr("width")), $("#right_svg_bg").attr("width", svg_width), $("#svg_1eft").parent().attr("transform", "scale(1," + parseFloat(svg_height) / 1080 + ")"), $("#svg_right").parent().attr("transform", "scale(" + parseFloat(svg_width) / 1720 + "," + parseFloat(svg_height) / 1080 + ")")
    }
}
function bindMenuClickByText(bind_menu_text, click_event) {
}
function init_left_dom(options) {
    if (null != options && "object" == typeof options && options.constructor == Object) {
        var _farmName = options.wind_farm_name, _userInfo = options.user_info, _userLogo = options.user_logo, _needShortcuts = options.need_shortcuts, _setWfTime = options.set_wf_time, _logout = options.logout, _clickFarm = options.clickFarm, _userLogoPointIndex = _userLogo.indexOf("."), _userLogoMin = _userLogoPointIndex > -1 ? _userLogo.substring(0, _userLogoPointIndex) + "_min" + _userLogo.substring(_userLogoPointIndex, _userLogo.length) : _userLogo + "_min", env_left = $('<div id="env_left" class="env-left"><div class="collapse-btn"></div></div>'), env_user_logo = $('<div id="env_user_logo" class="env-user-logo"><img /></div>');
        _userLogo ? env_user_logo.children("img").attr("src", "../project/images/logo/" + _userLogo).attr("alt", "User Logo") : env_user_logo.css({
                display: "none",
                height: 0
            });
        var env_app_logo = $('<div id="env_app_logo" class="env-app-logo"></div>'), env_wf_info = $('<div id="env_wf_info" class="env-wf-info"></div>'), windfarm_name_str = _farmName.length < 7 ? '<span style="padding-top:5px;">' + _farmName + "</span>" : '<marquee scrollamount="2" style="padding-top:5px;">' + _farmName + "</marquee>", wf_info_span = '<table><tr title="' + _farmName + '"><td class="wf-icon"></td><td id="wf_name" class="wf-name">' + windfarm_name_str + '</td><td class="toggle-arrow"></td></tr></table>';
        env_wf_info.append(wf_info_span), env_wf_info.bind("mouseover", function (e) {
            _clickFarm && "function" == typeof _clickFarm && _clickFarm()
        });
        var env_wf_time = $('<div id="env_wf_time" class="env-wf-time"></div>');
        env_wf_time.append('<table><tr title=""><td id="wf_time_icon"></td><td id="wf_time" class="wf-time">' + showTime() + '</td><td class="wf-time-other"></td></tr></table>');
        var env_user_info = $('<div id="env_user_info" class="env-usr-info"></div>'), user_info_ul = '<ul><li id="username" class="username">' + _userInfo.username + '</li><li id="logout" class="logout"><a></a></li></ul>';
        env_user_info.append(user_info_ul);
        var env_menu = $('<div id="' + menu_id + '" class="env-menu"></div>'), env_shortcut_menu = $('<div id="' + shortcut_menu_id + '" class="env-shortcut-menu"><div style="padding:10px 0 0 16px;color:#3ea0a7;"></div></div>'), shortcut_table = '<table id="shortcut_table" class="shortcut-table"><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>';
        env_shortcut_menu.append(shortcut_table);
        var env_left_bottom = $('<div id="env_left_bottom" class="env-left-bottom"></div>');
        env_left_bottom.append('<div id="env_copyright" class="env-copyright">2010-2015&copy;</div>'), env_left.append('<div id="env_l_bg" class="env-l-bg"></div>'), env_left.append(env_user_logo).append(env_app_logo).append(env_wf_info).append(env_wf_time), env_left.append(env_menu), _needShortcuts && env_left.append(env_shortcut_menu), env_left.append(env_user_info).append(env_left_bottom), $("body").prepend(env_left), $("body").append('<div id="envNavTreeDiv" class="envNavTree"><div class="envNavTreeIe" style="height:' + (3 * $(window).height() / 5 > 450 ? 3 * $(window).height() / 5 : 450) + 'px;"><ul id="envNavTree" class="ztree"></ul></div><iframe class="envision_mask" scrolling="no" frameborder="0"> </iframe></div>'), _setWfTime && "function" == typeof _setWfTime ? _setWfTime() : setInterval("wf_time.innerHTML=showTime()", 1e3), _logout && "function" == typeof _logout && $("#logout").click(_logout), env_left.children(".collapse-btn").click(function () {
            $("body").hasClass("maximize") ? ($("body").removeClass("maximize"), $(".menu span.lock").css("display", ""), _userLogo ? env_user_logo.children("img").attr("src", "../project/images/logo/" + _userLogo).attr("alt", "User Logo") : env_user_logo.css({
                        display: "none",
                        height: 0
                    })) : ($("body").addClass("maximize"), $(".menu span.lock").css("display", "none"), _userLogo ? (env_user_logo.children("img").attr("src", "../project/images/logo/" + _userLogoMin).attr("alt", "User Logo"), env_user_logo.children("img").error(function () {
                        $(this).attr("src", "../project/images/logo/" + _userLogo).attr("alt", "User Logo")
                    })) : env_user_logo.css({
                        display: "none",
                        height: 0
                    })), "function" == typeof resize_menu && resize_menu(), $(window).resize()
        }), addEventHandler(document, "mousemove", function (e) {
            for (var t = e.target || e.srcElement; "undefined" != typeof t && null != t && "undefined" != typeof t.nodeName && null != t.nodeName && "html" != t.nodeName.toLowerCase();) {
                if ("env_wf_info" == t.id || "envNavTreeDiv" == t.id)return;
                t = t.parentNode
            }
            $("#envNavTreeDiv").fadeOut(), farmCommSts.farmNodes = []
        }), /msie \d+\.0/gi.test(window.navigator.userAgent) && $(document).on("mouseover", function (e) {
            var _o = $("iframe.envision_mask");
            _o.each(function (i) {
                var _i = _o.eq(i);
                if ("block" == _i.parent().css("display")) {
                    var _u = _i.parent().children("div");
                    _i.css("display", "block").width(_u.outerWidth() + "px").height(_u.outerHeight() + "px")
                } else _i.css("display", "none")
            })
        })
    }
}
function set_wind_farm_name(wind_farm_name) {
    $("#wf_name").text(wind_farm_name)
}
function showTime() {
    var d = null, s = "";
    return d = new Date, s += "20" + d.getYear().toString().substring(1) + "-", s += (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)) + "-", s += (d.getDate() > 9 ? d.getDate() : "0" + d.getDate()) + " ", s += (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) + ":", s += (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()) + ":", s += d.getSeconds() > 9 ? d.getSeconds() : "0" + d.getSeconds()
}
function init_shortcut_menu() {
    var url_level_map = JSON.parse(sessionStorage.url_level_map), current_url = window.location.href.toString();
    current_url = current_url.lastIndexOf("_v") > 1 ? current_url.substring(0, current_url.lastIndexOf("_v") - 1) : current_url;
    var url_level_map_key = current_url.indexOf("&") > -1 ? current_url.substring(current_url.lastIndexOf("/") + 1, current_url.indexOf("&")) : current_url.substring(current_url.lastIndexOf("/") + 1);
    url_level_map[url_level_map_key] && url_level_map[url_level_map_key].level2 > 0 && update_shortcuts_array(url_level_map[url_level_map_key].id), sessionStorage.bind_menu_id && (update_shortcuts_array(sessionStorage.bind_menu_id), sessionStorage.bind_menu_id = ""), update_shortcuts_dom()
}
function update_shortcuts_array(clicked_menu_id) {
    var $clicked_menu = $("#" + clicked_menu_id), shortcut_menus = sessionStorage.shortcut_menus ? JSON.parse(sessionStorage.shortcut_menus) : [], temp = {};
    temp.text = $clicked_menu.text(), temp.url = $clicked_menu.attr("href") ? $clicked_menu.attr("href") : "", temp.target = $clicked_menu.attr("target") ? $clicked_menu.attr("target") : "", temp.icon = $clicked_menu.children("span").attr("icon") ? $clicked_menu.children("span").attr("icon").replace("_hover", "") : "", temp.id = clicked_menu_id;
    for (var i = 0; i < shortcut_menus.length; ++i)if (shortcut_menus[i].text == temp.text)return;
    6 == shortcut_menus.length && shortcut_menus.splice(0, 1), shortcut_menus.push(temp), sessionStorage.shortcut_menus = JSON.stringify(shortcut_menus)
}
function update_shortcuts_dom() {
    for (var shortcut_menus = sessionStorage.shortcut_menus ? JSON.parse(sessionStorage.shortcut_menus) : [], shortcuts_tds = $("#shortcut_table td"), i = shortcut_menus.length - 1; i >= 0; --i) {
        var shortcut_td = (!!shortcut_menus[i].target, '<a id="' + shortcut_menus[i].id + '_shortcuts_icon" href="' + shortcut_menus[i].url + '" ' + (shortcut_menus[i].target ? 'target="' + shortcut_menus[i].target + '"' : "") + '><img src="' + get_shortcuts_icon(shortcut_menus[i].icon) + '"></a><a id="' + shortcut_menus[i].id + '_shortcuts_text" href="' + shortcut_menus[i].url + '" ' + (shortcut_menus[i].target ? 'target="' + shortcut_menus[i].target + '"' : "") + ">" + shortcut_menus[i].text + "</a>");
        shortcuts_tds.eq(shortcut_menus.length - 1 - i).html(shortcut_td)
    }
    var svg_height = $("#env_left").height(), svg_width = getTotalWidth() - $("#" + menu_id).width();
    $("#left_svg_bg").attr("height", svg_height), $("#left_svg_bg").attr("width", $("#svg_1eft").attr("width")), $("#right_svg_bg").attr("height", svg_height), $("#right_svg_bg").attr("width", svg_width), $("#svg_1eft").parent().attr("transform", "scale(1," + parseFloat(svg_height) / 1080 + ")"), $("#svg_right").parent().attr("transform", "scale(" + parseFloat(svg_width) / 1720 + "," + parseFloat(svg_height) / 1080 + ")")
}
function get_shortcuts_icon(menu_icon) {
    if (menu_icon && menu_icon.length > 0) {
        if (menu_icon.lastIndexOf("/") > 0) {
            var icon_path = menu_icon.substring(0, menu_icon.lastIndexOf("/") + 1), icon_name = menu_icon.substring(menu_icon.lastIndexOf("/") + 1);
            return icon_name.length <= 0 ? icon_path + "shortcuts_default.png" : icon_path + "shortcuts_" + icon_name
        }
        return "shortcuts_" + menu_icon
    }
    return "http://" + window.location.host + "/webtools/env_nav/resources/shortcuts_default.png"
}
function init_right_dom(need_fixed_top, need_fixed_bottom) {
    var right_cnt = $("#" + right_cnt_id), env_right = $('<div id="' + right_id + '" class="env-right">'), env_r_bg = $('<div id="' + right_bg_id + '" class="env-r-bg"></div>');
    if (right_cnt.wrap(env_right).before(env_r_bg), need_fixed_top) {
        var env_r_top = $('<div id="' + right_top_id + '" class="env-r-top"></div>');
        right_cnt.before(env_r_top).css("padding-top", $("#" + right_top_id).height())
    }
    if (need_fixed_bottom) {
        var env_r_bottom = $('<div id="' + right_bottom_id + '" class="env-r-bottom"></div>');
        right_cnt.after(env_r_bottom).css("padding-bottom", $("#" + right_bottom_id).height())
    }
}
function init_accordion_dom(menu_data, new_tab) {
    setUrlMap(menu_data);
    var menu_index = get_cur_menu_index(), menu_ul = "", menu = menu_data.menu || [], res_path = menu_data.res_path ? menu_data.res_path.substring(0, menu_data.res_path.length - 1) + "/" : "", blockIcon = '<span class="lock" icon="../project/images/menu/scada_menu_lock.png" style="background:url(../project/images/menu/scada_menu_lock.png) no-repeat;"></span>', redBox = function (menu) {
        if (menu && menu.url) {
            if (menu.url.indexOf("v_dataexporter/v_dataexporter.html") > -1)return '<span id="data_export_number" class="data_export_number" style="display:none;"></span>';
            if (menu.url.indexOf("v_task.html") > -1)return '<span id="env_task_number" class="data_export_number" style="display:none;"></span>'
        }
        return ""
    }, aMenu = function (menuEle, n, pos, opened, focused) {
        var str = "";
        if (menuEle.show = menuEle.show ? menuEle.show.toString() : "0", "false" == menuEle.show || "0" == menuEle.show || 0 == menuEle.priv_type)return "";
        var open, focus, children = menuEle.children || [], icon = menuEle.icon ? res_path + menuEle.icon : "", show2 = "2" == menuEle.show ? ' onclick="hint_dialog();"' : "", addUrl = "2" != menuEle.show && !!menuEle.url, newTab = menuEle.new_tab || new_tab, liClass = "", rightBox = "", href = "", target = "", style = "", block = "", ulClass = "", aClass = "", hoverIcon = "", hovStr = "";
        (1 === n && menu_index.level1 == pos || opened && menu_index["level" + n] == pos) && (open = !0, menu_index.pageName == getUrlMap(menuEle.url) && (focus = !0, focused = !0)), 1 === n ? (liClass = ' class="level' + n + '"', rightBox = redBox(menuEle), open && (aClass = "current")) : (hoverIcon = icon ? icon.replace(/(\.[^\.]+$)/, "_hover$1") : "", children.length > 0 && (aClass = "menu-arrow-left", !focused && open && (aClass += " menu-arrow-down")), focus = !!focus, style = ' style="color:' + (focus ? "#dc5d03" : "#959595") + ';"', hovStr = ' is_hover="' + (focus ? "true" : "false") + '"'), 1 == menuEle.priv_type ? (href = ' href="javascript:void(0);"', block = blockIcon, style = ' style="color:#959595;"') : (href = ' href="' + (addUrl ? menuEle.url : "javascript:void(0);") + '"', target = addUrl && newTab ? ' target="_blank"' : "");
        var displayStyle = menuEle.url.indexOf("showonly") < 0 ? '"' : ';display:none;"';
        if (style = style.length > 1 ? style.substr(0, style.length - 1) + displayStyle : style, str += "<li" + liClass + ">" + rightBox + '<a show="' + menuEle.show + '" id="' + (menuEle.id || "") + '" title="' + menuEle.text + '" class="' + aClass + '" level="' + n + '" priv_type="' + menuEle.priv_type + '"' + href + target + style + show2 + '><span class="level' + n + '-icon" icon="' + icon + '" style="background:url(' + (n > 1 && focus && 1 != menuEle.priv_type ? hoverIcon : icon) + ') no-repeat;"' + hovStr + (hoverIcon ? 'hover_icon="' + hoverIcon + '"' : "") + "></span>" + menuEle.text + block + "</a>", children.length > 0) {
            n += 1, ulClass = n > 2 ? "menu_ul menu_ul_" + n + " level" + n : "level" + n + (!focused && open ? "" : " level" + n + "-hidden level-hidden"), str += '<ul class="' + ulClass + '"' + (!focused && open ? "" : 'style="display:none;"') + ">";
            for (var i = 0; i < children.length; i++)str += aMenu(children[i], n, i + 1, open, focused);
            str += "</ul>"
        }
        return str += "</li>"
    };
    menu_ul += '<ul class="menu disable_menu">';
    for (var i = 0; i < menu.length; i++)menu_ul += aMenu(menu[i], 1, i + 1);
    menu_ul += "</ul>", $("#" + menu_id).append(menu_ul), $("title").html(menu_index.text), lv2_menu_hover(menu_data), level2_click(), setTimeout(resize_menu, 0)
}
function level2_click() {
    $(".menu ul.level2 li>a").click(function (event) {
        return
    })
}
function hint_dialog() {
    Util.Dialog({
        boxID: "menu_hint_dialog",
        width: 320,
        height: 100,
        title: JSLocale.alert_info,
        fixed: !0,
        content: 'text:<div style="font-size:18px;color:#ffffff;text-align:center;padding:20px;">^_^ 玩命开发中，敬请期待...<br/>^_^ To be continued...</div>',
        yesBtn: [JSLocale.alert_ok, function () {
            return !0
        }],
        showbg: !0
    }), $("#menu_hint_dialog.ui_dialog .ui_title .ui_title_icon").css({
        background: "url(../v_graph/images/env_hint_icon.png) no-repeat",
        "margin-top": "12px",
        "margin-left": "8px"
    }), $("#menu_hint_dialog.ui_dialog .ui_title").css({
        height: "47px",
        "line-height": "46px"
    }), $("#menu_hint_dialog.ui_dialog .ui_btn_close").css({"margin-right": "8px"}), $("#menu_hint_dialog.ui_dialog .ui_box_btn").css({
        margin: "10px 15px 10px 5px",
        height: "25px",
        "line-height": "24px"
    })
}
function lv2_menu_hover(menu_data) {
    for (var menu = menu_data.menu ? menu_data.menu : [], i = 0; i < menu.length; ++i) {
        var menu_children = menu[i].children ? menu[i].children : [];
        lv_children_menu_hover(menu_children)
    }
}
function lv_children_menu_hover(menu_children) {
    if (menu_children)for (var j = 0; j < menu_children.length; ++j)menu_children[j].priv_type == -1 ? $("#" + menu_children[j].id).hover(function () {
            var $icon_span = $(this).find("span").first(), lv2_hover_icon = $icon_span.attr("hover_icon") ? $icon_span.attr("hover_icon") : "";
            "false" == $icon_span.attr("is_hover") && ($icon_span.css({background: "url(" + lv2_hover_icon + ") no-repeat"}), $(this).css("color", "#dc5d03"))
        }, function () {
            var $icon_span = $(this).find("span").first(), lv2_icon = $icon_span.attr("icon") ? $icon_span.attr("icon") : "";
            "false" == $icon_span.attr("is_hover") && ($icon_span.css({background: "url(" + lv2_icon + ") no-repeat"}), $(this).css("color", "#959595"))
        }) : 1 == menu_children[j].priv_type, lv_children_menu_hover(menu_children[j].children)
}
function get_cur_menu_index() {
    var menu_index = {};
    menu_index.level1 = 0, menu_index.level2 = 0;
    var url_level_map = JSON.parse(sessionStorage.url_level_map), current_url = window.location.href.toString(), url_level_map_key = getUrlMap(current_url);
    return url_level_map_key && url_level_map_key.indexOf("/v_graph.html") > -1 && !/first_svg=[^\&]+/.test(url_level_map_key) && !url_level_map["v_graph/v_graph.html"] && g_user_first_svg && (url_level_map_key = url_level_map_key + "?first_svg=" + g_user_first_svg), url_level_map[url_level_map_key] ? menu_index = url_level_map[url_level_map_key] : url_level_map_key.indexOf("first_svg=") > 0 && url_level_map_key.indexOf("/") > 0 && (url_level_map_key = url_level_map_key.replace(/=[^\/]*\//, "="), url_level_map[url_level_map_key] && (menu_index = url_level_map[url_level_map_key])), menu_index.pageName = url_level_map_key, menu_index
}
function setUrlMap(menu_data) {
    for (var menu = menu_data.menu || [], url_level_map = {}, ulm4 = function (menu, n, pos, level) {
        if (level["level" + n] = pos, menu.url) {
            var name = getUrlMap(menu.url);
            if (name) {
                url_level_map[name] = {id: menu.id, text: menu.text};
                for (var p in level)url_level_map[name][p] = level[p]
            }
        }
        var children = menu.children || [];
        n += 1;
        for (var j = 0; j < children.length; j++)ulm4(children[j], n, j + 1, level)
    }, i = 0; i < menu.length; ++i)ulm4(menu[i], 1, i + 1, {});
    sessionStorage.url_level_map = JSON.stringify(url_level_map)
}
function getUrlMap(url) {
    var str = "";
    if (url) {
        var special;
        if (url.indexOf("/v_graph.html") > -1 && /fleetmdmid=[^\&]+/.test(url) && !/first_svg=[^\&]+/.test(url)) {
            var fleetmdmid = getFleetHistory();
            if (fleetmdmid && fleetmdmid.graph_file) {
                var svghref = fleetmdmid.graph_file;
                svghref.indexOf("/") < 0 && (svghref = btn_param2svg(fleetmdmid.graph_file, fleetmdmid)), url += "&first_svg=" + svghref
            }
        }
        url.indexOf("/v_graph.html") > -1 && /first_svg=[^\&]+/.test(url) && (url = decodeURIComponent(url).match(/first_svg=[^\&]+/), url = url && url[0] ? url[0] : "", url = url.split(" ")[0], str = "v_graph/v_graph.html" + (url ? "?" + url : ""), special = !0), url.indexOf("v_powercurve/v_poweranalyze.html?") > -1 && (str = "v_powercurve/v_powercurve.html", special = !0), url.indexOf("v_curve.html") > -1 && url.indexOf("for_XY=1") > -1 && (str = "v_curve/v_curve.html?for_XY=1", special = !0), url.indexOf("v_common.html") > -1 && /t=[^\&]+/.test(url) && (url = decodeURIComponent(url).match(/t=[^\&]+/), url = url && url[0] ? url[0] : "", url = url.split(" ")[0], str = "v_maindata/v_common.html" + (url ? "?" + url : ""), special = !0), special || (url = url.replace(/&*_v=[^&]*/g, "").replace(/\?$/g, "").match(/[^\/]+\/[^\?\/]*(?:\?{0}|\?[^\?]*)$/), url = url && url[0] ? url[0] : "", url = url.match(/[^\/]+\/[^\?\/]*/), str = url && url[0] ? url[0] : "")
    }
    return str
}
function href_2_tree_click(a, new_tab) {
    var href = a.attr("href") || "";
    if (href.indexOf("/v_graph.html?") >= 0 && href.indexOf("first_svg=") >= 0) {
        var first_svg = getUrlValue(href, "first_svg");
        if (first_svg)return click_svg_href(first_svg, href, new_tab), !0
    }
    return !1
}
function init_accordion_event() {
    $(".menu .level1 a").click(function (event) {
        if ("2" == $(this).attr("show"))return hint_dialog(), !1;
        if (!$(this).next().html()) {
            var new_tab = "";
            return ("_blank" == $(this).attr("target") || event && event.ctrlKey) && (new_tab = "_blank"), !href_2_tree_click($(this), new_tab) && (new_tab = new_tab || "_self", window.open($(this).attr("href"), new_tab), !1)
        }
        var menu = document.getElementById(menu_id), env_cnt_height = $("#" + right_id).height(), total_height = Math.max(env_cnt_height, window.innerHeight, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)), menu_max_height = total_height - $("#env_user_logo").height() - $("#env_app_logo").height() - $("#env_wf_info").height() - $("#env_wf_time").height() - $("#env_user_info").height() - $("#" + shortcut_menu_id).height() - $("#env_left_bottom").height();
        if ($(this).next().is(":visible")) {
            $(this).removeClass("current"), $(this).next().hide(), $(this).parent().find("ul").hide(), $(this).parent().find("ul").find("a").removeClass("current").removeClass("menu-arrow-down"), $(this).removeClass("menu-arrow-down"), menu.style.minHeight = 50 * $(".menu .level1").length + "px", menu.style.height = menu_max_height + "px";
            var svg_height = total_height;
            $("#left_svg_bg").attr("height", svg_height), $("#right_svg_bg").attr("height", svg_height);
            var svg_width = getTotalWidth() - $("#" + menu_id).width();
            $("#left_svg_bg").attr("width", $("#svg_1eft").attr("width")), $("#right_svg_bg").attr("width", svg_width), $("#svg_1eft").parent().attr("transform", "scale(1," + parseFloat(svg_height) / 1080 + ")"), $("#svg_right").parent().attr("transform", "scale(" + parseFloat(svg_width) / 1720 + "," + parseFloat(svg_height) / 1080 + ")")
        } else {
            $(this).addClass("current").next().show().parent().siblings().children("a").removeClass("current").next().hide(), $(this).parent().siblings().find("ul").hide(), $(this).parent().siblings().find("ul").find("a").removeClass("current"), $(this).parent().siblings().find("a.menu-arrow-left").removeClass("menu-arrow-down"), $(this).closest("ul.level3").length > 0 && $(this).addClass("menu-arrow-down");
            var menu_minHeight = parseFloat(menu.style.minHeight.replace("px", ""));
            if ($(menu)[0].scrollHeight > menu_max_height) {
                $(menu).height($(menu)[0].scrollHeight);
                var svg_height = parseFloat(menu.style.height.replace("px", "")) + $("#env_user_logo").height() + $("#env_app_logo").height() + $("#env_wf_info").height() + $("#env_wf_time").height() + $("#env_user_info").height() + $("#" + shortcut_menu_id).height() + $("#env_left_bottom").height();
                $("#left_svg_bg").attr("height", svg_height), $("#right_svg_bg").attr("height", svg_height);
                var svg_width = getTotalWidth() - $("#" + menu_id).width();
                $("#left_svg_bg").attr("width", $("#svg_1eft").attr("width")), $("#right_svg_bg").attr("width", svg_width), $("#svg_1eft").parent().attr("transform", "scale(1," + parseFloat(svg_height) / 1080 + ")"), $("#svg_right").parent().attr("transform", "scale(" + parseFloat(svg_width) / 1720 + "," + parseFloat(svg_height) / 1080 + ")")
            }
            if (menu_minHeight + $(this).next().height() > parseFloat(menu.style.height.replace("px", ""))) {
                menu.style.minHeight = 50 * $(".menu .level1").length + $(this).next().height() + "px", menu.style.height = parseFloat(menu.style.minHeight.replace("px", "")) > menu_max_height ? menu.style.minHeight : menu_max_height + "px", $(menu)[0].scrollHeight > menu_max_height && $(menu).height($(menu)[0].scrollHeight);
                var svg_height = parseFloat(menu.style.height.replace("px", "")) + $("#env_user_logo").height() + $("#env_app_logo").height() + $("#env_wf_info").height() + $("#env_wf_time").height() + $("#env_user_info").height() + $("#" + shortcut_menu_id).height() + $("#env_left_bottom").height();
                $("#left_svg_bg").attr("height", svg_height), $("#right_svg_bg").attr("height", svg_height);
                var svg_width = getTotalWidth() - $("#" + menu_id).width();
                $("#left_svg_bg").attr("width", $("#svg_1eft").attr("width")), $("#right_svg_bg").attr("width", svg_width), $("#svg_1eft").parent().attr("transform", "scale(1," + parseFloat(svg_height) / 1080 + ")"), $("#svg_right").parent().attr("transform", "scale(" + parseFloat(svg_width) / 1720 + "," + parseFloat(svg_height) / 1080 + ")")
            }
        }
        return "function" == typeof resize_svg && resize_svg("svg_name"), "function" == typeof resize_menu && resize_menu(), !1
    })
}
function has_children_hovered(lv1_menu) {
    for (var lv2_menus = lv1_menu.next().children(), i = 0; i < lv2_menus.length; ++i)if ("true" == lv2_menus.eq(i).find("span.level2-icon").attr("is_hover"))return !0;
    return !1
}
function resize_menu(right_height) {
    right_height = right_height || 0;
    var env_cnt_height = Math.max($("#" + right_id).height(), $("#" + right_cnt_id).height(), right_height), total_height = env_cnt_height > window.innerHeight ? env_cnt_height : window.innerHeight, other_fixed_height = ($("#env_app_logo").is(":hidden") ? 0 : $("#env_app_logo").height()) + ($("#env_user_logo").is(":hidden") ? 0 : $("#env_user_logo").height()) + ($("#env_wf_info").is(":hidden") ? 0 : $("#env_wf_info").height()) + ($("#env_wf_time").is(":hidden") ? 0 : $("#env_wf_time").height()) + ($("#env_user_info").is(":hidden") ? 0 : $("#env_user_info").height()) + ($("#" + shortcut_menu_id).is(":hidden") ? 0 : $("#" + shortcut_menu_id).height()) + ($("#env_left_bottom").is(":hidden") ? 0 : $("#env_left_bottom").height()), max_height = total_height - other_fixed_height, menu = document.getElementById(menu_id);
    if (menu) {
        menu.style.height = max_height + "px";
        var visible_lv2_menu = $(".menu ul.level2:visible");
        visible_lv2_menu.length > 0 ? menu.style.minHeight = 50 * $(".menu .level1").length + visible_lv2_menu.height() + "px" : menu.style.minHeight = 50 * $(".menu .level1").length + "px";
        var svg_min_height = (visible_lv2_menu.length > 0 ? 50 * $(".menu .level1").length + visible_lv2_menu.height() : 50 * $(".menu .level1").length) + $("#env_user_logo").height() + $("#env_app_logo").height() + $("#env_wf_info").height() + $("#env_wf_time").height() + $("#env_user_info").height() + $("#" + shortcut_menu_id).height() + $("#env_left_bottom").height(), svg_height = total_height > svg_min_height ? total_height : svg_min_height, svg_width = getTotalWidth() - $("#" + menu_id).width();
        "" == $("#" + left_bg_id).html() && "function" == typeof initLeftSvgBg && initLeftSvgBg(left_bg_id, "../common/frame/env_nav/resources/env_left_bg.jpg"), "" == $("#" + right_bg_id).html() && "function" == typeof initRightSvgBg && initRightSvgBg(right_bg_id, "../common/frame/env_nav/resources/env_right_bg.jpg"), $("#left_svg_bg").attr("height", svg_height), $("#left_svg_bg").attr("width", $("#svg_1eft").attr("width")), $("#right_svg_bg").attr("height", svg_height), $("#right_svg_bg").attr("width", svg_width), $("#svg_1eft").parent().attr("transform", "scale(1," + parseFloat(svg_height) / 1080 + ")"), $("#svg_right").parent().attr("transform", "scale(" + parseFloat(svg_width) / 1720 + "," + parseFloat(svg_height) / 1080 + ")");
        var temp = $("#" + menu_id).width() - getScrollLeft();
        $("#" + right_top_id).css("left", (temp <= 0 ? 0 : temp) + "px"), $("#" + right_bottom_id).css("left", (temp <= 0 ? 0 : temp) + "px")
    }
}
function getTotalWidth() {
    var total_width = document.documentElement.clientWidth;
    return "chrome" == checkBrowser() ? total_width = document.documentElement.scrollWidth > window.innerWidth ? document.documentElement.scrollWidth : document.documentElement.scrollHeight > window.innerHeight ? document.documentElement.clientWidth : window.innerWidth : "ie" == checkBrowser() && (total_width = document.body.scrollWidth > window.innerWidth ? document.body.scrollWidth : document.documentElement.scrollHeight > window.innerHeight ? document.documentElement.clientWidth : window.innerWidth), total_width = total_width > 1263 ? total_width : 1263
}
function getScrollLeft() {
    return "chrome" == checkBrowser() ? document.body.scrollLeft : document.documentElement.scrollLeft
}
function checkBrowser() {
    return navigator.userAgent.indexOf("Chrome") >= 0 ? "chrome" : navigator.userAgent.indexOf("MSIE") >= 0 ? "ie" : void 0
}
!function (t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
        var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.pako = t()
    }
}(function () {
    return function t(e, a, i) {
        function n(s, o) {
            if (!a[s]) {
                if (!e[s]) {
                    var l = "function" == typeof require && require;
                    if (!o && l)return l(s, !0);
                    if (r)return r(s, !0);
                    var h = new Error("Cannot find module '" + s + "'");
                    throw h.code = "MODULE_NOT_FOUND", h
                }
                var d = a[s] = {exports: {}};
                e[s][0].call(d.exports, function (t) {
                    var a = e[s][1][t];
                    return n(a ? a : t)
                }, d, d.exports, t, e, a, i)
            }
            return a[s].exports
        }

        for (var r = "function" == typeof require && require, s = 0; s < i.length; s++)n(i[s]);
        return n
    }({
        1: [function (t, e, a) {
            "use strict";
            function i(t) {
                if (!(this instanceof i))return new i(t);
                this.options = l.assign({
                    level: w,
                    method: v,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: p,
                    to: ""
                }, t || {});
                var e = this.options;
                e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new f, this.strm.avail_out = 0;
                var a = o.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
                if (a !== b)throw new Error(d[a]);
                if (e.header && o.deflateSetHeader(this.strm, e.header), e.dictionary) {
                    var n;
                    if (n = "string" == typeof e.dictionary ? h.string2buf(e.dictionary) : "[object ArrayBuffer]" === _.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, a = o.deflateSetDictionary(this.strm, n), a !== b)throw new Error(d[a]);
                    this._dict_set = !0
                }
            }

            function n(t, e) {
                var a = new i(e);
                if (a.push(t, !0), a.err)throw a.msg;
                return a.result
            }

            function r(t, e) {
                return e = e || {}, e.raw = !0, n(t, e)
            }

            function s(t, e) {
                return e = e || {}, e.gzip = !0, n(t, e)
            }

            var o = t("./zlib/deflate"), l = t("./utils/common"), h = t("./utils/strings"), d = t("./zlib/messages"), f = t("./zlib/zstream"), _ = Object.prototype.toString, u = 0, c = 4, b = 0, g = 1, m = 2, w = -1, p = 0, v = 8;
            i.prototype.push = function (t, e) {
                var a, i, n = this.strm, r = this.options.chunkSize;
                if (this.ended)return !1;
                i = e === ~~e ? e : e === !0 ? c : u, "string" == typeof t ? n.input = h.string2buf(t) : "[object ArrayBuffer]" === _.call(t) ? n.input = new Uint8Array(t) : n.input = t, n.next_in = 0, n.avail_in = n.input.length;
                do {
                    if (0 === n.avail_out && (n.output = new l.Buf8(r), n.next_out = 0, n.avail_out = r), a = o.deflate(n, i), a !== g && a !== b)return this.onEnd(a), this.ended = !0, !1;
                    0 !== n.avail_out && (0 !== n.avail_in || i !== c && i !== m) || ("string" === this.options.to ? this.onData(h.buf2binstring(l.shrinkBuf(n.output, n.next_out))) : this.onData(l.shrinkBuf(n.output, n.next_out)))
                } while ((n.avail_in > 0 || 0 === n.avail_out) && a !== g);
                return i === c ? (a = o.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === b) : i !== m || (this.onEnd(b), n.avail_out = 0, !0)
            }, i.prototype.onData = function (t) {
                this.chunks.push(t)
            }, i.prototype.onEnd = function (t) {
                t === b && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = l.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
            }, a.Deflate = i, a.deflate = n, a.deflateRaw = r, a.gzip = s
        }, {
            "./utils/common": 3,
            "./utils/strings": 4,
            "./zlib/deflate": 8,
            "./zlib/messages": 13,
            "./zlib/zstream": 15
        }],
        2: [function (t, e, a) {
            "use strict";
            function i(t) {
                if (!(this instanceof i))return new i(t);
                this.options = o.assign({chunkSize: 16384, windowBits: 0, to: ""}, t || {});
                var e = this.options;
                e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(e.windowBits >= 0 && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && 0 === (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new f, this.strm.avail_out = 0;
                var a = s.inflateInit2(this.strm, e.windowBits);
                if (a !== h.Z_OK)throw new Error(d[a]);
                this.header = new _, s.inflateGetHeader(this.strm, this.header)
            }

            function n(t, e) {
                var a = new i(e);
                if (a.push(t, !0), a.err)throw a.msg;
                return a.result
            }

            function r(t, e) {
                return e = e || {}, e.raw = !0, n(t, e)
            }

            var s = t("./zlib/inflate"), o = t("./utils/common"), l = t("./utils/strings"), h = t("./zlib/constants"), d = t("./zlib/messages"), f = t("./zlib/zstream"), _ = t("./zlib/gzheader"), u = Object.prototype.toString;
            i.prototype.push = function (t, e) {
                var a, i, n, r, d, f, _ = this.strm, c = this.options.chunkSize, b = this.options.dictionary, g = !1;
                if (this.ended)return !1;
                i = e === ~~e ? e : e === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, "string" == typeof t ? _.input = l.binstring2buf(t) : "[object ArrayBuffer]" === u.call(t) ? _.input = new Uint8Array(t) : _.input = t, _.next_in = 0, _.avail_in = _.input.length;
                do {
                    if (0 === _.avail_out && (_.output = new o.Buf8(c), _.next_out = 0, _.avail_out = c), a = s.inflate(_, h.Z_NO_FLUSH), a === h.Z_NEED_DICT && b && (f = "string" == typeof b ? l.string2buf(b) : "[object ArrayBuffer]" === u.call(b) ? new Uint8Array(b) : b, a = s.inflateSetDictionary(this.strm, f)), a === h.Z_BUF_ERROR && g === !0 && (a = h.Z_OK, g = !1), a !== h.Z_STREAM_END && a !== h.Z_OK)return this.onEnd(a), this.ended = !0, !1;
                    _.next_out && (0 !== _.avail_out && a !== h.Z_STREAM_END && (0 !== _.avail_in || i !== h.Z_FINISH && i !== h.Z_SYNC_FLUSH) || ("string" === this.options.to ? (n = l.utf8border(_.output, _.next_out), r = _.next_out - n, d = l.buf2string(_.output, n), _.next_out = r, _.avail_out = c - r, r && o.arraySet(_.output, _.output, n, r, 0), this.onData(d)) : this.onData(o.shrinkBuf(_.output, _.next_out)))), 0 === _.avail_in && 0 === _.avail_out && (g = !0)
                } while ((_.avail_in > 0 || 0 === _.avail_out) && a !== h.Z_STREAM_END);
                return a === h.Z_STREAM_END && (i = h.Z_FINISH), i === h.Z_FINISH ? (a = s.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === h.Z_OK) : i !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), _.avail_out = 0, !0)
            }, i.prototype.onData = function (t) {
                this.chunks.push(t)
            }, i.prototype.onEnd = function (t) {
                t === h.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg
            }, a.Inflate = i, a.inflate = n, a.inflateRaw = r, a.ungzip = n
        }, {
            "./utils/common": 3,
            "./utils/strings": 4,
            "./zlib/constants": 6,
            "./zlib/gzheader": 9,
            "./zlib/inflate": 11,
            "./zlib/messages": 13,
            "./zlib/zstream": 15
        }],
        3: [function (t, e, a) {
            "use strict";
            var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            a.assign = function (t) {
                for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {
                    var a = e.shift();
                    if (a) {
                        if ("object" != typeof a)throw new TypeError(a + "must be non-object");
                        for (var i in a)a.hasOwnProperty(i) && (t[i] = a[i])
                    }
                }
                return t
            }, a.shrinkBuf = function (t, e) {
                return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t)
            };
            var n = {
                arraySet: function (t, e, a, i, n) {
                    if (e.subarray && t.subarray)return void t.set(e.subarray(a, a + i), n);
                    for (var r = 0; i > r; r++)t[n + r] = e[a + r]
                }, flattenChunks: function (t) {
                    var e, a, i, n, r, s;
                    for (i = 0, e = 0, a = t.length; a > e; e++)i += t[e].length;
                    for (s = new Uint8Array(i), n = 0, e = 0, a = t.length; a > e; e++)r = t[e], s.set(r, n), n += r.length;
                    return s
                }
            }, r = {
                arraySet: function (t, e, a, i, n) {
                    for (var r = 0; i > r; r++)t[n + r] = e[a + r]
                }, flattenChunks: function (t) {
                    return [].concat.apply([], t)
                }
            };
            a.setTyped = function (t) {
                t ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, n)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, r))
            }, a.setTyped(i)
        }, {}],
        4: [function (t, e, a) {
            "use strict";
            function i(t, e) {
                if (65537 > e && (t.subarray && s || !t.subarray && r))return String.fromCharCode.apply(null, n.shrinkBuf(t, e));
                for (var a = "", i = 0; e > i; i++)a += String.fromCharCode(t[i]);
                return a
            }

            var n = t("./common"), r = !0, s = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (o) {
                r = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (o) {
                s = !1
            }
            for (var l = new n.Buf8(256), h = 0; 256 > h; h++)l[h] = h >= 252 ? 6 : h >= 248 ? 5 : h >= 240 ? 4 : h >= 224 ? 3 : h >= 192 ? 2 : 1;
            l[254] = l[254] = 1, a.string2buf = function (t) {
                var e, a, i, r, s, o = t.length, l = 0;
                for (r = 0; o > r; r++)a = t.charCodeAt(r), 55296 === (64512 & a) && o > r + 1 && (i = t.charCodeAt(r + 1), 56320 === (64512 & i) && (a = 65536 + (a - 55296 << 10) + (i - 56320), r++)), l += 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
                for (e = new n.Buf8(l), s = 0, r = 0; l > s; r++)a = t.charCodeAt(r), 55296 === (64512 & a) && o > r + 1 && (i = t.charCodeAt(r + 1), 56320 === (64512 & i) && (a = 65536 + (a - 55296 << 10) + (i - 56320), r++)), 128 > a ? e[s++] = a : 2048 > a ? (e[s++] = 192 | a >>> 6, e[s++] = 128 | 63 & a) : 65536 > a ? (e[s++] = 224 | a >>> 12, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a) : (e[s++] = 240 | a >>> 18, e[s++] = 128 | a >>> 12 & 63, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a);
                return e
            }, a.buf2binstring = function (t) {
                return i(t, t.length)
            }, a.binstring2buf = function (t) {
                for (var e = new n.Buf8(t.length), a = 0, i = e.length; i > a; a++)e[a] = t.charCodeAt(a);
                return e
            }, a.buf2string = function (t, e) {
                var a, n, r, s, o = e || t.length, h = new Array(2 * o);
                for (n = 0, a = 0; o > a;)if (r = t[a++], 128 > r) h[n++] = r; else if (s = l[r], s > 4) h[n++] = 65533, a += s - 1; else {
                    for (r &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && o > a;)r = r << 6 | 63 & t[a++], s--;
                    s > 1 ? h[n++] = 65533 : 65536 > r ? h[n++] = r : (r -= 65536, h[n++] = 55296 | r >> 10 & 1023, h[n++] = 56320 | 1023 & r)
                }
                return i(h, n)
            }, a.utf8border = function (t, e) {
                var a;
                for (e = e || t.length, e > t.length && (e = t.length), a = e - 1; a >= 0 && 128 === (192 & t[a]);)a--;
                return 0 > a ? e : 0 === a ? e : a + l[t[a]] > e ? a : e
            }
        }, {"./common": 3}],
        5: [function (t, e, a) {
            "use strict";
            function i(t, e, a, i) {
                for (var n = 65535 & t | 0, r = t >>> 16 & 65535 | 0, s = 0; 0 !== a;) {
                    s = a > 2e3 ? 2e3 : a, a -= s;
                    do n = n + e[i++] | 0, r = r + n | 0; while (--s);
                    n %= 65521, r %= 65521
                }
                return n | r << 16 | 0
            }

            e.exports = i
        }, {}],
        6: [function (t, e, a) {
            "use strict";
            e.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }, {}],
        7: [function (t, e, a) {
            "use strict";
            function i() {
                for (var t, e = [], a = 0; 256 > a; a++) {
                    t = a;
                    for (var i = 0; 8 > i; i++)t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                    e[a] = t
                }
                return e
            }

            function n(t, e, a, i) {
                var n = r, s = i + a;
                t ^= -1;
                for (var o = i; s > o; o++)t = t >>> 8 ^ n[255 & (t ^ e[o])];
                return -1 ^ t
            }

            var r = i();
            e.exports = n
        }, {}],
        8: [function (t, e, a) {
            "use strict";
            function i(t, e) {
                return t.msg = D[e], e
            }

            function n(t) {
                return (t << 1) - (t > 4 ? 9 : 0)
            }

            function r(t) {
                for (var e = t.length; --e >= 0;)t[e] = 0
            }

            function s(t) {
                var e = t.state, a = e.pending;
                a > t.avail_out && (a = t.avail_out), 0 !== a && (R.arraySet(t.output, e.pending_buf, e.pending_out, a, t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0))
            }

            function o(t, e) {
                C._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, s(t.strm)
            }

            function l(t, e) {
                t.pending_buf[t.pending++] = e
            }

            function h(t, e) {
                t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e
            }

            function d(t, e, a, i) {
                var n = t.avail_in;
                return n > i && (n = i), 0 === n ? 0 : (t.avail_in -= n, R.arraySet(e, t.input, t.next_in, n, a), 1 === t.state.wrap ? t.adler = N(t.adler, e, n, a) : 2 === t.state.wrap && (t.adler = O(t.adler, e, n, a)), t.next_in += n, t.total_in += n, n)
            }

            function f(t, e) {
                var a, i, n = t.max_chain_length, r = t.strstart, s = t.prev_length, o = t.nice_match, l = t.strstart > t.w_size - ft ? t.strstart - (t.w_size - ft) : 0, h = t.window, d = t.w_mask, f = t.prev, _ = t.strstart + dt, u = h[r + s - 1], c = h[r + s];
                t.prev_length >= t.good_match && (n >>= 2), o > t.lookahead && (o = t.lookahead);
                do if (a = e, h[a + s] === c && h[a + s - 1] === u && h[a] === h[r] && h[++a] === h[r + 1]) {
                    r += 2, a++;
                    do; while (h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && h[++r] === h[++a] && _ > r);
                    if (i = dt - (_ - r), r = _ - dt, i > s) {
                        if (t.match_start = e, s = i, i >= o)break;
                        u = h[r + s - 1], c = h[r + s]
                    }
                } while ((e = f[e & d]) > l && 0 !== --n);
                return s <= t.lookahead ? s : t.lookahead
            }

            function _(t) {
                var e, a, i, n, r, s = t.w_size;
                do {
                    if (n = t.window_size - t.lookahead - t.strstart, t.strstart >= s + (s - ft)) {
                        R.arraySet(t.window, t.window, s, s, 0), t.match_start -= s, t.strstart -= s, t.block_start -= s, a = t.hash_size, e = a;
                        do i = t.head[--e], t.head[e] = i >= s ? i - s : 0; while (--a);
                        a = s, e = a;
                        do i = t.prev[--e], t.prev[e] = i >= s ? i - s : 0; while (--a);
                        n += s
                    }
                    if (0 === t.strm.avail_in)break;
                    if (a = d(t.strm, t.window, t.strstart + t.lookahead, n), t.lookahead += a, t.lookahead + t.insert >= ht)for (r = t.strstart - t.insert, t.ins_h = t.window[r], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[r + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[r + ht - 1]) & t.hash_mask, t.prev[r & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = r, r++, t.insert--, !(t.lookahead + t.insert < ht)););
                } while (t.lookahead < ft && 0 !== t.strm.avail_in)
            }

            function u(t, e) {
                var a = 65535;
                for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5); ;) {
                    if (t.lookahead <= 1) {
                        if (_(t), 0 === t.lookahead && e === I)return vt;
                        if (0 === t.lookahead)break
                    }
                    t.strstart += t.lookahead, t.lookahead = 0;
                    var i = t.block_start + a;
                    if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i, t.strstart = i, o(t, !1), 0 === t.strm.avail_out))return vt;
                    if (t.strstart - t.block_start >= t.w_size - ft && (o(t, !1), 0 === t.strm.avail_out))return vt
                }
                return t.insert = 0, e === F ? (o(t, !0), 0 === t.strm.avail_out ? yt : xt) : t.strstart > t.block_start && (o(t, !1), 0 === t.strm.avail_out) ? vt : vt
            }

            function c(t, e) {
                for (var a, i; ;) {
                    if (t.lookahead < ft) {
                        if (_(t), t.lookahead < ft && e === I)return vt;
                        if (0 === t.lookahead)break
                    }
                    if (a = 0, t.lookahead >= ht && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== a && t.strstart - a <= t.w_size - ft && (t.match_length = f(t, a)), t.match_length >= ht)if (i = C._tr_tally(t, t.strstart - t.match_start, t.match_length - ht), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= ht) {
                        t.match_length--;
                        do t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart; while (0 !== --t.match_length);
                        t.strstart++
                    } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask; else i = C._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
                    if (i && (o(t, !1), 0 === t.strm.avail_out))return vt
                }
                return t.insert = t.strstart < ht - 1 ? t.strstart : ht - 1, e === F ? (o(t, !0), 0 === t.strm.avail_out ? yt : xt) : t.last_lit && (o(t, !1), 0 === t.strm.avail_out) ? vt : kt
            }

            function b(t, e) {
                for (var a, i, n; ;) {
                    if (t.lookahead < ft) {
                        if (_(t), t.lookahead < ft && e === I)return vt;
                        if (0 === t.lookahead)break
                    }
                    if (a = 0, t.lookahead >= ht && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = ht - 1, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - ft && (t.match_length = f(t, a), t.match_length <= 5 && (t.strategy === q || t.match_length === ht && t.strstart - t.match_start > 4096) && (t.match_length = ht - 1)), t.prev_length >= ht && t.match_length <= t.prev_length) {
                        n = t.strstart + t.lookahead - ht, i = C._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - ht), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
                        do++t.strstart <= n && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart); while (0 !== --t.prev_length);
                        if (t.match_available = 0, t.match_length = ht - 1, t.strstart++, i && (o(t, !1), 0 === t.strm.avail_out))return vt
                    } else if (t.match_available) {
                        if (i = C._tr_tally(t, 0, t.window[t.strstart - 1]), i && o(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out)return vt
                    } else t.match_available = 1, t.strstart++, t.lookahead--
                }
                return t.match_available && (i = C._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < ht - 1 ? t.strstart : ht - 1, e === F ? (o(t, !0), 0 === t.strm.avail_out ? yt : xt) : t.last_lit && (o(t, !1), 0 === t.strm.avail_out) ? vt : kt
            }

            function g(t, e) {
                for (var a, i, n, r, s = t.window; ;) {
                    if (t.lookahead <= dt) {
                        if (_(t), t.lookahead <= dt && e === I)return vt;
                        if (0 === t.lookahead)break
                    }
                    if (t.match_length = 0, t.lookahead >= ht && t.strstart > 0 && (n = t.strstart - 1, i = s[n], i === s[++n] && i === s[++n] && i === s[++n])) {
                        r = t.strstart + dt;
                        do; while (i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && r > n);
                        t.match_length = dt - (r - n), t.match_length > t.lookahead && (t.match_length = t.lookahead)
                    }
                    if (t.match_length >= ht ? (a = C._tr_tally(t, 1, t.match_length - ht), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = C._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (o(t, !1), 0 === t.strm.avail_out))return vt
                }
                return t.insert = 0, e === F ? (o(t, !0), 0 === t.strm.avail_out ? yt : xt) : t.last_lit && (o(t, !1), 0 === t.strm.avail_out) ? vt : kt
            }

            function m(t, e) {
                for (var a; ;) {
                    if (0 === t.lookahead && (_(t), 0 === t.lookahead)) {
                        if (e === I)return vt;
                        break
                    }
                    if (t.match_length = 0, a = C._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (o(t, !1), 0 === t.strm.avail_out))return vt
                }
                return t.insert = 0, e === F ? (o(t, !0), 0 === t.strm.avail_out ? yt : xt) : t.last_lit && (o(t, !1), 0 === t.strm.avail_out) ? vt : kt
            }

            function w(t, e, a, i, n) {
                this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = i, this.func = n
            }

            function p(t) {
                t.window_size = 2 * t.w_size, r(t.head), t.max_lazy_match = Z[t.level].max_lazy, t.good_match = Z[t.level].good_length, t.nice_match = Z[t.level].nice_length, t.max_chain_length = Z[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = ht - 1, t.match_available = 0, t.ins_h = 0
            }

            function v() {
                this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = V, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new R.Buf16(2 * ot), this.dyn_dtree = new R.Buf16(2 * (2 * rt + 1)), this.bl_tree = new R.Buf16(2 * (2 * st + 1)), r(this.dyn_ltree), r(this.dyn_dtree), r(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new R.Buf16(lt + 1), this.heap = new R.Buf16(2 * nt + 1), r(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new R.Buf16(2 * nt + 1), r(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0
            }

            function k(t) {
                var e;
                return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = Q, e = t.state, e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? ut : wt, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = I, C._tr_init(e), H) : i(t, K)
            }

            function y(t) {
                var e = k(t);
                return e === H && p(t.state), e
            }

            function x(t, e) {
                return t && t.state ? 2 !== t.state.wrap ? K : (t.state.gzhead = e, H) : K
            }

            function z(t, e, a, n, r, s) {
                if (!t)return K;
                var o = 1;
                if (e === Y && (e = 6), 0 > n ? (o = 0, n = -n) : n > 15 && (o = 2, n -= 16), 1 > r || r > $ || a !== V || 8 > n || n > 15 || 0 > e || e > 9 || 0 > s || s > W)return i(t, K);
                8 === n && (n = 9);
                var l = new v;
                return t.state = l, l.strm = t, l.wrap = o, l.gzhead = null, l.w_bits = n, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.hash_bits = r + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + ht - 1) / ht), l.window = new R.Buf8(2 * l.w_size), l.head = new R.Buf16(l.hash_size), l.prev = new R.Buf16(l.w_size), l.lit_bufsize = 1 << r + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new R.Buf8(l.pending_buf_size), l.d_buf = l.lit_bufsize >> 1, l.l_buf = 3 * l.lit_bufsize, l.level = e, l.strategy = s, l.method = a, y(t)
            }

            function B(t, e) {
                return z(t, e, V, tt, et, J)
            }

            function S(t, e) {
                var a, o, d, f;
                if (!t || !t.state || e > L || 0 > e)return t ? i(t, K) : K;
                if (o = t.state, !t.output || !t.input && 0 !== t.avail_in || o.status === pt && e !== F)return i(t, 0 === t.avail_out ? P : K);
                if (o.strm = t, a = o.last_flush, o.last_flush = e, o.status === ut)if (2 === o.wrap) t.adler = 0, l(o, 31), l(o, 139), l(o, 8), o.gzhead ? (l(o, (o.gzhead.text ? 1 : 0) + (o.gzhead.hcrc ? 2 : 0) + (o.gzhead.extra ? 4 : 0) + (o.gzhead.name ? 8 : 0) + (o.gzhead.comment ? 16 : 0)), l(o, 255 & o.gzhead.time), l(o, o.gzhead.time >> 8 & 255), l(o, o.gzhead.time >> 16 & 255), l(o, o.gzhead.time >> 24 & 255), l(o, 9 === o.level ? 2 : o.strategy >= G || o.level < 2 ? 4 : 0), l(o, 255 & o.gzhead.os), o.gzhead.extra && o.gzhead.extra.length && (l(o, 255 & o.gzhead.extra.length), l(o, o.gzhead.extra.length >> 8 & 255)), o.gzhead.hcrc && (t.adler = O(t.adler, o.pending_buf, o.pending, 0)), o.gzindex = 0, o.status = ct) : (l(o, 0), l(o, 0), l(o, 0), l(o, 0), l(o, 0), l(o, 9 === o.level ? 2 : o.strategy >= G || o.level < 2 ? 4 : 0), l(o, zt), o.status = wt); else {
                    var _ = V + (o.w_bits - 8 << 4) << 8, u = -1;
                    u = o.strategy >= G || o.level < 2 ? 0 : o.level < 6 ? 1 : 6 === o.level ? 2 : 3, _ |= u << 6, 0 !== o.strstart && (_ |= _t), _ += 31 - _ % 31, o.status = wt, h(o, _), 0 !== o.strstart && (h(o, t.adler >>> 16), h(o, 65535 & t.adler)), t.adler = 1
                }
                if (o.status === ct)if (o.gzhead.extra) {
                    for (d = o.pending; o.gzindex < (65535 & o.gzhead.extra.length) && (o.pending !== o.pending_buf_size || (o.gzhead.hcrc && o.pending > d && (t.adler = O(t.adler, o.pending_buf, o.pending - d, d)), s(t), d = o.pending, o.pending !== o.pending_buf_size));)l(o, 255 & o.gzhead.extra[o.gzindex]), o.gzindex++;
                    o.gzhead.hcrc && o.pending > d && (t.adler = O(t.adler, o.pending_buf, o.pending - d, d)), o.gzindex === o.gzhead.extra.length && (o.gzindex = 0, o.status = bt)
                } else o.status = bt;
                if (o.status === bt)if (o.gzhead.name) {
                    d = o.pending;
                    do {
                        if (o.pending === o.pending_buf_size && (o.gzhead.hcrc && o.pending > d && (t.adler = O(t.adler, o.pending_buf, o.pending - d, d)), s(t), d = o.pending, o.pending === o.pending_buf_size)) {
                            f = 1;
                            break
                        }
                        f = o.gzindex < o.gzhead.name.length ? 255 & o.gzhead.name.charCodeAt(o.gzindex++) : 0, l(o, f)
                    } while (0 !== f);
                    o.gzhead.hcrc && o.pending > d && (t.adler = O(t.adler, o.pending_buf, o.pending - d, d)), 0 === f && (o.gzindex = 0, o.status = gt)
                } else o.status = gt;
                if (o.status === gt)if (o.gzhead.comment) {
                    d = o.pending;
                    do {
                        if (o.pending === o.pending_buf_size && (o.gzhead.hcrc && o.pending > d && (t.adler = O(t.adler, o.pending_buf, o.pending - d, d)), s(t), d = o.pending, o.pending === o.pending_buf_size)) {
                            f = 1;
                            break
                        }
                        f = o.gzindex < o.gzhead.comment.length ? 255 & o.gzhead.comment.charCodeAt(o.gzindex++) : 0, l(o, f)
                    } while (0 !== f);
                    o.gzhead.hcrc && o.pending > d && (t.adler = O(t.adler, o.pending_buf, o.pending - d, d)), 0 === f && (o.status = mt)
                } else o.status = mt;
                if (o.status === mt && (o.gzhead.hcrc ? (o.pending + 2 > o.pending_buf_size && s(t), o.pending + 2 <= o.pending_buf_size && (l(o, 255 & t.adler), l(o, t.adler >> 8 & 255), t.adler = 0, o.status = wt)) : o.status = wt), 0 !== o.pending) {
                    if (s(t), 0 === t.avail_out)return o.last_flush = -1, H
                } else if (0 === t.avail_in && n(e) <= n(a) && e !== F)return i(t, P);
                if (o.status === pt && 0 !== t.avail_in)return i(t, P);
                if (0 !== t.avail_in || 0 !== o.lookahead || e !== I && o.status !== pt) {
                    var c = o.strategy === G ? m(o, e) : o.strategy === X ? g(o, e) : Z[o.level].func(o, e);
                    if (c !== yt && c !== xt || (o.status = pt), c === vt || c === yt)return 0 === t.avail_out && (o.last_flush = -1), H;
                    if (c === kt && (e === U ? C._tr_align(o) : e !== L && (C._tr_stored_block(o, 0, 0, !1), e === T && (r(o.head), 0 === o.lookahead && (o.strstart = 0, o.block_start = 0, o.insert = 0))), s(t), 0 === t.avail_out))return o.last_flush = -1, H
                }
                return e !== F ? H : o.wrap <= 0 ? j : (2 === o.wrap ? (l(o, 255 & t.adler), l(o, t.adler >> 8 & 255), l(o, t.adler >> 16 & 255), l(o, t.adler >> 24 & 255), l(o, 255 & t.total_in), l(o, t.total_in >> 8 & 255), l(o, t.total_in >> 16 & 255), l(o, t.total_in >> 24 & 255)) : (h(o, t.adler >>> 16), h(o, 65535 & t.adler)), s(t), o.wrap > 0 && (o.wrap = -o.wrap), 0 !== o.pending ? H : j)
            }

            function E(t) {
                var e;
                return t && t.state ? (e = t.state.status, e !== ut && e !== ct && e !== bt && e !== gt && e !== mt && e !== wt && e !== pt ? i(t, K) : (t.state = null, e === wt ? i(t, M) : H)) : K
            }

            function A(t, e) {
                var a, i, n, s, o, l, h, d, f = e.length;
                if (!t || !t.state)return K;
                if (a = t.state, s = a.wrap, 2 === s || 1 === s && a.status !== ut || a.lookahead)return K;
                for (1 === s && (t.adler = N(t.adler, e, f, 0)), a.wrap = 0, f >= a.w_size && (0 === s && (r(a.head), a.strstart = 0, a.block_start = 0, a.insert = 0), d = new R.Buf8(a.w_size), R.arraySet(d, e, f - a.w_size, a.w_size, 0), e = d, f = a.w_size), o = t.avail_in, l = t.next_in, h = t.input, t.avail_in = f, t.next_in = 0, t.input = e, _(a); a.lookahead >= ht;) {
                    i = a.strstart, n = a.lookahead - (ht - 1);
                    do a.ins_h = (a.ins_h << a.hash_shift ^ a.window[i + ht - 1]) & a.hash_mask, a.prev[i & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = i, i++; while (--n);
                    a.strstart = i, a.lookahead = ht - 1, _(a)
                }
                return a.strstart += a.lookahead, a.block_start = a.strstart, a.insert = a.lookahead, a.lookahead = 0, a.match_length = a.prev_length = ht - 1, a.match_available = 0, t.next_in = l, t.input = h, t.avail_in = o, a.wrap = s, H
            }

            var Z, R = t("../utils/common"), C = t("./trees"), N = t("./adler32"), O = t("./crc32"), D = t("./messages"), I = 0, U = 1, T = 3, F = 4, L = 5, H = 0, j = 1, K = -2, M = -3, P = -5, Y = -1, q = 1, G = 2, X = 3, W = 4, J = 0, Q = 2, V = 8, $ = 9, tt = 15, et = 8, at = 29, it = 256, nt = it + 1 + at, rt = 30, st = 19, ot = 2 * nt + 1, lt = 15, ht = 3, dt = 258, ft = dt + ht + 1, _t = 32, ut = 42, ct = 69, bt = 73, gt = 91, mt = 103, wt = 113, pt = 666, vt = 1, kt = 2, yt = 3, xt = 4, zt = 3;
            Z = [new w(0, 0, 0, 0, u), new w(4, 4, 8, 4, c), new w(4, 5, 16, 8, c), new w(4, 6, 32, 32, c), new w(4, 4, 16, 16, b), new w(8, 16, 32, 32, b), new w(8, 16, 128, 128, b), new w(8, 32, 128, 256, b), new w(32, 128, 258, 1024, b), new w(32, 258, 258, 4096, b)], a.deflateInit = B, a.deflateInit2 = z, a.deflateReset = y, a.deflateResetKeep = k, a.deflateSetHeader = x, a.deflate = S, a.deflateEnd = E, a.deflateSetDictionary = A, a.deflateInfo = "pako deflate (from Nodeca project)"
        }, {"../utils/common": 3, "./adler32": 5, "./crc32": 7, "./messages": 13, "./trees": 14}],
        9: [function (t, e, a) {
            "use strict";
            function i() {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1
            }

            e.exports = i
        }, {}],
        10: [function (t, e, a) {
            "use strict";
            var i = 30, n = 12;
            e.exports = function (t, e) {
                var a, r, s, o, l, h, d, f, _, u, c, b, g, m, w, p, v, k, y, x, z, B, S, E, A;
                a = t.state, r = t.next_in, E = t.input, s = r + (t.avail_in - 5), o = t.next_out, A = t.output, l = o - (e - t.avail_out), h = o + (t.avail_out - 257), d = a.dmax, f = a.wsize, _ = a.whave, u = a.wnext, c = a.window, b = a.hold, g = a.bits, m = a.lencode, w = a.distcode, p = (1 << a.lenbits) - 1, v = (1 << a.distbits) - 1;
                t:do {
                    15 > g && (b += E[r++] << g, g += 8, b += E[r++] << g, g += 8), k = m[b & p];
                    e:for (; ;) {
                        if (y = k >>> 24, b >>>= y, g -= y, y = k >>> 16 & 255, 0 === y) A[o++] = 65535 & k; else {
                            if (!(16 & y)) {
                                if (0 === (64 & y)) {
                                    k = m[(65535 & k) + (b & (1 << y) - 1)];
                                    continue e
                                }
                                if (32 & y) {
                                    a.mode = n;
                                    break t
                                }
                                t.msg = "invalid literal/length code", a.mode = i;
                                break t
                            }
                            x = 65535 & k, y &= 15, y && (y > g && (b += E[r++] << g, g += 8), x += b & (1 << y) - 1, b >>>= y, g -= y), 15 > g && (b += E[r++] << g, g += 8, b += E[r++] << g, g += 8), k = w[b & v];
                            a:for (; ;) {
                                if (y = k >>> 24, b >>>= y, g -= y, y = k >>> 16 & 255, !(16 & y)) {
                                    if (0 === (64 & y)) {
                                        k = w[(65535 & k) + (b & (1 << y) - 1)];
                                        continue a
                                    }
                                    t.msg = "invalid distance code", a.mode = i;
                                    break t
                                }
                                if (z = 65535 & k, y &= 15, y > g && (b += E[r++] << g, g += 8, y > g && (b += E[r++] << g, g += 8)), z += b & (1 << y) - 1, z > d) {
                                    t.msg = "invalid distance too far back", a.mode = i;
                                    break t
                                }
                                if (b >>>= y, g -= y, y = o - l, z > y) {
                                    if (y = z - y, y > _ && a.sane) {
                                        t.msg = "invalid distance too far back", a.mode = i;
                                        break t
                                    }
                                    if (B = 0, S = c, 0 === u) {
                                        if (B += f - y, x > y) {
                                            x -= y;
                                            do A[o++] = c[B++]; while (--y);
                                            B = o - z, S = A
                                        }
                                    } else if (y > u) {
                                        if (B += f + u - y, y -= u, x > y) {
                                            x -= y;
                                            do A[o++] = c[B++]; while (--y);
                                            if (B = 0, x > u) {
                                                y = u, x -= y;
                                                do A[o++] = c[B++]; while (--y);
                                                B = o - z, S = A
                                            }
                                        }
                                    } else if (B += u - y, x > y) {
                                        x -= y;
                                        do A[o++] = c[B++]; while (--y);
                                        B = o - z, S = A
                                    }
                                    for (; x > 2;)A[o++] = S[B++], A[o++] = S[B++], A[o++] = S[B++], x -= 3;
                                    x && (A[o++] = S[B++], x > 1 && (A[o++] = S[B++]))
                                } else {
                                    B = o - z;
                                    do A[o++] = A[B++], A[o++] = A[B++], A[o++] = A[B++], x -= 3; while (x > 2);
                                    x && (A[o++] = A[B++], x > 1 && (A[o++] = A[B++]))
                                }
                                break
                            }
                        }
                        break
                    }
                } while (s > r && h > o);
                x = g >> 3, r -= x, g -= x << 3, b &= (1 << g) - 1, t.next_in = r, t.next_out = o, t.avail_in = s > r ? 5 + (s - r) : 5 - (r - s), t.avail_out = h > o ? 257 + (h - o) : 257 - (o - h), a.hold = b, a.bits = g
            }
        }, {}],
        11: [function (t, e, a) {
            "use strict";
            function i(t) {
                return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24)
            }

            function n() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new w.Buf16(320), this.work = new w.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0
            }

            function r(t) {
                var e;
                return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = T, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new w.Buf32(bt), e.distcode = e.distdyn = new w.Buf32(gt), e.sane = 1, e.back = -1, Z) : N
            }

            function s(t) {
                var e;
                return t && t.state ? (e = t.state, e.wsize = 0, e.whave = 0, e.wnext = 0, r(t)) : N
            }

            function o(t, e) {
                var a, i;
                return t && t.state ? (i = t.state, 0 > e ? (a = 0, e = -e) : (a = (e >> 4) + 1, 48 > e && (e &= 15)), e && (8 > e || e > 15) ? N : (null !== i.window && i.wbits !== e && (i.window = null), i.wrap = a, i.wbits = e, s(t))) : N
            }

            function l(t, e) {
                var a, i;
                return t ? (i = new n, t.state = i, i.window = null, a = o(t, e), a !== Z && (t.state = null), a) : N
            }

            function h(t) {
                return l(t, wt)
            }

            function d(t) {
                if (pt) {
                    var e;
                    for (g = new w.Buf32(512), m = new w.Buf32(32), e = 0; 144 > e;)t.lens[e++] = 8;
                    for (; 256 > e;)t.lens[e++] = 9;
                    for (; 280 > e;)t.lens[e++] = 7;
                    for (; 288 > e;)t.lens[e++] = 8;
                    for (y(z, t.lens, 0, 288, g, 0, t.work, {bits: 9}), e = 0; 32 > e;)t.lens[e++] = 5;
                    y(B, t.lens, 0, 32, m, 0, t.work, {bits: 5}), pt = !1
                }
                t.lencode = g, t.lenbits = 9, t.distcode = m, t.distbits = 5
            }

            function f(t, e, a, i) {
                var n, r = t.state;
                return null === r.window && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new w.Buf8(r.wsize)), i >= r.wsize ? (w.arraySet(r.window, e, a - r.wsize, r.wsize, 0), r.wnext = 0, r.whave = r.wsize) : (n = r.wsize - r.wnext, n > i && (n = i), w.arraySet(r.window, e, a - i, n, r.wnext), i -= n, i ? (w.arraySet(r.window, e, a - i, i, 0), r.wnext = i, r.whave = r.wsize) : (r.wnext += n, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += n))), 0
            }

            function _(t, e) {
                var a, n, r, s, o, l, h, _, u, c, b, g, m, bt, gt, mt, wt, pt, vt, kt, yt, xt, zt, Bt, St = 0, Et = new w.Buf8(4), At = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in)return N;
                a = t.state, a.mode === X && (a.mode = W), o = t.next_out, r = t.output, h = t.avail_out, s = t.next_in, n = t.input, l = t.avail_in, _ = a.hold, u = a.bits, c = l, b = h, xt = Z;
                t:for (; ;)switch (a.mode) {
                    case T:
                        if (0 === a.wrap) {
                            a.mode = W;
                            break
                        }
                        for (; 16 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        if (2 & a.wrap && 35615 === _) {
                            a.check = 0, Et[0] = 255 & _, Et[1] = _ >>> 8 & 255, a.check = v(a.check, Et, 2, 0), _ = 0, u = 0, a.mode = F;
                            break
                        }
                        if (a.flags = 0, a.head && (a.head.done = !1), !(1 & a.wrap) || (((255 & _) << 8) + (_ >> 8)) % 31) {
                            t.msg = "incorrect header check", a.mode = _t;
                            break
                        }
                        if ((15 & _) !== U) {
                            t.msg = "unknown compression method", a.mode = _t;
                            break
                        }
                        if (_ >>>= 4, u -= 4, yt = (15 & _) + 8, 0 === a.wbits) a.wbits = yt; else if (yt > a.wbits) {
                            t.msg = "invalid window size", a.mode = _t;
                            break
                        }
                        a.dmax = 1 << yt, t.adler = a.check = 1, a.mode = 512 & _ ? q : X, _ = 0, u = 0;
                        break;
                    case F:
                        for (; 16 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        if (a.flags = _, (255 & a.flags) !== U) {
                            t.msg = "unknown compression method", a.mode = _t;
                            break
                        }
                        if (57344 & a.flags) {
                            t.msg = "unknown header flags set", a.mode = _t;
                            break
                        }
                        a.head && (a.head.text = _ >> 8 & 1), 512 & a.flags && (Et[0] = 255 & _, Et[1] = _ >>> 8 & 255, a.check = v(a.check, Et, 2, 0)), _ = 0, u = 0, a.mode = L;
                    case L:
                        for (; 32 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        a.head && (a.head.time = _), 512 & a.flags && (Et[0] = 255 & _, Et[1] = _ >>> 8 & 255, Et[2] = _ >>> 16 & 255, Et[3] = _ >>> 24 & 255, a.check = v(a.check, Et, 4, 0)), _ = 0, u = 0, a.mode = H;
                    case H:
                        for (; 16 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        a.head && (a.head.xflags = 255 & _, a.head.os = _ >> 8), 512 & a.flags && (Et[0] = 255 & _, Et[1] = _ >>> 8 & 255, a.check = v(a.check, Et, 2, 0)), _ = 0, u = 0, a.mode = j;
                    case j:
                        if (1024 & a.flags) {
                            for (; 16 > u;) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            a.length = _, a.head && (a.head.extra_len = _), 512 & a.flags && (Et[0] = 255 & _, Et[1] = _ >>> 8 & 255, a.check = v(a.check, Et, 2, 0)), _ = 0, u = 0
                        } else a.head && (a.head.extra = null);
                        a.mode = K;
                    case K:
                        if (1024 & a.flags && (g = a.length, g > l && (g = l), g && (a.head && (yt = a.head.extra_len - a.length, a.head.extra || (a.head.extra = new Array(a.head.extra_len)), w.arraySet(a.head.extra, n, s, g, yt)), 512 & a.flags && (a.check = v(a.check, n, g, s)), l -= g, s += g, a.length -= g), a.length))break t;
                        a.length = 0, a.mode = M;
                    case M:
                        if (2048 & a.flags) {
                            if (0 === l)break t;
                            g = 0;
                            do yt = n[s + g++], a.head && yt && a.length < 65536 && (a.head.name += String.fromCharCode(yt)); while (yt && l > g);
                            if (512 & a.flags && (a.check = v(a.check, n, g, s)), l -= g, s += g, yt)break t
                        } else a.head && (a.head.name = null);
                        a.length = 0, a.mode = P;
                    case P:
                        if (4096 & a.flags) {
                            if (0 === l)break t;
                            g = 0;
                            do yt = n[s + g++], a.head && yt && a.length < 65536 && (a.head.comment += String.fromCharCode(yt)); while (yt && l > g);
                            if (512 & a.flags && (a.check = v(a.check, n, g, s)), l -= g, s += g, yt)break t
                        } else a.head && (a.head.comment = null);
                        a.mode = Y;
                    case Y:
                        if (512 & a.flags) {
                            for (; 16 > u;) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            if (_ !== (65535 & a.check)) {
                                t.msg = "header crc mismatch", a.mode = _t;
                                break
                            }
                            _ = 0, u = 0
                        }
                        a.head && (a.head.hcrc = a.flags >> 9 & 1, a.head.done = !0), t.adler = a.check = 0, a.mode = X;
                        break;
                    case q:
                        for (; 32 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        t.adler = a.check = i(_), _ = 0, u = 0, a.mode = G;
                    case G:
                        if (0 === a.havedict)return t.next_out = o, t.avail_out = h, t.next_in = s, t.avail_in = l, a.hold = _, a.bits = u, C;
                        t.adler = a.check = 1, a.mode = X;
                    case X:
                        if (e === E || e === A)break t;
                    case W:
                        if (a.last) {
                            _ >>>= 7 & u, u -= 7 & u, a.mode = ht;
                            break
                        }
                        for (; 3 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        switch (a.last = 1 & _, _ >>>= 1, u -= 1, 3 & _) {
                            case 0:
                                a.mode = J;
                                break;
                            case 1:
                                if (d(a), a.mode = at, e === A) {
                                    _ >>>= 2, u -= 2;
                                    break t
                                }
                                break;
                            case 2:
                                a.mode = $;
                                break;
                            case 3:
                                t.msg = "invalid block type", a.mode = _t
                        }
                        _ >>>= 2, u -= 2;
                        break;
                    case J:
                        for (_ >>>= 7 & u, u -= 7 & u; 32 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        if ((65535 & _) !== (_ >>> 16 ^ 65535)) {
                            t.msg = "invalid stored block lengths", a.mode = _t;
                            break
                        }
                        if (a.length = 65535 & _, _ = 0, u = 0, a.mode = Q, e === A)break t;
                    case Q:
                        a.mode = V;
                    case V:
                        if (g = a.length) {
                            if (g > l && (g = l), g > h && (g = h), 0 === g)break t;
                            w.arraySet(r, n, s, g, o), l -= g, s += g, h -= g, o += g, a.length -= g;
                            break
                        }
                        a.mode = X;
                        break;
                    case $:
                        for (; 14 > u;) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        if (a.nlen = (31 & _) + 257, _ >>>= 5, u -= 5, a.ndist = (31 & _) + 1, _ >>>= 5, u -= 5, a.ncode = (15 & _) + 4, _ >>>= 4, u -= 4, a.nlen > 286 || a.ndist > 30) {
                            t.msg = "too many length or distance symbols", a.mode = _t;
                            break
                        }
                        a.have = 0, a.mode = tt;
                    case tt:
                        for (; a.have < a.ncode;) {
                            for (; 3 > u;) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            a.lens[At[a.have++]] = 7 & _, _ >>>= 3, u -= 3
                        }
                        for (; a.have < 19;)a.lens[At[a.have++]] = 0;
                        if (a.lencode = a.lendyn, a.lenbits = 7, zt = {bits: a.lenbits}, xt = y(x, a.lens, 0, 19, a.lencode, 0, a.work, zt), a.lenbits = zt.bits, xt) {
                            t.msg = "invalid code lengths set", a.mode = _t;
                            break
                        }
                        a.have = 0, a.mode = et;
                    case et:
                        for (; a.have < a.nlen + a.ndist;) {
                            for (; St = a.lencode[_ & (1 << a.lenbits) - 1], gt = St >>> 24, mt = St >>> 16 & 255, wt = 65535 & St, !(u >= gt);) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            if (16 > wt) _ >>>= gt, u -= gt, a.lens[a.have++] = wt; else {
                                if (16 === wt) {
                                    for (Bt = gt + 2; Bt > u;) {
                                        if (0 === l)break t;
                                        l--, _ += n[s++] << u, u += 8
                                    }
                                    if (_ >>>= gt, u -= gt, 0 === a.have) {
                                        t.msg = "invalid bit length repeat", a.mode = _t;
                                        break
                                    }
                                    yt = a.lens[a.have - 1], g = 3 + (3 & _), _ >>>= 2, u -= 2
                                } else if (17 === wt) {
                                    for (Bt = gt + 3; Bt > u;) {
                                        if (0 === l)break t;
                                        l--, _ += n[s++] << u, u += 8
                                    }
                                    _ >>>= gt, u -= gt, yt = 0, g = 3 + (7 & _), _ >>>= 3, u -= 3
                                } else {
                                    for (Bt = gt + 7; Bt > u;) {
                                        if (0 === l)break t;
                                        l--, _ += n[s++] << u, u += 8
                                    }
                                    _ >>>= gt, u -= gt, yt = 0, g = 11 + (127 & _), _ >>>= 7, u -= 7
                                }
                                if (a.have + g > a.nlen + a.ndist) {
                                    t.msg = "invalid bit length repeat", a.mode = _t;
                                    break
                                }
                                for (; g--;)a.lens[a.have++] = yt
                            }
                        }
                        if (a.mode === _t)break;
                        if (0 === a.lens[256]) {
                            t.msg = "invalid code -- missing end-of-block", a.mode = _t;
                            break
                        }
                        if (a.lenbits = 9, zt = {bits: a.lenbits}, xt = y(z, a.lens, 0, a.nlen, a.lencode, 0, a.work, zt), a.lenbits = zt.bits, xt) {
                            t.msg = "invalid literal/lengths set", a.mode = _t;
                            break
                        }
                        if (a.distbits = 6, a.distcode = a.distdyn, zt = {bits: a.distbits}, xt = y(B, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, zt), a.distbits = zt.bits, xt) {
                            t.msg = "invalid distances set", a.mode = _t;
                            break
                        }
                        if (a.mode = at, e === A)break t;
                    case at:
                        a.mode = it;
                    case it:
                        if (l >= 6 && h >= 258) {
                            t.next_out = o, t.avail_out = h, t.next_in = s, t.avail_in = l, a.hold = _, a.bits = u, k(t, b), o = t.next_out, r = t.output, h = t.avail_out, s = t.next_in, n = t.input, l = t.avail_in, _ = a.hold, u = a.bits, a.mode === X && (a.back = -1);
                            break
                        }
                        for (a.back = 0; St = a.lencode[_ & (1 << a.lenbits) - 1], gt = St >>> 24, mt = St >>> 16 & 255, wt = 65535 & St, !(u >= gt);) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        if (mt && 0 === (240 & mt)) {
                            for (pt = gt, vt = mt, kt = wt; St = a.lencode[kt + ((_ & (1 << pt + vt) - 1) >> pt)], gt = St >>> 24, mt = St >>> 16 & 255, wt = 65535 & St, !(u >= pt + gt);) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            _ >>>= pt, u -= pt, a.back += pt
                        }
                        if (_ >>>= gt, u -= gt, a.back += gt, a.length = wt, 0 === mt) {
                            a.mode = lt;
                            break
                        }
                        if (32 & mt) {
                            a.back = -1, a.mode = X;
                            break
                        }
                        if (64 & mt) {
                            t.msg = "invalid literal/length code", a.mode = _t;
                            break
                        }
                        a.extra = 15 & mt, a.mode = nt;
                    case nt:
                        if (a.extra) {
                            for (Bt = a.extra; Bt > u;) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            a.length += _ & (1 << a.extra) - 1, _ >>>= a.extra, u -= a.extra, a.back += a.extra
                        }
                        a.was = a.length, a.mode = rt;
                    case rt:
                        for (; St = a.distcode[_ & (1 << a.distbits) - 1], gt = St >>> 24, mt = St >>> 16 & 255, wt = 65535 & St, !(u >= gt);) {
                            if (0 === l)break t;
                            l--, _ += n[s++] << u, u += 8
                        }
                        if (0 === (240 & mt)) {
                            for (pt = gt, vt = mt, kt = wt; St = a.distcode[kt + ((_ & (1 << pt + vt) - 1) >> pt)], gt = St >>> 24, mt = St >>> 16 & 255, wt = 65535 & St, !(u >= pt + gt);) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            _ >>>= pt, u -= pt, a.back += pt
                        }
                        if (_ >>>= gt, u -= gt, a.back += gt, 64 & mt) {
                            t.msg = "invalid distance code", a.mode = _t;
                            break
                        }
                        a.offset = wt, a.extra = 15 & mt, a.mode = st;
                    case st:
                        if (a.extra) {
                            for (Bt = a.extra; Bt > u;) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            a.offset += _ & (1 << a.extra) - 1, _ >>>= a.extra, u -= a.extra, a.back += a.extra
                        }
                        if (a.offset > a.dmax) {
                            t.msg = "invalid distance too far back", a.mode = _t;
                            break
                        }
                        a.mode = ot;
                    case ot:
                        if (0 === h)break t;
                        if (g = b - h, a.offset > g) {
                            if (g = a.offset - g, g > a.whave && a.sane) {
                                t.msg = "invalid distance too far back", a.mode = _t;
                                break
                            }
                            g > a.wnext ? (g -= a.wnext, m = a.wsize - g) : m = a.wnext - g, g > a.length && (g = a.length), bt = a.window
                        } else bt = r, m = o - a.offset, g = a.length;
                        g > h && (g = h), h -= g, a.length -= g;
                        do r[o++] = bt[m++]; while (--g);
                        0 === a.length && (a.mode = it);
                        break;
                    case lt:
                        if (0 === h)break t;
                        r[o++] = a.length, h--, a.mode = it;
                        break;
                    case ht:
                        if (a.wrap) {
                            for (; 32 > u;) {
                                if (0 === l)break t;
                                l--, _ |= n[s++] << u, u += 8
                            }
                            if (b -= h, t.total_out += b, a.total += b, b && (t.adler = a.check = a.flags ? v(a.check, r, b, o - b) : p(a.check, r, b, o - b)), b = h, (a.flags ? _ : i(_)) !== a.check) {
                                t.msg = "incorrect data check", a.mode = _t;
                                break
                            }
                            _ = 0, u = 0
                        }
                        a.mode = dt;
                    case dt:
                        if (a.wrap && a.flags) {
                            for (; 32 > u;) {
                                if (0 === l)break t;
                                l--, _ += n[s++] << u, u += 8
                            }
                            if (_ !== (4294967295 & a.total)) {
                                t.msg = "incorrect length check", a.mode = _t;
                                break
                            }
                            _ = 0, u = 0
                        }
                        a.mode = ft;
                    case ft:
                        xt = R;
                        break t;
                    case _t:
                        xt = O;
                        break t;
                    case ut:
                        return D;
                    case ct:
                    default:
                        return N
                }
                return t.next_out = o, t.avail_out = h, t.next_in = s, t.avail_in = l, a.hold = _, a.bits = u, (a.wsize || b !== t.avail_out && a.mode < _t && (a.mode < ht || e !== S)) && f(t, t.output, t.next_out, b - t.avail_out) ? (a.mode = ut, D) : (c -= t.avail_in, b -= t.avail_out, t.total_in += c, t.total_out += b, a.total += b, a.wrap && b && (t.adler = a.check = a.flags ? v(a.check, r, b, t.next_out - b) : p(a.check, r, b, t.next_out - b)), t.data_type = a.bits + (a.last ? 64 : 0) + (a.mode === X ? 128 : 0) + (a.mode === at || a.mode === Q ? 256 : 0), (0 === c && 0 === b || e === S) && xt === Z && (xt = I), xt)
            }

            function u(t) {
                if (!t || !t.state)return N;
                var e = t.state;
                return e.window && (e.window = null), t.state = null, Z
            }

            function c(t, e) {
                var a;
                return t && t.state ? (a = t.state, 0 === (2 & a.wrap) ? N : (a.head = e, e.done = !1, Z)) : N
            }

            function b(t, e) {
                var a, i, n, r = e.length;
                return t && t.state ? (a = t.state, 0 !== a.wrap && a.mode !== G ? N : a.mode === G && (i = 1, i = p(i, e, r, 0), i !== a.check) ? O : (n = f(t, e, r, r)) ? (a.mode = ut, D) : (a.havedict = 1, Z)) : N
            }

            var g, m, w = t("../utils/common"), p = t("./adler32"), v = t("./crc32"), k = t("./inffast"), y = t("./inftrees"), x = 0, z = 1, B = 2, S = 4, E = 5, A = 6, Z = 0, R = 1, C = 2, N = -2, O = -3, D = -4, I = -5, U = 8, T = 1, F = 2, L = 3, H = 4, j = 5, K = 6, M = 7, P = 8, Y = 9, q = 10, G = 11, X = 12, W = 13, J = 14, Q = 15, V = 16, $ = 17, tt = 18, et = 19, at = 20, it = 21, nt = 22, rt = 23, st = 24, ot = 25, lt = 26, ht = 27, dt = 28, ft = 29, _t = 30, ut = 31, ct = 32, bt = 852, gt = 592, mt = 15, wt = mt, pt = !0;
            a.inflateReset = s, a.inflateReset2 = o, a.inflateResetKeep = r, a.inflateInit = h, a.inflateInit2 = l, a.inflate = _, a.inflateEnd = u, a.inflateGetHeader = c, a.inflateSetDictionary = b, a.inflateInfo = "pako inflate (from Nodeca project)"
        }, {"../utils/common": 3, "./adler32": 5, "./crc32": 7, "./inffast": 10, "./inftrees": 12}],
        12: [function (t, e, a) {
            "use strict";
            var i = t("../utils/common"), n = 15, r = 852, s = 592, o = 0, l = 1, h = 2, d = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], f = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], _ = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], u = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            e.exports = function (t, e, a, c, b, g, m, w) {
                var p, v, k, y, x, z, B, S, E, A = w.bits, Z = 0, R = 0, C = 0, N = 0, O = 0, D = 0, I = 0, U = 0, T = 0, F = 0, L = null, H = 0, j = new i.Buf16(n + 1), K = new i.Buf16(n + 1), M = null, P = 0;
                for (Z = 0; n >= Z; Z++)j[Z] = 0;
                for (R = 0; c > R; R++)j[e[a + R]]++;
                for (O = A, N = n; N >= 1 && 0 === j[N]; N--);
                if (O > N && (O = N), 0 === N)return b[g++] = 20971520, b[g++] = 20971520, w.bits = 1, 0;
                for (C = 1; N > C && 0 === j[C]; C++);
                for (C > O && (O = C), U = 1, Z = 1; n >= Z; Z++)if (U <<= 1, U -= j[Z], 0 > U)return -1;
                if (U > 0 && (t === o || 1 !== N))return -1;
                for (K[1] = 0, Z = 1; n > Z; Z++)K[Z + 1] = K[Z] + j[Z];
                for (R = 0; c > R; R++)0 !== e[a + R] && (m[K[e[a + R]]++] = R);
                if (t === o ? (L = M = m, z = 19) : t === l ? (L = d, H -= 257, M = f, P -= 257, z = 256) : (L = _, M = u,
                                z = -1), F = 0, R = 0, Z = C, x = g, D = O, I = 0, k = -1, T = 1 << O, y = T - 1, t === l && T > r || t === h && T > s)return 1;
                for (var Y = 0; ;) {
                    Y++, B = Z - I, m[R] < z ? (S = 0, E = m[R]) : m[R] > z ? (S = M[P + m[R]], E = L[H + m[R]]) : (S = 96, E = 0), p = 1 << Z - I, v = 1 << D, C = v;
                    do v -= p, b[x + (F >> I) + v] = B << 24 | S << 16 | E | 0; while (0 !== v);
                    for (p = 1 << Z - 1; F & p;)p >>= 1;
                    if (0 !== p ? (F &= p - 1, F += p) : F = 0, R++, 0 === --j[Z]) {
                        if (Z === N)break;
                        Z = e[a + m[R]]
                    }
                    if (Z > O && (F & y) !== k) {
                        for (0 === I && (I = O), x += C, D = Z - I, U = 1 << D; N > D + I && (U -= j[D + I], !(0 >= U));)D++, U <<= 1;
                        if (T += 1 << D, t === l && T > r || t === h && T > s)return 1;
                        k = F & y, b[k] = O << 24 | D << 16 | x - g | 0
                    }
                }
                return 0 !== F && (b[x + F] = Z - I << 24 | 64 << 16 | 0), w.bits = O, 0
            }
        }, {"../utils/common": 3}],
        13: [function (t, e, a) {
            "use strict";
            e.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }, {}],
        14: [function (t, e, a) {
            "use strict";
            function i(t) {
                for (var e = t.length; --e >= 0;)t[e] = 0
            }

            function n(t, e, a, i, n) {
                this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = i, this.max_length = n, this.has_stree = t && t.length
            }

            function r(t, e) {
                this.dyn_tree = t, this.max_code = 0, this.stat_desc = e
            }

            function s(t) {
                return 256 > t ? lt[t] : lt[256 + (t >>> 7)]
            }

            function o(t, e) {
                t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255
            }

            function l(t, e, a) {
                t.bi_valid > W - a ? (t.bi_buf |= e << t.bi_valid & 65535, o(t, t.bi_buf), t.bi_buf = e >> W - t.bi_valid, t.bi_valid += a - W) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a)
            }

            function h(t, e, a) {
                l(t, a[2 * e], a[2 * e + 1])
            }

            function d(t, e) {
                var a = 0;
                do a |= 1 & t, t >>>= 1, a <<= 1; while (--e > 0);
                return a >>> 1
            }

            function f(t) {
                16 === t.bi_valid ? (o(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8)
            }

            function _(t, e) {
                var a, i, n, r, s, o, l = e.dyn_tree, h = e.max_code, d = e.stat_desc.static_tree, f = e.stat_desc.has_stree, _ = e.stat_desc.extra_bits, u = e.stat_desc.extra_base, c = e.stat_desc.max_length, b = 0;
                for (r = 0; X >= r; r++)t.bl_count[r] = 0;
                for (l[2 * t.heap[t.heap_max] + 1] = 0, a = t.heap_max + 1; G > a; a++)i = t.heap[a], r = l[2 * l[2 * i + 1] + 1] + 1, r > c && (r = c, b++), l[2 * i + 1] = r, i > h || (t.bl_count[r]++, s = 0, i >= u && (s = _[i - u]), o = l[2 * i], t.opt_len += o * (r + s), f && (t.static_len += o * (d[2 * i + 1] + s)));
                if (0 !== b) {
                    do {
                        for (r = c - 1; 0 === t.bl_count[r];)r--;
                        t.bl_count[r]--, t.bl_count[r + 1] += 2, t.bl_count[c]--, b -= 2
                    } while (b > 0);
                    for (r = c; 0 !== r; r--)for (i = t.bl_count[r]; 0 !== i;)n = t.heap[--a], n > h || (l[2 * n + 1] !== r && (t.opt_len += (r - l[2 * n + 1]) * l[2 * n], l[2 * n + 1] = r), i--)
                }
            }

            function u(t, e, a) {
                var i, n, r = new Array(X + 1), s = 0;
                for (i = 1; X >= i; i++)r[i] = s = s + a[i - 1] << 1;
                for (n = 0; e >= n; n++) {
                    var o = t[2 * n + 1];
                    0 !== o && (t[2 * n] = d(r[o]++, o))
                }
            }

            function c() {
                var t, e, a, i, r, s = new Array(X + 1);
                for (a = 0, i = 0; K - 1 > i; i++)for (dt[i] = a, t = 0; t < 1 << et[i]; t++)ht[a++] = i;
                for (ht[a - 1] = i, r = 0, i = 0; 16 > i; i++)for (ft[i] = r, t = 0; t < 1 << at[i]; t++)lt[r++] = i;
                for (r >>= 7; Y > i; i++)for (ft[i] = r << 7, t = 0; t < 1 << at[i] - 7; t++)lt[256 + r++] = i;
                for (e = 0; X >= e; e++)s[e] = 0;
                for (t = 0; 143 >= t;)st[2 * t + 1] = 8, t++, s[8]++;
                for (; 255 >= t;)st[2 * t + 1] = 9, t++, s[9]++;
                for (; 279 >= t;)st[2 * t + 1] = 7, t++, s[7]++;
                for (; 287 >= t;)st[2 * t + 1] = 8, t++, s[8]++;
                for (u(st, P + 1, s), t = 0; Y > t; t++)ot[2 * t + 1] = 5, ot[2 * t] = d(t, 5);
                _t = new n(st, et, M + 1, P, X), ut = new n(ot, at, 0, Y, X), ct = new n(new Array(0), it, 0, q, J)
            }

            function b(t) {
                var e;
                for (e = 0; P > e; e++)t.dyn_ltree[2 * e] = 0;
                for (e = 0; Y > e; e++)t.dyn_dtree[2 * e] = 0;
                for (e = 0; q > e; e++)t.bl_tree[2 * e] = 0;
                t.dyn_ltree[2 * Q] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0
            }

            function g(t) {
                t.bi_valid > 8 ? o(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0
            }

            function m(t, e, a, i) {
                g(t), i && (o(t, a), o(t, ~a)), N.arraySet(t.pending_buf, t.window, e, a, t.pending), t.pending += a
            }

            function w(t, e, a, i) {
                var n = 2 * e, r = 2 * a;
                return t[n] < t[r] || t[n] === t[r] && i[e] <= i[a]
            }

            function p(t, e, a) {
                for (var i = t.heap[a], n = a << 1; n <= t.heap_len && (n < t.heap_len && w(e, t.heap[n + 1], t.heap[n], t.depth) && n++, !w(e, i, t.heap[n], t.depth));)t.heap[a] = t.heap[n], a = n, n <<= 1;
                t.heap[a] = i
            }

            function v(t, e, a) {
                var i, n, r, o, d = 0;
                if (0 !== t.last_lit)do i = t.pending_buf[t.d_buf + 2 * d] << 8 | t.pending_buf[t.d_buf + 2 * d + 1], n = t.pending_buf[t.l_buf + d], d++, 0 === i ? h(t, n, e) : (r = ht[n], h(t, r + M + 1, e), o = et[r], 0 !== o && (n -= dt[r], l(t, n, o)), i--, r = s(i), h(t, r, a), o = at[r], 0 !== o && (i -= ft[r], l(t, i, o))); while (d < t.last_lit);
                h(t, Q, e)
            }

            function k(t, e) {
                var a, i, n, r = e.dyn_tree, s = e.stat_desc.static_tree, o = e.stat_desc.has_stree, l = e.stat_desc.elems, h = -1;
                for (t.heap_len = 0, t.heap_max = G, a = 0; l > a; a++)0 !== r[2 * a] ? (t.heap[++t.heap_len] = h = a, t.depth[a] = 0) : r[2 * a + 1] = 0;
                for (; t.heap_len < 2;)n = t.heap[++t.heap_len] = 2 > h ? ++h : 0, r[2 * n] = 1, t.depth[n] = 0, t.opt_len--, o && (t.static_len -= s[2 * n + 1]);
                for (e.max_code = h, a = t.heap_len >> 1; a >= 1; a--)p(t, r, a);
                n = l;
                do a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], p(t, r, 1), i = t.heap[1], t.heap[--t.heap_max] = a, t.heap[--t.heap_max] = i, r[2 * n] = r[2 * a] + r[2 * i], t.depth[n] = (t.depth[a] >= t.depth[i] ? t.depth[a] : t.depth[i]) + 1, r[2 * a + 1] = r[2 * i + 1] = n, t.heap[1] = n++, p(t, r, 1); while (t.heap_len >= 2);
                t.heap[--t.heap_max] = t.heap[1], _(t, e), u(r, h, t.bl_count)
            }

            function y(t, e, a) {
                var i, n, r = -1, s = e[1], o = 0, l = 7, h = 4;
                for (0 === s && (l = 138, h = 3), e[2 * (a + 1) + 1] = 65535, i = 0; a >= i; i++)n = s, s = e[2 * (i + 1) + 1], ++o < l && n === s || (h > o ? t.bl_tree[2 * n] += o : 0 !== n ? (n !== r && t.bl_tree[2 * n]++, t.bl_tree[2 * V]++) : 10 >= o ? t.bl_tree[2 * $]++ : t.bl_tree[2 * tt]++, o = 0, r = n, 0 === s ? (l = 138, h = 3) : n === s ? (l = 6, h = 3) : (l = 7, h = 4))
            }

            function x(t, e, a) {
                var i, n, r = -1, s = e[1], o = 0, d = 7, f = 4;
                for (0 === s && (d = 138, f = 3), i = 0; a >= i; i++)if (n = s, s = e[2 * (i + 1) + 1], !(++o < d && n === s)) {
                    if (f > o) {
                        do h(t, n, t.bl_tree); while (0 !== --o)
                    } else 0 !== n ? (n !== r && (h(t, n, t.bl_tree), o--), h(t, V, t.bl_tree), l(t, o - 3, 2)) : 10 >= o ? (h(t, $, t.bl_tree), l(t, o - 3, 3)) : (h(t, tt, t.bl_tree), l(t, o - 11, 7));
                    o = 0, r = n, 0 === s ? (d = 138, f = 3) : n === s ? (d = 6, f = 3) : (d = 7, f = 4)
                }
            }

            function z(t) {
                var e;
                for (y(t, t.dyn_ltree, t.l_desc.max_code), y(t, t.dyn_dtree, t.d_desc.max_code), k(t, t.bl_desc), e = q - 1; e >= 3 && 0 === t.bl_tree[2 * nt[e] + 1]; e--);
                return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e
            }

            function B(t, e, a, i) {
                var n;
                for (l(t, e - 257, 5), l(t, a - 1, 5), l(t, i - 4, 4), n = 0; i > n; n++)l(t, t.bl_tree[2 * nt[n] + 1], 3);
                x(t, t.dyn_ltree, e - 1), x(t, t.dyn_dtree, a - 1)
            }

            function S(t) {
                var e, a = 4093624447;
                for (e = 0; 31 >= e; e++, a >>>= 1)if (1 & a && 0 !== t.dyn_ltree[2 * e])return D;
                if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26])return I;
                for (e = 32; M > e; e++)if (0 !== t.dyn_ltree[2 * e])return I;
                return D
            }

            function E(t) {
                bt || (c(), bt = !0), t.l_desc = new r(t.dyn_ltree, _t), t.d_desc = new r(t.dyn_dtree, ut), t.bl_desc = new r(t.bl_tree, ct), t.bi_buf = 0, t.bi_valid = 0, b(t)
            }

            function A(t, e, a, i) {
                l(t, (T << 1) + (i ? 1 : 0), 3), m(t, e, a, !0)
            }

            function Z(t) {
                l(t, F << 1, 3), h(t, Q, st), f(t)
            }

            function R(t, e, a, i) {
                var n, r, s = 0;
                t.level > 0 ? (t.strm.data_type === U && (t.strm.data_type = S(t)), k(t, t.l_desc), k(t, t.d_desc), s = z(t), n = t.opt_len + 3 + 7 >>> 3, r = t.static_len + 3 + 7 >>> 3, n >= r && (n = r)) : n = r = a + 5, n >= a + 4 && -1 !== e ? A(t, e, a, i) : t.strategy === O || r === n ? (l(t, (F << 1) + (i ? 1 : 0), 3), v(t, st, ot)) : (l(t, (L << 1) + (i ? 1 : 0), 3), B(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1), v(t, t.dyn_ltree, t.dyn_dtree)), b(t), i && g(t)
            }

            function C(t, e, a) {
                return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & a, t.last_lit++, 0 === e ? t.dyn_ltree[2 * a]++ : (t.matches++, e--, t.dyn_ltree[2 * (ht[a] + M + 1)]++, t.dyn_dtree[2 * s(e)]++), t.last_lit === t.lit_bufsize - 1
            }

            var N = t("../utils/common"), O = 4, D = 0, I = 1, U = 2, T = 0, F = 1, L = 2, H = 3, j = 258, K = 29, M = 256, P = M + 1 + K, Y = 30, q = 19, G = 2 * P + 1, X = 15, W = 16, J = 7, Q = 256, V = 16, $ = 17, tt = 18, et = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], at = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], it = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], nt = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], rt = 512, st = new Array(2 * (P + 2));
            i(st);
            var ot = new Array(2 * Y);
            i(ot);
            var lt = new Array(rt);
            i(lt);
            var ht = new Array(j - H + 1);
            i(ht);
            var dt = new Array(K);
            i(dt);
            var ft = new Array(Y);
            i(ft);
            var _t, ut, ct, bt = !1;
            a._tr_init = E, a._tr_stored_block = A, a._tr_flush_block = R, a._tr_tally = C, a._tr_align = Z
        }, {"../utils/common": 3}],
        15: [function (t, e, a) {
            "use strict";
            function i() {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0
            }

            e.exports = i
        }, {}],
        "/": [function (t, e, a) {
            "use strict";
            var i = t("./lib/utils/common").assign, n = t("./lib/deflate"), r = t("./lib/inflate"), s = t("./lib/zlib/constants"), o = {};
            i(o, n, r, s), e.exports = o
        }, {"./lib/deflate": 1, "./lib/inflate": 2, "./lib/utils/common": 3, "./lib/zlib/constants": 6}]
    }, {}, [])("/")
}), function (win) {
    win.compressStr = {
        compress: function (str) {
            var len = str.length, time = (new Date).getTime();
            return str = pako.gzip(str, {to: "string"}), window.console && window.console.log("gzip before: " + len + " after: " + str.length + " time: " + ((new Date).getTime() - time)), str
        }, decompress: function (str) {
            return pako.ungzip(str, {to: "string"})
        }
    }
}(window);
var g_web_cfg = null, g_head_cfg = null, g_get_source = {}, gLoadWebConfig = {
    loadWebConfig: function () {
        var head = document.getElementsByTagName("head");
        head && head[0] && (head = head[0]), $(head).append(this.env_spell_js("../login/get_config.js").outerHTML)
    }, env_spell_js: function (file) {
        file += "?_v=" + (new Date).getTime();
        var node = document.createElement("script");
        return node.type = "text/javascript", node.src = file, node
    }
};
!function () {
    function try_to_login() {
        var web_site = getFileName(window.location.href, "/", ".");
        if ("login" != web_site) {
            window.localStorage && set_local_value("historyurl", window.location.href);
            var from_portal = getQueryString("from_portal");
            return from_portal = from_portal ? "&from_portal=" + from_portal : "", location.href = "../login/login.html?history=1&_v=" + temp_vid + from_portal, !0
        }
        return get_file_config() && import_files(), !1
    }

    function get_file_config() {
        var web_config_file = "../project/web_config.js?_v=" + temp_vid;
        if ($.ajaxSetup({async: !1}), $.getScript(web_config_file), $.ajaxSetup({async: !0}), !g_web_cfg)return !1;
        g_web_cfg.vid = temp_vid, sys_version = g_web_cfg.vid;
        var lang = getBrowserLang(), language_switch_flag = "undefined" != typeof g_web_cfg.language_switch && g_web_cfg.language_switch, langType = "undefined" == typeof g_web_cfg.languageType ? [] : g_web_cfg.languageType;
        if (language_switch_flag)if (langType && langType.length > 0) {
            for (var i = 0; i < langType.length && lang !== langType[i].name; i++);
            i >= langType.length && (lang = "en")
        } else"zh" != lang && "en" != lang && "es" != lang && (lang = "en"); else"zh" != lang && "en" != lang && "es" != lang && (lang = "en");
        return g_web_cfg.scada_language_config = lang, !0
    }

    function getBrowserLang() {
        var code;
        code = navigator.language ? navigator.language : navigator.browserLanguage;
        var index = code.indexOf("-");
        return index != -1 && (code = code.substring(0, index)), code
    }

    function get_config() {
        var web_cfg_temp = get_local_value("g_web_cfg");
        if (test_html5() && web_cfg_temp && "null" != web_cfg_temp) {
            g_web_cfg = get_local_value("g_web_cfg"), g_head_cfg = get_local_value("g_head_cfg");
            var node_name_list = get_session_value("node_name_list");
            return node_name_list && getCookie("global_id") && (g_web_cfg = get_local_value("g_web_cfg_" + node_name_list), g_head_cfg = get_local_value("g_head_cfg_" + node_name_list), get_local_value("g_web_cfg") && (g_web_cfg = get_local_value("g_web_cfg"), g_head_cfg = get_local_value("g_head_cfg"))), g_web_cfg = JSON.parse(g_web_cfg), g_head_cfg = JSON.parse(g_head_cfg), !0
        }
        return !1
    }

    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=?([^;=]*)(;|$)"));
        return null != arr ? unescape(arr[2]) : null
    }

    function check_version() {
        if ("object" == typeof g_web_cfg && g_web_cfg && (sys_version = g_web_cfg.vid), !sys_version)return !0;
        var url_version = getQueryString("_v");
        if (sys_version != url_version && temp_vid != sys_version) {
            var href = window.location.href;
            return href = url_version ? href.replace("_v=" + url_version, "_v=" + sys_version) : add_version_tail(window.location.href), window.location.href = href, isToOtherPage = !0, !1
        }
        return !0
    }

    function add_version_tail(url) {
        if (url || (url = ""), "#" == url[0])return url;
        var hash = "";
        return url.indexOf("#") >= 0 && (hash = url.split("#")[1], url = url.split("#")[0]), url.indexOf("_v=") < 0 && (url += (url.indexOf("?") > 0 ? "&" : "?") + "_v=" + sys_version), hash && (url = url + "#" + hash), url
    }

    function spell_css(file) {
        return '<link type="text/css" rel="stylesheet" href="' + file + '"/>'
    }

    function spell_js(file) {
        return '<script type="text/javascript" src="' + file + '"></script>'
    }

    function spell_ico(file) {
        return '<link rel="shortcut icon" href="' + file + '" type="image/x-icon">'
    }

    function set_symble(url) {
        return url ? url + (url.indexOf("?") >= 0 ? "&" : "?") + "_v=" + sys_version : ""
    }

    function import_files() {
        if (!files_import) {
            var scada_language_config = "en";
            "object" == typeof g_web_cfg && g_web_cfg && (scada_language_config = g_web_cfg.scada_language_config);
            var lan = getCookie("portallanguage") || getCookie("locale"), urlLang = getQueryString("lang") || getQueryString("language"), language_switch_flag = "undefined" != typeof g_web_cfg.language_switch && g_web_cfg.language_switch;
            if (language_switch_flag) {
                "" !== lan && null !== lan && (scada_language_config = lan.substring(0, 2).toLowerCase());
                var langType = "undefined" == typeof g_web_cfg.languageType ? [] : g_web_cfg.languageType;
                if (langType && langType.length > 0) {
                    for (var i = 0; i < langType.length; i++)if (urlLang === langType[i].name) {
                        scada_language_config = urlLang;
                        break
                    }
                } else switch (urlLang) {
                    case"zh":
                    case"en":
                    case"es":
                        scada_language_config = urlLang
                }
            } else switch (urlLang) {
                case"zh":
                case"en":
                case"es":
                    scada_language_config = urlLang
            }
            fixed_js.push("../project/i18n/" + scada_language_config + ".js"), language_switch_flag && fixed_js.push("../project/i18n/menu_" + scada_language_config + ".js"), fixed_js.push("../common/plugins/jqgrid/js/i18n/grid.locale-" + scada_language_config + ".js");
            $("script[src*='grid.locale-']").remove();
            $("head").append(spell_ico(set_symble(fixed_icon)));
            for (var i = 0; i < fixed_css.length; i++)files_import += spell_css(set_symble(fixed_css[i]));
            if ("object" == typeof g_css_files)for (var i = 0; i < g_css_files.length; i++)files_import += spell_css(set_symble(g_css_files[i]));
            for (var i = 0; i < fixed_js.length; i++)files_import += spell_js(set_symble(fixed_js[i]));
            if ("object" == typeof g_js_files)for (var i = 0; i < g_js_files.length; i++)files_import += spell_js(set_symble(g_js_files[i]));
            document.write(files_import)
        }
    }

    function testVersion(version) {
        if (version != window.windosWebpageVersion && version != getQueryString("version")) {
            var flag = location.href.indexOf("?") >= 0 ? "&" : "?";
            return location.href = location.href + flag + "version=" + version, isToOtherPage = !0, !1
        }
        if (window.g_web_cfg && g_web_cfg.ws_url) {
            var ws_url = g_web_cfg.ws_url, vid = getQueryString("_v");
            setTimeout(function () {
                $.ajax({
                    url: ws_url + "scada_config?_t=" + (new Date).getTime(),
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (cfg) {
                        if (cfg.vid && vid != cfg.vid) {
                            var errorversion = getQueryString("errorversion");
                            if (errorversion != cfg.vid)if (errorversion) location.href = location.href.replace("errorversion=" + errorversion, "errorversion=" + cfg.vid); else {
                                var flag = location.href.indexOf("?") >= 0 ? "&" : "?";
                                location.href = location.href + flag + "errorversion=" + cfg.vid
                            }
                        }
                    }
                })
            }, 5e3)
        }
        return !0
    }

    var temp_vid = (new Date).getTime(), sys_version = "", fixed_js = [], fixed_icon = "../common/images/favicon.ico", fixed_css = [], files_import = "";
    !function () {
        !test_html5() && try_to_login() || (get_config() || gLoadWebConfig.loadWebConfig(), testVersion("3132") && check_version() && import_files())
    }(), g_get_source.get_sources = function (sources) {
        var files_import = "";
        if ("string" == typeof sources && (sources = [sources]), "object" == typeof sources)for (var i = 0; i < sources.length; i++) {
            var source = set_symble(sources[i]);
            source.indexOf(".js") >= 0 && (files_import += spell_js(source)), source.indexOf(".css") >= 0 && (files_import += spell_css(source)), source.indexOf(".ico") >= 0 && (files_import += spell_ico(source))
        }
        document.write(files_import)
    }
}();
var language_num = 0, Easy_inter = {
    def_language: null,
    parent_json: null,
    parent_key: null,
    cur_language: null,
    container: "",
    language: [{value: "英文", flag: "en"}, {value: "中文", flag: "zh"}, {value: "西班牙语", flag: "es"}],
    init: function () {
        this.cur_language = this.getBrowserLang();
        var temp_lang = localStorage.getItem("cur_selected_lang");
        temp_lang && "" != temp_lang && (this.cur_language = temp_lang), this.def_language && (this.cur_language = this.def_language), localStorage.setItem("cur_selected_lang", this.cur_language), Easy_inter.setLang(this.cur_language, "all")
    },
    open_callback: function (event, ui) {
        var $ul = $(this).autocomplete("widget"), lHeight = $ul.find("li").css("height"), lWidth = $(this).css("width");
        lHeight = lHeight.substring(0, lHeight.lastIndexOf("px"));
        var maxHeight = 15 * lHeight + "px";
        lWidth = Number(lWidth.substring(0, lWidth.lastIndexOf("px"))) + 20, lWidth += "px", $ul.css("max-height", maxHeight).css("overflow", "auto").css("width", lWidth)
    },
    select_callback: function (event, ui) {
        var lang = ui.item.flag;
        lang != localStorage.getItem("cur_selected_lang") && (Easy_inter.setLang(lang, "all"), localStorage.setItem("cur_selected_lang", lang))
    },
    setLang: function (code, range) {
        parent_json = JSLocale, Easy_inter.traverse_json(JSLocale, "all"), Easy_inter.container = ""
    },
    getBrowserLang: function () {
        var code;
        code = navigator.language ? navigator.language : navigator.browserLanguage;
        var index = code.indexOf("-");
        return index != -1 && (code = code.substring(0, index)), code
    },
    traverse_json: function (obj, range) {
        if ("all" == range)for (var k in obj) {
            var v = obj[k];
            "object" != typeof v ? this.trsverse_one(obj, k) : (parent_key = k, this.traverse_json(v, "all"))
        } else this.trsverse_inter(obj.range)
    },
    trsverse_inter: function (obj) {
        for (var k in obj)this.trsverse_one(obj, k)
    },
    trsverse_one: function (obj, k) {
        var v = obj[k];
        if ("object" != typeof v)switch (language_num++, k) {
            case"html":
                $(Easy_inter.container + " #" + parent_key).html(v);
                break;
            case"btn":
                $(Easy_inter.container + " #" + parent_key).val(v);
                break;
            case"place":
                $(Easy_inter.container + " #" + parent_key).attr("placeholder", v);
                break;
            case"label_class":
                $(Easy_inter.container + " ." + parent_key).html(v);
                break;
            case"btn_class":
                $(Easy_inter.container + " ." + parent_key).val(v);
                break;
            case"width":
                $(Easy_inter.container + " ." + parent_key).css({width: v});
                break;
            case"use_class":
                $(Easy_inter.container + " #" + parent_key).removeClass().addClass(v)
        } else parent_key = k, this.trsverse_inter(v)
    }
}, local_url = "";
jQuery.extend({
    toJSON: function (object) {
        var type = typeof object;
        switch ("object" == type && (type = null === object ? "object" : Array == object.constructor ? "array" : RegExp == object.constructor ? "regexp" : "object"), type) {
            case"undefined":
            case"unknown":
                return;
            case"function":
            case"boolean":
            case"regexp":
                return object.toString();
            case"number":
                return isFinite(object) ? object.toString() : "null";
            case"string":
                return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                        var a = arguments[0];
                        return "\n" == a ? "\\n" : "\r" == a ? "\\r" : "\t" == a ? "\\t" : ""
                    }) + '"';
            case"object":
                if (null === object)return "null";
                var results = [];
                for (var property in object) {
                    var value = jQuery.toJSON(object[property]);
                    void 0 !== value && results.push(jQuery.toJSON(property) + ":" + value)
                }
                return "{" + results.join(",") + "}";
            case"array":
                for (var results = [], i = 0; i < object.length; i++) {
                    var value = jQuery.toJSON(object[i]);
                    void 0 !== value && results.push(value)
                }
                return "[" + results.join(",") + "]"
        }
    }
}), ~function () {
    function getCityID(siteAlias) {
        return $.ajax({
            url: baseUrl + "/mdmService/ws/rest/getMdmServiceInfoByMdmName",
            type: "POST",
            contentType: "application/json",
            processData: !1,
            data: JSON.stringify({scdAlias: siteAlias}),
            dataType: "json"
        }).then(function (res) {
            return res.data[0].cityId
        })
    }

    function getWeather(city) {
        return $.ajax({
            url: baseUrl + "/weatherService/ws/rest/getWeatherInfoAmount",
            type: "POST",
            data: JSON.stringify({cityId: city, beginTime: new Date, endTime: new Date}),
            dataType: "json"
        }).then(function (res) {
            return res = res.data[0].weather, {weather: res, className: weatherInfo[res]}
        })
    }

    var baseUrl;
    $.fn.weather = function (site, baseurl) {
        baseUrl = baseurl, getCityID(site).then(getWeather).then(function (res) {
            this.removeClass(this[0].className && this[0].className.split(" ").filter(function (o) {
                    return 0 === o.indexOf("weather")
                }).join(" ")), this.addClass("weather " + res.className).attr("title", res.weather)
        }.bind(this))
    }, $.fn.weatherDemo = function () {
        this.addClass("weather");
        for (var i in weatherInfo)this.append("<div class='" + weatherInfo[i] + "' title='" + i + "'>" + i + "</div>")
    };
    var weatherInfo = {
        "晴": "weather-icon-qing",
        "多云": "weather-icon-duoyun",
        "阵雨": "weather-icon-zhenyu",
        "小雨": "weather-icon-xiaoyu",
        "中雨": "weather-icon-zhongyu",
        "阴": "weather-icon-yin",
        "暴雪": "weather-icon-baoxue",
        "暴雨": "weather-icon-baoyu",
        "大暴雨": "weather-icon-dabaoyu",
        "暴雨到大暴雨": "weather-icon-baoyu-dabaoyu",
        "大到特大暴雨": "weather-icon-dabaoyu-tedabaoyu",
        "大雪": "weather-icon-daxue",
        "大到暴雪": "weather-icon-daxue-baoxue",
        "大雨": "weather-icon-dayu",
        "大到暴雨": "weather-icon-dayu-baoyu",
        "冻雨": "weather-icon-dongyu",
        "浮尘": "weather-icon-fuchen",
        "雷阵雨": "weather-icon-leizhenyu",
        "雷阵雨伴有冰雹": "weather-icon-leizhenyuyoubingbao",
        "强沙尘暴": "weather-icon-qiangshachenbao",
        "沙尘暴": "weather-icon-shachenbao",
        "特大暴雨": "weather-icon-tedabaoyu",
        "雾": "weather-icon-wu",
        "小雪": "weather-icon-xiaoxue",
        "小到中雪": "weather-icon-xiaoxue-zhongxue",
        "小到中雨": "weather-icon-xiaoyu-zhongyu",
        "扬沙": "weather-icon-yangsha",
        "雨夹雪": "weather-icon-yujiaxue",
        "阵雪": "weather-icon-zhenxue",
        "中雪": "weather-icon-zhongxue",
        "中到大雪": "weather-icon-zhongxue-daxue",
        "中到大雨": "weather-icon-zhongyu-dayu",
        "霾": "weather-icon-mai"
    }
}();
var url = window.location.host, re_url = "../", base_ip = "http://" + url, dataexport_callback = null, node_list = null, success_code = "10000", test_session_no = 1, try_to_test_login = 5, grid_header = 34, grid_pager = 31, bottom_height = 20, min_width = 1079, MAXLENGTH = 20, scada_language_config = "zh", enable_language_switch = "undefined" != typeof get_web_cfg("language_switch") && get_web_cfg("language_switch"), mr_url = get_web_cfg("mr_url"), ws_url = get_web_cfg("ws_url"), eam_url = get_web_cfg("eam_url"), fc_url = get_web_cfg("fc_url"), cp_url = get_web_cfg("cp_url"), occ_url = get_web_cfg("occ_url"), mdm_url = get_web_cfg("mdm_url"), rs_url = get_web_cfg("rs_url"), task_url = get_web_cfg("task_url"), webcal_url = get_web_cfg("webcal_url"), checklog_url = get_web_cfg("checklog_url"), wfpc_url = get_web_cfg("wfpc_url"), scadaserviceUrl = get_web_cfg("scadaserviceUrl") || ws_url, portalUrl = get_web_cfg("portalUrl") || get_web_cfg("http_url_config") + "gateway/portalservice/", g_now_html_name = getFileName(window.location.href, "/", "."), g_field_parm = "", g_user_first_svg = "",
    g_field_date = {
    time: null,
    id: "wf_time",
    time_zone: null,
    time_format: null,
    yyyy_MM_dd_format: null,
    yyyy_MM: null,
    hh_mm_ss_format: null,
    need_time_zone: null,
    debug_mode: null,
    has_check_vid: !1
},
    default_time_format = "yyyy-MM-dd HH:mm:ss",
    g_default_format = {
    time_format: "yyyy-MM-dd HH:mm:ss",
    yyyy_MM_dd_format: "yyyy-MM-dd",
    hh_mm_ss_format: "HH:mm:ss",
    yyyy_MM: "yyyy-MM"
};
if ("undefined" == typeof Util)var Util = {};
Util.config = {
    JSfile: "../common/frame/env_dialog/xydialog/",
    loadingICO: "../common/frame/env_dialog/xydialog/loading.gif"
}, $(document).ready(function () {
    test_web_cfg(), test_IE(), init_language(), get_now_field(), init_page_menuItem(), show_center(), portal_sys_memu(), try_to_init_tree(), test_home_page(), clear_app_name(), init_field_time(), init_header_user(), ckeck_page_url(), check_nodenamelist(), set_min_width(min_width), addUserHabits()
}), g_head_cfg && g_head_cfg.limit_user_and_tab_num && "true" == g_head_cfg.limit_user_and_tab_num.if_enabled && (addEventHandler(window, "load", function () {
    if (parseInt(localStorage.page_count)) {
        localStorage.page_count = parseInt(localStorage.page_count) + 1;
        var max_tab_num = g_head_cfg && g_head_cfg.limit_user_and_tab_num && parseInt(g_head_cfg.limit_user_and_tab_num.max_tab_num) || 1e3;
        parseInt(localStorage.page_count) > max_tab_num && alert(JSLocale.tab_over_limitation.replace("{0}", max_tab_num))
    } else localStorage.page_count = 1
}), addEventHandler(window, "unload", function () {
    parseInt(localStorage.page_count) && (localStorage.page_count = parseInt(localStorage.page_count) - 1)
}));
var gGetWindOrPortalMenu = {
    getWindOrPortalMenu: function (fieldParm, callback) {
        if ("1" == get_web_cfg("menu_source")) {
            var mdm_id = this.getMdmByInfo(fieldParm) || "";
            ws_getPortalMenu(mdm_id, function (resp) {
                check_ws_data(resp) ? (resp.menu = gGetWindOrPortalMenu.nodes2tree(resp.data), gGetWindOrPortalMenu.setParentAttr(resp.menu), callback(resp)) : ws_get_menu(fieldParm, callback)
            })
        } else ws_get_menu(fieldParm, callback)
    }, getMdmByInfo: function (fieldParm) {
        var treeObj = gNodeMenuShow.farmTreeObject || g_tree_object, fieldNode = null;
        if (treeObj && (fieldNode = treeObj.getNodeByParam("alias", fieldParm) || treeObj.getNodeByParam("name", fieldParm)), fieldNode)return fieldNode.mdm_id
    }, nodes2tree: function (nodes) {
        var nodeMap = {}, rootNodes = [];
        return $.each(nodes, function (i, node) {
            nodeMap[node.id] = node, node.url = node.url || "", node.ifshow = 1, node.show = 1, !node.parent && node.appid && (node.parent = node.appid)
        }), $.each(nodes, function (i, node) {
            var parent = nodeMap[node.parent];
            parent ? parent.children ? parent.children.push(node) : parent.children = [node] : rootNodes.push(node)
        }), rootNodes
    }, setParentAttr: function (menus, parent) {
        var level = 100, priv_type = 100;
        return menus && menus.length > 0 && $.each(menus, function (i, menu) {
            if (menu.children && menu.children.length > 0) {
                var attrs = gGetWindOrPortalMenu.setParentAttr(menu.children, menu);
                level = gGetWindOrPortalMenu.mergeLeval(level, attrs.level), priv_type = gGetWindOrPortalMenu.mergePriv(priv_type, attrs.priv_type)
            }
        }), parent && (parent.level = level, parent.priv_type = priv_type), {level: level, priv_type: priv_type}
    }, mergeLeval: function (level1, level2) {
        return 0 == level1 || 0 == level2 ? 0 : level1 == level2 ? level1 : level1 < 100 && level2 < 100 ? 0 : Math.min(level1, level2)
    }, mergePriv: function (level1, level2) {
        return Math.min(level1, level2)
    }
};
!function () {
    var fleetmdmid = getQueryString("fleetmdmid");
    if (!fleetmdmid) {
        var graph_svg = get_local_value("graph_svg");
        getQueryString("from_portal") && graph_svg && getUrlValue(graph_svg, "fleetmdmid") && (fleetmdmid = getUrlValue(graph_svg, "fleetmdmid"), set_local_value("graph_svg", ""), location.href = location.href + "&fleetmdmid=" + fleetmdmid)
    }
}();
var g_login_info = {login: !1, info: !0};
Date.prototype.format = function (format) {
    format || (format = g_field_date.time_format), format || (format = default_time_format);
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "D+": this.getDate(),
        "h+": this.getHours(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S+": this.getSeconds()
    };
    /(y+)/.test(format) && (format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
    for (var k in o)new RegExp("(" + k + ")").test(format) && (format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
    return format
},
    Date.prototype.format_mini = function (format, format_mini, time_zone) {
    if (format || (format = g_field_date.time_format), format || (format = default_time_format), !format_mini)return this.format(format);
    format_mini.indexOf("(UTC+hh:mm)") < 0 && (time_zone = null), format_mini = format_mini.replace(/\(UTC\+hh:mm\)$/, ""), format_mini = format_mini.replace(/S/g, "s"), format_mini = format_mini.replace(/D/g, "d"), format_mini = format_mini.replace(/Y/g, "y"), format_mini = format_mini.replace(/h/g, "H");
    var o = {
        MM: this.getMonth() + 1,
        dd: this.getDate(),
        DD: this.getDate(),
        hh: this.getHours(),
        HH: this.getHours(),
        mm: this.getMinutes(),
        ss: this.getSeconds(),
        SS: this.getSeconds()
    };
    if (/(y+)/.test(format)) {
        var be_replace = RegExp.$1, repalce = "";
        /(y+)/.test(format_mini) && (repalce = (this.getFullYear() + "").substr(4 - be_replace.length)), format = format.replace(be_replace, repalce)
    }
    for (var k in o)if (new RegExp("(" + k + ")").test(format)) {
        var be_replace = RegExp.$1, repalce = "";
        new RegExp("(" + k + ")").test(format_mini) && (repalce = 1 == be_replace.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)), format = format.replace(be_replace, repalce)
    }
    return format = delete_split_char(format), parseInt(time_zone) == parseInt(time_zone) && (format += " " + fill_UTC_area(time_zone, g_field_date.need_time_zone)), format
},
    Date.prototype.format_yy = function (format) {
    format || (format = g_field_date.yyyy_MM_dd_format), format || (format = g_default_format.yyyy_MM_dd_format);
    var o = {"M+": this.getMonth() + 1, "d+": this.getDate(), "D+": this.getDate()};
    /(y+)/.test(format) && (format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
    for (var k in o)new RegExp("(" + k + ")").test(format) && (format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
    return format
},
    Date.prototype.format_hh = function (format) {
    format || (format = g_field_date.hh_mm_ss_format), format || (format = g_default_format.hh_mm_ss_format);
    var o = {
        "h+": this.getHours(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "S+": this.getSeconds()
    };
    for (var k in o)new RegExp("(" + k + ")").test(format) && (format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
    return format
},
    gEnvTimeFormat = {
    compareStrTime: function (start_time, end_time) {
        return start_time = start_time || "", end_time = end_time || "", Date.parse(end_time.replace(/-/g, "/")) - Date.parse(start_time.replace(/-/g, "/"))
    }
},
    function ($) {
    $.fn.mask = function () {
        this.each(function () {
            var id = $(this).attr("id");
            id && init_overlay({con_id: "#" + id})
        })
    }, $.fn.unmask = function () {
        this.each(function () {
            var id = $(this).attr("id");
            id && close_overlay("#" + id)
        })
    }
}(jQuery), Array.prototype.scadaRemoveSame = function () {
    for (var i = 0; i < this.length; i++)for (var j = i + 1; j < this.length; j++)this[i] === this[j] && (this.splice(j, 1), j--);
    return this
}, Array.prototype.scadaRemove = function (s) {
    for (var i = 0; i < this.length; i++)s == this[i] && this.splice(i, 1);
    return this
}, Array.prototype.scadaAdd = function (s) {
    for (var count = 0, i = 0; i < this.length; i++)s == this[i] && count++;
    return 0 == count && this.push(s), this
}, Array.prototype.scadaMaxVal = function () {
    return Math.max.apply({}, this)
}, Array.prototype.scadaMinVal = function () {
    return Math.min.apply({}, this)
}, Array.prototype.remove_index = function (dx) {
    if (isNaN(dx) || dx > this.length)return !1;
    for (var i = 0, n = 0; i < this.length; i++)this[i] != this[dx] && (this[n++] = this[i]);
    return this.length -= 1, this
}, function ($) {
    $.envtool = $.envtool || {}, $.extend(!0, $.envtool, {
        getFarmName: function (n, g_field_parm) {
            if (!(n <= 0)) {
                if ($.fn.zTree && $.fn.zTree.getZTreeObj("tree")) {
                    var tree = $.fn.zTree.getZTreeObj("tree"), farmName = "";
                    if ("" != g_field_parm) {
                        var node = tree.getNodeByParam("alias", g_field_parm);
                        if (node) {
                            if (farmName = node.display_name, "FACTORY" == node.node_type) {
                                var curFarmNode = farmCommSts.getCurFarmNode();
                                curFarmNode && curFarmNode.length <= 0 && farmCommSts.updateCurFarmNode([node])
                            }
                        } else farmName = g_field_parm
                    } else {
                        var nodes = tree.getNodesByParam("level", "0", null);
                        if (1 == nodes.length) {
                            if (farmName = nodes[0].display_name, "" != nodes[0].alias && nodes[0].alias && "FACTORY" == nodes[0].node_type) {
                                var curFarmNode = farmCommSts.getCurFarmNode();
                                curFarmNode && curFarmNode.length <= 0 && farmCommSts.updateCurFarmNode([node])
                            }
                        } else farmName = JSLocale.no_node_name
                    }
                    if (enable_language_switch) farmName.length < 7 ? $("#wf_name").html('<span style="padding-top:5px;">' + farmName + "</span>") : $("#wf_name").html('<marquee scrollamount="2" style="padding-top:5px;">' + farmName + "</marquee>"); else {
                        var lang = scada_language_config || "zh";
                        "zh" == lang && farmName.length < 7 || "en" == lang && farmName.length < 13 ? $("#wf_name").html('<span style="padding-top:5px;">' + farmName + "</span>") : $("#wf_name").html('<marquee scrollamount="2" style="padding-top:5px;">' + farmName + "</marquee>")
                    }
                    return farmCommSts.stopTimer(), farmCommSts.getFarmCommSts(), void initWeather()
                }
                setTimeout(function () {
                    $.envtool.getFarmName(n, g_field_parm)
                }, 200)
            }
        }, getOnlyFarmName: function () {
            var treeObj, farmName = "";
            if (g_field_parm && $.fn.zTree && (treeObj = $.fn.zTree.getZTreeObj("tree"))) {
                var node = treeObj.getNodeByParam("alias", g_field_parm);
                node || (node = treeObj.getNodeByParam("display_name", g_field_parm)), node && "FACTORY" === node.node_type.toUpperCase() && (farmName = node.display_name)
            }
            return farmName
        }
    })
}(jQuery);
var g_num_add_comma = {
    format_num: function (nStr) {
        nStr += "", x = nStr.split("."), x1 = x[0], x2 = x.length > 1 ? "." + x[1] : "";
        for (var rgx = /(\d+)(\d{3})/; rgx.test(x1);)x1 = x1.replace(rgx, "$1,$2");
        return x1 + x2
    }, add_comma: function (num) {
        var type = typeof num;
        if ("string" == type || "number" == type) {
            var temp = num;
            "string" == type && (temp = temp.replace(/\,/g, ""));
            var float_num = parseFloat(temp);
            if (!isNaN(float_num) && isFinite(temp))return g_num_add_comma.format_num(temp)
        }
        return num
    }, remove_comma: function (num) {
        if ("string" == typeof num) {
            var temp = num.replace(/\,/g, ""), float_num = parseFloat(temp);
            if (!isNaN(float_num) && isFinite(temp))return temp
        }
        return num
    }, need_comma: function () {
        return "false" != get_web_cfg("if_add_comma")
    }, add_remove_comma: function (num) {
        return g_num_add_comma.need_comma() ? g_num_add_comma.add_comma(num) : g_num_add_comma.remove_comma(num)
    }
};
!function () {
    function handle_from_portal() {
        if (is_from_portal()) {
            setCookie("global_id", getCookie("ESBID"));
            var userName = getCookie("userName");
            userName && set_local_value("username", userName.replace(/@.*$/, "")), set_local_value("portal2", "yes"), "login" != g_now_html_name && gLoadWebConfig.loadWebConfig(), sessionStorage.region_list = get_local_value("region_list"), ws_get_loginfo(handle_loginfo, "sync")
        }
        get_user_first_svg(), get_now_field(), check_page_auth()
    }

    function is_from_portal() {
        return !!("1" == getQueryString("from_portal") && getCookie("ESBID") && getCookie("userName") && uncertain_local_data("serviceList"))
    }

    get_web_cfg("vid");
    handle_from_portal()
}();
var farmCommSts = {
    curFarmNode: [],
    farmNodes: [],
    farmCommStsTimer: null,
    ifEnabled: !(!g_head_cfg || !g_head_cfg.farm_comm_status_config || "true" != g_head_cfg.farm_comm_status_config.if_enabled),
    aliasSuffix: g_head_cfg && g_head_cfg.farm_comm_status_config && g_head_cfg.farm_comm_status_config.yx_alias_suffix ? g_head_cfg.farm_comm_status_config.yx_alias_suffix : "Farm.Statistics.WTUR.FarmSts",
    refreshCycle: g_head_cfg && g_head_cfg.farm_comm_status_config && parseFloat(g_head_cfg.farm_comm_status_config.refresh_cycle) ? parseFloat(g_head_cfg.farm_comm_status_config.refresh_cycle) : 5,
    updateCurFarmNode: function (nodes) {
        for (var i = 0; i < nodes.length; i++)this.curFarmNode.push(nodes[i])
    },
    updateFarmNodes: function (nodes) {
        for (var i = 0; i < nodes.length; i++)this.farmNodes.push(nodes[i])
    },
    getCurFarmNode: function () {
        return this.curFarmNode
    },
    getFarmNodes: function () {
        return this.farmNodes
    },
    getRquestParas: function () {
        var requestParas = {};
        requestParas.branch_para_list = "";
        var requestData = [];
        if (this.curFarmNode && this.curFarmNode.length > 0 && requestData.push({
                id: "wf_name",
                decimal: 0,
                key: "1:61:" + this.curFarmNode[0].alias + "." + this.aliasSuffix + ":9"
            }), "none" != $("div#envNavTreeDiv").css("display") && this.farmNodes && this.farmNodes.length > 0)for (var i = 0; i < this.farmNodes.length; i++) {
            var temp = this.farmNodes[i];
            requestData.push({id: temp.tId, decimal: 0, key: "1:61:" + temp.alias + "." + this.aliasSuffix + ":9"})
        }
        return requestParas.data = requestData, requestParas.data.length > 0 ? requestParas : null
    },
    getFarmCommSts: function () {
        if (this.ifEnabled) {
            var requestParas = this.getRquestParas();
            requestParas ? ws_get_dyndata_central(requestParas, this.handleFarmCommSts, this.requestError) : this.startTimer()
        }
    },
    handleFarmCommSts: function (result) {
        if (result && result.code && "10000" == result.code.toString() && result.data && result.data.length > 0)for (var i = 0; i < result.data.length; i++) {
            var temp = result.data[i];
            "wf_name" == temp.id ? 1 == temp.raw_value ? $("td.wf-icon").css("background", "url(../project/images/connect_27x28.png) no-repeat center center") : 0 == temp.raw_value ? $("td.wf-icon").css("background", "url(../project/images/disconnect_27x28.png) no-repeat center center") : 2 == temp.raw_value && $("td.wf-icon").css("background", "url(../project/images/partconnect_27x28.png) no-repeat center center") : 1 == temp.raw_value ? $("#" + temp.id + "_a span.button").css("background", "url(../project/images/connect_16x16.png) no-repeat center center") : 0 == temp.raw_value ? $("#" + temp.id + "_a span.button").css("background", "url(../project/images/disconnect_16x16.png) no-repeat center center") : 2 == temp.raw_value && $("#" + temp.id + "_a span.button").css("background", "url(../project/images/partconnect_16x16.png) no-repeat center center")
        }
        farmCommSts.startTimer()
    },
    requestError: function () {
        farmCommSts.startTimer()
    },
    startTimer: function () {
        var that = this;
        this.farmCommStsTimer = setTimeout(function () {
            that.getFarmCommSts()
        }, 6e4 * that.refreshCycle)
    },
    stopTimer: function () {
        this.farmCommStsTimer && (clearInterval(this.farmCommStsTimer), this.farmCommStsTimer = null)
    }
}, $String = {
    format: function (args) {
        var vp, reg, result = arguments[0];
        if (arguments.length > 1)if (2 == arguments.length && "object" == typeof arguments[1]) {
            vp = arguments[1];
            for (var key in vp)if (void 0 != vp[key]) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, vp[key])
            }
        } else for (var i = 1; i < arguments.length; i++)void 0 != arguments[i] && (reg = new RegExp("({)" + (i - 1) + "(})", "g"), result = result.replace(reg, arguments[i]));
        return result
    }, fromRGBtoHex: function (rgb) {
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2)
        }

        return rgb >= 0 ? rgb : (rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/), rgb = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]))
    }
}, g_node_name_sort = {
    sort_tree_data: function (data) {
        data && data.data && data.data.length > 0 && this.sort_tree_node(data.data)
    },
    sort_tree_node: function (nodes) {
        var order_type = get_web_cfg("tree_sort");
        switch (order_type) {
            case"1":
                break;
            case"0":
            case"2":
            default:
                this.sort_wtglist_node(nodes)
        }
    },
    sort_wtglist_node: function (nodes) {
        var order_type = get_web_cfg("tree_sort");
        switch (order_type) {
            case"1":
            case"0":
            default:
                this.hide_wtg_order(nodes);
                break;
            case"2":
        }
        this.deal_wtg_name(nodes), nodes.sort(this.wtg_sort)
    },
    sort_wtgdata: function (nodes, option) {
        var branch_nodes = this.get_branch_nodes(nodes), leaf_nodes = branch_nodes[1], leafTop = [];
        branch_nodes = branch_nodes[0];
        for (var i = 0, l = leaf_nodes.length; i < l; i++) {
            var _o = leaf_nodes[i];
            _o.ToTop && (leafTop.push(_o), leaf_nodes.splice(i, 1), l--, i--)
        }
        return this.sort_wtglist_node(branch_nodes), option.sort_leaf && (this.sort_wtglist_node(leaf_nodes), option.is_asc || leaf_nodes.reverse()), branch_nodes.concat(leafTop, leaf_nodes)
    },
    get_branch_nodes: function (nodes) {
        for (var branch_nodes = [], leaf_nodes = [], i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            "true" != node.isLeaf ? branch_nodes.push(node) : leaf_nodes.push(node)
        }
        return [branch_nodes, leaf_nodes]
    },
    has_no_order_no: function (nodes) {
        return !0
    },
    deal_wtg_name: function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i], name = node.display_name || node["WTG.Name"];
            name = this.replace_num(name), name = this.fill_name0(name), node.order_name = name;
            var order_no = node.order_no || "";
            node.order_no = order_no.replace(/,/g, 0)
        }
    },
    hide_wtg_order: function (nodes) {
        for (var i = 0; i < nodes.length; i++)nodes[i].order_no = 0
    },
    set_tree_order: function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            node.order_no = node.level, node.array_index = i
        }
    },
    sort_wtg_alpha: function (a, b) {
        var name_a = a.order_name || a.display_name || a["WTG.Name"], name_b = b.order_name || b.display_name || b["WTG.Name"];
        return name_a.localeCompare(name_b)
    },
    sort_wtg_order_no: function (a, b) {
        var num_a = parseInt(a.order_no) || 0, num_b = parseInt(b.order_no) || 0;
        return num_a - num_b
    },
    wtg_sort: function (a, b) {
        var num_a = parseInt(a.order_no) || 0, num_b = parseInt(b.order_no) || 0;
        return num_a == num_b ? g_node_name_sort.sort_wtg_alpha(a, b) : num_a - num_b
    },
    wtg_name_sort: function (a, b) {
        return a == b ? 0 : a > b ? 1 : -1
    },
    sort_map: {"一": "1", "二": "2", "三": "3", "四": "4", "五": "5", "六": "6", "七": "7", "八": "8", "九": "9", "零": "0"},
    replace_num: function (name) {
        return $.each(this.sort_map, function (key, value) {
            var reg = new RegExp(key, "g");
            name = name.replace(reg, value)
        }), name
    },
    fill_name0: function (name) {
        var test = /([^\d]|^)(\d+)/g;
        return name.replace(test, function ($0, $1, $2) {
            return $1 + g_node_name_sort.fill_pre0($2, 4)
        })
    },
    fill_pre0: function (str, n) {
        str = str || "", str += "", n = n || 0;
        for (var new_str = [], i = 0; i < n - str.length; i++)new_str.push("0");
        str = new_str.join("") + str;
        var reg = new RegExp(".*(.{" + n + "})$");
        return str.replace(reg, "$1")
    }
};
!function () {
    function Preference(opt) {
        var option = "[object Object]" === Object.prototype.toString.call(opt) ? opt : {};
        this.cfgName = option.cfgName || "", this.description = option.description || "", this.user = option.user || ""
    }

    function get(sync, callback) {
        var _self = this, postData = {username: _self.user, type: type, is_desc: "1", description: _self.description};
        ws_user_preference("get", postData, function (result) {
            var returnData = {};
            result && "10000" === result.code && result.data && result.data.length > 0 && (data = result.data[0], ope = "update", returnData = $.extend(!0, {}, data)), "function" == typeof callback && callback(returnData, postData)
        }, null, null, sync, function (xhr, status) {
            "success" === status && 4 === xhr.readyState && 200 === xhr.status || callback({}, postData)
        })
    }

    var type = "", ope = "insert", data = {};
    Preference.prototype.isCorrectCfg = function () {
        return !!(this.cfgName && this.user && this.description)
    }, Preference.prototype.getData = function () {
        return data
    }, Preference.prototype.setData = function (d) {
        d && (d.type && d.id ? (type = d.type, ope = "update", data = d) : d.type && (type = d.type))
    }, Preference.prototype.get = function (sync, callback) {
        var _self = this;
        _self.isCorrectCfg() && (type ? get(sync, callback) : ws_user_preference_config(_self.cfgName, function (records) {
                records && "10000" === records.code && records.data && 1 === records.data.length && (type = records.data[0].type, get(sync, callback))
            }, null, sync))
    }, Preference.prototype.save = function (content, sync, callback, error, beforesend) {
        var param, _self = this;
        _self.isCorrectCfg() && type && (param = $.extend({
            content: "",
            description: _self.description,
            is_desc: "1",
            type: type,
            username: _self.user
        }, data, {content: content}), ws_user_preference(ope, param, function (record) {
            record && "10000" === record.code ? (data = param, "insert" === ope && (data.id = record.id, ope = "update"), "function" == typeof callback && callback.call(_self, data)) : "function" == typeof error && error.call(_self, data)
        }, error, beforesend, sync))
    }, window.EnvPreference = Preference
}(), function () {
    var preference = new EnvPreference({
        cfgName: "universalize_wtg_name",
        description: "universalize_wtg_name",
        user: get_local_value("username") || ""
    }), uWtgName = {
        run: function () {
            if ("undefined" == typeof localStorage.universalize_wtg_name) preference.get(!0, function (data, request) {
                !data.type && !data.id && request && request.type && (data.type = request.type), localStorage.universalize_wtg_name = JSON.stringify(data)
            }); else try {
                preference.setData(JSON.parse(localStorage.universalize_wtg_name))
            } catch (e) {
            }
        }, ui: function () {
            function U() {
            }

            var doms = {boxId: "env-wtgname-set", checkboxId: "env-wtgname-set-input"};
            return U.prototype.isChecked = function () {
                return document.getElementById(doms.checkboxId).checked
            }, U.prototype.checkedVal = function () {
                return this.isChecked() ? "1" : "0"
            }, U.prototype.gen = function () {
                var _self = this;
                preference.get(!1, function (data) {
                    Util.Dialog({
                        title: "风机名偏好配置",
                        boxID: doms.boxId,
                        width: 450,
                        height: 200,
                        fixed: !0,
                        content: 'text: <input type="checkbox" id="' + doms.checkboxId + '" ' + (data && "1" === data.content ? 'checked="checked"' : "") + '/><label for="' + doms.checkboxId + '">风机名前添加风场名</label>',
                        showbg: !0,
                        ofns: function () {
                        },
                        yesBtn: [JSLocale.submit_btn_inter.label_class, function () {
                            return confirm("成功后将刷新页面，是否继续？") && preference.save(_self.checkedVal(), !1, function (data) {
                                localStorage.universalize_wtg_name = JSON.stringify(data), Util.Dialog.close(doms.boxId), window.location.reload()
                            }), !1
                        }],
                        noBtn: [JSLocale.cancel_btn_inter.label_class, function () {
                            return !0
                        }]
                    })
                })
            }, new U
        }(), save: function (val, syn, callback, error, beforesend) {
            preference.save(val, syn, function (data) {
                localStorage.universalize_wtg_name = JSON.stringify(data), "function" == typeof callback && callback(data)
            }, error, beforesend)
        }, farmName: "", getNowFarmName: function () {
            if (this.farmName)return this.farmName;
            var farmName = this.getAliasFarmName(g_field_parm);
            return farmName ? this.farmName = farmName : ""
        }, getAliasFarmName: function (farmAlias) {
            if (window.tree_object && farmAlias) {
                var node = tree_object.getNodeByParam("alias", farmAlias);
                if (node || (node = tree_object.getNodeByParam("name", farmAlias)), node && "FACTORY" == node.node_type)return node.display_name
            }
            return ""
        }
    };
    Object.defineProperty(uWtgName, "enabled", {
        get: function () {
            var data = preference.getData(), def = !("undefined" == typeof g_head_cfg || !g_head_cfg || !g_head_cfg.set_preference || "true" !== g_head_cfg.set_preference.contain_farm);
            return data && "undefined" != typeof data.content ? "1" === data.content : def
        }
    }), window.universalizeWtgName = uWtgName, "undefined" != typeof g_head_cfg && g_head_cfg && g_head_cfg.set_preference && "true" === g_head_cfg.set_preference.enabled && universalizeWtgName.run()
}(), jQuery && function ($) {
    $.envmrset = $.envmrset || {}, $.extend(!0, $.envmrset, {
        ztree: function () {
            return $.fn.zTree
        }, getPos: function (el) {
            if ("object" != typeof el || 0 == $(el).length)return null;
            var box = el.getBoundingClientRect(), doc = el.ownerDocument, body = doc.body, html = doc.documentElement, clientTop = html.clientTop || body.clientTop || 0, clientLeft = html.clientLeft || body.clientLeft || 0, top = box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop, left = box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft;
            return [top, left]
        }, refreshZtreeMethod: function () {
            if ($.fn.zTree) {
                var _zTreeTools = function (setting, zTreeTools) {
                    zTreeTools.selectNodeWithFocusEnv = function (node, addFlag, focus) {
                        if (node && tools.uCanDo(setting)) {
                            if (addFlag = setting.view.selectedMulti && addFlag, node.parentTId) view.expandCollapseParentNode(setting, node.getParentNode(), !0, !1, function () {
                                if (focus)try {
                                    $$(node, setting).focus().blur()
                                } catch (e) {
                                }
                            }); else if (focus)try {
                                $$(node, setting).focus().blur()
                            } catch (e) {
                            }
                            view.selectNode(setting, node, addFlag)
                        }
                    }
                }, zt = $.fn.zTree, tools = zt._z.tools, view = (zt.consts, zt._z.view), data = zt._z.data;
                zt._z.event;
                data.addZTreeTools(_zTreeTools)
            }
        }
    }), $.fn.envSearchTree = function (options) {
        if ("string" == typeof options) {
            var fn = $.envmrset[options];
            if (!fn)throw"No such method: " + options;
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args)
        }
        return this.each(function () {
            options = $.extend(!0, {
                id: "",
                text: {search: ""},
                searchBox: !0,
                searchPropName: "display_name",
                treeId: [],
                treeContainer: "",
                layout: "",
                offset: null
            }, options || {});
            var _ztree = $.envmrset.ztree(), _p = options;
            if (_p.searchBox) {
                var nodeNum = 0, ischange = "";
                $.envmrset.refreshZtreeMethod();
                var searchBox = $('<input type="text" id="' + _p.id + '" name="" autocomplete="on" placeholder="' + _p.text.search + '"/>'), searchBoxBtn = $("<div><i></i></div>"), searchEvent = function () {
                    var _v = searchBox.val().trim(), searchTree = [];
                    if (_p.treeId.constructor == Array && _p.treeId.length > 0 && (searchTree = searchTree.concat(_p.treeId)), _ztree)for (var i = 0; i < searchTree.length; i++) {
                        var _t = _ztree.getZTreeObj(searchTree[i]);
                        if (_t) {
                            _t.selectNodeWithFocusEnv || _ztree._z.data.setZTreeTools(_t.setting, _t);
                            var lastSelectedNodes = _t.getSelectedNodes();
                            if (lastSelectedNodes)for (var m = 0; m < lastSelectedNodes.length; m++)_t.cancelSelectedNode(lastSelectedNodes[m]);
                            if (_v)if (nodeList = _t.getNodesByParamFuzzy(_p.searchPropName, _v), 0 != nodeList.length) {
                                for (var tempList = [], k = 0; k < nodeList.length; k++)nodeList[k].isHidden || tempList.push(nodeList[k]);
                                if (nodeList = tempList, _ztree.getZTreeObj(searchTree[i]).selectNode("all", !1), ischange != nodeList[0].id) {
                                    var node = "", expandedNodes = _ztree.getZTreeObj(searchTree[i]).getNodesByParam("open", !0);
                                    if ("" != expandedNodes)for (var k = (nodeList[0].parentTId, 1); k <= expandedNodes.length - 1; k++) {
                                        node = expandedNodes[k];
                                        for (var s = 0; s <= nodeList.length - 1; s++) {
                                            if (nodeList[s].parentTId == node.tId) {
                                                _ztree.getZTreeObj(searchTree[i]).expandNode(node, !0, !1);
                                                break
                                            }
                                            if (nodeList[s].parentTId == node.parentTId && nodeList[s].name == node.name) {
                                                _ztree.getZTreeObj(searchTree[i]).expandNode(node, !0, !1);
                                                break
                                            }
                                            _ztree.getZTreeObj(searchTree[i]).expandNode(node, !1, !0)
                                        }
                                    }
                                    for (var j = 0; j < nodeList.length; j++)_t.selectNodeWithFocusEnv(nodeList[j], !0), j >= nodeList.length - 1 && setTimeout(function () {
                                        searchBox.focus()
                                    }, 200)
                                } else for (var j = 0; j < nodeList.length; j++)_t.selectNodeWithFocusEnv(nodeList[j], !0);
                                if (0 == nodeList.length)continue;
                                if (nodeList[nodeList.length - 1].parentTId || _p.treeContainer && $(_p.treeContainer).length > 0 && $(_p.treeContainer).scrollTop(0), !$("#" + searchTree[i]).is(":hidden") && _p.treeContainer && $(_p.treeContainer).length > 0) {
                                    for (var a = $.envmrset.getPos($(_p.treeContainer)[0]), searchTimes = nodeList.length, treeNode = null; (!treeNode || treeNode.is(":hidden")) && searchTimes--;)nodeNum = ++nodeNum % nodeList.length, ischange != nodeList[0].id && (ischange = nodeList[0].id, nodeNum = 0), treeNode = $("#" + searchTree[i]).find("#" + _ztree._z.tools.$(nodeList[nodeNum], _t.setting)[0].id);
                                    setTimeout(function () {
                                        if ($(_p.treeContainer).scrollTop(0), a && treeNode && treeNode[0]) {
                                            var b = $.envmrset.getPos(treeNode[0]);
                                            $(_p.treeContainer).scrollTop(b[0] - a[0] + (isNaN(_p.offset) ? 0 : Number(_p.offset)))
                                        }
                                    }, 350)
                                }
                            } else {
                                var expandedNodes = _ztree.getZTreeObj(searchTree[i]).getNodesByParam("open", !0);
                                if ("" != expandedNodes)for (var k = 1; k <= expandedNodes.length - 1; k++)node = expandedNodes[k], _ztree.getZTreeObj(searchTree[i]).expandNode(node, !1, !0);
                                setTimeout(function () {
                                    $(_p.treeContainer).scrollTop(0), searchBox.focus()
                                }, 400), ischange = 0, alert(JSLocale.alert_no_data_inter)
                            } else {
                                var expandedNodes = _ztree.getZTreeObj(searchTree[i]).getNodesByParam("open", !0);
                                if ("" != expandedNodes)for (var k = 1; k <= expandedNodes.length - 1; k++)node = expandedNodes[k], _ztree.getZTreeObj(searchTree[i]).expandNode(node, !1, !0);
                                setTimeout(function () {
                                    $(_p.treeContainer).scrollTop(0)
                                }, 400), searchBox.val(""), ischange = 0, alert(JSLocale.alert_no_data_inter)
                            }
                        }
                    }
                };
                searchBox.on("keydown", function (e) {
                    if (e = window.event || e, 13 == e.keyCode || 13 == e.which)return searchEvent(), $(this).focus(), !1
                }), searchBoxBtn.on("click", function () {
                    return searchEvent(), searchBox.focus(), !1
                }), $('<div class="envAllTreeSearchBox"' + (_p.layout ? ' style="' + _p.layout + '"' : "") + ">").append(searchBox).append(searchBoxBtn).insertBefore($(this)).wrap('<div class="envAllTreeSearchBoxCon"></div>')
            }
        })
    }
}(jQuery), function ($) {
    $.envswitch = $.envswitch || {}, $.extend(!0, $.envswitch, {
        setParam: function (newParams) {
            return this.each(function () {
                "object" == typeof newParams && $.extend(!0, this._p, newParams)
            })
        }, destroy: function () {
            return this.each(function () {
                this.switchDom && (this.switchDom.remove(), delete this.switchDom), this._p && delete this._p
            })
        }
    }), $.fn.envSwitch = function (options) {
        if ("string" == typeof options) {
            var fn = $.envswitch[options];
            if (!fn)throw"No such method: " + options;
            var args = $.makeArray(arguments).slice(1);
            return fn.apply(this, args)
        }
        return this.each(function () {
            if (!this._p) {
                options = $.extend(!0, {
                    list: [],
                    listNameProp: "",
                    listTag: "a",
                    userName: {text: ""},
                    logout: {text: ""},
                    multiLang: !1,
                    lang: "zh",
                    direction: "end",
                    layout: ""
                }, options || {}), this._p = options;
                var c, $t = this, list = $t._p.list, u = function (item, tagName) {
                    if ("string" == typeof item)return "<" + tagName + ">" + item + "</" + tagName + ">";
                    if ("object" == typeof item && item.text) {
                        var t = "";
                        return $.each(item, function (k, v) {
                            "text" == k || "events" == k || "selected" == k || "children" == k || /^on/.test(k) || ("a" === tagName && "url" === k && (k = "href"), "class" !== tagName && "className" !== tagName || (k = "class"), t += "" != t ? " " + k + "=" + v : k + "=" + v)
                        }), t = "" != t ? tagName + " " + t : tagName, "<" + t + ">" + item.text + "</" + tagName + ">"
                    }
                    return ""
                }, ae = function (el, p, arg) {
                    "object" == typeof p.events && $.each(p.events, function (e, fn) {
                        $(el).bind(e, function (event) {
                            "function" == typeof fn && fn.apply(this, arguments || [])
                        })
                    })
                }, l = function () {
                    var t, ll = list.length;
                    if (0 === ll)return "";
                    if (t = $('<ul class="env-web-switch-ul env-web-switch-left-ul">'), $t._p.multiLang)for (var k = 0; k < ll; k++)list[k].text = list[k][$t._p.lang] || "";
                    if ($t._p.listNameProp)for (var j = 0; j < ll; j++)list[j].text = list[j][$t._p.listNameProp] || "";
                    for (var i = 0; i < ll; i++) {
                        var l = list[i], tag = u(l, $t._p.listTag);
                        tag && (tag = $(tag), tag.addClass("env-web-switch-item").appendTo(t).wrap("<li><span></span></li>"), l.selected && tag.addClass("env-web-switch-item-selected"), l.children && l.children.constructor === Array && l.children.length > 0 ? tag.addClass("env-web-switch-dropdown") : ae(tag, l))
                    }
                    return t
                }, m = function (list) {
                    var t, ll = list.length;
                    if (0 === ll)return "";
                    if (t = $("<ul>"), $t._p.multiLang)for (var k = 0; k < ll; k++)list[k].text = list[k][$t._p.lang] || "";
                    if ($t._p.listNameProp)for (var j = 0; j < ll; j++)list[j].text = list[j][$t._p.listNameProp] || "";
                    for (var i = 0; i < ll; i++) {
                        var l = list[i], tag = u(l, $t._p.listTag);
                        tag && (tag = $(tag), tag.addClass("").appendTo(t).wrap("<li></li>"), l.selected && tag.addClass(""), ae(tag, l))
                    }
                    return t
                }, r = function () {
                    var t, a = u($t._p.userName, "span"), b = u($t._p.logout, "span"), c = u("", "span"), lan = (u("English", "span"), ""), scadaLang = scada_language_config;
                    if (!a && !b && !c)return "";
                    t = $('<ul class="env-web-switch-ul env-web-switch-right-ul">');
                    var language_switch_flag = "undefined" != typeof g_web_cfg.language_switch && g_web_cfg.language_switch, langType = "undefined" == typeof g_web_cfg.languageType ? [] : g_web_cfg.languageType, $container = $(c);
                    if ($container && language_switch_flag)if (lan = getCookie("portallanguage") || getCookie("locale"), "" !== lan && null !== lan && (scada_language_config = lan.substring(0, 2).toLowerCase()), langType && langType.length > 0) {
                        scadaLang = scada_language_config;
                        for (var activeFlag = !1, i = 0; i < langType.length; i++) {
                            var type = langType[i];
                            if (type.name && type.code && type.dispName) {
                                var $lang = $('<span class="env-web-switch-lang-cnt env-web-switch-lang-' + type.name + '" lang="' + type.code + '">' + type.dispName + "</span>"), $vert = $("<span> / </span>");
                                scadaLang === type.name && ($lang.addClass("active"), activeFlag || (activeFlag = !0)), $container.append($lang), i !== langType.length - 1 && $container.append($vert), ae($lang, $t._p.switchLang)
                            }
                        }
                        !activeFlag && langType[0].code && $("span[lang=" + langType[0].code.toUpperCase() + "]").addClass("active"), $container.addClass("env-web-switch-lang").appendTo(t).wrap("<li></li>")
                    } else {
                        var lanCN = "<span class='env-web-switch-lang-cnt env-web-switch-lang-cn' lang='zh-CN'>简体中文</span>", vert = "<span> / </span>", lanEN = "<span class='env-web-switch-lang-cnt env-web-switch-lang-en' lang='en-US'>En</span>";
                        lanCN = $(lanCN), vert = $(vert), lanEN = $(lanEN), "en-US" === lan || "en" === scadaLang ? lanEN.addClass("active") : "zh-CN" === lan || "zh" === scadaLang ? lanCN.addClass("active") : lanCN.addClass("active"), $container.append(lanCN).append(vert).append(lanEN), $container.addClass("env-web-switch-lang").appendTo(t).wrap("<li></li>"), ae(lanCN, $t._p.switchLang), ae(lanEN, $t._p.switchLang)
                    }
                    var alarmPopupURL = get_web_cfg("alarm_dialog_url"), alarmProcessingURL = get_web_cfg("alarm_processing_url"), alarmConfigURL = get_web_cfg("alarm_config_url"), siteIds = "function" == typeof get_user_at_value ? get_user_at_value("mdm_farm_list") : "";
                    if (alarmPopupURL && alarmProcessingURL && siteIds.length > 0 && (t.append('<li id="alarm-num-container"></li>'), $("body").append('<div id="alarm-popup-container" style="display:none;"><iframe src="' + alarmPopupURL + "?skipURL=" + alarmProcessingURL + "&configURL=" + alarmConfigURL + "&siteIds=" + siteIds + '"></iframe></div>')), a)if (a = $(a), a.addClass("env-web-switch-user").appendTo(t).wrap("<li></li>"), $t._p.userName.children && $t._p.userName.children.constructor === Array && $t._p.userName.children.length > 0) {
                        a.html("<span>" + a.text() + "</span>").addClass("env-web-switch-user-drop");
                        var child = $('<div class="sub"></div>');
                        a.parent("li").append(child.append(m($t._p.userName.children)).append('<iframe class="env-web-switch-mask" scrolling="no" frameborder="0"> </iframe>').hide()), a.on("click", function () {
                            child.is(":hidden") ? child.fadeIn() : child.fadeOut()
                        }), $(document).on("mousedown.switch", function (e) {
                            e = window.event || e;
                            var target = e.srcElement ? e.srcElement : e.target;
                            target == a[0] || target == child[0] || $.contains(a[0], target) || $.contains(child[0], target) || child.fadeOut(0)
                        }), /msie \d+\.0/gi.test(window.navigator.userAgent) && $(document).on("mouseover click", function (e) {
                            var _o = $("iframe.env-web-switch-mask");
                            _o.each(function (i) {
                                var _i = _o.eq(i);
                                if ("block" == _i.parent().css("display")) {
                                    var _u = _i.parent().children("ul");
                                    _i.css("display", "block").width(_u.outerWidth() + "px").height(_u.outerHeight() + "px")
                                } else _i.css("display", "none")
                            })
                        })
                    } else if (ae(a, $t._p.userName), "object" == typeof $t._p.userName.events) {
                        var count = 0;
                        $.each($t._p.userName.events, function () {
                            count++
                        }), count > 0 && a.addClass("env-web-switch-user-btn")
                    }
                    return b && (t.append('<li class="env-web-switch-vert"><span></span></li>'), b = $(b), b.addClass("env-web-switch-logout").appendTo(t).wrap("<li></li>"), ae(b, $t._p.logout)), t
                };
                c = $('<div class="env-web-switch"><div class="collapse-btn"></div></div>'), $t._p.layout && c.attr("style", $t._p.layout), $($t).bind("reloadApp", function () {
                    $(this).find("div.env-web-switch div.env-web-switch-left").remove(), $('<div class="env-web-switch-left">').append(l()).appendTo(c)
                }).trigger("reloadApp"), $('<div class="env-web-switch-right">').append(r()).appendTo(c), c.append('<div class="env-web-switch-clear"></div>'), "front" === $t._p.direction ? $($t).prepend(c) : $($t).append(c), $t.switchDom = c
            }
        })
    }
}(jQuery), $.fn.load_multi_sys_memu = function (options) {
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=?([^;=]*)(;|$)"));
        return null != arr ? unescape(arr[2]) : null
    }

    function get_my_portal_group(service_list, appName_esb) {
        service_list = service_list || [];
        for (var j = 0; j < service_list.length; j++) {
            var group = service_list[j];
            group = group || {}, group = group.service || [];
            for (var i = 0; i < group.length; i++) {
                var service = group[i];
                if (service && appName_esb == service.serviceName)return service.selected = !0, group
            }
        }
        return []
    }

    function get_portal_app_name(service_list) {
        for (var app_name_list = [], i = 0; i < service_list.length; i++)app_name_list.push(service_list[i].serviceName);
        return app_name_list
    }

    function get_portal_app(service_list, app_name_list) {
        for (var temp_list = [], i = 0; i < service_list.length; i++)(0 == app_name_list.length || app_name_list.indexOf(service_list[i].id) >= 0) && temp_list.push(service_list[i]);
        return temp_list
    }

    var default_options = {
        username: "user", appName_esb: "", logout_callback: function () {
        }, lang: "en", app_list: null
    }, options = $.extend(default_options, options), now_lang = options.lang, switch_options = {};
    return options.app_list && (switch_options = {listNameProp: now_lang}), options.lang = {
        logout_str: JSLocale.logout_str,
        changePasswordUrl: JSLocale.changePasswordUrl,
        userManagerUrl: JSLocale.userManagerUrl
    }, this.each(function () {
        try {
            var service_list = localStorage.getItem("serviceList");
            service_list = service_list || "{}", service_list = JSON.parse(service_list) || [], service_list = get_my_portal_group(service_list, options.appName_esb);
            var app_name_list = get_portal_app_name(service_list);
            service_list = options.app_list || service_list, options.app_list && (service_list = get_portal_app(service_list, app_name_list));
            var portal_menu = getCookie("portalBaseUrl");
            portal_menu += localStorage.getItem("menuPath"), portal_menu = portal_menu || "";
            var portal_sub_menu = [];
            if (portal_menu && localStorage.getItem("serviceList")) {
                var user_info = {displayName: options.lang.changePasswordUrl, url: portal_menu};
                user_info[now_lang] = user_info.displayName, portal_sub_menu.push(user_info)
            }
            switch_options = $.extend({
                layout: "font-size: 15px",
                listNameProp: "displayName",
                direction: "front",
                list: service_list,
                logout: {
                    text: options.lang.logout_str, events: {
                        click: function () {
                            "function" == typeof options.logout_callback && options.logout_callback.apply(this, arguments)
                        }
                    }
                },
                switchLang: {
                    lang_text: ["简体中文", "English"],
                    lang_attr: ["zh-CN", "en-US"],
                    events: {
                        click: function () {
                            if (!$(this).hasClass("active")) {
                                $(this.parentElement).children().each(function () {
                                    $(this).removeClass("active")
                                }), $(this).addClass("active");
                                var lang = $(this).attr("lang");
                                window.setLangCookie && setLangCookie(lang), location.reload(!0)
                            }
                        }
                    }
                },
                userName: {text: options.username, children: portal_sub_menu}
            }, switch_options), $(this).envSwitch(switch_options)
        } catch (e) {
        }
    }), this.find(".env-web-switch").contextmenu(function (event) {
        return event.preventDefault(), !1
    }), this
};
var menu_id = "env_menu", wf_time_id = "wf_time", shortcut_menu_id = "env_shortcut_menu", right_id = "env_right", left_bg_id = "env_l_bg", right_bg_id = "env_r_bg", right_top_id = "env_r_top", right_cnt_id = "env_r_cnt", right_bottom_id = "env_r_bottom", bind_menu_event_map = {}, fixed_height_except_menu = 0;
window.onresize = function () {
    setTimeout(resize_menu, 1)
}, window.addEventListener ? window.addEventListener("load", function () {
        setTimeout(resize_menu, 1)
    }) : window.attachEvent && window.attachEvent("onload", function () {
        setTimeout(resize_menu, 1)
    }), function ($) {
    $.envtool = $.envtool || {}, $.extend(!0, $.envtool, {
        navTree: function (setting, treeArray, currentFarm, currentWtg) {
            if ("object" != typeof treeArray || treeArray.constructor != Array || treeArray.length <= 0)return null;
            var options = $.extend(!0, {
                data: {
                    key: {name: "display_name"},
                    simpleData: {enable: !0, pIdKey: "pid"}
                }
            }, setting || {}), t = $.fn.zTree.init($("#envNavTree"), options, treeArray);
            if (t) {
                for (var nodes = t.getNodesByParam("level", 0), temp_nodes = [], i = 0; i < nodes.length; i++)nodes[i].isHidden || temp_nodes.push(nodes[i]);
                if (nodes = temp_nodes, nodes.length > 1) {
                    var newNodes = [{
                        display_name: JSLocale.no_node_name,
                        children: t.getNodes(),
                        graph_file: "-/-",
                        open: !0,
                        icon: "../project/images/tree_1.png",
                        mdm_id: "system",
                        alias: "system"
                    }];
                    t.destroy(), t = $.fn.zTree.init($("#envNavTree"), options, newNodes)
                } else 1 == nodes.length && t.expandNode(nodes[0], !0, !1, !0)
            }
            return t
        }, getElementPos: function (el) {
            var box = el.getBoundingClientRect(), doc = el.ownerDocument, body = doc.body, html = doc.documentElement, clientTop = html.clientTop || body.clientTop || 0, clientLeft = html.clientLeft || body.clientLeft || 0, top = box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop, left = box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft;
            return {top: top, left: left}
        }
    })
}(jQuery), function ($, document) {
    function _rotate(element, deg) {
        var curDeg = $(element).data("deg") || 0;
        curDeg += deg, curDeg >= 360 && (curDeg -= 360), element.style[CSS_TRANSFORM] = "rotate(" + curDeg + "deg)", $(element).data("deg", curDeg)
    }

    function EnvLoading(element, options) {
        var _this = this, $element = $(element), options = $.extend({}, defaultOptions, options), computedStyle = document.defaultView.getComputedStyle(element, null), positionInStyle = element.style.position, isStaticPosition = "static" == computedStyle.position;
        if (isStaticPosition && (element.style.position = "relative"), this.element = element, this.options = options, this.loadingElement = $(templates)[0], this.isStaticPosition = isStaticPosition, this.positionInStyle = positionInStyle, "function" == typeof this.options.onClosed && $(this.loadingElement).addClass(classNames.closeable).find("." + classNames.closeBtn).click(function () {
                var onClosed = _this.options.onClosed;
                _this.destory(), onClosed()
            }), $element.append(this.loadingElement), null === CSS_TRANSITION) {
            var rotateElement = $(this.loadingElement).find("." + classNames.rotate)[0];
            this.timer = setInterval(function () {
                _rotate(rotateElement, 9)
            }, 50)
        }
        $(this.element).data("envLoading", this)
    }

    var classNames = {
        wrapper: "env-loading-wrapper",
        img: "env-loading-img",
        rotate: "env-loading-rotate",
        closeable: "closeable",
        closeBtn: "env-loading-close-btn"
    }, templates = ["<div class='" + classNames.wrapper + "'>", "<div class='" + classNames.img + "'>", "<div class='" + classNames.rotate + "'></div>", "</div>", "<div class='" + classNames.closeBtn + "'></div>", "</div>"].join(""), defaultOptions = {onClosed: null}, CSS_TRANSITION = function () {
        for (var prefixes = ["", "O", "ms", "Webkit", "Moz"], tempStyle = document.createElement("div").style, i = 0, len = prefixes.length; i < len; i++)if (prefixes[i] + "Transition" in tempStyle)return prefixes[i] + "Transition";
        return null
    }(), CSS_TRANSFORM = function () {
        for (var prefixes = ["", "O", "ms", "Webkit", "Moz"], tempStyle = document.createElement("div").style, i = 0, len = prefixes.length; i < len; i++)if (prefixes[i] + "Transform" in tempStyle)return prefixes[i] + "Transform";
        return null
    }();
    EnvLoading.prototype = {
        destory: function () {
            $(this.element).data("envLoading", null), $(this.loadingElement).find("." + classNames.closeBtn).unbind("click"), $(this.loadingElement).remove(), this.isStaticPosition && (this.element.style.position = this.positionInStyle), !!this.timer && clearInterval(this.timer), this.timer = null, this.element = null, this.loadingElement = null
        }
    }, $.fn.showEnvLoading = function (opt) {
        return 0 == this.length ? this : this.each(function () {
                var instance = $(this).data("envLoading");
                instance instanceof EnvLoading || (instance = new EnvLoading(this, opt))
            })
    }, $.fn.hideEnvLoading = function () {
        return 0 == this.length ? this : this.each(function () {
                var instance = $(this).data("envLoading");
                instance instanceof EnvLoading && instance.destory()
            })
    }, $.showPageLoading = function (opt) {
        var $body = $("body");
        if (null != $body && $body.length >= 0) {
            var instance = $body.data("envLoading");
            instance instanceof EnvLoading || (instance = new EnvLoading($body[0], opt))
        }
    }, $.hidePageLoading = function () {
        var $body = $("body");
        if (null != $body && $body.length >= 0) {
            var instance = $body.data("envLoading");
            instance instanceof EnvLoading && instance.destory()
        }
    }
}(jQuery, document);
//# sourceMappingURL=../../maps/static/js/common.js.map
