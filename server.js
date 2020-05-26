const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const Robot = require('./robot');
const { Model, Point, Edge, Face, getGrid } = require('./model');
const { rotate } = require('./3D');
const { exec } = require('child_process');

let app = express();

app.use('/controler', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.writeHead(302, { Location: '/controler' });
	res.end();
});

let robot = new Robot();
robot.set('FL', { x: -12, y: -16, z: 0 });
robot.set('FR', { x: 12, y: -16, z: 0 });
robot.set('BL', { x: -12, y: 16, z: 0 });
robot.set('BR', { x: 12, y: 16, z: 0 });
for (let leg of robot.legs) leg.mot.b = 2.4;
for (let leg of robot.legs) leg.mot.c = 1.6;
let grid = getGrid();

let cloud = () => {
	let m = new Model([], [], []);
	for (let i = 0; i < 100; i++) {
		let c = `rgba(${64 + Math.random() * 192}, ${0}, ${64 + Math.random() * 64}, 1)`;
		let p = new Point(0, 100, 20, 1, c);
		let a = new Point(0, 120, 20, 1, c);
		let rot = () => Math.random() * 2 * Math.PI;
		p = rotate('xz', p, a, { x: rot(), y: 0, z: rot() });
		m.points.push(p);
	}
	return m;
};

let server = app.listen(5500);
let io = socket(server);
console.clear();
console.log('server up..');

exec('python QR.py', (err, stdout, stderr) => {
	if (!err) {
		stdout = stdout.replace(/0/g, '█');
		stdout = stdout.replace(/1/g, '▄');
		stdout = stdout.replace(/2/g, '▀');
		stdout = stdout.replace(/3/g, ' ');
		console.log(stdout);
	}
});

io.sockets.on('connection', client => {
	console.log('connection from', client.id);

	client.emit('grid', grid);

	client.on('disconnect', () => console.log(client.id, 'disconnected'));

	client.on('message', data => console.log(`${data}`));

	client.on('difuse', data => {
		console.log(`${data}`);
		io.sockets.emit('difuse', data);
	});

	client.on('joystick', data => {
		// console.log('joystick:', data);
	});
});

const tick = () => {
	io.sockets.emit('cloud', cloud());
	io.sockets.emit('robot', robot.getModel());
	setTimeout(tick, 1000 / 30);
};

tick();
