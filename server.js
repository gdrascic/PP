const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/autobusne-stanice', async (req, res) => {
  try {
    const url = 'http://e-usluge2.rijeka.hr/OpenData/ATstanice.csv';
    const response = await axios.get(url, { responseType: 'stream' });
    const results = [];
    response.data
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results);
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});
