const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;
const contactsRoute = require('./routes/contacts');
const { initDb} = require('./db/connection');

initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => console.log(`DB connected. Server running on port: ${PORT}`));
  }
});

dotenv.config();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Header','Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control_Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use(express.json());
app.use('/', require('./routes'));


app.use('/contacts', contactsRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
