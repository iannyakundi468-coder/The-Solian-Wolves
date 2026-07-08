from PIL import Image

def remove_background(img_path, out_path, bg_color, threshold=30):
    img = Image.open(img_path).convert('RGBA')
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check if the pixel is close to the bg_color
        if abs(item[0] - bg_color[0]) <= threshold and \
           abs(item[1] - bg_color[1]) <= threshold and \
           abs(item[2] - bg_color[2]) <= threshold:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, 'PNG')

remove_background('assets/logo.jpg', 'assets/favicon.png', (1, 1, 1), 30)
