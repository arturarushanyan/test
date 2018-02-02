const express = require('express');
const router = express.Router();
const basicAuth = require('../auth/basic');

router.route('/')
    .get(basicAuth.isAuthenticated, (req, res) => {
        res.render('index');
    });

module.exports = router;