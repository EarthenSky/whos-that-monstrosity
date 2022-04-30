# NOTE: do `pip install opencv-python` if you need to
import cv2

# NOTE: this script turns the regular pokemon images into blue outlines.

# get pokemon names

with open("data/pokemon.txt", 'r') as f:
   pokemon_list = map(lambda x: x.replace("\n", ""), f.readlines())

# transform pokemon 

for pkmn in pokemon_list:
    img = cv2.imread("../../res/images/pkmn_normal/" + pkmn + ".png", cv2.IMREAD_UNCHANGED)

    img[:,:,0] = 159
    img[:,:,1] = 68
    img[:,:,2] = 0
    cv2.imwrite("../../res/images/pkmn_outline/" + pkmn + ".png", img)