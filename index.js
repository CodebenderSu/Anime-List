const express = require('express');
const Joi = require('joi');
const list = require('./list.json'); // anime list
const app = express();
const port = 3000;
// Initialize
app.listen(port, () => console.log(`App is listening on port ${port}`));
app.use(express.json());

const validateAnime = (anime) => {
  const schema = {
    'title': Joi.string().min(3).required(),
    'aka': Joi.string().min(3),
    'episodes': Joi.number().integer().min(1).max(9999).required(),
    'rating': Joi.number().integer().min(1).max(10).required(),
    'review': Joi.string().min(3).max(280).required(),
    'genre': Joi.array().items(Joi.string().min(3).max(30)).required()
  };
  return Joi.validate(anime, schema);
};

//// GET REQUESTS ////

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
// Get single anime by title
app.get('/anime/series/:title', (req, res) => {
  const reqTitle = req.params.title.toUpperCase();
  let item = list.find(l => l.title.toUpperCase().replace(/ /g, '+') === reqTitle);
  if (!item) {
    item = list.find(l => l.aka.toUpperCase().replace(/ /g, '+') === reqTitle);
    if (!item) return res.status(404).send('Error 404: Anime series not found');
  };
  res.send(item);
});
// Get list of anime by genre
app.get('/anime/genres/:genre', (req, res) => {
  const reqGenre = req.params.genre.toUpperCase();
  const items = []
  const search = list.forEach(l => {
    if (l.genre.find(i => i.toUpperCase().replace(/ /g, '+') === reqGenre)) items.push(l);
  });
  if (items.length) return res.send(items);
  res.status(404).send('Error 404: Anime genre not found')
});

//// POST REQUESTS ////

app.post('/anime', (req, res) => {
  const { error } = validateAnime(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const anime = {
    id: list.length + 1,
    title: req.body.title,
    aka: req.body.aka,
    episodes: req.body.episodes,
    rating: req.body.rating,
    review: req.body.review,
    genre: req.body.genre
  };
  list.push(anime);
  res.send(anime);
});

//// PUT REQUESTS ////

app.put('/anime/:id', (req, res) => {
  const item = list.find(l => l.id === parseInt(req.params.id));
  if (!item) return res.status(404).send('Error 404: Anime series not found');
  const { error } = validateAnime(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  item.title = req.body.title;
  item.aka = req.body.aka;
  item.episodes = req.body.episodes;
  item.rating = req.body.rating;
  item.review = req.body.review;
  item.genre = req.body.genre;
  res.send(item);
})
