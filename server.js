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
  request.body["timestamp"] = Date.now();
  console.log(request.body);
  database.insert(request.body);
  response.json({
    status: 'success'
  });

  // HOW TO HANDLE ERRORS?
});

app.get('/api', (request, response) => {
  database.find().sort({ "timestamp": -1 }).exec((err, data) => {
    if (err) {
      response.json({
        status: 'error'
      });
      return;
    }
    response.json(data);
  });
});