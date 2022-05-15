const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const { getVotesForKathmandu } = require('./scrapper.js');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/v1/kathmandu', async (req, res) => {
  res.json(await getVotesForKathmandu());
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});


