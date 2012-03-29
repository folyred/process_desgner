var lucid = window["lucidAPI"];/**CAJA**/
/**********************************************************
**  Process Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'ProcessBlock',
	name:'Process',
	searchKeywords: ['flowchart','process','square','rectangle'],
	defaultSize:{w:160,h:120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Process',
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y,
					w:bb.w-40,
					h:bb.h
				};
			}
		});
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


/**********************************************************
**  Decision Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DecisionBlock',
	name: 'Decision',
	searchKeywords: ['flowchart','decision','diamond'],	
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Decision',
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.25,
					y:bb.y+bb.h*.25,
					w:bb.w*.5,
					h:bb.h*.5					
				};
			}
		});
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var mx = bb.x + bb.w/2;
		var my = bb.y + bb.h/2;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:mx,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:my
					},{
						Action:'line',
						x:mx,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:my
					},{
						Action:'close'
					}
				]
			}
		];
	},
	
	lineDrawn:function(blockId, lineId, count, allowUI) {
		var value = 'Option';
		if(count == 1)
			value = 'Yes';
		if(count == 2)
			value = 'No';

		lucid.plugin.addLineTextArea(lineId, {
			id:'Text',
			value:value,
			side:0,
			location:0.5
		});
		
		if(allowUI)
			lucid.plugin.editLineTextArea(lineId, 'Text');
	}
});



/**********************************************************
**  Terminator Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'TerminatorBlock',
	name:'Terminator',
	searchKeywords: ['flowchart','terminator','oval','pill'],
	defaultSize:{'w':160,'h':80},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Terminator',
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.1,
					y:bb.y,
					w:bb.w*.8,
					h:bb.h
				};
			}
		});
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w*.8,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w*.6,bb.y,bb.w*.4,bb.h,Math.PI*-.5,Math.PI*.5)
					},{
						Action:'line',
						x:bb.x + bb.w*.2,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w*.4,bb.h,Math.PI*.5,Math.PI*1.5)
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  PredefinedProcess Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'PredefinedProcessBlock',
	name:'Predefined Process',
	searchKeywords: ['flowchart','predefined','process'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.registerProperty(id,'Side',.1);

		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Predefined Process',
			getBoundingBox:function(bb) {
				var side = lucid.plugin.getProperty(id,'Side');
				return {
					x:bb.x+bb.w*(side+.025),
					y:bb.y,
					w:bb.w*(1-2*(side+.025)),
					h:bb.h
				};
			}
		});
	},
	spatialControls:function(id) {
		return [{
			location:function() {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var side = lucid.plugin.getProperty(id, 'Side');

				return {
					x:bb.x+bb.w*side - 8,
					y:bb.y+bb.h - 8,
					w:16,
					h:16
				};
			},
			moved:function(center) {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				lucid.plugin.setProperty(id, 'Side', (center.x-bb.x)/bb.w);
			},
			path:function() {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');

				return [
					{x:bb.x+5, y:bb.y},
					{x:bb.x+bb.w/3, y:bb.y}
				];
			},
			snap:2
		}];
	},
	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			},{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + bb.w*props.Side,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w*props.Side,
						y:bb.y + bb.h
					},{
						Action:'move',
						x:bb.x + bb.w*(1-props.Side),
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w*(1-props.Side),
						y:bb.y + bb.h
					}
				]
			}
		];
	}
});



/**********************************************************
**  Document Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DocumentBlock',
	name:'Document',
	searchKeywords: ['flowchart','document','page'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Document',
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y,
					w:bb.w-40,
					h:bb.h*.9
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:.915}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x+bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x+bb.w,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:[
							{
								x1:bb.x+bb.w-(bb.w/6),					y1:bb.y+bb.h-(bb.h/6),
								x2:bb.x+bb.w-(bb.w/3-bb.w/16),			y2:bb.y+bb.h-(bb.h/6),
								x3:bb.x+bb.w-(bb.w/3),					y3:bb.y+bb.h-(bb.h/6)
							},{
								x1:bb.x+bb.w-(bb.w/3+bb.w/10),			y1:bb.y+bb.h-(bb.h/6),
								x2:bb.x+bb.w-(bb.w*2/3-bb.w/10),		y2:bb.y+bb.h,
								x3:bb.x+bb.w-(bb.w*2/3),				y3:bb.y+bb.h
							},{
								x1:bb.x+bb.w-(bb.w*2/3+bb.w/16),		y1:bb.y+bb.h,
								x2:bb.x+bb.w-(bb.w-bb.w/6),				y2:bb.y+bb.h-(bb.h/6-bb.h/6),
								x3:bb.x+bb.w-(bb.w),					y3:bb.y+bb.h-(bb.h/6)
							}
						]
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  MultiDocument Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'MultiDocumentBlock',
	name:'Multiple Documents',
	searchKeywords: ['flowchart','documents','pages','multi','multiple'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Multiple Documents', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.1+20,
					y:bb.y+bb.h*.1,
					w:bb.w*.9-40,
					h:bb.h*.8
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:.96}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		var OneDoc = function(x,y,w,h) {
			return {
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
				{
					Action:'move',
					x:x,
					y:y
				},{
					Action:'line',
					x:x+w,
					y:y
				},{
					Action:'line',
					x:x+w,
					y:y+h
				},{
					Action:'curve',
					Control:[
						{
							x1:x+w-(w/6),					y1:y+h-(h/6),
							x2:x+w-(w/3-w/16),			y2:y+h-(h/6),
							x3:x+w-(w/3),					y3:y+h-(h/6)
						},{
							x1:x+w-(w/3+w/10),			y1:y+h-(h/6),
							x2:x+w-(w*2/3-w/10),		y2:y+h,
							x3:x+w-(w*2/3),				y3:y+h
						},{
							x1:x+w-(w*2/3+w/16),		y1:y+h,
							x2:x+w-(w-w/6),				y2:y+h-(h/6-h/6),
							x3:x+w-(w),					y3:y+h-(h/6)
						}
					]
				},{
					Action:'close'
				}]
			};
		};

		return [
			OneDoc(bb.x,bb.y,bb.w*.9,bb.h*.85),
			OneDoc(bb.x+bb.w*.05,bb.y+bb.h*.075,bb.w*.9,bb.h*.85),
			OneDoc(bb.x+bb.w*.1,bb.y+bb.h*.15,bb.w*.9,bb.h*.85)
		];

	}
});



/**********************************************************
**  ManualInput Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'ManualInputBlock',
	name:'Manual Input',
	searchKeywords: ['flowchart','manual','input','trapezoid'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Manual Input', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y+bb.h*.2,
					w:bb.w-40,
					h:bb.h*.8
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:.1}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y+bb.h/6
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  Preparation Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'PreparationBlock',
	name:'Preparation',
	searchKeywords: ['flowchart','preparation','hexagon'],
	defaultSize:{w:160,h:120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Preparation', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w/6,
					y:bb.y+bb.h/6,
					w:bb.w*2/3,
					h:bb.h*2/3
				};
			}
		});
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var x1 = bb.x + bb.w * 1/5;
		var x2 = bb.x + bb.w * 4/5;
		var my = bb.y + bb.h/2;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:x1,
						y:bb.y
					},{
						Action:'line',
						x:x2,
						y:bb.y
					},{
						Action:'line',
						x:bb.x+bb.w,
						y:my
					},{
						Action:'line',
						x:x2,
						y:bb.y+bb.h
					},{
						Action:'line',
						x:x1,
						y:bb.y+bb.h
					},{
						Action:'line',
						x:bb.x,
						y:my
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


/**********************************************************
**  Data Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DataBlock',
	name:'Data (I/O)',
	searchKeywords: ['flowchart','data','input','output','i/o','rhombus','parallelogram'],
	defaultSize:{'w':160,'h':120},

	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Data', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.25,
					y:bb.y,
					w:bb.w*.5,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:.1,y:.5}, {x:.9,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + bb.w/5,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w-bb.w/5,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  Database Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DatabaseBlock',
	name:'Database',
	searchKeywords: ['flowchart','database','cylinder','tube'],
	defaultSize:{'w':120,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Database', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+10,
					y:bb.y+bb.h*.2,
					w:bb.w-20,
					h:bb.h*.7
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y+bb.h*.9
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y+bb.h*.8,bb.w,bb.h*.2,0,Math.PI)
					},{
						Action:'line',
						x:bb.x,
						y:bb.y+bb.h*.1
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w,bb.h*.2,Math.PI,Math.PI*2)
					},{
						Action:'close'
					}
				]
			},{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y+bb.h*.1
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w,bb.h*.2,0,Math.PI)
					}
				]
			}
		];
	}
});



/**********************************************************
**  DirectAccessStorage Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DirectAccessStorageBlock',
	name:'Direct Access Storage (Hard Disk)',
	searchKeywords: ['flowchart','direct','access','storage','hard','disk','cylinder','tube'],
	defaultSize:{'w':160,'h':120},
		
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Hard Disk', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.1,
					y:bb.y,
					w:bb.w*.6,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w*.9,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w*.8,bb.y,bb.w*.2,bb.h,Math.PI*-.5,Math.PI*.5)
					},{
						Action:'line',
						x:bb.x + bb.w*.1,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w*.2,bb.h,Math.PI*.5,Math.PI*1.5)
					},{
						Action:'close'
					}
				]
			},{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w*.9,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w*.8,bb.y,bb.w*.2,bb.h,Math.PI*.5,Math.PI*1.5)
					}
				]
			}
		];
	}
});



/**********************************************************
**  InternalStorage Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'InternalStorageBlock',
	name:'Internal Storage',
	searchKeywords: ['flowchart','internal','storage'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Internal Storage', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.1+20,
					y:bb.y+bb.w*.1,
					w:bb.w*.9-40,
					h:bb.h-bb.w*.1
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			},{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w/10,
						y:bb.y
					},{
						Action:'line',
						x:bb.x+bb.w/10,
						y:bb.y+bb.h
					},{
						Action:'move',
						x:bb.x,
						y:bb.y+bb.w/10
					},{
						Action:'line',
						x:bb.x+bb.w,
						y:bb.y+bb.w/10
					}
				]
			}
		];
	}
});



/**********************************************************
**  PaperTape Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'PaperTapeBlock',
	name:'Paper Tape',
	searchKeywords: ['flowchart','paper','tape','wave'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Paper Tape', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y,
					w:bb.w-40,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:.085}, {x:.5,y:.915}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				NoRounding:true,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'curve',
						Control:[
							{
								x1:bb.x+bb.w/6,					y1:bb.y+bb.h/6,
								x2:bb.x+bb.w/3-bb.w/16,			y2:bb.y+bb.h/6,
								x3:bb.x+bb.w/3,					y3:bb.y+bb.h/6
							},{
								x1:bb.x+bb.w/3+bb.w/10,			y1:bb.y+bb.h/6,
								x2:bb.x+bb.w*2/3-bb.w/10,		y2:bb.y,
								x3:bb.x+bb.w*2/3,				y3:bb.y
							},{
								x1:bb.x+bb.w*2/3+bb.w/16,		y1:bb.y,
								x2:bb.x+bb.w-bb.w/6,			y2:bb.y+bb.h/6-bb.h/6,
								x3:bb.x+bb.w,					y3:bb.y+bb.h/6
							}
						]
					},{
						Action:'line',
						x:bb.x+bb.w,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:[
							{
								x1:bb.x+bb.w-(bb.w/6),					y1:bb.y+bb.h-(bb.h/6),
								x2:bb.x+bb.w-(bb.w/3-bb.w/16),			y2:bb.y+bb.h-(bb.h/6),
								x3:bb.x+bb.w-(bb.w/3),					y3:bb.y+bb.h-(bb.h/6)
							},{
								x1:bb.x+bb.w-(bb.w/3+bb.w/10),			y1:bb.y+bb.h-(bb.h/6),
								x2:bb.x+bb.w-(bb.w*2/3-bb.w/10),		y2:bb.y+bb.h,
								x3:bb.x+bb.w-(bb.w*2/3),				y3:bb.y+bb.h
							},{
								x1:bb.x+bb.w-(bb.w*2/3+bb.w/16),		y1:bb.y+bb.h,
								x2:bb.x+bb.w-(bb.w-bb.w/6),				y2:bb.y+bb.h-(bb.h/6-bb.h/6),
								x3:bb.x+bb.w-(bb.w),					y3:bb.y+bb.h-(bb.h/6)
							}
						]
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  ManualOperation Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'ManualOperationBlock',
	name:'Manual Operation',
	searchKeywords: ['flowchart','manual','operation','trapezoid'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Manual Operation', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.25,
					y:bb.y,
					w:bb.w*.5,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:.1,y:.5}, {x:.9,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w*.8,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x + bb.w*.2,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


/**********************************************************
**  Delay Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DelayBlock',
	name:'Delay',
	searchKeywords: ['flowchart','delay','semicircle'],
	defaultSize:{'w':120,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Delay', 
			getBoundingBox:function(bb) {
				var aw = (bb.h > 2*bb.w ? bb.w : 0.5*bb.h); // arc width
				return {
					x:bb.x+10,
					y:bb.y,
					w:bb.w-aw*.5,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var aw = (bb.h > 2*bb.w ? bb.w : 0.5*bb.h); // arc width

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x+bb.w - aw,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w - 2*aw,bb.y,2*aw,bb.h,Math.PI*-.5,Math.PI*.5)
					},{
						Action:'line',
						x:bb.x,
						y:bb.y+bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  StoredData Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'StoredDataBlock',
	name:'Stored Data',
	searchKeywords: ['flowchart','stored','data'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Stored Data', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.1,
					y:bb.y,
					w:bb.w*.7,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:.9,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w*.9,bb.y,bb.w*.2,bb.h,Math.PI*1.5,Math.PI*.5)
					},{
						Action:'line',
						x:bb.x + bb.w*.1,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w*.2,bb.h,Math.PI*.5,Math.PI*1.5)
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  Merge Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'MergeBlock',
	name:'Merge',
	searchKeywords: ['flowchart','merge','triangle'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Merge', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.2,
					y:bb.y,
					w:bb.w*.6,
					h:bb.h*.6
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:.25,y:.5}, {x:.75,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w/2,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  Connector Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'ConnectorBlock',
	name:'Connector',
	searchKeywords: ['flowchart','connector','circle'],
	defaultSize:{'w':80,'h':80},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'A', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y,
					w:bb.w-40,
					h:bb.h
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y+bb.h/2
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w,bb.h,0,Math.PI*2)
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  Or Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'OrBlock',
	name:'Or',
	searchKeywords: ['flowchart','or','reticle','crosshairs'],
	defaultSize:{'w':80,'h':80},
	onInit:function(id) {},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y+bb.h/2
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w,bb.h,0,Math.PI*2)
					},{
						Action:'close'
					}
				]
			},
			{
				FillColor:null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y + bb.h/2
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h/2
					},{
						Action:'move',
						x:bb.x + bb.w/2,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w/2,
						y:bb.y + bb.h
					}
				]
			}
		];
	}
});



/**********************************************************
**  Summing Junction Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'SummingJunctionBlock',
	name:'Summing Junction',
	searchKeywords: ['flowchart','summing','junction','reticle','crosshairs'],
	defaultSize:{'w':80,'h':80},
	onInit:function(id) {},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y+bb.h/2
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w,bb.h,0,Math.PI*2)
					},{
						Action:'close'
					}
				]
			},
			{
				FillColor:null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + 0.1464*bb.w,
						y:bb.y + 0.1464*bb.h
					},{
						Action:'line',
						x:bb.x + 0.8536*bb.w,
						y:bb.y + 0.8536*bb.h
					},{
						Action:'move',
						x:bb.x + 0.8536*bb.w,
						y:bb.y + 0.1464*bb.h
					},{
						Action:'line',
						x:bb.x + 0.1464*bb.w,
						y:bb.y + 0.8536*bb.h
					}
				]
			}
		];
	}
});



/**********************************************************
**  Display Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DisplayBlock',
	name:'Display',
	searchKeywords: ['flowchart','display','tag'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Display', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+bb.w*.25,
					y:bb.y+bb.h*.25,
					w:bb.w*.6,
					h:bb.h*.5
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var x1 = bb.x + bb.w * 1/5;
		var x2 = bb.x + bb.w * .9;
		var my = bb.y + bb.h/2;
		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:x1,
						y:bb.y
					},{
						Action:'line',
						x:x2,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w*.8, bb.y, bb.w*.2, bb.h, Math.PI*3/2, Math.PI*5/2)
					},{
						Action:'line',
						x:x1,
						y:bb.y+bb.h
					},{
						Action:'line',
						x:bb.x,
						y:my
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


/**********************************************************
**  OffPageLink Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'OffPageLinkBlock',
	name:'Off-Page Link',
	searchKeywords: ['flowchart','offpage','off','page','link'],
	defaultSize:{'w':120,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Off-Page Link', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+10,
					y:bb.y,
					w:bb.w-20,
					h:bb.h*.8
				};
			}
		});
	},


	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	onCreate:function(id) {
		lucid.plugin.selectBlockLink(id);
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h*.6
					},{
						Action:'line',
						x:bb.x + bb.w/2,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h*.6
					},{
						Action:'close'
					}
				]
			}
		];
	}
});



/**********************************************************
**  Note Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'NoteBlock',
	name:'Note',
	searchKeywords: ['flowchart','note'],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Note', 
			getBoundingBox:function(bb) {
				return {
					x:bb.x+10,
					y:bb.y,
					w:bb.w-10,
					h:bb.h
				};
			},
			wantReturn:true,
			align:'left'
		});
	},


	getLinkPoints:function() {
		return [{x:0,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		var left = true;
		/*this.EachAttachedLine(function(ep1, ep2) {
			//Get the location of the non-attached end of the line coming out of this note block.
			var ep = props.Endpoint'+(ep1?'2':'1);
			if(ep.x >= bb.x+bb.w)
				left = false;
		});TODO: This and moving the actual line itself.*/

		if(left) {
			var BracketActions = [
				{
					Action:'move',
					x:bb.x+bb.w/10,
					y:bb.y
				},{
					Action:'line',
					x:bb.x,
					y:bb.y
				},{
					Action:'line',
					x:bb.x,
					y:bb.y+bb.h
				},{
					Action:'line',
					x:bb.x+bb.w/10,
					y:bb.y+bb.h
				}
			];
		}
		else {
			var BracketActions = [
				{
					Action:'move',
					x:bb.x+bb.w*.9,
					y:bb.y
				},{
					Action:'line',
					x:bb.x+bb.w,
					y:bb.y
				},{
					Action:'line',
					x:bb.x+bb.w,
					y:bb.y+bb.h
				},{
					Action:'line',
					x:bb.x+bb.w*.9,
					y:bb.y+bb.h
				}
			];
		}

		var ret = [
			{
				FillColor:props.FillColor,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			},{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:BracketActions
			}
		];

		return ret;
	}
});


/**********************************************************
**  Text Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'TextBlock',
	name:'Text',
	searchKeywords:[],
	defaultSize:{'w':160,'h':120},
	
	onInit:function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text', 
			value:'Text',
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y,
					w:bb.w-40,
					h:bb.h
				};
			},
			wantReturn:true
		});
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.FillColor,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


var mainFlowchartBlocks = [
	'ProcessBlock',
	'DecisionBlock',
	'TerminatorBlock',
	'PredefinedProcessBlock',
	'DocumentBlock',
	'MultiDocumentBlock',
	'ManualInputBlock',
	'PreparationBlock',
	'DataBlock',
	'DatabaseBlock',
	'DirectAccessStorageBlock',
	'InternalStorageBlock',
	'PaperTapeBlock',
	'ManualOperationBlock',
	'DelayBlock',
	'StoredDataBlock',
	'MergeBlock',
	'ConnectorBlock',
	'OrBlock',
	'SummingJunctionBlock',
	'DisplayBlock',
	'OffPageLinkBlock'
];

lucid.plugin.createNextBlockGroup(mainFlowchartBlocks);
lucid.plugin.createExchangeGroup(mainFlowchartBlocks);



/**********************************************************
**  SwimLane Block (legacy only)
*********************************************************/

lucid.plugin.initBlockClass({
	className:'SwimLaneBlock',
	name: 'Swim Lane',
	defaultSize:{'w':320,'h':320},
	container:true,
	onInit:function(id) {

		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Swim Lane',
			getBoundingBox:function(bb) {
				return {
					x:bb.x+20,
					y:bb.y,
					w:bb.w-40,
					h:40
				};
			}
		});
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}];
	},

	getRenderData: function(props, type) {
		var bb = props.BoundingBox;
		var titleHeight = 40;
		if(bb.h < 40)
			titleHeight = bb.h/3;

		return [
			{
				FillColor:props.FillColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + titleHeight
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + titleHeight
					},{
						Action:'close'
					}
				]
			},{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y+bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					}
				]
			}
		];
	}
});

/**********************************************************
**  Advanced SwimLane Block
*********************************************************/

function initSwimlaneBlock(horizontal) {
return {
	className:horizontal? 'AdvancedSwimLaneBlockRotated' : 'AdvancedSwimLaneBlock',
	name: 'Swim Lane',
	defaultSize:{'w':320,'h':820},
	container: true,
	rLock: true,
	hLock: true,
	vLock: true,
	moveContained: true,
	searchKeywords: ['flowchart','container','swimlane','lane'],
	beforeCreate: function (pageId,props) {
		var blocks = lucid.plugin.getChildren(pageId,function(itemId) {
			var className = lucid.plugin.getBlockClassName(itemId);
			return className && (className == 'AdvancedSwimLaneBlock' || className == 'AdvancedSwimLaneBlockRotated');
		});
		var newBlockBB = props['BoundingBox'];
		var newBlockRotation = props['Rotation'] || 0;

		for(var i in blocks) {
			var blockId = blocks[i];
			var currBlockBB = lucid.plugin.getProperty(blockId,'BoundingBox');
			//don't add a new vertical lane to an existing horizontal lane and vice versa
			var blockRotation = lucid.plugin.getProperty(blockId,'Rotation') || 0;
			if ( (blockRotation == 0 && newBlockRotation != 0) || (blockRotation != 0 && newBlockRotation == 0 ) ) {
				continue;
			}
			var newBlockBBRotated = lucid.math.Box.rotate(newBlockBB, newBlockRotation);
			var currBlockBBRotated = lucid.math.Box.rotate(currBlockBB, blockRotation);


			if (lucid.math.Box.overlap(newBlockBBRotated, currBlockBBRotated)) {

				var lanes = lucid.plugin.getProperty(blockId,'Lanes');
				var newLaneWidth = currBlockBB.w *lanes[lanes.length-1].p;
				var totalWidth = currBlockBB.w + newLaneWidth;
				var newLanes = [];
				var takenIds = [];
				var i;
				for(i=0; i<lanes.length; i++) {
					var laneData = {
						p:(currBlockBB.w*lanes[i].p)/totalWidth,
						tid: lanes[i].tid
					};
					newLanes.push(laneData);
					takenIds.push(laneData.tid);
				}

				while(lucid.array.contains(takenIds,i)){
					i++;
				}

				newLanes.push({
					p:newLaneWidth/totalWidth,
					tid: parseInt(i)
				});
				if (newLanes.length <= 50 &&  newLanes.length > 0) {
					lucid.plugin.undoBatch(function() {
						lucid.plugin.setProperty(blockId,'Lanes',newLanes);

						if (blockRotation != 0) {
							currBlockBB.x += (currBlockBB.w-totalWidth)/2;
							currBlockBB.y -= (currBlockBB.w-totalWidth)/2;
						}
						currBlockBB.w = totalWidth;
						lucid.plugin.setProperty(blockId,'BoundingBox',currBlockBB);
					});
					return false;
				}
			}
		}


		return true;
	},
	getLinkPoints:function(blockId) {
		var lanes = lucid.plugin.getProperty(blockId,'Lanes');
		var isVertical = lucid.plugin.getProperty(blockId,'Vertical');
		var currentPercent = 0;
		var ret = [];
		if(isVertical) {
			for(var i=0; i < lanes.length; i++) {
				var p = currentPercent + lanes[i].p/2;
				ret.push({x:p,y:0});
				currentPercent += lanes[i].p;
			}
		}
		else {
			for(var i=lanes.length-1; i >= 0; i--) {
				var p = currentPercent + lanes[i].p/2;
				ret.push({x:p,y:0});
				currentPercent += lanes[i].p;
			}
		}
		return ret;
	},
	spatialControls: function (blockId) {
		function getLanes() {
			var l = lucid.plugin.getProperty(blockId, 'Lanes');
			var v = lucid.plugin.getProperty(blockId,'Vertical');
			return v ? l : l.reverse();
		}

		function setLanes(lanes) {
			var v = lucid.plugin.getProperty(blockId,'Vertical');
			lucid.plugin.setProperty(blockId, 'Lanes', v ? lanes : lanes.reverse());
		}

		function resizeBoundingBox(bb,change) {
			var v = lucid.plugin.getProperty(blockId,'Vertical');

			if(change.h) {
				if(!v) {
					bb.x -= (bb.h-change.h)/2;
					bb.y += (bb.h-change.h)/2;
				}
				bb.h = change.h;
			}
			if(change.w) {
				if(!v) {
					bb.x += (bb.w-change.w)/2;
					bb.y -= (bb.w-change.w)/2;
				}
				bb.w = change.w;
			}

			lucid.plugin.setProperty(blockId, 'BoundingBox', bb);
		}

		var lanes = getLanes();

		function percentAfterLane(idx) {
			var ret = 0;
			var v = lucid.plugin.getProperty(blockId,'Vertical');
			if(!v) idx--;
			for(var i = 0; i <= idx; i++)
				ret += lanes[i].p;
			return ret;
		}

		function oneControl(idx) {
			return {
				location: function() {
					lanes = getLanes();
					var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');

					return {
						x:bb.x+bb.w*percentAfterLane(idx)-10,
						y:bb.y,
						w:20,
						h:bb.h
					};
				},
				moved: function(center) {
					lanes = getLanes();
					var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');
					var vertical = lucid.plugin.getProperty(blockId,'Vertical');
					var laneP = percentAfterLane(idx);
					var laneX = bb.x+laneP*bb.w;
					var delta = vertical? center.x - laneX :  laneX - center.x;

					if(!vertical) {
						var rotatedBB = lucid.math.Box.rotate(bb,lucid.plugin.getProperty(blockId,'Rotation'));
						var laneY = rotatedBB.y+(1-laneP)*bb.w;
					}

					var fullWidth = bb.w+delta;
					for(var i=0; i < lanes.length; i++) {
						if(i == idx)
							lanes[i].p = (lanes[i].p*bb.w + delta)/fullWidth;
						else
							lanes[i].p = (lanes[i].p*bb.w)/fullWidth;
					}

					//push/pull downstream block
					var contained = lucid.plugin.getContained(blockId);
					for(var i=0; i < contained.length; i++) {
						var itemBB  = lucid.plugin.getProperty(contained[i],'BoundingBox');
						if(!itemBB)
							continue;
						if(vertical) {
							if(itemBB.x > laneX)
								itemBB.x += delta;
						}
						else {
							if(itemBB.y > laneY)
								itemBB.y += delta;
						}
						lucid.plugin.setProperty(contained[i],'BoundingBox',itemBB);
					}

					resizeBoundingBox(bb,{w:fullWidth});
					setLanes(lanes);
				},
				path: function() {
					lanes = getLanes();
					var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');
					var v = lucid.plugin.getProperty(blockId, 'Vertical');
					var x = v? bb.x+bb.w*percentAfterLane(idx-1)+20 : bb.x+bb.w*percentAfterLane(idx+1)-20;
					return [
						{x:x, y:bb.y+bb.h/2},
						{x:v?1e8:-1e8, y:bb.y+bb.h/2}
					];
				},
				cursor:function() {
					var r = lucid.plugin.getProperty(blockId,'Rotation');
					return r ? 's-resize' : 'e-resize';
				},
				snap:true,
				color:'none'
			};
		}

		var controls = [];
		for(var i = 0; i < lanes.length; i++)
			controls.push(oneControl(i));

		//swimlane height control
		controls.push({
			location: function() {
				var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');
				return {
					x:bb.x,
					y:bb.y+bb.h-10,
					w:bb.w,
					h:20
				};
			},
			moved: function(center) {
				var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');
				resizeBoundingBox(bb,{h:bb.h-(bb.y+bb.h-center.y)});
			},
			path: function() {
				lanes = getLanes();
				var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');
				return [
					{x:bb.x+bb.w/2, y:bb.y+20+lucid.plugin.getProperty(blockId,'titleHeight',true) || 40},
					{x:bb.x+bb.w/2, y:1e8}
				];
			},
			cursor:function() {
				var v = lucid.plugin.getProperty(blockId,'Vertical');
				return v ? 's-resize' : 'e-resize';
			},
			snap:true,
			color:'none'
		});

		return controls;
	},
	dockControls: function(blockId) {

		//helper to update lanes
		var updateLanes = function(type,lanes) {
			var bb = lucid.plugin.getProperty(blockId,'BoundingBox');
			var r = lucid.plugin.getProperty(blockId,'Rotation') || 0;

			if(!lanes || !bb)
				return;

			if(type === 'add') {
				var newLaneWidth = bb.w*lanes[lanes.length-1].p;
				var totalWidth = bb.w + newLaneWidth;
				var newLanes = [];

				var takenIds = [];
				var i;
				for(i=0;i<lanes.length;i++) {
					var laneData = {
						p:(bb.w*lanes[i].p)/totalWidth,
						tid: lanes[i].tid
					};
					newLanes.push(laneData);
					takenIds.push(laneData.tid);
				}

				while(lucid.array.contains(takenIds,i)){
					i++;
				}

				newLanes.push({
						p:newLaneWidth/totalWidth,
						tid: parseInt(i)
					});
			}
			else {
				var totalWidth = bb.w*(1-lanes.pop().p);
				var newLanes = [];
				for(var i=0; i < lanes.length; i++) {
					var laneData = {
						p:(bb.w*lanes[i].p)/totalWidth,
						tid: lanes[i].tid
					};
					newLanes.push(laneData);
				}
			}

			if (newLanes.length <= 50 &&  newLanes.length > 0) {

				lucid.plugin.undoBatch(function(){
					lucid.plugin.setProperty(blockId,'Lanes',newLanes);
					if (r != 0) {
						bb.x += (bb.w-totalWidth)/2;
						bb.y -= (bb.w-totalWidth)/2;
					}
					bb.w = totalWidth;
					lucid.plugin.setProperty(blockId,'BoundingBox',bb);
				});
			}
		};


		return {
			'swimlaneCount': {
				external: true,
				label: 'Lanes',
				type: 'Spinner',
				group: 'Flowchart',
				index: 0,
				min: 1,
				max: 100,
				step: 1,
				value: function() {
					return lucid.plugin.getProperty(blockId,'Lanes').length;
				},
				change: function(newValue, programmatic) {
					var lanes = lucid.plugin.getProperty(blockId,'Lanes');
					var current = lanes.length;

					if (current < newValue) {
						for ( ; current < newValue; current++) {
							updateLanes('add', lanes);
						}
					}
					else if (current > newValue) {
						for ( ; current > newValue; current--) {
							updateLanes('remove', lanes);
						}
					}
				}
			},
			'swimlaneFlow': {
				external: true,
				label: 'Orientation',
				type: 'Select',
				group: 'Flowchart',
				index: 1,
				options: {
					0: 'Horizontal',
					1: 'Vertical'
				},
				value: function() {
					return lucid.plugin.getProperty(blockId,'Vertical');
				},
				change: function(newValue, programmatic) {
					if (newValue == '')
						return;

					var origValue = lucid.plugin.getProperty(blockId,'Vertical');
					newValue = parseInt(newValue, 10);

					if (newValue != origValue) {
						lucid.plugin.setProperty(blockId,'Vertical',newValue);
					}
				}
			},
			'swimlaneTextFlow': {
				external: true,
				label: 'Text Orientation',
				type: 'Select',
				group: 'Flowchart',
				index: 2,
				options: {
					'0': 'Horizontal',
					'1': 'Vertical'
				},
				value: function() {
					return lucid.plugin.getProperty(blockId,'VerticalText');
				},
				change: function(newValue, programmatic) {
					if (newValue == '')
						return;

					var origValue = lucid.plugin.getProperty(blockId,'VerticalText');
					newValue = parseInt(newValue, 10);

					if (newValue != origValue) {
						lucid.plugin.setProperty(blockId,'VerticalText',newValue);
					}
				}
			}
		};
	},

	onInit:function(blockId) {

		//	this.createLaneResizeControls();
		//	this.createHeightResizeControls();

		/**
		 * Lanes are vertical by default.   Horizontal lanes are rendered such that the leftmost lane becomes the top lane.
		 * The lanes array isn't actually changed to do that, but instead this flag is looked at and the render data is
		 * generated appropriately.
		 */

		var pad = 10;
		var titleHeight = 40;
		var currentStyles = null;

		//helper for changing swimlane orientation
		var setOrientation = function(wasVertical, isVertical) {

			var changeBlocksOrientation = function (orientation,bb) {
				var rotation = lucid.plugin.getProperty(blockId, 'Rotation') || 0;
				var swimLaneBB = lucid.math.Box.rotate(bb, rotation);

				var blocksToRotate = lucid.plugin.getContained(blockId);

				var rotationPoint = {x:swimLaneBB['x'] + (swimLaneBB['w']) / 2, y: (swimLaneBB['y'] + (swimLaneBB['h']) / 2)};
				lucid.array.map(blocksToRotate, function (subBlockId) {
					//rotate 90 degrees
					var blockBBtoRotate = lucid.plugin.getProperty(subBlockId,'BoundingBox');
					var blockPos = {x:blockBBtoRotate['x'], y:blockBBtoRotate['y']};
					var rotatedBlockPos = lucid.math.Point.rotate(blockPos, rotationPoint, (orientation === 'v' ? Math.PI / 2 : -Math.PI / 2));

					//flip around center Y axis because lane order reversed
					var newX = orientation === 'v' ? rotatedBlockPos.x - (2 * (rotatedBlockPos.x - ( swimLaneBB.x + (swimLaneBB.w / 2)) )) : rotatedBlockPos.x;
					var newY = orientation === 'h' ? rotatedBlockPos.y - (2 * (rotatedBlockPos.y - ( swimLaneBB.y + (swimLaneBB.h / 2)) )) : rotatedBlockPos.y;
					var newBB = {x:newX, y:newY, w:blockBBtoRotate['w'], h:blockBBtoRotate['h'], data:blockBBtoRotate['data']};

					//apply offset that makes swimlane top left corner not move
					newBB.x -= (swimLaneBB.w - swimLaneBB.h) / 2;
					newBB.y -= (swimLaneBB.h - swimLaneBB.w) / 2;

					lucid.plugin.setProperty(subBlockId, 'BoundingBox', newBB);
				});
			};

			var isVerticalText = lucid.plugin.getProperty(blockId, 'VerticalText');
			var bb = lucid.plugin.getProperty(blockId, 'BoundingBox');

			if (wasVertical != null) {  //if setting the property for the first time, don't change the objects
				changeBlocksOrientation(isVertical ? 'v' : 'h',bb);

				//Keep intent with text rotation when switching from horz to vertical swimlanes:
				// if switching from horizontal swimlane with Vertical text to a vertical swimlane, make text horizontal
				// if switching from horizontal swimlane with horizontal text to a vertical swimlane, make text vertical
				if((!wasVertical && isVertical) || (wasVertical && !isVertical)) {
					lucid.plugin.setProperty(blockId, 'VerticalText', isVerticalText? 0 : 1);
				}
			}

			lucid.plugin.setProperty(blockId, 'Rotation', isVertical ? 0 : -Math.PI / 2);

			//offset bounding box appropriately so that top left corner doesn't move.
			bb.x += isVertical ? (bb.w - bb.h) / 2 : -(bb.w - bb.h) / 2;
			bb.y += isVertical ? (bb.h - bb.w) / 2 : -(bb.h - bb.w) / 2;
			lucid.plugin.setProperty(blockId, 'BoundingBox', bb);
		};


		//helper for calculating title height
		var recalculateTitleSize = function (lanes) {
			var i = 0,
				verticalText = lucid.plugin.getProperty(blockId, 'VerticalText'),
				vertical = lucid.plugin.getProperty(blockId, 'Vertical'),
				swimLaneBB = lucid.plugin.getProperty(blockId, 'BoundingBox'),
				margin = 15;

			var maxTitleHeight = swimLaneBB.h / 3;
			titleHeight = 40;

			lucid.array.map(lucid.plugin.getBlockTextAreas(blockId), function (id, textArea) {

				if (i < lanes.length) {
					var bb = {x:0, y:0, w:swimLaneBB.w * lanes[i].p, h:10000};
					var measure = lucid.text.getSize(blockId, id, bb);
					if ((vertical && verticalText) || (!vertical && !verticalText)) {
						titleHeight = Math.min(maxTitleHeight, Math.round(Math.max(titleHeight, measure.w + margin)));
					}
					else {
						titleHeight = Math.min(maxTitleHeight, Math.round(Math.max(titleHeight, measure.h + margin)));
					}
				}
				if (i == lanes.length - 1) {
					currentStyles = lucid.text.getStyle(blockId, id);
				}
				lucid.plugin.updateBlockTextArea(blockId,id,{
					'rotation':(verticalText != !vertical) ? Math.PI / 2 : 0
				});
				i++;
			});

			lucid.plugin.setProperty(blockId, 'titleHeight', titleHeight, true);

			//rerender
			lucid.plugin.refreshBlockView(blockId);
		};

		//helper for creating lane text area
		var createLaneTextArea = function (tid) {
			lucid.plugin.addBlockTextArea(blockId, {
				id:'Lane_' + tid,
				value:lucid.text.restyle('Swim Lane',currentStyles),
				getBoundingBox:function (textid) {
					//add textid to the closure
					return function (bb) {
						var lanes = lucid.plugin.getProperty(blockId, 'Lanes');
						recalculateTitleSize(lanes);  //when textarea changes, the title of the lane needs to adjust appropriately

						//find the index for lane with "textid"
						var r;
						for (r = 0; r < lanes.length; r++) {
							if (lanes[r].tid === textid) {
								break;
							}
						}
						//if r is greater than the lanes, that text area is not displayed
						if (r >= lanes.length) {
							return null;
						}

						var vertical = lucid.plugin.getProperty(blockId, 'Vertical');
						var xOffset = 0;
						if (vertical) {
							for (var j = 0; j < r; j++) {
								xOffset += bb.w * lanes[j].p;
							}
						}
						else {  //for horizontal, block is rotated 90 degrees.  Lanes need to be reverse order so first column becomes first row.
							for (var j = lanes.length - 1; j > r; j--) {
								xOffset += bb.w * lanes[j].p;
							}
						}

						var newTextBB = {
							x:bb.x + xOffset,
							y:bb.y,
							w:bb.w * lanes[r].p,
							h:titleHeight
						};


						var verticalText = lucid.plugin.getProperty(blockId, 'VerticalText');
						if ((vertical && verticalText) || (!vertical && !verticalText)) {
							newTextBB = lucid.math.Box.rotate(newTextBB, Math.PI / 2);
						}

						return newTextBB;
					};
				}(tid)
			});
		};

		lucid.plugin.registerProperty(blockId,'Lanes', [{p:1, tid:0}],null,function (oldValue, newValue) {
			if(oldValue != newValue) {
				var textAreas = lucid.plugin.getBlockTextAreas(blockId);
				for (var i = 0; i < newValue.length; i++) {
					if (!textAreas['Lane_' + newValue[i].tid]) {
						createLaneTextArea(newValue[i].tid);
					}
				}
				recalculateTitleSize(newValue);
			}
		});

		lucid.plugin.registerProperty(blockId,'VerticalText', !horizontal? 0 : 1, null, function (oldValue, newValue) {
			if(oldValue != newValue) {
				//Orient the text correctly
				var lanes = lucid.plugin.getProperty(blockId, 'Lanes');
				var isVerticalSwimLane = lucid.plugin.getProperty(blockId, 'Vertical');
				for (var i = 0; i < lanes.length; i++) {
					lucid.plugin.updateBlockTextArea(blockId,'Lane_'+lanes[i].tid,{
						'rotation':	((isVerticalSwimLane && !newValue) || (!isVerticalSwimLane && newValue)) ? 0 : Math.PI / 2
					});
				}
				recalculateTitleSize(lanes);
			}
		});

		lucid.plugin.registerProperty(blockId,'Vertical', !horizontal? 1 : 0, null, function (oldValue, newValue) {
			if (oldValue != newValue) {
				setOrientation(oldValue, newValue);
			}
		});
	},
	getRenderData: function(props,type) {
		var lanes = props.Lanes;
		var vertical = props.Vertical || false;
		var bb = props.BoundingBox;
		var renderTitleHeight = props.titleHeight || 40;
		if(bb.h< 40)
			renderTitleHeight = bb.h/5;

		//The outer rectangle, and fill across the top.
		var ret = [{
			FillColor:props.FillColor,
			Actions:[
				{
					Action:'move',
					x:bb.x,
					y:bb.y
				},{
					Action:'line',
					x:bb.x + bb.w,
					y:bb.y
				},{
					Action:'line',
					x:bb.x + bb.w,
					y:bb.y + renderTitleHeight
				},{
					Action:'line',
					x:bb.x,
					y:bb.y + renderTitleHeight
				},{
					Action:'close'
				}
			]
		},{
			StrokeColor:props.LineColor,
			LineWidth:props.LineWidth,
			Actions:[
				{
					Action:'move',
					x:bb.x,
					y:bb.y+bb.h
				},{
					Action:'line',
					x:bb.x,
					y:bb.y
				},{
					Action:'line',
					x:bb.x + bb.w,
					y:bb.y
				},{
					Action:'line',
					x:bb.x + bb.w,
					y:bb.y + bb.h
				},{
					Action:'close'
				},{
					Action:'move',
					x:bb.x,
					y:bb.y + renderTitleHeight
				},{
					Action:'line',
					x:bb.x + bb.w,
					y:bb.y + renderTitleHeight
				}
			]
	   }];

		var drawSwimLane = function(bb) {
		   ret[1].Actions.push({Action:'move',x:bb.x,y:bb.y});
		   ret[1].Actions.push({Action:'line',x:bb.x,y:bb.y+bb.h});
		};

		//lanes grow toward origin
		var fullWidth = bb.w;
		if (vertical) {
			for(var i=0; i <lanes.length; i++) {
				bb.w = fullWidth*lanes[i].p;
				if(i > 0)
					drawSwimLane(bb);
				bb.x += fullWidth*lanes[i].p;
			}
		}
		else { //for horizontal, block is rotated 90 degrees.  Lanes need to be reverse order so first column becomes first row.
			for (var i=lanes.length-1; i >=0 ; i--){
				bb.w = fullWidth*lanes[i].p;
				if(i < lanes.length-1)
					drawSwimLane(bb);
				bb.x += fullWidth*lanes[i].p;
			}
		}
		return ret;
	}
	};
}

lucid.plugin.initBlockClass(initSwimlaneBlock());
lucid.plugin.initBlockClass(initSwimlaneBlock(true));

/**
 * Add Swimlane context menu items
 */
lucid.plugin.addContextMenuItems(function() {

	var isVisible = function(s,upDown) {
		if(!s || s.length != 1)
			return false;

		var className = lucid.plugin.getBlockClassName(s[0]);
		return className &&
			className.toLowerCase().indexOf('swimlaneblock') > -1 &&
			lucid.plugin.getProperty(s[0],'Lanes').length > 1 &&
			(upDown? !lucid.plugin.getProperty(s[0],'Vertical') : !!lucid.plugin.getProperty(s[0],'Vertical'));
	};

	var hitTestLane = function(point,props) {
		var lanes = props.Lanes,
			bb = props.BoundingBox,
			rotation = props.Rotation,
			fullWidth = bb.w,
			curX = bb.x,
			curW = 0;

		if(rotation) {
			point = lucid.math.Point.rotate(point,lucid.math.Box.center(bb),-rotation);
			for (var i=lanes.length-1;i >= 0; i--) {
				curW = fullWidth*lanes[i].p;
				if (point.x > curX && point.x < curX+curW) {
					break;
				}
				curX += curW;
			}
		}
		else {
			for (var i=0;i<lanes.length;i++) {
				curW = fullWidth*lanes[i].p;
				if (point.x > curX && point.x < curX+curW) {
					break;
				}
				curX += curW;
			}
		}
		return i;
	};

	var getLaneBB = function(idx,props,succeeding) {
		var bb = props.BoundingBox;
		var laneBB = {x:bb.x, y:bb.y, w:bb.w*props.Lanes[idx].p, h:bb.h};
		for(var i=0;i<idx;i++) {
			laneBB.x += bb.w*props.Lanes[i].p;
		}
		if(succeeding)
			laneBB.w = bb.w - (laneBB.x -bb.x);
		return laneBB;
	};

	var getBlocksInLane = function (laneIdx,blocks,props,succeeding) {
		var lanes = props.Lanes;
		var swimlaneBB = props.BoundingBox;

		var blocksInLane = [];
		var rotatedSwimLaneBB = lucid.math.Box.rotate(swimlaneBB,props.Rotation||0);
		var rotationPoint = {x:rotatedSwimLaneBB['x']+ (rotatedSwimLaneBB['w'])/2, y:rotatedSwimLaneBB['y']+ (rotatedSwimLaneBB['h'])/2};

		if (laneIdx > lanes.length) {
			return blocksInLane;
		}

		var laneBB = getLaneBB(laneIdx,props,succeeding);
		if(!props.Vertical) {
			//flip around center Y axis because lane order reversed
			laneBB.x += 2*((swimlaneBB.x+swimlaneBB.w/2) - (laneBB.x+laneBB.w/2));
		}
		lucid.array.map(blocks, function(subBlockId) {
			var subBlockBB = lucid.plugin.getProperty(subBlockId,'BoundingBox');
			if(!subBlockBB)
				return;
			var subBlockRot = lucid.plugin.getProperty(subBlockId,'Rotation') || 0;
			var blockBB = lucid.math.Box.rotate(subBlockBB,subBlockRot);
			if (!props.Vertical) {
				blockBB = lucid.math.Box.rotate(blockBB, Math.PI/2,rotationPoint);
			}

			if (lucid.math.Box.within(blockBB,laneBB)) {
				blocksInLane.push(subBlockId);
			}
		});
		return blocksInLane;
	};


	var moveLaneItems = function(blockId,delta,laneBlocks,props) {
		var lanes = props.Lanes;
		for (var i=0; i<laneBlocks.length; i++) {
			var blockBB = lucid.plugin.getProperty(laneBlocks[i],'BoundingBox');
			if(!blockBB)
				continue;
			if (props.Vertical)
				blockBB.x +=  delta;
			else
				blockBB.y +=  delta;
			lucid.plugin.setProperty(laneBlocks[i],'BoundingBox',blockBB);
		}
	};

	var swapLanes = function (blockId,laneIdx1, laneIdx2, props) {
		var lanes = props.Lanes;
		var swimlaneBB = props.BoundingBox;

		if (laneIdx1 > laneIdx2) {
			var tmp = laneIdx1;
			laneIdx1 = laneIdx2;
			laneIdx2 = tmp;
		}

		//move all the blocks in the lanes to the right place
		var blocks = lucid.plugin.getContained(blockId);

		var lane1Blocks = getBlocksInLane(laneIdx1,blocks,props);
		var lane2Blocks = getBlocksInLane(laneIdx2,blocks,props);
		var lane1BB =  getLaneBB(laneIdx1,props);
		var lane2BB = getLaneBB(laneIdx2,props);
		moveLaneItems(blockId,lane2BB.w,lane1Blocks,props);
		moveLaneItems(blockId,-lane1BB.w,lane2Blocks,props);

		//swap the indexes of the lanes
		if (laneIdx1 < lanes.length && laneIdx2 < lanes.length) {
			var tmp = lanes[laneIdx1];
			lanes[laneIdx1] = lanes[laneIdx2];
			lanes[laneIdx2] = tmp;
		}

		lucid.plugin.setProperty(blockId,'Lanes',lanes);

	};

	var moveLane = function(pt,s,direction) {
		if(s.length != 1 || !s[0])
			return;
		var props = lucid.plugin.getAllProperties(s[0]);
		var lastIdx = props.Lanes.length-1;
		lucid.plugin.undoBatch(function() {
			if (props.Vertical) {
				var laneIdx = hitTestLane(pt,props);
				if(direction === 'r' && laneIdx < lastIdx) { //right
					swapLanes(s[0],laneIdx,laneIdx+1,props);
				}
				else if(direction === 'l' && laneIdx > 0){ //left
					swapLanes(s[0],laneIdx,laneIdx-1,props);
				}
			}
			else {
				var laneIdx = hitTestLane(pt,props);
				if(direction === 'u' && laneIdx > 0){ //up
					swapLanes(s[0],laneIdx,laneIdx-1,props);
				}
				else if(direction === 'd' && laneIdx < lastIdx)  { //down
					swapLanes(s[0],laneIdx,laneIdx+1,props);
				}
			}
		});
	};

	return [
		{
			external: true,
			label: "Move Lane To Left",
			action: function(e,s) {
				moveLane(e,s,'l');
			},
			visible:function(s) {
				return isVisible(s);
			}
		}, {
			external: true,
			label: "Move Lane To Right",
			action: function(e,s) {
				moveLane(e,s,'r');
			},
			visible:function(s) {
				return isVisible(s);
			}
		}, {
			external: true,
			label: "Move Lane Up",
			action: function(e,s) {
				moveLane(e,s,'u');
			},
			visible:function(s) {
				return isVisible(s,true);
			}
		}, {
			external: true,
			label: "Move Lane Down",
			action: function(e,s) {
				moveLane(e,s,'d');
			},
			visible:function(s) {
				return isVisible(s,true);
			}
		},{
			external: true,
			label: "Remove Lane",
			action: function(e,s) {
				if(s.length != 1 || !s[0])
					return;
				var props = lucid.plugin.getAllProperties(s[0]);
				if(props.Lanes.length > 1) {
					lucid.plugin.undoBatch(function() {
						var laneIdx = hitTestLane(e,props);
						var oldLanes = props.Lanes;
						var laneBB = getLaneBB(laneIdx,props);

						var newLanes = [];
						var newWidth = props.BoundingBox.w*(1-oldLanes[laneIdx].p);

						//delete blocks within the lane
						var allBlocks = lucid.plugin.getContained(s[0]);
						var laneBlocks = getBlocksInLane(laneIdx,allBlocks,props);

						for(var i=0; i < laneBlocks.length; i++)
							lucid.plugin.deleteItem(laneBlocks[i]);

						if(laneIdx+1 < oldLanes.length) {
							var laneBlockToMove = getBlocksInLane(laneIdx+1,allBlocks,props,true);
							moveLaneItems(s[0],-laneBB.w,laneBlockToMove,props);
						}

						for(var i=0; i < oldLanes.length; i++) {
							if(i!=laneIdx) {
								oldLanes[i].p = (props.BoundingBox.w*oldLanes[i].p)/newWidth;
								newLanes.push(oldLanes[i]);
							}
						}

						lucid.plugin.setProperty(s[0],'Lanes',newLanes);
						if(!props.Vertical) {
							props.BoundingBox.x += (props.BoundingBox.w-newWidth)/2;
							props.BoundingBox.y -= (props.BoundingBox.w-newWidth)/2;
						}
						props.BoundingBox.w = newWidth;
						lucid.plugin.setProperty(s[0],'BoundingBox',props.BoundingBox);
					});
				}
			},
			visible:function(s) {
				if(s.length != 1 || !s[0])
					return false;

				var className = lucid.plugin.getBlockClassName(s[0]);
				return className &&
					className.toLowerCase().indexOf('swimlaneblock') > -1 &&
					lucid.plugin.getProperty(s[0],'Lanes').length > 1;
			}
		}
	];
}());

/**********************************************************
**  Rectangle Container Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'RectangleContainerBlock',
	name: 'Rectangle Container',
	defaultSize:{'w':320,'h':240},
	container: true,

	onInit:function(id) {},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	searchKeywords: ['flowchart','container','rectangle'],

	getRenderData: function(props, type) {
		var bb = props.BoundingBox;

		return [
			{
				FillColor:props.Fill ? props.FillColor : null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h
					},{
						Action:'close'
					}
				]
			}
		];
	}
});

/**********************************************************
**  Diamond Container Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DiamondContainerBlock',
	name:'Diamond Container',
	defaultSize:{'w':320,'h':240},
	container:true,
	onInit:function(id) {},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	searchKeywords: ['flowchart','container','diamond'],

	getRenderData: function(props, type) {
		var bb = props.BoundingBox;
		var mx = bb.x + bb.w/2;
		var my = bb.y + bb.h/2;

		return [
			{
				FillColor:props.Fill ? props.FillColor : null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:mx,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:my
					},{
						Action:'line',
						x:mx,
						y:bb.y + bb.h
					},{
						Action:'line',
						x:bb.x,
						y:my
					},{
						Action:'close'
					}
				]
			}
		];
	}
});

/**********************************************************
**  Rounded Rectangle Container Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'RoundedRectangleContainerBlock',
	name:'Rounded Rectangle Container',
	container: true,
	defaultSize:{'w':320,'h':240},
	onInit:function(id) {
		lucid.plugin.registerProperty(id, 'RoundCorners', 30);
	},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	searchKeywords: ['flowchart','container','rectangle','rounded'],

	spatialControls:function(id) {
		return [{
			location:function() {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var val = lucid.plugin.getProperty(id, 'RoundCorners');
				val = Math.min(val, bb.w/2, bb.h/2);
				
				return {
					x:bb.x+bb.w - val - 8,
					y:bb.y - 8,
					w:16,
					h:16
				};
			},
			moved:function(center) {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				lucid.plugin.setProperty(id, 'RoundCorners', bb.x+bb.w - center.x);
			},
			path:function() {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var max = Math.min(bb.w/2, bb.h/2);
				
				return [
					{x:bb.x+bb.w, y:bb.y},
					{x:bb.x+bb.w - max, y:bb.y}
				];
			},
			snap:2
		}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var r = type=='sample' ? bb.h/4 : props.RoundCorners;

		r = Math.min(r, bb.w/2, bb.h/2);
		
		return [
			{
				FillColor:props.Fill ? props.FillColor : null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + bb.w-r,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w-r*2,bb.y,r*2,r*2,-Math.PI/2,0)
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bb.h - r
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w-r*2,bb.y+bb.h-r*2,r*2,r*2,0, Math.PI/2)
					},{
						Action:'line',
						x:bb.x + r,
						y:bb.y + bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y+bb.h-r*2,r*2,r*2,Math.PI/2,Math.PI)
					},{
						Action:'line',
						x:bb.x,
						y:bb.y+r
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,r*2,r*2,Math.PI,Math.PI*3/2)
					},{
						Action:'close'
					}
				]
			}
		];
	}
});

/**********************************************************
**  Circle Container Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'CircleContainerBlock',
	name: 'Circle Container',
	container: true,
	defaultSize: {'w':320,'h':240},

	onInit:function(id) {},

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	searchKeywords: ['flowchart','container','circle'],

	getRenderData: function(props, type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.Fill ? props.FillColor : null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w,
						y:bb.y+bb.h/2
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w,bb.h,0,Math.PI*2)
					},{
						Action:'close'
					}
				]
			}
		];
	}
});

/**********************************************************
**  Pill Container Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'PillContainerBlock',
	name:'Pill Container',
	container: true,
	defaultSize:{'w':320,'h':240},
	onInit:function(id) {},

	searchKeywords: ['flowchart','container','oval','pill'],

	getLinkPoints:function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData: function(props,type) {
		var bb = props.BoundingBox;
		return [
			{
				FillColor:props.Fill ? props.FillColor : null,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x+bb.w*.8,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x+bb.w*.6,bb.y,bb.w*.4,bb.h,Math.PI*-.5,Math.PI*.5)
					},{
						Action:'line',
						x:bb.x + bb.w*.2,
						y:bb.y+bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bb.w*.4,bb.h,Math.PI*.5,Math.PI*1.5)
					},{
						Action:'close'
					}
				]
			}
		];
	}
});

/**********************************************************
**  Brace Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'BraceBlock',
	name: 'Double Brace',
	defaultSize:{'w':320,'h':320},
	container: true,
	onInit:function(id) {
		lucid.plugin.registerProperty(id,'Spread',0.0625);
	},

	searchKeywords: ['flowchart','container','brace','curly','bracket','double'],

	getLinkPoints:function() {
		return [{x:0,y:.5}, {x:1,y:.5}];
	},

	spatialControls:function(id) {
		return [{
			location:function() {
				var bs = lucid.plugin.getProperty(id, 'Spread');
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var hBW = bs*(bb.h > bb.w ? bb.w : bb.h);
				return {
					x:bb.x+bb.w - 2*hBW - 8,
					y:bb.y - 8,
					w:16,
					h:16
				};
			},
			moved:function(center) {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var bs = (bb.x+bb.w-center.x)/(2*(bb.h > bb.w ? bb.w : bb.h));
				lucid.plugin.setProperty(id, 'Spread', bs);
			},
			path:function() {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var hBW = 0.25*(bb.h > bb.w ? bb.w : bb.h);

				return [
					{x:bb.x+bb.w-2*hBW, y:bb.y},
					{x:bb.x+bb.w - 10, y:bb.y}
				];
			},
			snap:2
		}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var hBW = props.Spread*(bb.h > bb.w ? bb.w : bb.h); // Half Brace Width

		return [
			{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + 2*hBW,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + hBW,bb.y,hBW*2,hBW*2,Math.PI*1.5,Math.PI)
					},{
						Action:'line',
						x:bb.x + hBW,
						y:bb.y + bb.h/2 - hBW
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x - hBW,bb.y + bb.h/2 - 2*hBW,hBW*2,hBW*2,0,Math.PI*0.5)
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x - hBW,bb.y + bb.h/2,hBW*2,hBW*2,Math.PI*1.5,Math.PI*2)
					},{
						Action:'line',
						x:bb.x + hBW,
						y:bb.y + bb.h - hBW
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + hBW,bb.y + bb.h - 2*hBW,hBW*2,hBW*2,Math.PI,Math.PI*0.5)
					},{
						Action:'move',
						x:bb.x + bb.w - hBW*2,
						y:bb.y + bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + bb.w - 3*hBW,bb.y + bb.h - 2*hBW,hBW*2,hBW*2,Math.PI*0.5,0)
					},{
						Action:'line',
						x:bb.x + bb.w - hBW,
						y:bb.y + bb.h/2 + hBW
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + bb.w - hBW,bb.y + bb.h/2,hBW*2,hBW*2,Math.PI,Math.PI*1.5)
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + bb.w - hBW,bb.y + bb.h/2 - 2*hBW,hBW*2,hBW*2,Math.PI*0.5,Math.PI)
					},{
						Action:'line',
						x:bb.x + bb.w - hBW,
						y:bb.y + hBW
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + bb.w - 3*hBW,bb.y,hBW*2,hBW*2,Math.PI*2,Math.PI*1.5)
					}
				]
			}
		];
	}
});


/**********************************************************
**  Bracket Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'BracketBlock',
	name: 'Double Bracket',
	defaultSize:{'w':320,'h':320},
	container: true,
	onInit:function(id) {
		lucid.plugin.registerProperty(id,'Spread',0.125);
	},

	searchKeywords: ['flowchart','container','bracket','double'],

	getLinkPoints:function() {
		return [{x:0,y:.5}, {x:1,y:.5}];
	},

	spatialControls:function(id) {
		return [{
			location:function() {
				var bs = lucid.plugin.getProperty(id, 'Spread');
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var bW = bs*(bb.h > bb.w ? bb.w : bb.h);
				return {
					x:bb.x+bb.w - bW - 8,
					y:bb.y - 8,
					w:16,
					h:16
				};
			},
			moved:function(center) {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var bs = (bb.x+bb.w-center.x)/(bb.h > bb.w ? bb.w : bb.h);
				lucid.plugin.setProperty(id, 'Spread', bs);
			},
			path:function() {
				var bb = lucid.plugin.getProperty(id, 'BoundingBox');
				var bW = 0.5*(bb.h > bb.w ? bb.w : bb.h);

				return [
					{x:bb.x+bb.w-bW, y:bb.y},
					{x:bb.x+bb.w - 10, y:bb.y}
				];
			},
			snap:2
		}];
	},

	getRenderData:function(props, type) {
		var bb = props.BoundingBox;
		var bW = props.Spread*(bb.h > bb.w ? bb.w : bb.h); // Bracket Width

		return [
			{
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + bW,
						y:bb.y
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y,bW*2,bW*2,Math.PI*1.5,Math.PI)
					},{
						Action:'line',
						x:bb.x,
						y:bb.y + bb.h - bW
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x,bb.y + bb.h - 2*bW,bW*2,bW*2,Math.PI,Math.PI*0.5)
					},{
						Action:'move',
						x:bb.x + bb.w - bW,
						y:bb.y + bb.h
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + bb.w - 2*bW,bb.y + bb.h - 2*bW,bW*2,bW*2,Math.PI*0.5,0)
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + bW
					},{
						Action:'curve',
						Control:lucid.math.ellipseArcControlPoints(bb.x + bb.w - 2*bW,bb.y,bW*2,bW*2,Math.PI*2,Math.PI*1.5)
					}
				]
			}
		];
	}
});
//





lucid.plugin.onActivate(function() {
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'ProcessBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DecisionBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'TerminatorBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'PredefinedProcessBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DocumentBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'MultiDocumentBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'ManualInputBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'PreparationBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DataBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DatabaseBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DirectAccessStorageBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'InternalStorageBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'PaperTapeBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'ManualOperationBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DelayBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'StoredDataBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'MergeBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'ConnectorBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'OrBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'SummingJunctionBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'DisplayBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'OffPageLinkBlock'});
	lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'NoteBlock'});
	//lucid.plugin.addBlockToToolbox({category:'Flowchart', className:'TextBlock'}); // removed from toolbox because of default text block
//	
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'AdvancedSwimLaneBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'AdvancedSwimLaneBlockRotated'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'RectangleContainerBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'DiamondContainerBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'RoundedRectangleContainerBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'CircleContainerBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'PillContainerBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'BraceBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'BracketBlock'});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'BraceBlock', name:'BraceBlockRotated',defaultProperties:function(){return {Rotation:-Math.PI/2};}});
	lucid.plugin.addBlockToToolbox({category:'Containers', className:'BracketBlock', name:'BracketBlockRotated', defaultProperties:function(){return {Rotation:-Math.PI/2};}});
});

lucid.plugin.onDeactivate(function() {
	lucid.plugin.removeToolGroup('Flowchart');
	lucid.plugin.removeToolGroup('Containers');
});



//@ sourceURL=/js/plugins/v2/flowchart.js