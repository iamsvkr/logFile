const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const fs = require('fs');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on("connection", socket => {
  console.log("New client connected");
  let prevData;
  fs.watch('log.txt', (et, fn) => {
    const data = fs.readFileSync('./log.txt', {encoding:'utf8', flag:'r'});
    if(prevData !== data) {
        socket.emit('hello', data);
    }
    prevData = data;
  });
});

httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});