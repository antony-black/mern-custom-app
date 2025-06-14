import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json('hello');
});

app.listen(3001, () => {
  // console.log('Running on 3001');
});
