class Joystick {
	constructor(x, y, side) {
		this.pos = { x: 0, y: 0 };
		this.stick = { x: 0, y: 0 };
		this.side = side;

		this.r1 = 1;
		this.r2 = 1;

		this.enabled = false;

		this.update(x, y);
		this.reset();
	}

	update(x, y, s) {
		this.pos = { x: x, y: y };
		this.r1 = 6 * s;
		this.r2 = 14 * s;
	}

	set(x, y) {
		this.stick = { x: x, y: y };

		let d = { x: x - this.pos.x, y: y - this.pos.y };
		let mag = Math.sqrt(d.x * d.x + d.y * d.y);

		if (mag > this.r2) {
			this.stick.x = this.pos.x + (d.x / mag) * this.r2;
			this.stick.y = this.pos.y + (d.y / mag) * this.r2;
		}
	}

	reset() {
		this.set(this.pos.x, this.pos.y);
	}

	getBack() {
		let d = { x: this.stick.x - this.pos.x, y: this.stick.y - this.pos.y };
		let f = 0.8;
		this.set(this.pos.x + d.x * f, this.pos.y + d.y * f);
	}

	draw(ctx) {
		let lightwhite = `rgba(255, 255, 255, ${this.enabled ? 0.2 : 0.1})`;
		ctx.fillStyle = lightwhite;
		ctx.beginPath();
		ctx.arc(this.stick.x, this.stick.y, this.r1, 0, Math.PI * 2);
		ctx.fill();

		ctx.lineWidth = 2;
		ctx.strokeStyle = lightwhite;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.r2, 0, Math.PI * 2);
		ctx.stroke();
	}
}
