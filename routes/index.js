const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //swagger.tags=["Hello World from swagger"]
    res.send('Hello World');});

router.use('/contacts', require('./contacts'))
module.exports = router;