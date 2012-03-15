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

designer.config = {
	panelItemWidth: 25,
	panelItemHeight: 25
};

designer.newId = function(){
	var random = Math.round(Math.random() * 100000000);
	var newId = (new Date().getTime() + random).toString(16);
	return newId;
};

/**
 * 初始化
 */
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
	designer.drawPanelShapes();
	
	designer.initShapeOperations();
};

/**
 * 绘制图形面板
 */
designer.drawPanelShapes = function(){
	$(".panel_item").each(function(){
		var shapeCanvas = $(this);
		var name = shapeCanvas.attr("shapeName");
		var canvas = shapeCanvas[0];
		designer.drawPanelItem(canvas, name);
		//Bind creatable
		shapeCanvas.bind("dragstart", function(){return false;});
		shapeCanvas.bind("mousedown.createnode", function(e){
			var currentShape = $(this);
			$(document).bind("selectstart.createnode", function(){return false;});
			var downX = e.pageX;
			var downY = e.pageY;
			var downLeft = shapeCanvas.offset().left;
			var downTop = shapeCanvas.offset().top;
			var createdShape;
			var canvas = $("#designer_canvas");
			var canvasleft = canvas.offset().left;
			var canvastop = canvas.offset().top;
			$(document).bind("mousemove.createnode", function(e){
				var left = e.pageX - downX + downLeft;
				var top = e.pageY - downY + downTop;
				shapeCanvas.offset({
					left: left,
					top: top
				});
				//If drag to canvas
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
				currentShape.css({
					left: "0px",
					top: "0px"
				});
				//鼠标up时，如果位置不正确，则删除已创建图形
				if(e.pageX < canvasleft || e.pageX > canvasleft + canvas.width() 
						|| e.pageY < canvas.offset().top || e.pageY > canvastop + canvas.height()){
					createdShape.remove();
				}
			});
		});
	});
};


/**
 * 初始化形状拖动
 */
designer.initShapeOperations = function(){
	var supercanvas = $("#designer_canvas");
	var canvasleft = supercanvas.offset().left;
	var canvastop = supercanvas.offset().top;
	//绑定Hover时，显示移动还是连线
	supercanvas.find("canvas").live("mousemove", function(hoverEvent){
		var currentShape = $(this);
		var currentCtx = currentShape[0].getContext("2d");
		var shapeX = currentShape.offset().left;
		var shapeY = currentShape.offset().top;
		if(currentCtx.isPointInPath(hoverEvent.pageX - shapeX, hoverEvent.pageY - shapeY)){
			currentShape.css("cursor", "move");
			//绑定拖动
			currentShape.unbind("mousedown.shapedrag").bind("mousedown.shapedrag", function(downEvent){
				$(document).bind("selectstart.shapedrag", function(){return false;});
				
				var downX = downEvent.pageX;
				var downY = downEvent.pageY;
				var downLeft = currentShape.offset().left;
				var downTop = currentShape.offset().top;
				$(document).bind("mousemove.shapedrag", function(moveEvent){
					if(moveEvent.pageX > canvasleft && moveEvent.pageX < canvasleft + supercanvas.width() 
							&& moveEvent.pageY > supercanvas.offset().top && moveEvent.pageY < canvastop + supercanvas.height()){
						var left = moveEvent.pageX - downX + downLeft + "px";
						var top = moveEvent.pageY - downY + downTop + "px";
						currentShape.css({
							left: left,
							top: top
						});
					}
				});
				$(document).bind("mouseup.shapedrag", function(){
					$(document).unbind("selectstart.shapedrag");
					$(document).unbind("mousemove.shapedrag");
					$(document).unbind("mouseup.shapedrag");
				});
			});
		}else{
			currentShape.css("cursor", "default");
			currentShape.unbind("mousedown.shapedrag")
		}
	});
};

/**
 * 绘制图形面板图形
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

/**
 * 创建形状
 * @param schemaName
 * @param centerX
 * @param centerY
 * @returns
 */
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
};



