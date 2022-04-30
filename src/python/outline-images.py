# NOTE: do `pip install opencv-python` if you need to
import cv2

im = cv2.imread('a.png') 

# Make all pixels where Blue > 150 into white
im[im[...,0]>150] = [255,255,255]

# Save result
cv2.imwrite('result.png', im)