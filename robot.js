const { Model, Point, Edge, Face } = require('./model');
const { rotate, translate } = require('./3D');

class Robot {
	constructor() {
		this.pos = { x: 0, y: 0, z: 24 };
		this.rot = { x: 0, y: 0, z: 0 };

		this.body = { width: 16, length: 48, height: 8 };
		this.leg = { b1: 5, b2: 16, b3: 16 };

		this.legs = [
			{ side: 'FL', pos: { x: 0, y: 0, z: 0 }, mot: { a: 0, b: 0, c: 0 } },
			{ side: 'FR', pos: { x: 0, y: 0, z: 0 }, mot: { a: 0, b: 0, c: 0 } },
			{ side: 'BR', pos: { x: 0, y: 0, z: 0 }, mot: { a: 0, b: 0, c: 0 } },
			{ side: 'BL', pos: { x: 0, y: 0, z: 0 }, mot: { a: 0, b: 0, c: 0 } }
		];
	}

	getLeg(side) {
		for (let leg of this.legs) {
			if (leg.side == side) return leg;
		}
	}

	set(side, pos) {
		this.getLeg(side).pos = pos;
	}

	getModel() {
		let lw = 0.8;
		let bc = '#aaaaaa';
		let lc = `rgba(255, 128, 128, 1)`;
		let points = [
			new Point(-this.body.width / 2, -this.body.length / 2, -this.body.height / 2, lw, bc),
			new Point(this.body.width / 2, -this.body.length / 2, -this.body.height / 2, lw, bc),
			new Point(this.body.width / 2, this.body.length / 2, -this.body.height / 2, lw, bc),
			new Point(-this.body.width / 2, this.body.length / 2, -this.body.height / 2, lw, bc),
			new Point(-this.body.width / 2, -this.body.length / 2, this.body.height / 2, lw, bc),
			new Point(this.body.width / 2, -this.body.length / 2, this.body.height / 2, lw, bc),
			new Point(this.body.width / 2, this.body.length / 2, this.body.height / 2, lw, bc),
			new Point(-this.body.width / 2, this.body.length / 2, this.body.height / 2, lw, bc)
		];

		let edges = [
			new Edge([0, 1], lw, bc),
			new Edge([1, 2], lw, bc),
			new Edge([2, 3], lw, bc),
			new Edge([3, 0], lw, bc),

			new Edge([0, 4], lw, bc),
			new Edge([1, 5], lw, bc),
			new Edge([2, 6], lw, bc),
			new Edge([3, 7], lw, bc),

			new Edge([4, 5], lw, bc),
			new Edge([5, 6], lw, bc),
			new Edge([6, 7], lw, bc),
			new Edge([7, 4], lw, bc)
		];

		for (let leg of this.legs) {
			let fb = leg.side[0] == 'F' ? -1 : 1;
			let lr = leg.side[1] == 'L' ? -1 : 1;
			let p0 = new Point(7 * lr, 16 * fb, 0, lw, lc);
			let p1 = new Point(12 * lr, 16 * fb, 0, lw, lc);
			let p2 = new Point(12 * lr, 16 * fb + 16, 0, lw, lc);
			let p3 = new Point(12 * lr, 16 * fb, 0, lw * 2, lc);

			let l = points.length;
			let i = 0;
			while (i < 3) {
				edges.push(new Edge([l + i, l + i + 1], lw, lc));
				i++;
			}

			let rot = { x: -leg.mot.c, y: 0, z: 0 };
			p3 = rotate('x', p3, p2, rot);

			rot = { x: -leg.mot.b, y: 0, z: 0 };
			p2 = rotate('x', p2, p1, rot);
			p3 = rotate('x', p3, p1, rot);

			rot = { x: 0, y: leg.mot.a, z: 0 };
			p1 = rotate('y', p1, p0, rot);
			p2 = rotate('y', p2, p0, rot);
			p3 = rotate('y', p3, p0, rot);

			for (let p of [p0, p1, p2, p3, new Point(leg.pos.x, leg.pos.y, leg.pos.z, lw * 3, `rgba(255, 64, 64, 0.5)`)]) points.push(p);
		}

		points = points.map(point => rotate('xyz', point, { x: 0, y: 0, z: 0 }, this.rot));
		points = points.map(point => translate(point, this.pos));

		let faces = [
			// new Face([0, 1, 2, 3], 'lightgreen'),
			// new Face([4, 5, 6, 7], 'lightgreen'),
			// new Face([0, 4, 5, 1], 'lightgreen'),
			// new Face([1, 5, 6, 2], 'lightgreen'),
			// new Face([3, 2, 6, 7], 'lightgreen'),
			// new Face([8, 3, 7, 4], 'lightgreen')
		];

		return new Model(points, edges, faces);
	}
}

module.exports = Robot;
