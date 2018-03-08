require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/send', (req, res) => {
    let output = `
        <h1>Reactie contactformulier LVMS</h1>
        <h2>Details:</h2>
        <ul>
            <li>Naam: ${req.body.name}</li>
            <li>Email: <a href="mailto:${req.body.email}">${req.body.email}</a></li>
            <li>Onderwerp: ${req.body.subject}</li>
        </ul>
        <h4 style="margin-bottom:0;">Bericht:</h4> 
        <p>${req.body.msg}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        secure: false,
        port: 25,
        auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    let HelperOptions = {
        from: '"Contactformulier LVMS website" <wendy.dimmendaal@again.nl>',
        to: 'wendy.dimmendaal@again.nl',
        subject: 'Reactie contactformulier',
        text: '',
        html: output
    };
    
    transporter.sendMail(HelperOptions, (error, info) => {
        if(error) {
            res.render('error', {errorMsg: error, defaultLayout: 'simple'});
        }
        res.redirect('/?form=send');
    });
})

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started...');
});