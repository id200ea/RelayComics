'''
Created on 2017. 8. 12.

@author: Park
'''
import socket
import cv2
import numpy as np
import sys
from _socket import gethostbyname

# def parse_args():
#     parser = argparse.ArgumentParser(description='parser to send image to colorization')
#     # basic parameters
   
#     parser.add_argument('-img_path', dest='img_path', type=str, help='image file path to colorization',
#                         default='./input.png')

#     parser.add_argument('-mask_path', dest='mask_path', type=str, help='mask file path to colorization',
#                         default='./mask.png')
    
#     parser.add_argument('-out_path', dest='output_path', type=str, help='colorized output image file path',
#                         default='./output.png')
    
#     args = parser.parse_args()
#     return args
def recvall(sock,count):
    buf = b''
    while count:
        newbuf = sock.recv(count)
        if not newbuf: return None
        buf += newbuf
        count -= len(newbuf)
    return buf

if __name__ == '__main__':
    

    # if you use the Docker uncomment sentence
    # HOST = gethostbyname('colorization')
    
    # if you use the Win & Linux uncomment sentence
    HOST = socket.gethostbyname(socket.gethostname())
    
    PORT = 50007
    print(socket.gethostname(), HOST, PORT)
    img = cv2.imread(sys.argv[1])
    mask = cv2.imread(sys.argv[2],cv2.IMREAD_UNCHANGED)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))
    
    # image, mask encoding to String
    result, imgencode = cv2.imencode('.png',img)
    result, maskencode = cv2.imencode('.png',mask)

    stringData = imgencode.tostring()
    s.send(str(len(stringData)).ljust(16))
    s.send(stringData)
    print('Send Image file size('+str(len(stringData)).ljust(16)+')')
    
    print('Send Mask file size')
    stringData = maskencode.tostring()
    s.send(str(len(stringData)).ljust(16))
    s.send(stringData)
    print('Send Mask file size('+str(len(stringData)).ljust(16)+')')
    
    print('Receving the image...')
    length = recvall(s,16)
    imageData = recvall(s,int(length))
    print('Received Colorized Image!!')
    
    print('Decoding string to Image file')
    data = np.fromstring(imageData,dtype='uint8')
    decimg = cv2.imdecode(data,1)
    
    print('Saving the Image file to ' + sys.argv[3])
    cv2.imwrite(sys.argv[3],decimg)
    print('Saved the Image File!!')
    s.close()

    
