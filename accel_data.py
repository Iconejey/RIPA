import serial
import os
from serial.tools import list_ports

os.system('cls')
print('Searching for USB connextion..')

for port in list_ports.comports():
    if not 'Bluetooth' in str(port):
        ser = serial.Serial(port[0], 2000000, timeout=1)
        print(ser)
        while True:
            ser.write('\t'.encode('ascii'))
            accel = [float(v) for v in str(ser.readline())[2:-3].split()]
            print(*['%.2f' % v for v in accel], end=' '*5 + '\r')
