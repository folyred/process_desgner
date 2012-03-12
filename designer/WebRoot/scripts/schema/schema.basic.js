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
			p.moveTo(lineWidth / 2, lineWidth / 2);
			p.lineTo(width - lineWidth / 2, lineWidth / 2);
			p.lineTo(width - lineWidth / 2, height - lineWidth / 2);
			p.lineTo(lineWidth / 2, height - lineWidth / 2);
		},
		shapeStyle: {
			iconHeight: 20
		}
	},
	"round": {
		text: "Round",
		category: "basic",
		draw: function(p, width, height, lineWidth){
			//p.arc(width / 2, height / 2, width / 2 - lineWidth, 0, Math.PI*2, true);
			p.moveTo(width / 2, lineWidth / 2);
			p.bezierCurveTo(width - lineWidth / 2, lineWidth / 2, width - lineWidth / 2, height - lineWidth / 2, width/2, height - lineWidth / 2);
			p.bezierCurveTo(lineWidth / 2, height - lineWidth / 2, lineWidth / 2, lineWidth / 2, width / 2, lineWidth / 2);
		}
	}
});