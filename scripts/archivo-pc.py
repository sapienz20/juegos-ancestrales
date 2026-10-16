# Genera un único archivo HTML que abre la app en el computador sin internet.
import base64, json, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist = os.path.join(root, 'dist')
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'JuegosAncestrales-PC.html')
mime = {'.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}
assets = {}
for d, _, fs in os.walk(os.path.join(dist, 'img')):
    for f in fs:
        p = os.path.join(d, f)
        rel = os.path.relpath(p, dist).replace(os.sep, '/')
        assets[rel] = 'data:%s;base64,%s' % (mime[os.path.splitext(f)[1]], base64.b64encode(open(p, 'rb').read()).decode())
js = open(os.path.join(dist, 'app.js'), encoding='utf-8').read().replace('</script', '<\\/script')
css = open(os.path.join(dist, 'app.css'), encoding='utf-8').read()
fix = """
(function(){
  var A = window.__ASSETS;
  function f(el){
    if (el.nodeType !== 1) return;
    var s = el.getAttribute('src');
    if (s && A[s]) el.setAttribute('src', A[s]);
    var st = el.getAttribute('style');
    if (st && /url\\(["']?img\\//.test(st)) el.setAttribute('style', st.replace(/url\\(["']?(img\\/[^"')]+)["']?\\)/g, function(m, p){ return A[p] ? 'url("' + A[p] + '")' : m; }));
  }
  function all(n){ f(n); if (n.querySelectorAll) n.querySelectorAll('[src],[style]').forEach(f); }
  new MutationObserver(function(ms){ ms.forEach(function(m){ if (m.type === 'attributes') f(m.target); else m.addedNodes.forEach(all); }); })
    .observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'style'] });
  var l = document.querySelector('link[rel=icon]'); if (l) l.href = A['img/logo.png'];
})();
"""
html = """<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Juegos Ancestrales e Interculturales</title>
<link rel="icon" href="">
<style>%s</style>
</head>
<body>
<div id="root"></div>
<script>window.__ASSETS = %s;</script>
<script>%s</script>
<script>%s</script>
</body>
</html>
""" % (css, json.dumps(assets), fix, js)
open(out, 'w', encoding='utf-8').write(html)
print(out, round(len(html) / 1e6, 2), 'MB')
