from PIL import Image
import os

files = [
    "ship_vanguard.png", "ship_swift.png", "ship_titan.png", "ship_ghost.png", "ship_orion.png",
    "enemy_squid.png", "enemy_crab.png", "enemy_octopus.png", "boss_ship.png"
]

for f in files:
    if not os.path.exists(f): 
        print("Missing:", f)
        continue
    img = Image.open(f).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for r, g, b, a in data:
        lum = max(r, g, b) # using max channel is better for bright colors on dark
        if lum < 40:
            new_data.append((r, g, b, 0))
        elif lum < 80:
            alpha = int(((lum - 40) / 40.0) * 255)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save(f, "PNG")
    print("Processed", f)
