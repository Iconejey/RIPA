import pygame as pg
from math import sin, cos

ORIGIN = [0, 0, 0]

def render(d):
	s = pg.Surface(d['view size'])
	proj_points = {k: p for k, v in enumerate(d['points']) if (p:=project(d, k)) is not None}

	render_queue = []

	for k, color in d['dots']:
		if k in proj_points:
			x, y, z = proj_points[k]
			render_queue.append([z, [x, y], color])

	for K, color in d['vertices']:
		if all(k in proj_points for k in K):
			(x1, y1, z1), (x2, y2, z2) = [proj_points[k] for k in K]
			render_queue.append([(z1 + z2)/2, [x1, y1], [x2, y2], color])

	try:
		for obj in sorted(render_queue):
			if type(obj[-1]) == str:
				obj[-1] = d['colors'][obj[-1]]

			if len(obj) is 3:
				z, point, color = obj
				Z = int(700 / (d['view distance'] - z))
				pg.draw.circle(s, color, point, Z)
			else:
				z, p1, p2, color = obj
				pg.draw.line(s, color, p1, p2, 2)
	except TypeError:
		return None

	return s


def project(d, pindex):
	point = d['points'][pindex]
	cx, cy = [v//2 for v in d['view size']]

	point = rotate('zyx', point, ORIGIN, d['view angle'])

	dist = d['view distance'] - point[2]
	Z = 1 / dist

	if dist > 0:
		x, y, z = point
		s = d['view scale']
		x = int(x*s*Z + cx)
		y = int(y*s*Z + cy)

		return x, y, z


def rotate(axles, point, anchor, angles):
	px, py, pz = [p - a for p, a in zip(point, anchor)]
	axle_map = {'x': 0, 'y': 1, 'z': 2}

	for axle in axles:
		a = angles[axle_map[axle]]
		if axle == 'x':
			nx = px
			ny = cos(a)*py - sin(a)*pz
			nz = sin(a)*py + cos(a)*pz

		if axle == 'y':
			nx = cos(a)*px - sin(a)*pz
			ny = py
			nz = sin(a)*px - cos(a)*pz

		if axle == 'z':
			nx = cos(a)*px - sin(a)*py
			ny = sin(a)*px + cos(a)*py
			nz = pz

		px, py, pz = nx, ny, nz

	return [p + a for p, a in zip([px, py, pz], anchor)]