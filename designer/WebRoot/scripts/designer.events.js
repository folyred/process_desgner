/**
 * 设计器事件处理
 */

/**
 * 初始化完毕事件
 */
designer.events.addEventListener("initialized", function(){
	var shapeDefine = {
		elements: {
			shapes: {
				"1": {
					props: {
						x:0,
						y:0,
						w:100,
						h:200,
						zindex: 0
					}
				}
			}
		}
	};
	designer.open(shapeDefine);
});