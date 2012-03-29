/**CAJA**/

/**********************************************************
**  Default Text Block (New and awesome)
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DefaultTextBlockNew',
	name:'Text',
	defaultSize:{'w':240,'h':60},
	searchKeywords: ['text'],

	onInit: function(id) {
		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'Text',
			getBoundingBox:function(bb) {
				return {
					x:bb.x,
					y:bb.y,
					w:bb.w,
					h:bb.h
				};
			},
			wantReturn: true
		});

		lucid.plugin.setProperty('TextWrap',1);
		
		lucid.plugin.hookPropertyPostSave(id, 'Text', function(o,v) {
			var bb = lucid.plugin.getProperty(id, 'BoundingBox');
			var measurement = lucid.text.measure(v, bb);
			if(measurement.h > bb.h) {
				var vAlign = lucid.plugin.getProperty(id, 'TextVAlign');
				if(vAlign == 'middle')
					bb.y -= (measurement.h-bb.h)/2;
				else if(vAlign == 'bottom')
					bb.y -= (measurement.h-bb.h);
				
				bb.h = measurement.h;
				lucid.plugin.setProperty(id, 'BoundingBox', bb);
			}
		});
	},

	afterEditText: function(blockId) {
		var text = lucid.text.plainText(lucid.plugin.getProperty(blockId,'Text'));

		// IF YOU CAN'T FIND A NON-SPACE CHARACTER IN THE STRING, IT'S EMPTY, SO REMOVE IT
		if (text.search(/\S/) == -1) {
			lucid.plugin.deleteItem(blockId);
		}
	},

	getRenderData: function(props,type) {
		var bb = props.BoundingBox;

	    // DRAW 'T' IF SAMPLE
	    if (type == "sample") {
			var side = bb.w > bb.h ? bb.w : bb.h;
			var offset = bb.x < bb.y ? bb.x : bb.y;
	        bb = {x:offset, y:offset, w:side, h:side};
	        return [
	            {
	                FillColor:props.LineColor,
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
	                        y:bb.y + .2*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .9*bb.w,
	                        y:bb.y + .1*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .55*bb.w,
	                        y:bb.y + .1*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .55*bb.w,
	                        y:bb.y + .9*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .65*bb.w,
	                        y:bb.y + bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .35*bb.w,
	                        y:bb.y + bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .45*bb.w,
	                        y:bb.y + .9*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .45*bb.w,
	                        y:bb.y + .1*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x + .1*bb.w,
	                        y:bb.y + .1*bb.h
	                    },{
	                        Action:'line',
	                        x:bb.x,
	                        y:bb.y + .2*bb.h
	                    },{
	                        Action:'close'
	                    }
	                ]
	            }
	        ];
	    }
	    else {
	        return [
	            {
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
	}

});


/**********************************************************
**  Default Square Block
*********************************************************/


lucid.plugin.initBlockClass({
	className:'DefaultSquareBlock',
	name:'Block',
	defaultSize:{'w':160,'h':160},
	searchKeywords:['block','square','rectangle','box'],

	onInit: function(id) {
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
			}
		});
	},

	linkPoints: function() {
		return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
	},

	getRenderData: function(props,type) {
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
**  Default Note Block
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DefaultNoteBlock',
	name:'Note',
	defaultSize:{'w':160,'h':160},
	searchKeywords:['note'],
	unthemed: true,
	defaultProperties:function(){return{'FillColor':'#ffffaa'}},

	onInit: function(id) {

		lucid.plugin.setProperty('TextAlign', 'left');

		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'',
			getBoundingBox:function(bb) {
				var foldDepth = 0.2*(bb.h > bb.w ? bb.w : bb.h); // Fold Depth
				return {
					x:bb.x + .5*foldDepth,
					y:bb.y + .1*bb.h + .1*foldDepth,
					w:bb.w - foldDepth,
					h:.8*bb.h
				};
			},
			wantReturn : true
		});
	},

	linkPoints: function() {
		return [{x:.5,y:0}, {x:1,y:.5}, {x:.5,y:1}, {x:0,y:.5}];
	},

	getRenderData: function(props,type) {
		var bb = props.BoundingBox;
		var foldDepth = 0.2*(bb.h > bb.w ? bb.w : bb.h); // Fold Depth
		var shadowColor = lucid.color.darken(props.FillColor,.3);

		if(type == 'sample')
			foldDepth *= 2;

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
						x:bb.x + bb.w - foldDepth,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + foldDepth
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
			},
			{
				FillColor:shadowColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + bb.w - foldDepth,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + foldDepth
					},{
						Action:'line',
						x:bb.x + bb.w - 0.8*foldDepth,
						y:bb.y + 0.8*foldDepth
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


/**********************************************************
**  Default Important Note Block (Legacy!)
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DefaultRedNoteBlock',
	name:'Important Note',
	defaultSize:{'w':160,'h':160},
	searchKeywords:['note','important','red'],
	unthemed: true,

	onInit: function(id) {
		lucid.plugin.setProperty('TextAlign', 'left');

		lucid.plugin.addBlockTextArea(id, {
			id:'Text',
			value:'<span style="color:#ffffff; font-weight:bold;">Important Note</span>',
			getBoundingBox:function(bb) {
				var foldDepth = 0.2*(bb.h > bb.w ? bb.w : bb.h); // Fold Depth
				return {
					x:bb.x + .5*foldDepth,
					y:bb.y + .1*bb.h + .1*foldDepth,
					w:bb.w - foldDepth,
					h:.8*bb.h
				};
			},
			wantReturn : true
		});
	},

	linkPoints: function() {
		return [{x:.5,y:0}, {x:1,y:.5}, {x:.5,y:1}, {x:0,y:.5}];
	},

	getRenderData:  function(props,type) {
		var bb = props.BoundingBox;
		var foldDepth = 0.2*(bb.h > bb.w ? bb.w : bb.h); // Fold Depth
		var shadowColor = lucid.color.darken(props.FillColor,.3);

		if(type == 'sample')
			foldDepth *= 2;

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
						x:bb.x + bb.w - foldDepth,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + foldDepth
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
			},
			{
				FillColor:shadowColor,
				StrokeColor:props.LineColor,
				LineWidth:props.LineWidth,
				Actions:[
					{
						Action:'move',
						x:bb.x + bb.w - foldDepth,
						y:bb.y
					},{
						Action:'line',
						x:bb.x + bb.w,
						y:bb.y + foldDepth
					},{
						Action:'line',
						x:bb.x + bb.w - 0.8*foldDepth,
						y:bb.y + 0.8*foldDepth
					},{
						Action:'close'
					}
				]
			}
		];
	}
});


/**********************************************************
 **  Image Search Block
 *********************************************************/
lucid.plugin.initBlockClass({
	className: 'ImageSearchBlock'
	, name: 'External Image'
	, defaultSize: {'w':120,'h':120}
	, getRenderData: function(props, type) {
		var bb = props.BoundingBox;
		var url = props.URL;
		var url_tn = props.ThumbURL;

		if (!url_tn || url_tn == '')
			url_tn = url;

		if(type == 'sample' || type == 'preview') {
			url = url_tn;
		}

		return [
			{
				Image:url,
				BoundingBox: bb
			}
		];
	}
	, onInit: function(id) {
		lucid.plugin.registerProperty(id, 'service','');

		lucid.plugin.registerProperty(id, 'URL', '', function(url) {
			if(url != '' && url != null) {
				// Chrome has a bug in windows and linux - dropshadows and blurs don't work.
				// for this, we must get image data to create our own custom blur.
				// we need to get these images through our proxy so we can actually
				// read it
				if (lucid.useragent.is_chrome() && (lucid.useragent.is_win() || lucid.useragent.is_linux())) {
					if(/^http:\/\//.test(url))
						url = '/imageProxy/'+url.substr(7);
					else if(/^https:\/\//.test(url))
						url = '/imageProxy/'+url.substr(8);
				}
			}
			return url;
		});

		lucid.plugin.registerProperty(id, 'ThumbURL', '', function(url) {
			if(url != '' && url.indexOf('::') > -1) {
				url = 'http://' + url.substr(url.indexOf('::')+2);
			}
			return url;
		});
	}
	, isImageBlock: function() {
		return true;
	}
});

/**********************************************************
 **  HotSpot Block
 *********************************************************/

lucid.plugin.initBlockClass({
	className:'HotspotBlock',
	name:'Hotspot',
	searchKeywords:['ui','interface','hotspot'],
	defaultSize: {'w':120,'h':120},
	hotspot:true,
	unthemed:true,
	defaultProperties:function(){return  {'FillColor':'#00ff9966'}},
	getRenderData: function(props, type) {
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

lucid.plugin.onActivate(function() {

	lucid.plugin.addBlockToToolbox({category:'Standard', className:'DefaultTextBlockNew'});
	lucid.plugin.addBlockToToolbox({category:'Standard', className:'DefaultSquareBlock'});
	lucid.plugin.addBlockToToolbox({category:'Standard', className:'DefaultNoteBlock'});
	lucid.plugin.addBlockToToolbox({category:'Standard', className:'HotspotBlock'});

});

lucid.plugin.onDeactivate(function() {
	lucid.plugin.removeToolGroup('Standard');
});

































/**********************************************************
**  Default Text Block (Crappy and old)
*********************************************************/

lucid.plugin.initBlockClass({
	className:'DefaultTextBlock',
	name:'Text',
	defaultSize:{'w':240,'h':60},

	onInit: function(id) {
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
			}
		});
	},

	afterEditText: function(blockId) {
		var text = lucid.text.plainText(lucid.plugin.getProperty(blockId,'Text'));

		// IF YOU CAN'T FIND A NON-SPACE CHARACTER IN THE STRING, IT'S EMPTY, SO REMOVE IT
		if (text.search(/\S/) == -1) {
			lucid.plugin.deleteItem(blockId);
		}
	},

	getRenderData: function(props,type) {
		var bb = props.BoundingBox;

		return [
			{
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