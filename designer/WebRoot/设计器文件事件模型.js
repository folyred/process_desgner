�¼����ͣ�
action:
create update delete

create: �������ӹ�ȥ
update: �����޸����ĸ����ԣ��Լ�����ֵ
delete: ��ID����

Shape�ṹ�滮��
{
	"id": {
		name: "Process",
		title: "",
		linkable: true,
		inLinkers: [],
		outLinkers: [],
		group: "groupId",
		style: {
			lineWidth: 2,
			"..."
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

�ļ�����滮��
{
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
					lineWidth: 2,
					"..."
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
