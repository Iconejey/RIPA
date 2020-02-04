import serial, os
from serial.tools import list_ports

os.system('cls')
print('Searching for USB connextion..')

for port in list_ports.comports():
	if not 'Bluetooth' in str(port):
		ser = serial.Serial(port[0], 2000000)
		print(ser)
		l = [0]*3
		while True:
			tmp = [float(v) for v in str(ser.readline())[2:-3].split()]
			for i in range(3):
				l[i] = l[i]*9/10 + tmp[i]*1/10
			print(tuple(tmp), end = '\r')
			# print(('%.2f '*3)%tuple(l), end = '\r')