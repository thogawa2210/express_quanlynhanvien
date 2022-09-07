const mysql = require('mysql');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
const upload = multer();
app.set("view engine", "ejs");
app.set("views", "./views");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abcd1234',
    database: 'demo',
    charset: 'utf8_general_ci'
});

connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else {
        console.log("connect success");
        const sqlCreate = `CREATE TABLE IF NOT EXISTS staffs (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(255),
 salary INT,
 department VARCHAR(255)
 )`;

        connection.query(sqlCreate, function (err, result) {
            if (err) throw err;
            console.log("Create table success");
        });
    }
});

app.get("/create", (req, res) => {
    res.render("create")
})

app.post("/list", upload.none(), (req, res) => {
    const {name, salary, department} = req.body;
    let sql = "INSERT INTO staffs (name, salary, department) VALUES ?";
    const value = [
        [name, salary, department]
    ];
    connection.query(sql, [value], function (err, result) {
        if (err) throw err;
        res.redirect("list");
    });
})

app.get('/list', (req, res) => {
    const sql = "SELECT * FROM staffs";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("list", {staffs: result});
    })
})

app.delete("/staff/delete", (req, res) => {
    const sql = "DELETE FROM staffs WHERE id = " + req.body.id;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.json({status: 200, message: "deleted"});
    })
})

app.listen(port ,()=> {
    console.log("Listening on port " + port);
})