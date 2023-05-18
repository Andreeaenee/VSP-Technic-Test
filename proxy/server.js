const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/nbrfxrates.xml', async (req, res) => {
  try {
    const response = await axios.get('https://www.bnr.ro/nbrfxrates.xml');
    res.set('Content-Type', 'text/xml');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error retrieving XML data');
  }
});

app.listen(3001, () => {
  console.log('Proxy server listening on port 3001');
});
