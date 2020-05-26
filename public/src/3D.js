const render = (ctx, scale, cam, models) => {
	let render_queue = [];
	for (let m of models) {
		let pts = m.points.map(p => project(ctx, scale * 100, cam, p));

		for (let p of pts) render_queue.push(p);

		for (let e of m.edges) {
			let epts = { p1: pts[e.points[0]], p2: pts[e.points[1]] };

			render_queue.push({
				points: epts,
				w: e.w,
				color: e.color,
				z: (epts.p1.z + epts.p2.z) / 2
			});
		}
	}

	render_queue.sort((a, b) => b.z - a.z);

	for (let e of render_queue) {
		if (e.points) {
			ctx.strokeStyle = e.color;
			ctx.lineWidth = e.w * scale;

			let p1 = e.points.p1;
			let p2 = e.points.p2;

			if (p1.z > 0 && p2.z > 0) {
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
			}
		} else if (e.z > 0) {
			ctx.fillStyle = e.color;
			ctx.beginPath();
			ctx.arc(e.x, e.y, (e.r * scale * 50) / e.z, 0, Math.PI * 2);
			ctx.fill();
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
				np.z = Math.sin(a) * p.x - Math.cos(a) * p.z;
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
