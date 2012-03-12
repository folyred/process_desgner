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
			p.moveTo(1,1);
			p.lineTo(width - 1, 1);
			p.lineTo(width - 1,height - 1);
			p.lineTo(1,height - 1);
		},
		shapeStyle: {
			iconHeight: 20
		}
	}
});