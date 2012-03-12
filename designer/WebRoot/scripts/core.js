/**
 * 核心JS
 */

function byId(id){
	return document.getElementById(id);
}

$(function(){
	designer.init();
});

var designer = function(){};

designer.init = function(){
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
	for(var key in schema.schemas){
		var scm = $.extend(true, {}, schema.styles, schema.schemas[key]);
		schema.schemas[key] = scm;
		$("#panel_" + scm.category).append("<div class='panel_box'><canvas class='panel_item' width='27' height='20' shapeName='" + key + "'></canvas></div>");
	}
	$(".panel_item").each(function(){
		var name = $(this).attr("shapeName");
		var canvas = $(this)[0];
		var ctx = canvas.getContext("2d");
		ctx.lineWidth = 1;
		ctx.beginPath();
		schema.schemas[name].draw(ctx, 26, 20);
		ctx.closePath();
		ctx.stroke();
	});
};



