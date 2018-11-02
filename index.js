const express = require('express');
const app = express();
const list = require('./list.json'); // anime list
const port = 3000;
// Initialize
app.listen(port, () => console.log(`App is listening on port ${port}`));

//// REQUESTS ////

// Get list of anime titles
app.get('/anime', (req, res) => {
  res.send(list.map(l => `id: ${l.id}, title: ${l.title}`));
});
// Get single anime metadata by id
app.get('/anime/:id', (req, res) => {
  const item = list.find(l => l.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('Error 404: Anime series not found');
  res.send(item);
});
