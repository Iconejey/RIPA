const render = (ctx, scale, cam, model) => {
	points = model.points.map(point => project(ctx, scale * 100, cam, point));
	// console.log(points);

	for (let p of points) {
		if (p.z > 0) {
			ctx.fillStyle = p.color;
			ctx.beginPath();
			ctx.arc(p.x, p.y, (p.r * scale * 50) / p.z, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	for (let e of model.edges) {
		ctx.strokeStyle = e.color;
		ctx.lineWidth = e.w * scale;

		let p1 = points[e.points[0]];
		let p2 = points[e.points[1]];

		if (p1.z > 0 && p2.z > 0) {
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.stroke();
		}
	}
};

const project = (ctx, scale, cam, point) => {
	let p = rotate('zyx', point, { x: 0, y: 0, z: 0 }, cam);
	p.z = cam.d - p.z;
	p.x = (p.x * scale) / p.z + ctx.canvas.width / 2;
	p.y = (p.y * scale) / p.z + (ctx.canvas.height / 5) * 3;
	return p;
};

const rotate = (axles, point, anchor, angles) => {
	let p = { x: point.x - anchor.x, y: point.y - anchor.y, z: point.z - anchor.z };

	for (let axle of axles) {
		a = angles[axle];
		if (a) {
			let np = { x: p.x, y: p.y, z: p.z };

			if (axle == 'x') {
				np.y = Math.cos(a) * p.y - Math.sin(a) * p.z;
				np.z = Math.sin(a) * p.y + Math.cos(a) * p.z;
			} else if (axle == 'y') {
				np.x = Math.cos(a) * p.x - Math.sin(a) * p.z;
				np.z = Math.sin(a) * p.x + Math.cos(a) * p.z;
			} else if (axle == 'z') {
				np.x = Math.cos(a) * p.x - Math.sin(a) * p.y;
				np.y = Math.sin(a) * p.x + Math.cos(a) * p.y;
			}

			p = np;
		}
	}

	return {
		x: p.x + anchor.x,
		y: p.y + anchor.y,
		z: p.z + anchor.z,
		r: point.r,
		color: point.color
	};
};

const translate = (p, v) => {
	return { x: p.x + v.x, y: p.y + v.y, z: p.z + v.z, r: p.r, color: p.color };
};

module.exports.rotate = rotate;
module.exports.project = project;
module.exports.render = render;
module.exports.translate = translate;
