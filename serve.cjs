const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, 'dist')
const port = 4173
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
}

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html'
  const filePath = path.join(root, path.normalize(urlPath).replace(/^([/\\])+/, ''))
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end('Forbidden')
    return
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA/hash fallback for direct navigation
      const index = path.join(root, 'index.html')
      fs.readFile(index, (e2, d2) => {
        if (e2) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found'); return }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(d2)
      })
      return
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(port, '127.0.0.1', () => {
  console.log(`Portfolio: http://localhost:${port}/`)
})
