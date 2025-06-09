const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const createPath = require('../helpers/create-path');

router.get('/contacts', (req, res) => {
    const title = 'Контакты';
    Contact
     .find()
     .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

module.exports = router;