import serial, os
from serial.tools import list_ports

os.system('cls')

for port in list_ports.comports():
	if not 'Bluetooth' in str(port):
		ser = serial.Serial(port[0], 2000000)
		# print(ser)
		l = [0 for i in range(10)]
		while True:
			l.pop(0)
			l.append(['%2.2f'%float(v) for v in str(ser.readline())[2:-3].split()])
			print([sum(v) for v in zip(*l)], end = '\r')