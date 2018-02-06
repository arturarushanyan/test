const express = require('express');
const router = express.Router();
const basicAuth = require('../auth/basic');

router.route('/')
    .get(basicAuth.isAuthenticated, (req, res) => {
        res.render('index');
    });
router.route('/prev')
    .get((req, res) => {
        res.render('email', {name: 'Artur', verifyLink: 'www.link.com'});
    });
module.exports = router;