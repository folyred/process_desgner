/**
 * 核心JS
 */

function byId(id){
	return document.getElementById(id);
}

(function($) {
	
	$.fn.draggable = function(options){
		var defaults = {
				target:$(this)
		};
		var opt = $.extend(defaults, options);
		$(this).unbind("dragstart").bind("dragstart", function(){return false;});
		$(this).unbind("mousedown.chartdrag").bind("mousedown.chartdrag", function(e){
			$(document).unbind("selectstart").bind("selectstart", function(){return false;});
			var downX = e.pageX;
			var downY = e.pageY;
			var downLeft = opt.target.offset().left;
			var downTop = opt.target.offset().top;
			$(document).bind("mousemove.chartdrag", function(e){
				var offsetX = e.pageX - downX;
				var offsetY = e.pageY - downY;
				opt.target.offset({
					left: downLeft + offsetX,
					top: downTop + offsetY
				});
			});
			$(document).unbind("mouseup.chartdrag")
			.bind("mouseup.chartdrag", function(e){
				$(document).unbind("selectstart");
				$(document).unbind("mousemove.chartdrag");
			});
		});
	};
})(jQuery);

$(function(){
	designer.init();
});

var designer = function(){};

designer.config = {
	panelItemWidth: 25,
	panelItemHeight: 25
};

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
		$("#panel_" + scm.category).append("<div class='panel_box'><canvas class='panel_item' width='"+(designer.config.panelItemWidth + scm.lineStyle.lineWidth)+"' height='"+(designer.config.panelItemHeight + scm.lineStyle.lineWidth)+"' shapeName='" + key + "'></canvas></div>");
	}
	//Draw panel node items
	$(".panel_item").each(function(){
		var shapeCanvas = $(this);
		var name = shapeCanvas.attr("shapeName");
		var canvas = shapeCanvas[0];
		designer.drawPanelItem(canvas, name);
		//Bind creatable
		shapeCanvas.bind("dragstart", function(){return false;});
		shapeCanvas.bind("mousedown.createnode", function(e){
			$(document).bind("selectstart.createnode", function(){return false;});
			var downX = e.pageX;
			var downY = e.pageY;
			var downLeft = shapeCanvas.offset().left;
			var downTop = shapeCanvas.offset().top;
			var createdShape;
			$(document).bind("mousemove.createnode", function(e){
				var left = e.pageX - downX + downLeft;
				var top = e.pageY - downY + downTop;
				shapeCanvas.offset({
					left: left,
					top: top
				});
				//If drag to canvas
				var canvas = $("#designer_canvas");
				var canvasleft = canvas.offset().left;
				var canvastop = canvas.offset().top;
				if(e.pageX > canvasleft && e.pageX < canvasleft + canvas.width() 
					&& e.pageY > canvas.offset().top && e.pageY < canvastop + canvas.height()){
					if(!createdShape){
						createdShape = designer.createNode(name, e.pageX, e.pageY);
					}else{
						createdShape.css({
							left: e.pageX - createdShape.width()/2 + "px",
							top: e.pageY - createdShape.height()/2 + "px"
						});
					}
				}
			});
			$(document).bind("mouseup.createnode", function(e){
				$(document).unbind("selectstart.createnode");
				$(document).unbind("mousemove.createnode");
				$(document).unbind("mouseup.createnode");
			});
		});
	});
};

/**
 * 绘制图形面板节点
 * @param canvas
 * @param schemeName
 */
designer.drawPanelItem = function(canvas, schemaName){
	var ctx = canvas.getContext("2d");
	var scm = schema.schemas[schemaName];
	var translateX = (designer.config.panelItemWidth - scm.shapeStyle.iconWidth)/2 + scm.lineStyle.lineWidth / 2;
	var translateY = (designer.config.panelItemHeight - scm.shapeStyle.iconHeight)/2 + scm.lineStyle.lineWidth / 2;
	ctx.translate(translateX, translateY);
	
	ctx.lineWidth = scm.lineStyle.lineWidth;
	ctx.strokeStyle = scm.lineStyle.lineColor;
	ctx.fillStyle = scm.fillStyle.backgroundColor;
	ctx.beginPath();
	scm.draw(ctx, scm.shapeStyle.iconWidth, scm.shapeStyle.iconHeight);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};

designer.createNode = function(schemaName, centerX, centerY){
	var scm = schema.schemas[schemaName];
	
	var container = $("#designer_canvas");
	var newShape = $("<canvas width='"+(scm.shapeStyle.width + scm.lineStyle.lineWidth)+"' height='"+(scm.shapeStyle.height + scm.lineStyle.lineWidth)+"'></canvas>").appendTo(container);
	var ctx = newShape[0].getContext("2d");
	newShape.css({
		left: centerX - scm.shapeStyle.width/2 + "px",
		top: centerY - scm.shapeStyle.height/2 + "px"
	});
	var translateX = scm.lineStyle.lineWidth / 2;
	var translateY = scm.lineStyle.lineWidth / 2;
	ctx.translate(translateX, translateY);
	
	ctx.lineWidth = scm.lineStyle.lineWidth;
	ctx.strokeStyle = scm.lineStyle.lineColor;
	ctx.fillStyle = scm.fillStyle.backgroundColor;
	ctx.beginPath();
	scm.draw(ctx, scm.shapeStyle.width, scm.shapeStyle.height);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	return newShape;
}



