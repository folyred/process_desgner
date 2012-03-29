//事件类型：
//action:
//create update delete

//create: 将对象扔过去
//update: 声明修改了哪个属性，以及属性值
//delete: 传ID即可

//Shape结构规划：
var shape = {
	"id": {
		name: "Process",
		title: "",
		linkable: true,
		inLinkers: [],
		outLinkers: [],
		group: "groupId",
		style: {
			lineWidth: 2
			//....
		},
		props: {
			x:0,
			y:0,
			w:100,
			h:200
		},
		text: {
			
		},
		image: {
		
		}
	}
}

//文件定义规划：
var define = {
	page: {
		padding: 10,
		showGrid: true,
		gridSize: 5,
		backgroundColor: "#FFFFFF",
		scale: 1,
		orientation: 0,
		width: 500,
		height: 800
	},
	elements: {
		shapes: {
			"shapeid": {
				name: "Process",
				title: "",
				inLinkers: [],
				outLinkers: [],
				group: "groupId",
				style: {
					lineWidth: 2
					//.....
				},
				props: {
					x:0,
					y:0,
					w:100,
					h:200
				},
				text: {
					
				},
				image: {
				
				}
			}
		},
		linkers: {
			"linkerId": {
				from: "fromId",
				to: "toShapeId"
			}
		},
		groups: {
			"groupId": {
				groupElements: ["oneShapeId", "twoShapeId"]
			}
		}
	}
}
