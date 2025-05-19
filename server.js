const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;
const contactsRoute = require('./routes/contacts');
const { initDb} = require('./db/connection');

initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => console.log(`DB connected. Server running on port ${PORT}`));
  }
});

dotenv.config();
app.use(express.json());


app.use('/contacts', contactsRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
