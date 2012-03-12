/**
 * 核心JS
 */

function byId(id){
	return document.getElementById(id);
}

$(function(){
	designer.init();
});

var designer = function(){};

designer.init = function(){
	//Init designer layout.
	$(window).bind("resize.designer", function(){
		var height = "400px";
		var winW = $(window).width();
		var shapePanelWidth = $("#shape_panel").outerWidth();
		$("#designer_canvas").width(winW - shapePanelWidth - 2);
		$(".layout").height(height);
	});
	$(window).trigger("resize.designer");
	//Init shape panel.
	for(var i = 0; i < schema.categories.length; i++){
		var cate = schema.categories[i];
		$("#shape_panel").append("<h3 class='panel_title'>" + cate.text + "</h3><div id='panel_" + cate.name + "' class='content'></div>");
	}
	//Init toolbar items.
	for(var key in schema.schemas){
		var scm = $.extend(true, {}, schema.styles, schema.schemas[key]);
		schema.schemas[key] = scm;
		var mtop = (27 - scm.shapeStyle.iconHeight) / 2;
		$("#panel_" + scm.category).append("<div class='panel_box'><canvas class='panel_item' style='margin-top:"+mtop+"px' width='"+scm.shapeStyle.iconWidth+"' height='"+scm.shapeStyle.iconHeight+"' shapeName='" + key + "'></canvas></div>");
	}
	$(".panel_item").each(function(){
		var name = $(this).attr("shapeName");
		var canvas = $(this)[0];
		designer.drawPanelItem(canvas, name);
	});
	var canvas = byId("test");
	var ctx = canvas.getContext("2d");
	var scm = schema.schemas["round"];
	ctx.lineWidth = scm.lineStyle.lineWidth;
	ctx.strokeStyle = scm.lineStyle.lineColor;
	ctx.fillStyle = scm.fillStyle.backgroundColor;
	
	ctx.beginPath();
	scm.draw(ctx, scm.shapeStyle.width, scm.shapeStyle.height, scm.lineStyle.lineWidth);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};

/**
 * 绘制图形面板节点
 * @param canvas
 * @param schemeName
 */
designer.drawPanelItem = function(canvas, schemeName){
	var ctx = canvas.getContext("2d");
	var scm = schema.schemas[schemeName];
	ctx.lineWidth = scm.lineStyle.lineWidth;
	ctx.strokeStyle = scm.lineStyle.lineColor;
	ctx.fillStyle = scm.fillStyle.backgroundColor;
	
	ctx.beginPath();
	scm.draw(ctx, scm.shapeStyle.iconWidth, scm.shapeStyle.iconHeight, scm.lineStyle.lineWidth);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};



