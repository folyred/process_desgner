
/**
 * 核心JS
 */

$(function(){
	designer.init();
	designer.events.push("initialized");
});

var designer = {
	/**
	 * 配置信息
	 */
	config: {
		panelItemWidth: 27,
		panelItemHeight: 27
	},
	/**
	 * 工具
	 */
	util: {
		getDomById: function(id){
			return document.getElementById(id);
		},
		newId: function(c1, c2){
			var random = Math.random();
			var newId = (random + new Date().getTime());
			return newId.toString(16).replace(".", "");
		}
	},
	/**
	 * 初始化
	 */
	init: function(){
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
			$("#panel_" + shape.category).append("<div class='panel_box' shapeName='" + key + "'><canvas class='panel_item' width='"+(designer.config.panelItemWidth)+"' height='"+(designer.config.panelItemHeight)+"'></canvas></div>");
		}
		//Draw panel node items
		initPanelShapes();
		/**
		 * 绘制图形面板
		 */
		function initPanelShapes(){
			$(".panel_box").each(function(){
				var currentShape = $(this);
				var name = currentShape.attr("shapeName");
				var canvas = currentShape.children()[0];
				//绘制图形
				drawPanelItem(canvas, name);
				//给图片面板绑定Draggable，可创建图形
				currentShape.draggable({
					onstart: function(){
						//currentShape.css("position", "absolute");
						var createdShape = null;
						var designer_canvas = $("#designer_canvas");
						designer_canvas.bind("mousemove.create", function(e){
							var location = $.getRelativePos(e.pageX, e.pageY, designer_canvas);
							if(createdShape == null){
								createdShape = createShape(name, location.x, location.y);
							}
							createdShape.css({
								"cursor": "move",
								left: location.x - createdShape.width()/2 + "px",
								top: location.y - createdShape.height()/2 + "px"
							});
						});
						var created = false;
						designer_canvas.bind("mouseup.create", function(e){
							created = true;
						});
						$(document).bind("mouseup.create", function(){
							$(this).unbind("mouseup.create");
							designer_canvas.unbind("mouseup.create").unbind("mousemove.create");
							if(created == false && createdShape != null){
								createdShape.remove();
							}else{
								onShapeCreated(createdShape);
							}
						});
					},
					ondrop: function(x, y){
						$(this).css({
							left: "0px",
							top: "0px"
						});
					}
				});
			});
		}
		/**
		 * 绘制图形面板图形
		 * @param canvas
		 * @param schemeName
		 */
		function drawPanelItem(canvas, shapeName){
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
			designer.painter.renderPath(ctx, shape.getPath(props));
			ctx.fill();
			ctx.stroke();
		}
		/**
		 * 创建形状
		 * @param schemaName
		 * @param centerX
		 * @param centerY
		 * @returns
		 */
		function createShape(shapeName, centerX, centerY){
			var newId = designer.util.newId();
			var shape = schema.shapes[shapeName];
			shape.props.x = centerX - shape.props.w / 2;
			shape.props.y = centerY - shape.props.h / 2;
			var shapeBox = designer.painter.appendShape(newId, shape, designer.model.maxZIndex + 1);
			designer.painter.renderShape(newId, shape);
			return shapeBox;
		}
		/**
		 * 初始化形状操作
		 */
		function onShapeCreated(shapeBox){
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
		};
	},
	/**
	 * 事件对象以及处理函数
	 * @type {}
	 */
	events: {
		push: function(eventName, eventObject){
			var eventListener = this.listeners[eventName];
			if(eventListener){
				eventListener(eventObject);
			}
		},
		listeners: {},
		addEventListener: function(listenEventName, execCallback){
			this.listeners[listenEventName] = execCallback;
		}
	},
	/**
	 * 方法定义
	 */
	addFunction: function(fnName, fnBody){
		if(designer[fnName]){
			throw "Duplicate function name!";
		}else{
			this[fnName] = fnBody;
		}
	},
	/**
	 * 对象模型
	 * @type {}
	 */
	model: {
		orderList: [],
		define: {},
		maxZIndex: 0
	},
	/**
	 * 绘制器
	 */
	painter: {
		/**
		 * 绘制器动作处理定义
		 */
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
		},
		/**
		 * 绘制路径
		 * @param {} 画布上下文
		 * @param {} renderPath 路径定义对象
		 */
		renderPath: function(ctx, renderPath){
			for(var i = 0; i < renderPath.length; i++){
				var path = renderPath[i];
				this.actions[path.action].call(ctx, path);
			}
		},
		/**
		 * 添加形状
		 * @param {} shapeId
		 * @param {} shapeObj
		 * @return {}
		 */
		appendShape: function(shapeId, shapeObj, zindex){
			var superCanvas = $("#designer_canvas");
			var canvasWidth = shapeObj.props.w * 2;
			var canvasHeight = shapeObj.props.h * 2;
			var shapeBox = $("<div id='"+shapeId+"' shapename='"+shapeObj.name+"' class='shape_box'><canvas class='shape_canvas' width='"+canvasWidth+"' height='"+canvasHeight+"'></canvas></div>").appendTo(superCanvas);
			shapeBox.css({
				left: shapeObj.props.x - shapeObj.props.x/2 + "px",
				top: shapeObj.props.y - shapeObj.props.y/2 + "px",
				"z-index": zindex
			});
			return shapeBox;
		},
		/**
		 * 绘制形状
		 * @param {} shapeObj
		 */
		renderShape: function(shapeId, shape){
			var shapeBox = $("#" + shapeId);
			var ctx = shapeBox.find(".shape_canvas")[0].getContext("2d");
			ctx.translate(shape.props.w/2, shape.props.h/2);
			
			ctx.lineWidth = shape.style.lineWidth;
			ctx.strokeStyle = shape.style.lineColor;
			ctx.fillStyle = shape.style.backgroundColor;
			ctx.beginPath();
			this.renderPath(ctx, shape.getPath(shape.props));
			ctx.fill();
			ctx.stroke();
		}
	}
};





/**
 * 创建文本框
 * @param {} shapeBox
 * @param {} props
 */
//designer.createTextBlock = function(shapeBox, props){
//	var tb = $("<div class='text_block' contenteditable='true'></div>").appendTo(shapeBox);
//	var tbProps = props.getTextBlock(shapeBox.width(), shapeBox.height());
//	tb.css({
//		left: tbProps.x + props.lineStyle.lineWidth/2,
//		top: tbProps.y + props.lineStyle.lineWidth/2,
//		width: tbProps.width - props.lineStyle.lineWidth,
//		height: tbProps.height - props.lineStyle.lineWidth
//	}).html(props.text);
//	tb.bind("focus", function(){
//		shapeBox.unbind("mousemove").draggable("disable");
//	});
//	tb.focus();
//};


/**
 * 添加设计器方法函数
 */
designer.addFunction("open", function(definition){
 	designer.model.define = definition;
 	var shapes = definition.elements.shapes;
 	designer.model.orderList = [];
 	for(var shapeId in shapes){
 		var shape = shapes[shapeId];
 		designer.model.orderList.push({id: shapeId, zindex: shape.props.zindex});
 	}
 	designer.model.orderList.sort(function compare(a, b){
 		return a.zindex - b.zindex;
 	});
});



