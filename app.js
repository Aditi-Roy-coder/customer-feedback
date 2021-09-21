const express = require('express');
var session = require('express-session');
const app = express();
const mysql = require('mysql');
var user = require('./routes/user')
var userOffice = require('./routes/userOffice')
var router = express.Router();
var bodyParser = require("body-parser");

const con = mysql.createConnection({
    host: "cs351db.clzhco7cwwan.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    port: "3306",
    database: "CS351_DB"
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');

    // var sql = "CREATE TABLE feedbacks (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), feedback VARCHAR(255))";
    // var sql = "INSERT INTO office (username, password) VALUES ('david', '0000')";

    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Query executed");
    // });

});

global.db = con;

app.use("/static", express.static("public"))
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: Date.now() + (30 * 86400 * 1000) }
}))



app.get('/', user.home)

app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post
app.get('/login', user.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/feedback', user.afterFeedback);//call for feedback page after feedback
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.post('/home/dashboard', user.feedback);//call for dashboard page after feedback
app.get('/home/logout', user.logout);//call for logout


app.get('/signupOffice', userOffice.signup);//call for signup page
app.post('/signupOffice', userOffice.signup);//call for signup post 
app.get('/loginOffice', userOffice.index);//call for login page
app.post('/loginOffice', userOffice.login);//call for login post
app.get('/home/dashboardOffice', userOffice.dashboard);//call for dashboard page after login
app.get('/home/logoutOffice', userOffice.logout);//call for logout


port = process.env.PORT || 80

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
