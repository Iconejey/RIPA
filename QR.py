import socket, qrcode, os

ip = socket.gethostbyname(socket.gethostname())

qr = qrcode.QRCode( version = 1, error_correction = qrcode.constants.ERROR_CORRECT_L, box_size = 1, border = 1)
qr.add_data(f'http://{ip}:5500')
qr.make(fit = True)

mat = qr.get_matrix()
if len(mat)%2: mat.append([True]*len(mat))

data = ''
for y in range(len(mat)//2):
    l1 = mat[y*2]
    l2 = mat[y*2+1]
    s = ''
    for p1, p2 in zip(l1, l2):
        if p1 and p2: s += '3'
        elif p1: s += '1'
        elif p2: s += '2'
        else: s += '0'

        # '█▄▀ ' = '0123'

    data += s + '\n'

print(data)