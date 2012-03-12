/**
 * 图形定义Schema
 */

var schema = {
	styles:{
		shapeStyle: {
			width: 80,
			height: 80,
			iconWidth: 27,
			iconHeight: 27
		},
		fontStyle: {
			fontColor: "#000000",
			fontFamily: "Arial",
			fontSize: "12px",
			weight: false,
			italic: false,
			underLine: false,
			through: false
		},
		lineStyle: {
			lineColor: "#666666",
			lineWidth: "2"
		},
		fillStyle: {
			backgroundColor: "#FFFFFF"
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
