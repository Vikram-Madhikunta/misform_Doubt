const mysql = require('mysql2');

const data = require('./data.js');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'misform_app',
    password: 'viky4752G@'
  });

let q= "INSERT INTO user VALUES ?";

connection.query(q,[data],(err,result)=>{
    if(err) throw err;
    console.log(result);
})

