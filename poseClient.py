'''
Created on 2017. 8. 12.

@author: Park
'''
import socket
import cv2
import numpy as np
import sys
import time

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
    
    HOST = '127.0.0.1'
    PORT = 50006
    print(HOST, PORT)

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))
    

    s.send(b"../../image_transmissions/ref/pose_input.png");
    time.sleep(1)
	


    
