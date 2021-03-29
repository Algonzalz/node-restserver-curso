require('./config/config')


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//hasbilitar la carpeta public
// app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }


}

dbConnection();


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
})