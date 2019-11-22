const Datastore = require('nedb');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
app.use(express.static('public'));
app.use(express.json({ limit: '500kb' }));

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
const database = new Datastore('mft.db');
database.loadDatabase();

app.post('/api', (request, response) => {
  database.insert(request.body);
  response.json({
    status: 'success'
  });

  // HOW TO HANDLE ERRORS?
});

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});