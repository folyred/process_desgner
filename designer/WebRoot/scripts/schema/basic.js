/**
 * Basic shapes
 */

schema.categories.add({
	name: "basic",
	text: "Basic Shape"
});

schema.shapes.add({
	name: "rectangle",
	text: "Rectangle",
	category: "basic",
	props: {
		w: 100,
		h: 60
	},
	getTextBlock: function(props){
		
	},
	getPath: function(props){
		return [
			{
				action: "move",
				x: 0,
				y: 0
			},{
				action: "line",
				x: props.w,
				y: 0
			},{
				action: "line",
				x: props.w,
				y: props.h
			},{
				action: "line",
				x: 0,
				y: props.h
			},{
				action: 'close'
			}
		];
	}
});

schema.shapes.add({
	name: "round",
	text: "Round",
	category: "basic",
	props: {
		w: 80,
		h: 80
	},
	getTextBlock: function(props){
		
	},
	getPath: function(props){
		return [
			{
				action: "move",
				x: 0,
				y: props.h / 2
			},{
				action: "curve",
				cp1x: 0,
				cp1y: -props.h/6,
				cp2x: props.w,
				cp2y: -props.h/6,
				x: props.w,
				y: props.h/2
			},{
				action: "curve",
				cp1x: props.w,
				cp1y: props.h + props.h/6,
				cp2x: 0,
				cp2y: props.h + props.h/6,
				x: 0,
				y: props.h/2
			},{
				action: 'close'
			}
		];
	}
});

