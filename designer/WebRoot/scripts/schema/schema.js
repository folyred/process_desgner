/**
 * 图形定义Schema
 */

var schema = {
	defaultProps:{
		iconWidth: 25,
		iconHeight: 25,
		shapeStyle: {
			x: 0,
			y: 0,
			width: 100,
			height: 100
		},
		fontStyle: {
			color: "#000000",
			fontFamily: "Arial",
			fontSize: "12px",
			weight: false,
			italic: false,
			underLine: false,
			through: false
		},
		lineStyle: {
			lineColor: "#333333",
			lineWidth: 2
		},
		fillStyle: {
			backgroundColor: "#FFFFFF"
		},
		getTextBlock: function(width, height){
			return {
				x: 20,
				y: 0,
				width: width - 40,
				height: height					
			};
		}
	},
	categories:[],
	schemas: {}
};
/**
 * Init schema
 */
schema.init = function(){
	schema.categories = [];
	schema.schemas = {};
};
