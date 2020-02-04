import pygame as pg
from visu_3d import render
from time import perf_counter, sleep


if __name__ == '__main__':
	import json, os
	from ctypes import windll
	windll.shcore.SetProcessDpiAwareness(1)

	os.system('cls')
	with open('PCE.json') as f:
		d = json.load(f)

	screen = pg.display.set_mode(d['view size'])
	s = pg.Surface(d['view size'])

	time_code = perf_counter()
	while time_code:
		sleep(1/1000)
		new_perf = perf_counter()
		if new_perf - time_code >= 1/60:
			time_code = new_perf
			for event in pg.event.get():
				if event.type == pg.QUIT:
					time_code = 0
					break

			if not time_code:
				continue

			snap_angle = d['view angle'].copy()
			snap_dist = d['view distance']

			keys = pg.key.get_pressed()
			delta = 0.03
			if keys[pg.K_UP]:
				d['view angle'][0] -= delta
				
			if keys[pg.K_DOWN]:
				d['view angle'][0] += delta
				
			if keys[pg.K_LEFT]:
				d['view angle'][2] -= delta
				
			if keys[pg.K_RIGHT]:
				d['view angle'][2] += delta
				
			if keys[pg.K_KP_MINUS]:
				d['view distance'] += delta*100
				
			if keys[pg.K_KP_PLUS]:
				d['view distance'] -= delta*100

			if d['view angle'] != snap_angle or d['view distance'] != snap_dist or time_code < 1:
				ns = render(d)
				if ns is not None:
					s = ns
					screen.blit(s, [0, 0])
				else:
					print('typeError')

			pg.display.update()