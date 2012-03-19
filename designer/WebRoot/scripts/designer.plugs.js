
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
	$.getRelativePos = function(pageX, pageY, related){
		var relatedOffset = related.offset();
		return {
			x: pageX - relatedOffset.left,
			y: pageY - relatedOffset.top
		};
	};
	
	$.fn.draggable = function(options){
		var defaults = {
			target: $(this),
			relative: null
		};
		var opt = $.extend(defaults, options);
		$(this).unbind("dragstart").bind("dragstart", function(){return false;});
		$(this).unbind("mousedown.drag").bind("mousedown.drag", function(e){
			$(document).bind("selectstart", function(){return false;});
			if(opt.onstart){
				opt.onstart();
			}
			var downX = e.pageX;
			var downY = e.pageY;
			var downLeft = opt.target.offset().left;
			var downTop = opt.target.offset().top;
			$(document).bind("mousemove.drag", function(e){
				var moveTo = {
					x: e.pageX - downX + downLeft,
					y: e.pageY - downY + downTop
				};
				if(opt.bounding){
					var boundingleft = opt.bounding.offset().left;
					var boundingtop = opt.bounding.offset().top;
					if(moveTo.x < boundingleft && moveTo.y < boundingtop
						&& moveTo.x > boundingleft + opt.bounding.outerWidth() - opt.target.outerWidth()
						&& moveTo.y > boundingtop + opt.bounding.outerHeight() - opt.target.outerHeight()){
						return false;
					}
				}
				if(opt.relative){
					moveTo = $.getRelativePos(moveTo.x, moveTo.y, opt.relative);
				}
				opt.target.offset({
					left: moveTo.x,
					top: moveTo.y
				});
				if(opt.ondrag){
					opt.ondrag.call(opt.target, moveTo.x, moveTo.y, e.pageX, e.pageY);
				}
			});
			$(document).bind("mouseup.drag", function(e){
				if(opt.ondrop){
					opt.ondrop.call(opt.target);
				}
				$(document).unbind("selectstart");
				$(document).unbind("mousemove.drag");
				$(document).unbind("mouseup.drag");
			});
		});
	};
	
	
})(jQuery);

