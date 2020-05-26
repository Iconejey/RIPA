let socket = io.connect('http://192.168.1.16:5500');

let can = document.querySelector('canvas');
let dpi = window.devicePixelRatio;
let loading_div = document.getElementById('loading');
let UIscale = 1;
let frame = 0;
let screenReady = false;

let grid = { points: [], edges: [], faces: [] };
let robot = { points: [], edges: [], faces: [] };
let cloud = { points: [], edges: [], faces: [] };
let cam = { x: 1, y: 0, z: 1, d: 120 };

socket.on('grid', data => {
	grid = data;
});

socket.on('robot', data => {
	robot = data;
});

socket.on('cloud', data => {
	cloud = data;
});

socket.on('difuse', data => {
	console.log(data);
});

let LJ = new Joystick(0, 0, 'L');
let RJ = new Joystick(0, 0, 'R');
let drag = null;

const fullScreen = () => can.requestFullscreen();

const resize = () => {
	can.width = window.innerWidth;
	can.height = window.innerHeight;

	if (document.fullscreenElement) {
		can.setAttribute('height', can.clientHeight * dpi);
		can.setAttribute('width', can.clientWidth * dpi);
	}

	UIscale = can.height / 100;

	LJ.update(can.width / 8, (can.height / 5) * 4, UIscale);
	RJ.update((can.width / 8) * 7, (can.height / 5) * 4, UIscale);

	screenReady = window.innerWidth > window.innerHeight;
	if (screenReady) {
		loading_div.classList.add('hidden');
		loading_div.classList.remove('show');
		can.classList.remove('hidden');
		can.classList.add('show');
	} else {
		loading_div.classList.add('show');
		loading_div.classList.remove('hidden');
		can.classList.remove('show');
		can.classList.add('hidden');
	}
};

const tick = () => {
	frame++;
	if (frame % 10 == 0) resize();
	if (screenReady) {
		let ctx = can.getContext('2d');
		ctx.fillStyle = '#0f0d16';
		ctx.fillRect(0, 0, can.width, can.height);

		render(ctx, UIscale, cam, [grid, robot, cloud]);

		if (document.fullscreenElement) {
			if (!LJ.enabled) LJ.getBack();
			LJ.draw(ctx);

			if (!RJ.enabled) RJ.getBack();
			RJ.draw(ctx);
		}
	}
	window.setTimeout(tick, 1000 / 30);
};

window.onload = () => {
	let move = event => {
		event.preventDefault();
		for (touch of event.changedTouches) {
			let x = touch.clientX * dpi;
			let y = touch.clientY * dpi;

			let isDrag = false;

			if (drag) {
				let d = { x: x - drag.x, y: y - drag.y };
				let mag = Math.sqrt(d.x * d.x + d.y * d.y);
				if (mag < 100) {
					cam.x -= (y - drag.y) / 200;
					cam.z -= (x - drag.x) / 200;
					drag = { x: x, y: y };
					isDrag = true;
				}
			}

			if (!isDrag) {
				let used = false;
				for (let J of [LJ, RJ]) {
					let d = { x: x - J.pos.x, y: y - J.pos.y };
					let mag = Math.sqrt(d.x * d.x + d.y * d.y);

					if (mag < 100) J.enabled = true;

					if (J.enabled && mag < 500) {
						J.set(x, y);
						socket.emit('joystick', { side: J.side, vec: { x: Number((d.x / mag).toFixed(2)), y: Number((d.y / mag).toFixed(2)) } });
						used = true;
					}
				}

				if (!used) {
					drag = { x: x, y: y };
				}
			}
		}
	};

	can.addEventListener('touchstart', move);

	can.addEventListener('touchmove', move);

	can.addEventListener('touchend', event => {
		event.preventDefault();
		for (touch of event.changedTouches) {
			let x = touch.clientX * dpi;
			let y = touch.clientY * dpi;

			if (x < can.width / 2) {
				LJ.enabled = false;
				socket.emit('joystick', { side: 'L', vec: { x: 0, y: 0 } });
			} else {
				RJ.enabled = false;
				socket.emit('joystick', { side: 'R', vec: { x: 0, y: 0 } });
			}

			let d = { x: x - drag.x, y: y - drag.y };
			let mag = Math.sqrt(d.x * d.x + d.y * d.y);
			if (mag < 10) {
				drag = null;
			}
		}
	});

	tick();
};
