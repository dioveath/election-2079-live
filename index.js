const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const path = require('path');
const fs = require('fs');
const port = 5000;

const {getVotesForKathmandu} = require('./scrapper.js');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/v1/kathmandu', async (req, res) => {
  res.sendFile(path.join(__dirname, 'db.json'));
  // res.json(await getVotesForKathmandu());
});


setInterval(async () => {
  try {
    await dataCycle();
  } catch (error) {
    console.log(error.message);
  }
}, 60000);


async function dataCycle() {
  const datas = await getVotesForKathmandu();
  fs.writeFile('db.json', JSON.stringify(datas), (err) => {
    if (err) {
      console.error(err);
    }
    console.log('data updated!');
    io.emit('update', datas);
  });
}


io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  dataCycle();
  io.emit('update', JSON.parse(fs.readFileSync(
    path.join(__dirname, 'db.json'))));
});

server.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
