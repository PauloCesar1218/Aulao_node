const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
});

// conection.connect();

conection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Database is connected');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.post('/calcular', (req, res) => {
    const calc = (num1, num2) => {
        return num1 + num2;
    };
    const n1 = parseInt(req.body.num1);
    const n2 = parseInt(req.body.num2);
    res.status(200).json({resultado: calc(n1, n2)});
});

app.post('/insert/user', (req, res) => {
    const userData = req.body;
    conection.query(`insert into user 
    (nome, email, senha) values (?, ?, ?);`
    , [userData.nome, userData.email, userData.senha], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).json(err);
            return;
        }
        console.log(result);
        res.status(200).json(result)
    });
});

app.post('/search/user', (req, res) => {
    const userData = req.body;
    let returnData = {};
    const query = conection.query(`select * from user where nome = ?`
    , [userData.nome], (err, result, fields) => {
        if (err) {
            // console.log(err);
            res.status(500).json(err);
            return;
        }
        console.log(result);
        returnData.rest = result;
        res.status(200).json(returnData);
    });
    console.log(query.sql);
    
});

app.listen(port, () => console.log('Server is running on port ' + port));
