/**
 * 核心JS
 */


$(function(){
	designer.init();
});

var designer = function(){};

/**
 * 渲染器
 */
designer.renderer = {
	actions: {
		move: function(data){
			this.moveTo(data.x, data.y);
		},
		line: function(data){
			this.lineTo(data.x, data.y);
		},
		curve: function(data){
			this.bezierCurveTo(data.cp1x, data.cp1y, data.cp2x, data.cp2y, data.x, data.y);
		},
		close: function(){
			this.closePath();
		}
	}
};

/**
 * 渲染路径
 * @param {} ctx
 * @param {} renderData
 */
designer.renderer.renderPath = function(ctx, renderPath){
	for(var i = 0; i < renderPath.length; i++){
		var path = renderPath[i];
		this.actions[path.action].call(ctx, path);
	}
};

designer.byId = function(id){
	return document.getElementById(id);
};

/**
 * The Designer Core Config
 */
designer.config = {
	panelItemWidth: 27,
	panelItemHeight: 27
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
	for(var key in schema.shapes){
		var shape = $.extend(true, {}, schema.defaults, schema.shapes[key]);
		schema.shapes[key] = shape;
		$("#panel_" + shape.category).append("<div class='panel_box'><canvas class='panel_item' width='"+(designer.config.panelItemWidth)+"' height='"+(designer.config.panelItemHeight)+"' shapeName='" + key + "'></canvas></div>");
	}
	//Draw panel node items
	designer.initPanelShapes();
	
};

/**
 * 绘制图形面板
 */
designer.initPanelShapes = function(){
	$(".panel_item").each(function(){
		var currentShape = $(this);
		var name = currentShape.attr("shapeName");
		var canvas = currentShape[0];
		//绘制图形
		designer.drawPanelItem(canvas, name);
		var createdShape;
		var designer_canvas = $("#designer_canvas");
		var canvasleft = designer_canvas.offset().left;
		var canvastop = designer_canvas.offset().top;
		currentShape.draggable({
			onstart: function(){
				createdShape = null;
			},
			ondrag: function(shapex, shapey, x, y){
				currentShape.css("position", "absolute");
				if(x > canvasleft && x < canvasleft + designer_canvas.width() 
					&& y > canvastop && y < canvastop + designer_canvas.height()){
					var location = $.getRelativePos(x, y, designer_canvas);
					if(!createdShape){
						createdShape = designer.createNode(name, location.x, location.y);
					}else{
						createdShape.css({
							"cursor": "move",
							left: location.x - createdShape.width()/2 + "px",
							top: location.y - createdShape.height()/2 + "px"
						});
					}
				}
			},
			ondrop: function(x, y){
				$(this).css({
					left: "0px",
					top: "0px",
					position: "relative"
				});
				//鼠标up时，如果位置不正确，则删除已创建图形
				if(x < canvasleft || x > canvasleft + designer_canvas.width() 
						|| y < canvastop || y > canvastop + designer_canvas.height()){
					if(createdShape){
						createdShape.remove();
					}
				}else{
					//形状创建后
					designer.onShapeCreated(createdShape);
				}
			}
		});
	});
};

/**
 * 绘制图形面板图形
 * @param canvas
 * @param schemeName
 */
designer.drawPanelItem = function(canvas, shapeName){
	var ctx = canvas.getContext("2d");
	var shape = schema.shapes[shapeName];
	var props = {
		w: shape.props.w,
		h: shape.props.h
	};
	//计算图标的宽高以及位移
	if(shape.props.w > shape.props.h){
		props.w = designer.config.panelItemWidth - shape.style.lineWidth * 2;
		props.h = parseInt(shape.props.h / shape.props.w * props.w);
	}else if(shape.props.w < shape.props.h){
		props.h = designer.config.panelItemHeight - shape.style.lineWidth * 2;
		props.w = parseInt(shape.props.w / shape.props.h * props.h);
	}else{
		props.h = designer.config.panelItemWidth - shape.style.lineWidth * 2;
		props.w = designer.config.panelItemHeight - shape.style.lineWidth * 2;
	}
	var translateX = (designer.config.panelItemWidth - props.w)/2;
	var translateY = (designer.config.panelItemHeight - props.h)/2;
	ctx.translate(translateX, translateY);
	
	ctx.lineWidth = shape.style.lineWidth;
	ctx.strokeStyle = shape.style.lineColor;
	ctx.fillStyle = shape.style.backgroundColor;
	ctx.beginPath();
	designer.renderer.renderPath(ctx, shape.getPath(props));
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
	var shapeWidth = scm.shapeStyle.width + scm.lineStyle.lineWidth;
	var shapeHeight = scm.shapeStyle.height + scm.lineStyle.lineWidth;
	var shapeBox = $("<div shapename='"+schemaName+"' class='shape_box' style='width:"+shapeWidth+"px; height:"+shapeHeight+"px'></div>").appendTo(container);
	var newShape = $("<canvas width='"+shapeWidth+"' height='"+shapeHeight+"'></canvas>").appendTo(shapeBox);
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
	
	//测试代码
//	ctx.font = "italic bold 13px Arial";
//	ctx.fillStyle = "#000";
//	ctx.textAlign = "center";
//    ctx.textBaseline = "middle";
//	ctx.fillText ("1 2 3 4 5 6 7 8 9 0", newShape.width() / 2 , newShape.height() / 2);
	//测试代码end
//	scm.shapeStyle.x = centerX;
//	scm.shapeStyle.y = centerY;
//	designer.addTextBlock(newShape, scm, container);
	return shapeBox;
};

/**
 * 初始化形状操作
 */
designer.onShapeCreated = function(shapeBox){
	//绑定Hover时，显示移动还是连线
	shapeBox.bind("mousemove", function(hoverEvent){
		var currentShape = $(this).find("canvas");
		var currentCtx = currentShape[0].getContext("2d");
		var shapeX = currentShape.offset().left;
		var shapeY = currentShape.offset().top;
		if(currentCtx.isPointInPath(hoverEvent.pageX - shapeX, hoverEvent.pageY - shapeY)){
			shapeBox.css("cursor", "move").draggable({relative: $("#designer_canvas")});
		}else{
			shapeBox.css("cursor", "default").draggable("disable");
		}
	});
	
	var props = schema.schemas[shapeBox.attr("shapename")];
	
	designer.createTextBlock(shapeBox, props);
};

/**
 * 创建文本框
 * @param {} shapeBox
 * @param {} props
 */
designer.createTextBlock = function(shapeBox, props){
	var tb = $("<div class='text_block' contenteditable='true'></div>").appendTo(shapeBox);
	var tbProps = props.getTextBlock(shapeBox.width(), shapeBox.height());
	tb.css({
		left: tbProps.x + props.lineStyle.lineWidth/2,
		top: tbProps.y + props.lineStyle.lineWidth/2,
		width: tbProps.width - props.lineStyle.lineWidth,
		height: tbProps.height - props.lineStyle.lineWidth
	}).html(props.text);
	tb.bind("focus", function(){
		shapeBox.unbind("mousemove").draggable("disable");
	});
	tb.focus();
};



