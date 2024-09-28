const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mysql = require('mysql2');
const app = express();
const { faker } = require('@faker-js/faker');

const port  = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'misform_app',
    password: 'viky4752G@'
  });



app.set("view-engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public/materials")));
app.use(express.static(path.join(__dirname,"/public/CSS")));
app.use(express.static(path.join(__dirname,"/public/JS")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true }));
app.use(express.json());
app.engine('ejs',ejsMate);

app.get("/",(req,res)=>{
    res.render('login.ejs');
})

app.post("/login",(req,res)=>{
  let obj = req.body;
  // console.log(obj);
  let {applicationnum , email, mobilenum } = req.body;

  console.log(applicationnum,email,mobilenum);
  let q= `select * from user where applicationnum = ${applicationnum} `;

  connection.query(q,(err,result)=>{
    if(err) throw err;
    let data = result[0];
    console.log(data);
    if(data != undefined){
      if(data.email  ==  email && data.mobilenum == mobilenum ){
        res.redirect('/home');
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  })
});

app.get("/home",(req,res)=>{
    res.render('Form.ejs');
})

app.post('/home/Userinfo', (req, res) => {
  const { firstname, lastname, email, aadhaarnum, mobilenum, altmobilenum, applicationnum, course } = req.body;

  // Now you have access to the form data
  console.log(req.body);

  res.send('Form received');
});


app.listen(port,()=>{
    console.log("App is Listening");
});