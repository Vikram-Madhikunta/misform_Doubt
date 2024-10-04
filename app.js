const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mysql = require('mysql2');
const app = express();
const { faker } = require('@faker-js/faker');

const port  = 3000;

// MySQL database connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'misform_app',
    password: 'viky4752G@'
});

// Check the connection to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
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

let obj;

app.post("/login",(req,res)=>{
  let {applicationnum , email, mobilenum } = req.body;
  console.log(applicationnum,email,mobilenum);
  
  let q= `select * from user where applicationnum = ${applicationnum}`;
  connection.query(q, (err, result) => {
    if (err) throw err;
    let data = result[0];
    obj = data;
    console.log(data);
    
    if(data != undefined){
      if(data.email  ==  email && data.mobilenum == mobilenum ){
        res.redirect('/home');
      } else {
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  });
});

app.get("/home", (req, res) => {
  // if (obj.applicationnum == null || obj.email == null || obj.mobilenum == null) {
  //   res.redirect('/');
  // } else {
    res.render('Form.ejs');
  // }
});

app.post('/home/Userinfo', (req, res) => {
  const {
    firstname, Lastname, email, Aadharnum, MobileNum, AltMobilenum, TempAddress, PermanentAddress,
    Caste, Religion, City, State, Pincode, AccountHolder, Accountnum, IFSC, ParentsOccupation,
    incomerange, applicationnum, course, Roll10th, State10th, Marks10th, MaxMarks10th, Roll12th,
    State12th, Marks12th, MaxMarks12th
  } = req.body;

  let q = `INSERT INTO userdata (
    firstName, lastName, email, aadhaarNum, mobileNum, altMobileNum, 
    TempAddress, PermanentAddress, caste, religion, city, state, 
    pincode, accountHolder, accountNum, ifsc, parentsOccupation, incomeRange, 
    applicationNum, course, roll10th, state10th, marks10th, maxMarks10th, 
    roll12th, state12th, marks12th, maxMarks12th
) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
`;

  let values = [
    firstname, Lastname, email, Aadharnum, MobileNum, AltMobilenum, TempAddress, PermanentAddress,
    Caste, Religion, City, State, Pincode, AccountHolder, Accountnum, IFSC, ParentsOccupation,
    incomerange, applicationnum, course, Roll10th, State10th, Marks10th, MaxMarks10th, Roll12th,
    State12th, Marks12th, MaxMarks12th
  ];

  connection.query(q, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    console.log(result);
    res.send('Thank you for Form Filling');
  });

  console.log(req.body);
});


app.get("/admin",( async (req,res)=>{
  let q= `select * from userdata`;
  connection.query(q, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    let datas = result;
    // console.log(datas);
    res.render('admin.ejs', {datas} );
  });

}));

app.get("/admin/:id",(async(req,res) =>{
  let {id} = req.params;
  // console.log(id);
  let q= `select * from userdata where id = '${id}'`;
  connection.query(q, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    let data = result[0];
    // console.log(data);
    res.render('view.ejs', {data} );
  });
}))
app.get("/admin/:id/accepted",(async(req,res) =>{
  let {id} = req.params;
  // console.log(id);
  let q= `select * from userdata where id = '${id}'`;
  connection.query(q, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    let data = result[0];
    // console.log(data);
    res.render('view2.ejs', {data} );
  });
}))

app.delete("/admin/:id",(req,res)=>{
  const { id } = req.params;
  try{
    connection.query(`DELETE  FROM userdata WHERE id = '${id}'`,(err,results)=>{
       if(err) throw err;
       console.log(results);
       res.redirect("/admin");
    });
 }
 catch(err){
   console.log(err);
 }
})

app.delete("/admin/:id/Accept", (req, res) => {
  const { id } = req.params;

  // Query to select user data
  const selectQuery = `SELECT * FROM userdata WHERE id = ?`;

  connection.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error while fetching user data');
    }

    // Check if the user exists
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const data = results[0];

    // Delete the user
    const deleteQuery = `DELETE FROM userdata WHERE id = ?`;
    connection.query(deleteQuery, [id], (err, deleteResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error while deleting user');
      }

      // Log the results of the deletion
      console.log(deleteResults);

      // Insert accepted user data
      const insertQuery = `INSERT INTO acceptuserdata (
        firstName, lastName, email, aadhaarNum, mobileNum, altMobileNum, 
        TempAddress, PermanentAddress, caste, religion, city, state, 
        pincode, accountHolder, accountNum, ifsc, parentsOccupation, incomeRange, 
        applicationNum, course, roll10th, state10th, marks10th, maxMarks10th, 
        roll12th, state12th, marks12th, maxMarks12th
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        data.firstName, data.lastName, data.email, data.aadhaarNum, data.mobileNum, data.altMobileNum,
        data.TempAddress, data.PermanentAddress, data.caste, data.religion, data.city, data.state,
        data.pincode, data.accountHolder, data.accountNum, data.ifsc, data.parentsOccupation, data.incomeRange,
        data.applicationNum, data.course, data.roll10th, data.state10th, data.marks10th, data.maxMarks10th,
        data.roll12th, data.state12th, data.marks12th, data.maxMarks12th
      ];

      connection.query(insertQuery, values, (err, insertResults) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Database error while inserting accepted user data');
        }

        // Log the results of the insertion
        console.log(insertResults);
        res.redirect('/admin');
      });
    });
  });
});


app.get("/admin/acceptedStudents",( async (req,res)=>{
  let q= `select * from acceptuserdata`;
  connection.query(q, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    let datas = result;
    // console.log(datas);
    res.render('adminaccepted.ejs', {datas} );
  });

}));



app.listen(port, () => {
    console.log("App is Listening on port", port);
});
