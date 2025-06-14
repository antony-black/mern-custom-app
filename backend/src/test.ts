// test.ts
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});
// console.log('here');
app.listen(3000);
