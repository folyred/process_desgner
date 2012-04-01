/**
 * 图形定义Schema
 */

var schema = {
	
	/**
	 * Init schema
	 * getTextBlock
	 * getAnchors
	 * getRender (No defaults)
	 */
	init: function(){
		schema.defaults = {
			name: "",
			text: "",
			category: "",
			inLinkers: [],
			outLinkers: [],
			group: "",
			props: {
				linkable: true,
				editable: true,
				x:0,
				y:0,
				w:120,
				h:80
			},
			style: {
				lineWidth: 2,
				lineColor: "#333",
				backgroundColor: "#FFFFFF"
			},
			getTextBlock: function(props){
				return null;
			},
			getAnchors: function() {
				return [{x:.5,y:0}, {x:.5,y:1}, {x:0,y:.5}, {x:1,y:.5}];
			}
		};
		schema.categories = [];
		schema.shapes = {};
		//Add a category
		schema.categories.add = function(category){
			this.push(category)
		};
		//Add a shape
		schema.shapes.add = function(shape){
			this[shape.name] = shape;
		};
	}
};

schema.init();

