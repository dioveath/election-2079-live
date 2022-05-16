const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 5000;

const { getVotesForKathmandu } = require('./scrapper.js');


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/v1/kathmandu', async (req, res) => {
  res.sendFile(path.join(__dirname, 'db.json'));
  // res.json(await getVotesForKathmandu());
});

setInterval(async () => { 

  try { 
    const datas = await getVotesForKathmandu();
  fs.writeFile('db.json', JSON.stringify(datas), err => {
    console.error(err);
    console.log("data updated!");
  });

  } catch (error){
    console.log(error.message);
  }

}, 60000);




app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});


