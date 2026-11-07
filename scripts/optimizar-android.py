# Reduce el peso de las imágenes de arranque que genera @capacitor/assets.
# Convierte cada res/drawable*/splash.png en splash.webp (Android usa el mismo nombre de recurso).
import glob, os
from PIL import Image

antes = despues = 0
for png in glob.glob('android/app/src/main/res/drawable*/splash.png'):
    webp = png[:-4] + '.webp'
    Image.open(png).convert('RGB').save(webp, 'WEBP', quality=80, method=6)
    antes += os.path.getsize(png)
    despues += os.path.getsize(webp)
    os.remove(png)
print(f'Pantallas de arranque: {antes/1e6:.1f} MB -> {despues/1e6:.1f} MB')
