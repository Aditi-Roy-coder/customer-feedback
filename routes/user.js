exports.home = function (req, res) {
   var message = '';
   res.render('home', { message: message });

};

//---------------------------------------------login page call------------------------------------------------------
exports.index = function (req, res) {
   var message = '';
   res.render('index', { message: message });

};

//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
   message = '';
   if (req.method == "POST") {
      var post = req.body;
      var name = post.Username;
      var pass = post.Password;

      var sql = "INSERT INTO customers (Username,Password) VALUES ('" + name + "','" + pass + "')";

      db.query(sql, function (err, result) {
         message = "Successfully! Your account has been created.";
         res.render('signup.ejs', { message: message });
      });

   } else {
      res.render('signup');
   }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
   var message = '';
   var sess = req.session;

   console.log("sess:" + sess.userId + " " + sess.user)

   if (req.method == "POST") {
      var post = req.body;
      var name = post.Username;
      var pass = post.Password;

      var sql = "SELECT id, username, password FROM customers WHERE username='" + name + "' and password = '" + pass + "'";
      db.query(sql, function (err, results) {
         if (results.length) {
            sess.userId = results[0].id;
            sess.user = results[0];
            console.log(results[0].id);

            res.redirect('/home/dashboard');
         }
         else {
            message = 'Wrong Credentials.';
            res.render('index.ejs', { message: message });
         }
      });
   } else {
      res.render('index.ejs', { message: message });
   }

};

//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {

   var userId = req.session.userId;
   console.log('ddd = ' + userId);
   if (userId == null) {
      res.redirect("/login");
      return;
   }

   var sql = "SELECT * FROM customers WHERE id = '" + userId + "'";

   db.query(sql, function (err, results) {
      req.session.user = results[0];
      var user = req.session.user;
      console.log(user);
      res.render('dashboard.ejs', { user: user, message: { "text": "", "newuser": "", "newpass": "" } });
   });
};

//-----------------------------------------------feedback functionality----------------------------------------------

exports.feedback = function (req, res) {
   var message = '';
   var sess = req.session;

   if (req.method == "POST") {
      var post = req.body;
      var name = post.username;
      var feed = post.feedback;

      var sql = "INSERT INTO feedbacks (username,feedback) VALUES ('" + name + "','" + feed + "')";

      db.query(sql, function (err, results) {
         if (results.length) {
            sess.userId = results[0].id;
            sess.user = results[0];
            console.log(results[0].id);            
         }
         res.redirect('/home/feedback');
      });
   } else {
      res.render('index.ejs', { message: message });
   }

};

//-----------------------------------------------after feedback functionality----------------------------------------------

exports.afterFeedback = function (req, res) {
   var user = req.session.user;
   res.render('feedback.ejs', { user: user, message: { "text": "", "newuser": "", "newpass": "" }});

};

//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
   req.session.destroy(function (err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------

// exports.profile = function(req, res){

//    var userId = req.session.userId;
//    if(userId == null){
//       res.redirect("/login");
//       return;
//    }

//    var sql="SELECT * FROM `user` WHERE `ID`='"+userId+"'";          
//    db.query(sql, function(err, result){  
//       res.render('profile.ejs',{data:result});
//    });
// };


//---------------------------------edit users details after login----------------------------------
// exports.editprofile = function (req, res) {
//    var userId = req.session.userId;
//    if (userId == null) {
//       res.redirect("/login");
//       return;
//    }

//    var sql = "SELECT * FROM `user` WHERE `ID`='" + userId + "'";
//    db.query(sql, function (err, results) {
//       res.render('edit_profile.ejs', { data: results });
//    });
// };

// setInterval(function () { db.query('select 1'); }, 5000);

