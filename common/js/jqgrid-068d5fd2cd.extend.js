!function($){"use strict";$.jgrid.extend({delDataFromGlobal:function(rowid){var success=!0;return this.each(function(){var $t=this;if("local"===$t.p.datatype){var id=$.jgrid.stripPref($t.p.idPrefix,rowid),pos=$t.p._index[id];void 0!==pos&&($t.p.data.splice(pos,1),delete $t.p._index[rowid],$t.refreshIndex())}}),success},updateDataFromGlobal:function(rowid,data){var success=!0;return this.each(function(){var $t=this;if("local"===$t.p.datatype){var id=$.jgrid.stripPref($t.p.idPrefix,rowid),pos=$t.p._index[id];void 0!==pos&&($t.p.data[pos]=$.extend(!0,t.p.data[pos],data))}}),success},addDataToGlobal:function(rowid,data){var success=!0;return this.each(function(){var $t=this;if("local"===$t.p.datatype){var id=$.jgrid.stripPref($t.p.idPrefix,rowid),pos=$t.p._index[id];void 0==pos&&($t.p.data.push($.extend(!0,{id:rowid},data)),$t.refreshIndex())}}),success},addDataToGlobalExtra:function(rowid,data,position,extraid){var success=!0;return this.each(function(){var $t=this;if("local"===$t.p.datatype){var id=$.jgrid.stripPref($t.p.idPrefix,rowid),pos=$t.p._index[id];if(void 0==pos){var eid=$.jgrid.stripPref($t.p.idPrefix,extraid),epos=$t.p._index[eid];void 0!=epos&&(0==epos?("before"==position?$t.p.data.unshift($.extend(!0,{id:rowid},data)):$t.p.data.splice(epos,0,$.extend(!0,{id:rowid},data)),$t.refreshIndex()):("before"==position?$t.p.data.splice(epos,0,$.extend(!0,{id:rowid},data)):$t.p.data.splice(epos+1,0,$.extend(!0,{id:rowid},data)),$t.refreshIndex()))}}}),success},setColWidth:function(iCol,newWidth,adjustGridWidth){return this.each(function(){var colName,colModel,i,nCol,$self=$(this),grid=this.grid;if("string"==typeof iCol){for(colName=iCol,colModel=$self.jqGrid("getGridParam","colModel"),i=0,nCol=colModel.length;i<nCol;i++)if(colModel[i].name===colName){iCol=i;break}if(i>=nCol)return}else if("number"!=typeof iCol)return;grid.resizing={idx:iCol},grid.headers[iCol].newWidth=newWidth,adjustGridWidth!==!1&&(grid.newWidth=grid.width+newWidth-grid.headers[iCol].width),grid.dragEnd(),adjustGridWidth!==!1&&$self.jqGrid("setGridWidth",grid.newWidth,!1)})},setColWidthAuto:function(cm,beforeSet,fn){return this.each(function(){for(var $self=$(this),p=(this.grid,this.p),colModel=p.colModel,cols=cm&&cm.constructor==Array?cm:colModel,count=0,style=$self.attr("style"),getIcol=function(name){for(var i=0,l=colModel.length;i<l;i++)if(colModel[i].name==name&&("undefined"==typeof colModel[i].hidden||0==colModel[i].hidden))return i;return-1},i=0,l=cols.length;i<l;i++){var index=getIcol(cols[i].name);index>-1&&($self.find("tr.jqgfirstrow>td:eq("+index+")").css("width","inherit"),count++)}if(0!=count){"function"==typeof beforeSet&&beforeSet.apply($(this)[0]),$self.attr("style","table-layout:auto;"+style).css("width","auto"),this.p.tblwidth=0,$("body").append('<span id="widthTest" />'),$("body").append('<style id="widthTestCss">.ui-jqgrid #'+this.id+" tr.jqgrow td{white-space: nowrap;word-wrap:normal;}</style>");for(var allWidth={},itm=0,itmCount=cols.length;itm<itmCount;itm++){var index=getIcol(cols[itm].name);if(index>-1){var tdWidth=parseInt($($self.find("tr.jqgfirstrow>td")[index]).width()),headWidth=$("#"+this.id+"_"+cols[itm].name+" div");$("#widthTest").html(headWidth.text()).css({"font-family":headWidth.css("font-family"),"font-size":headWidth.css("font-size"),"font-weight":headWidth.css("font-weight")});var maxWidth=$("#widthTest").width();maxWidth=Math.max(maxWidth,cols[itm].minWidth?cols[itm].minWidth:0),maxWidth=(tdWidth>maxWidth?tdWidth:maxWidth)+20,allWidth[cols[itm].name]=maxWidth+(cols[itm].expand||0)}}$("#widthTest").remove(),$("#widthTestCss").remove(),$self.attr("style",style).css("width","auto"),$.each(allWidth,function(key,width){"rn"==key&&(width=60),width>(isNaN(cm)?350:cm)&&(width=isNaN(cm)?350:cm),$self.jqGrid("setColWidth",key,width,!1)}),this.p.tblwidth=$self.width(),"function"==typeof fn&&fn.apply($(this)[0])}})},resizeColumnHeader:function(){return this.each(function(){var rowHight,resizeSpanHeight,headerRow=$(this).closest("div.ui-jqgrid-view").find("table.ui-jqgrid-htable>thead>tr.ui-jqgrid-labels");headerRow.find("span.ui-jqgrid-resize").each(function(){this.style.height=""}),resizeSpanHeight="height: "+headerRow.height()+"px !important; cursor: col-resize;",headerRow.find("span.ui-jqgrid-resize").each(function(){this.style.cssText=resizeSpanHeight}),rowHight=headerRow.height(),headerRow.find("div.ui-jqgrid-sortable").each(function(){$(this)})})},fixPositionsOfFrozenDivs:function(){return this.each(function(){var $rows;if("undefined"!=typeof this.grid.fbDiv){$rows=$(">div>table.ui-jqgrid-btable>tbody>tr",this.grid.bDiv),$(">table.ui-jqgrid-btable>tbody>tr",this.grid.fbDiv).each(function(i){var rowHight=$($rows[i]).height(),rowHightFrozen=$(this).height();$(this).hasClass("jqgrow")&&($(this).height(rowHight),rowHightFrozen=$(this).height(),rowHight!==rowHightFrozen&&$(this).height(rowHight+(rowHight-rowHightFrozen)))}),$(this.grid.fbDiv).height(this.grid.bDiv.clientHeight),$(this.grid.fbDiv).css($(this.grid.bDiv).position()),$(this.grid.fbDiv).scrollTop($(this.grid.bDiv).scrollTop());var _this=this;$(this.grid.fbDiv).mousewheel(function(event,delta,deltaX,deltaY){$(this).scrollTop($(this).scrollTop()-20*deltaY),$(_this.grid.bDiv).scrollTop($(this).scrollTop()-20*deltaY),event.stopPropagation(),event.preventDefault()})}"undefined"!=typeof this.grid.fhDiv&&($rows=$(">div>table.ui-jqgrid-htable>thead>tr",this.grid.hDiv),$(">table.ui-jqgrid-htable>thead>tr",this.grid.fhDiv).each(function(i){var rowHight=$($rows[i]).height(),rowHightFrozen=$(this).height();$(this).height(rowHight),rowHightFrozen=$(this).height(),rowHight!==rowHightFrozen&&$(this).height(rowHight+(rowHight-rowHightFrozen))}),$(this.grid.fhDiv).height(this.grid.hDiv.clientHeight),$(this.grid.fhDiv).css($(this.grid.hDiv).position()),$(this.grid.fhDiv).scrollTop($(this.grid.hDiv).scrollTop()),0==$(this.grid.fhDiv).height()&&$(this.grid.fhDiv).fadeOut())})},fixGboxHeight:function(){return this.each(function(){var gviewHeight=$("#gview_"+$.jgrid.jqID(this.id)).outerHeight(),pagerHeight=$(this.p.pager).outerHeight();$("#gbox_"+$.jgrid.jqID(this.id)).height(gviewHeight+pagerHeight),gviewHeight=$("#gview_"+$.jgrid.jqID(this.id)).outerHeight(),pagerHeight=$(this.p.pager).outerHeight(),$("#gbox_"+$.jgrid.jqID(this.id)).height(gviewHeight+pagerHeight)})}})}(jQuery);
//# sourceMappingURL=../../maps/common/js/jqgrid.extend.js.map