def blend_color(base_color, ratio):
    # base_color is (R, G, B)
    r = int((1 - ratio) * 255 + ratio * base_color[0])
    g = int((1 - ratio) * 255 + ratio * base_color[1])
    b = int((1 - ratio) * 255 + ratio * base_color[2])
    return f'#{r:02x}{g:02x}{b:02x}'

def get_color(ratio):
    if ratio == 0.5:
        return "#ffffff"
      
    if ratio > 0.90:
      return "#990000"
    
    if ratio > 0.5:  # more positives -> red blend
        strength = (ratio - 0.5) * 2
        return blend_color((255, 0, 0), strength)
    else:  # more negatives -> blue blend
        strength = (0.5 - ratio) * 2
        return blend_color((0, 0, 255), strength)