/**
 * Basic shapes
 */
 
schema.categories.push({
	name: "basic",
	text: "Basic Shape"
});

$.extend(schema.schemas, {	
	"rectangle": {
		text: "Rectangle",
		category: "basic",
		draw: function(p, width, height, lineWidth){
			p.moveTo(0, 0);
			p.lineTo(width, 0);
			p.lineTo(width, height);
			p.lineTo(0, height);
		},
		shapeStyle: {
			iconHeight: 19,
			height: 60
		}
	},
	"round": {
		text: "Round",
		category: "basic",
		draw: function(p, width, height, lineWidth){
			p.moveTo(0, height / 2);
			p.bezierCurveTo(0, -height/6, width, -height/6, width, height / 2);
			p.bezierCurveTo(width, height + height/6, 0, height + height/6, 0, height / 2);
		}
	}
});