
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
		if(relatedOffset == null){
			relatedOffset = {left: 0, top: 0};
		}
		return {
			x: pageX - relatedOffset.left + related.scrollLeft(),
			y: pageY - relatedOffset.top + related.scrollTop()
		};
	};
	
	$.fn.draggable = function(options){
		if(typeof options == "string"){
			if(options == "disable"){
				$(this).unbind("dragstart");
				$(this).unbind("mousedown.drag");
			}
			return;
		}
		var defaults = {
			target: $(this)
		};
		var opt = $.extend(defaults, options);
		$(this).unbind("dragstart").bind("dragstart", function(){return false;});
		$(this).unbind("mousedown.drag").bind("mousedown.drag", function(downE){
			$(document).bind("selectstart", function(){return false;});
			if(opt.onstart){
				opt.onstart();
			}
			var downOffset = {
				x: downE.pageX - opt.target.offset().left,
				y: downE.pageY - opt.target.offset().top
			};
			var mouseMoveParent = $(document);
			if(opt.relative){
				mouseMoveParent = opt.relative;
			}
			mouseMoveParent.bind("mousemove.drag", function(moveE){
				if(opt.relative){
					var moveTo = $.getRelativePos(moveE.pageX - downOffset.x, moveE.pageY - downOffset.y, opt.relative);
					opt.target.css({
						left: moveTo.x + "px",
						top: moveTo.y + "px"
					});
				}else{
					opt.target.offset({
						left: moveE.pageX - downOffset.x,
						top: moveE.pageY - downOffset.y
					});
				}
				if(opt.ondrag){
					opt.ondrag.call(opt.target, moveE.pageX, moveE.pageY);
				}
			});
			$(document).bind("mouseup.drag", function(upE){
				if(opt.ondrop){
					opt.ondrop.call(opt.target, upE.pageX, upE.pageY);
				}
				$(document).unbind("selectstart");
				mouseMoveParent.unbind("mousemove.drag");
				$(document).unbind("mouseup.drag");
			});
		});
	};
	
	
})(jQuery);

