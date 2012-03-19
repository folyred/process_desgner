
/**
* Plugs
**/

(function($) {
	
	/**
	 * 获取画布的相对坐标位置
	 * @param {} pageX 相对屏幕的x坐标
	 * @param {} pageY 相对屏幕的y坐标
	 * @return {}
	 */
	$.getRelativeLocaltion = function(pageX, pageY, related){
		var relatedOffset = related.offset();
		return {
			x: pageX - relatedOffset.left,
			y: pageY - relatedOffset.top
		};
	};

	$.fn.draggable = function(options){
		var defaults = {
			target:$(this)
		};
		var opt = $.extend(defaults, options);
		$(this).unbind("dragstart").bind("dragstart", function(){return false;});
		$(this).unbind("mousedown.drag").bind("mousedown.drag", function(e){
			$(document).bind("selectstart", function(){return false;});
			var downX = e.pageX;
			var downY = e.pageY;
			var downLeft = opt.target.offset().left;
			var downTop = opt.target.offset().top;
			$(document).bind("mousemove.drag", function(e){
				var left = e.pageX - downX + downLeft;
				var top = e.pageY - downY + downTop;
				if(opt.bounding){
					var boundingleft = opt.bounding.offset().left;
					var boundingtop = opt.bounding.offset().top;
					if(left > boundingleft && top > boundingtop
						&& left < boundingleft + opt.bounding.outerWidth() - opt.target.outerWidth()
						&& top < boundingtop + opt.bounding.outerHeight() - opt.target.outerHeight()){
						opt.target.offset({
							left: left,
							top: top
						});
					}
				}else{
					opt.target.css({
						left: left,
						top: top
					});
				}
			});
			$(document).bind("mouseup.drag", function(e){
				$(document).unbind("selectstart");
				$(document).unbind("mousemove.drag");
				$(document).unbind("mouseup.drag");
			});
		});
	};
	
	
})(jQuery);

