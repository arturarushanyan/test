const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const nodeMailer = require('nodemailer');
const uuIdToken = require('uuid-token-generator');

let transporter = nodeMailer.createTransport({
    // service: 'gmail',
    // secure: false,
    // port: 465,
    // auth: {
    //     user: 'riotatest@gmail.com',
    //     pass: 'Riot$123'
    // },
    // tls: {
    //     rejectUnauthorized: false
    // }
    service: 'Godaddy',
    host: "smtpout.secureserver.net",
    secureConnection: false,
    port: 465,
    auth: {
        user: "whitelist@riota.io",
        pass: "Manager$1"
    }
});

router.route('/register')
    .post((req, res) => {
        let name = req.body.name,
            email = req.body.email,
            purchasePlan = req.body.purchasePlan,
            description = req.body.description,
            joinedToTelegram = req.body.telegram,
            secretToken = new uuIdToken(256, uuIdToken.BASE62).generate();

        console.log('verify token is ',secretToken);
        console.log('request protocol is ',req.protocol);
        console.log('request host is',req.get('host'));

        //Form validation
        req.checkBody('email', 'email field is required').notEmpty();
        req.checkBody('email', 'email is not valid').isEmail();
        req.checkBody('purchasePlan', 'this field is required').notEmpty();
        req.checkBody('description', 'this field is required').notEmpty();
        req.checkBody('telegram', 'this field is required').notEmpty();

        //check errors
        let errors = req.validationErrors();
        if(errors){
            console.log('errors',errors);
            res.render('index', {errors: errors});
            console.log('validation errors',errors);
        } else {
            console.log("No validation errors");
            let newUser = new UserModel({
                name: name,
                email: email,
                purchasePlan: purchasePlan,
                description: description,
                joinedToTelegram: joinedToTelegram,
                secretToken: secretToken,
                isVerified: false,
            });
            UserModel.find({email: newUser.email}, (err, docs) => {
                if(docs.length > 0){
                    console.log('user exists');
                    req.flash('danger', 'Email already exists');
                    res.redirect('/');
                } else {
                    console.log('creating user');
                    console.log(err);
                    UserModel.createUser(newUser, function (error, user) {
                        if(error){
                            throw error;
                        } else {
                            console.log(user);
                        }
                    });

                    //mail options for sending mail
                    let mailOptions = {
                        from: 'whitelist@riota.io',
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
                    req.flash('success','You are now registered, please verify your email');
                    res.redirect('/');
                }
            })
        }
    });

//email verification
router.route('/verify/:secretToken')
    .get((req, res) => {
    UserModel.findOneAndUpdate({secretToken:req.params.secretToken}, {isVerified: true}, (err,user) => {
        if(err){
            throw err;
        }
        if(!user){
            req.flash('error', 'no user')
        }
    });
    //console.log('vser to be verified', user);
    req.flash('success', 'Your email is successfully verified');
    res.redirect('/');
});

module.exports = router;