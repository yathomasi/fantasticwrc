var express = require("express");

var router = express.Router();

/* Add players i.e CREATE */
//Add to database
router.post('/add', function (req, res, next) {
  req.assert('name', 'Please fill the name').notEmpty();
  req.assert('team', 'Please fill the team').notEmpty();
  req.assert('email', 'A valid email is required').isEmail(); //Validate email

  var errors = req.validationErrors();
  if (!errors) {

    v_name = req.sanitize('name').escape().trim();
    v_team = req.sanitize('team').escape().trim();
    v_email = req.sanitize('email').escape().trim();
    v_address = req.sanitize('address').escape().trim();
    v_phone = req.sanitize('phone').escape();

    var player = {
      name: v_name,
      team: v_team,
      address: v_address,
      email: v_email,
      phone: v_phone
    };
    //mysql to create db if don't exists
    var create_sql = 'CREATE TABLE IF NOT EXISTS players(id int(10) not null auto_increment primary key,gw int(5) not null unique, name varchar(200)  NOT NULL,team varchar(100)  NOT NULL,favclub varchar(100) not null,phone varchar(20) NOT NULL, paid text not null)';
    req.getConnection(function (err, connection) {
      var query = connection.query(create_sql, function (err) {
        if (err) {
          var errors_detail = ("Error Create : %s ", err);
          req.flash('msg_error', errors_detail);
          res.render('players/add', {
            name: req.param('name'),
            team: req.param('team'),
            address: req.param('address'),
            email: req.param('email'),
            phone: req.param('phone'),
            user:req.user
          });
        }
      });
    });
    //mysql for create with insert
    var insert_sql = 'INSERT INTO users SET ?';
    req.getConnection(function (err, connection) {
      var query = connection.query(insert_sql, player, function (err, result) {
        if (err) {
          var errors_detail = ("Error Insert : %s ", err);
          req.flash('msg_error', errors_detail);
          res.render('players/add', {
            name: req.param('name'),
            team: req.param('team'),
            address: req.param('address'),
            email: req.param('email'),
            phone: req.param('phone'),
            user:req.user
          });
        } else {
          req.flash('msg_info', 'Create player success');
          res.redirect('/players');
        }
      });
    });
  } else {
    console.log(errors);
    errors_detail = "Sorry there are error <ul>";
    for (var i in errors) {
      error = errors[i];
      errors_detail += '<li>' + error.msg + '</li>';
    }
    errors_detail += "</ul>";
    req.flash('msg_error', errors_detail);
    res.render('players/add', {
      name: req.param('name'),
      address: req.param('address'),
      user:req.user
    });
  }

});
//Add player view
router.get('/add', function (req, res, next) {
  res.render('players/add', {
    title: 'Add New Player',
    name: '',
    team: '',
    email: '',
    phone: '',
    address: '',
    user:req.user
  });
});

/* GET players list page ie. RETRIVE */
router.get("/", function (req, res, next) {
  // res.render("players", { title: "Players" });
  req.getConnection(function (err, connection) {
    //mysql select query to retrieve data
    var query = connection.query("SELECT * FROM users ORDER BY name", function (err, rows) {
      if (err) {
        var errors_detail = ("Error Selecting : %s ", err);
        req.flash("msg_error", errors_detail);
        res.render("players/list", {
          title: "Players",
          user:req.user
        });
      } else {
        res.render("players/list", {
          title: "Players",
          data: rows,
          user:req.user
        });
      }
    });
  });
});

/*Edit the players data ie. UPDATE*/

//Update Page View
router.get('/edit/:Id', function (req, res, next) {
  req.getConnection(function (err, connection) {
    //mysql select query to retrieve data
    var query = connection.query('SELECT * FROM users where id=' + req.params.Id, function (err, rows) {
      if (err) {
        var errornya = ("Error Selecting : %s ", err);
        req.flash('msg_error', errors_detail);
        res.redirect('/players');
      } else {
        if (rows.length <= 0) {
          req.flash('msg_error', "Player can't be find!");
          res.redirect('/players');
        } else {
          console.log(rows);
          res.render('players/edit', {
            title: "Edit ",
            data: rows[0],
            user:req.user
          });

        }
      }

    });
  });
});
//Update data here
router.put('/edit/:id', function (req, res, next) {
  req.assert('name', 'Please fill the name').notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_name = req.sanitize('name').escape().trim();
    v_team = req.sanitize('team').escape().trim();
    v_email = req.sanitize('email').escape().trim();
    v_address = req.sanitize('address').escape().trim();
    v_phone = req.sanitize('phone').escape();

    var player = {
      name: v_name,
      team: v_team,
      address: v_address,
      email: v_email,
      phone: v_phone
    };
    //mysql update query 
    var update_sql = 'update users SET ? where id = ' + req.params.id;
    req.getConnection(function (err, connection) {
      var query = connection.query(update_sql, player, function (err, result) {
        if (err) {
          var errors_detail = ("Error Update : %s ", err);
          req.flash('msg_error', errors_detail);
          res.render('players/edit', {
            name: req.param('name'),
            team: req.param('team'),
            address: req.param('address'),
            email: req.param('email'),
            phone: req.param('phone'),
            user:req.user
          });
        } else {
          req.flash('msg_info', 'Update player success');
          res.redirect('/players/edit/' + req.params.id);
        }
      });
    });
  } else {

    console.log(errors);
    errors_detail = "Sory there are error<ul>";
    for (var i in errors) {
      error = errors[i];
      errors_detail += '<li>' + error.msg + '</li>';
    }
    errors_detail += "</ul>";
    req.flash('msg_error', errors_detail);
    res.render('players/add', {
      name: req.param('name'),
      address: req.param('address'),
      user:req.user
    });
  }
});

/* Remove player form the list ie. DELETE*/
//delete form database
router.delete('/delete/:id', function (req, res, next) {
  req.getConnection(function (err, connection) {
    var player = {
      id: req.params.id,
    };
    //mysql delete query
    var delete_sql = 'delete from users where ?';
    req.getConnection(function (err, connection) {
      var query = connection.query(delete_sql, player, function (err, result) {
        if (err) {
          var errors_detail = ("Error Delete : %s ", err);
          req.flash('msg_error', errors_detail);
          res.redirect('/players');
        } else {
          req.flash('msg_info', 'Delete Player Success');
          res.redirect('/players');
        }
      });
    });
  });
});

router.get("/winners", function (req, res, next) {
  // res.render("players", { title: "Players" });
  req.getConnection(function (err, connection) {
    //mysql select query to retrieve data
    var query = connection.query("select * from users join gw on users.id=gw.winid order by gw.num", function (err, rows) {
      if (err) {
        var errors_detail = ("Error Selecting winners : %s ", err);
        req.flash("msg_error", errors_detail);
        res.render("players/winner", {
          title: "Players",
          user:req.user
        });
      } else {
        res.render("players/winners", {
          title: "Winners",
          data: rows,
          user:req.user
        });
      }
    });
  });
});

//Add winner view
router.get('/addwinner', function (req, res, next) {
  req.getConnection(function (err, connection) {
    //mysql select query to retrieve data
    var query1 = connection.query("SELECT * FROM gw ORDER BY num", function (err, gwrows) {
      if (err) {
        var errors_detail = ("Error Selecting in gw : %s ", err);
        req.flash("msg_error", errors_detail);

        res.render('players/addwinner', {
          title: 'Add Winner Player',
          num: '',
          winid: '',
          user:req.user
        });
      } else {

        var query = connection.query("SELECT * FROM users ORDER BY name", function (err, rows) {
          if (err) {
            var errors_detail = ("Error Selecting in users  : %s ", err);
            req.flash("msg_error", errors_detail);

            res.render('players/addwinner', {
              title: 'Add Winner Player',
              num: '',
              winid: '',
              user:req.user
            });
          } else {
            res.render("players/addwinner", {
              title: "Add Winner Player",
              data: rows,
              gwdata: gwrows,
              user:req.user
            });
          }
        });
      }

    });
  });
});
router.post('/addwinner', function (req, res, next) {
    console.log(req.body);
    req.assert('gameweek', 'Please Select GameWeek').isNumeric();
    req.assert('winner', 'Please Select Winner').isNumeric();
    var errors = req.validationErrors();
    var player = {
      num : req.body.gameweek,
      winid : req.body.winner,
    };
    var insert_sql = 'INSERT INTO gw SET ?';
    req.getConnection(function(err, connection){
      var query = connection.query(insert_sql, player, function(err,result){
        if(err){
          var errors_detail = ("Error Adding : %s ", err);
          req.flash('msg_error', errors_detail);
          res.redirect('/players/addwinner');
        }else{
          req.flash('msg_info', 'Winner Selected');
          res.redirect('/players/winners');
        }
      });
    });

  //   //mysql for create with insert
  //   var insert_sql = 'INSERT INTO gw SET ?';
  //   req.getConnection(function (err, connection) {
  //     var query = connection.query(insert_sql, player, function (err, result) {
  //       if (err) {
  //         var errors_detail = ("Error Insert : %s ", err);
  //         req.flash('msg_error', errors_detail);
  //         res.render('players/addwinner', {

  //         });
  //       } else {
  //         req.flash('msg_info', 'Add winner success');
  //         res.redirect('/winners');
  //       }
  //     });
  //   });
  // } else {
  //   console.log(errors);
  //   errors_detail = "Sorry there are error <ul>";
  //   for (var i in errors) {
  //     error = errors[i];
  //     errors_detail += '<li>' + error.msg + '</li>';
  //   }
  //   errors_detail += "</ul>";
  //   req.flash('msg_error', errors_detail);
  //   res.render('players/add', {
  //     name: req.param('name'),
  //     address: req.param('address')
  //   });
  // }

});
/* Remove winner form the list ie. DELETE*/
//delete form database gw
router.delete('/winners/delete/:num', function (req, res, next) {
  req.getConnection(function (err, connection) {
    var player = {
      num : req.params.num,
    };
    //mysql delete query
    var delete_sql = 'delete from gw where ?';
    req.getConnection(function (err, connection) {
      var query = connection.query(delete_sql, player, function (err, result) {
        if (err) {
          var errors_detail = ("Error Delete : %s ", err);
          req.flash('msg_error', errors_detail);
          res.redirect('/players/winners');
        } else {
          req.flash('msg_info', 'Delete Player Success');
          res.redirect('/players/winners');
        }
      });
    });
  });
});
module.exports = router;
