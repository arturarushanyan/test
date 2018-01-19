const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const nodeMailer = require('nodemailer');
const uuIdToken = require('uuid-token-generator');

let transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 465,
    auth: {
        user: 'riotatest@gmail.com',
        pass: 'Riot$123'
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.route('/register')
    .get((req, res) => {
        res.render('index');
    })
    .post((req, res) => {
        let email = req.body.email,
            secretToken = new uuIdToken(256, uuIdToken.BASE62).generate();

        console.log('verify token is ',secretToken);
        console.log('request protocol is ',req.protocol);
        console.log('request host is',req.get('host'));

        //Form validation
        req.checkBody('email', 'email field is required').notEmpty();
        req.checkBody('email', 'email is not valid').isEmail();

        //check errors
        let errors = req.validationErrors();

        if(errors){
            console.log('errors',errors);
            // res.render('register',{errors: errors})
        } else {
            console.log("Success");
            let newUser = new UserModel({
                email: email,
                secretToken: secretToken,
                isVerified: false,
            });
            UserModel.createUser(newUser, function (error, user) {
                if(error){
                    throw error;
                } else {
                    console.log(user);
                }
            });

            req.flash('success','You are now registered');

            //mail options for sending mail
            let mailOptions = {
                from: 'riotatest@gmail.com',
                to: email,
                subject: 'Welcome to Riota!',
                text: 'Congrats',
                html: '<p>Click <a href="' + req.protocol+ '://'+ req.get('host') + '/users/verify/' + secretToken + '">here</a> to verify your account</p>'
            };

            //send email
            transporter.sendMail(mailOptions, function (err, res) {
                if(err){
                    console.log('Error', err);
                } else {
                    console.log('Email Sent');
                }
            });
            res.location('/');
            res.redirect('/');
        }
    });

module.exports = router;