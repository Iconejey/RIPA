class Model {
	constructor(points, edges, faces) {
		this.points = points;
		this.edges = edges;
		this.faces = faces;
	}
}

class Point {
	constructor(x, y, z, r, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.r = r;
		this.color = color;
	}
}

class Edge {
	constructor(points, w, color) {
		this.points = points;
		this.w = w;
		this.color = color;
	}
}

class Face {
	constructor(points, color) {
		this.points = points;
		this.color = color;
	}
}

const getGrid = () => {
	let n = 2,
		s = 25;
	c = `rgba(255, 255, 255, 0.5)`;
	let grid = new Model(
		[new Point(n * s, 0, 0, 0, c), new Point(-n * s, 0, 0, 0, c), new Point(0, n * s, 0, 0, c), new Point(0, -n * s, 0, 0, c)],
		[new Edge([0, 1], 0.1, c), new Edge([2, 3], 0.1, c)],
		[]
	);

	for (let i = 0; i <= n; i++) {
		grid.points.push(new Point(-n * s, i * s, 0, 0, c));
		grid.points.push(new Point(n * s, i * s, 0, 0, c));
		grid.points.push(new Point(n * s, -i * s, 0, 0, c));
		grid.points.push(new Point(-n * s, -i * s, 0, 0, c));
		grid.points.push(new Point(i * s, -n * s, 0, 0, c));
		grid.points.push(new Point(i * s, n * s, 0, 0, c));
		grid.points.push(new Point(-i * s, n * s, 0, 0, c));
		grid.points.push(new Point(-i * s, -n * s, 0, 0, c));

		grid.edges.push(new Edge([4 + 8 * i, 5 + 8 * i], 0.1, c));
		grid.edges.push(new Edge([6 + 8 * i, 7 + 8 * i], 0.1, c));
		grid.edges.push(new Edge([8 + 8 * i, 9 + 8 * i], 0.1, c));
		grid.edges.push(new Edge([10 + 8 * i, 11 + 8 * i], 0.1, c));
	}

	return grid;
};

module.exports.Model = Model;
module.exports.Point = Point;
module.exports.Edge = Edge;
module.exports.Face = Face;
module.exports.getGrid = getGrid;
