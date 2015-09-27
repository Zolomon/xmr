var jayson = require('jayson'),
    Promise = require('bluebird'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config.json')[env],
    Sequelize = require('sequelize'),
    sequelize = new Sequelize(config.database, null, null, config);
//sequelize = new Sequelize(config.database, config.username, config.password, config);

var Course = sequelize.define('Course', {
    name: Sequelize.STRING,
    code: Sequelize.STRING
});

//console.log(models);

// models.Course.findAll().then(function(courses) {
//   console.log(courses);
// });

var getCourses = function(skip, take) {
    console.log('test');
    return new Promise(function(resolve, reject) {
        console.log('Trying to authenticate');
        sequelize.sync().then(function() {
            console.log('Authenticate succeeded');
            resolve(Course.findAll());
                //.then(function(courses) {
                //resolve(courses.map(function(c) { c.get(); }));
            }).catch(reject);
        });
        //sequelize.sync().then(function() {
        
        //}).catch(reject);
    //});
};

console.log('l34');
var courses = getCourses(0, 100)
    .then(function(courses) {
        courses.map(function(course) {
            console.log(course.get());
        });        
        
    })
    .catch(function(error) {
        console.log('failure');
        console.log(error);
    });
//console.log(courses);
console.log('l45');


var server = jayson.server({

    getAllCourses: function(callback) {
        getCourses(0,0)
            .then(function(courses) {
                return courses.map(function(course) {
                    return course.get();
                });                
            }).catch(function(err) {
                console.log(err);
            }).nodeify(callback);
        //console.log('getAllCourses');
        //debugger;
        

        // var p1 = sequelize.sync().then(
        //   function(){
        //     //console.log('this is running');
        //     return Course.findAll();
        //   });
        // console.log(p1);
        // p1.then(function (courses){
        //   console.log(courses);
        //   var db = {}, i = 0;
        //   courses.forEach(function(course) {
        //     db[i] = course.get();
        //     i += 1;
        //   })
        //   return db;
        // })
        // .catch(function(err) {
        //          console.log(err);
        //        });
        // console.log('...');
        // var courses = getCourses(0, 100)
        //     .then(function(db) {
        //         console.log('........');
        //         callback(null, db);
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //     });
        // console.log(courses);
        // courses.map(function(c){
        //     console.log(c);
        // });
        // callback(null, courses);
        //p1.map(function(courses) {
        //  return course.get();
        //})
        // .then(function(courses) {
        //   courses.forEach(function(course) {
        //     //console.log(course);
        //   });
        // })
        //.nodeify(callback);
        // console.log('getAllCourses');
        // Promise.try(function() {
        //   console.log('trying');
        //   var findAll = models.Course.findAll();
        //   console.log(findAll);
        //   console.log(models);
        //   return findAll
        //          .then(function (courses) {
        //            console.log('found all');
        //            return courses;
        //          });
        // }).catch(function(err){
        //            console.log(err);
        //          }).map(function (course) {
        //   console.log('mapping');
        //   return course.get();
        // })                
        // .nodeify(callback);
        // 
        // debugger;
        // var p1 = 
        //   Promise.try(function() {
        //     return models.Course.findAll();
        //   }, function() {
        //        console.log("lol, error!");
        //      });
        // var p2 = p1.map(function(course) {
        //            debugger;
        //            return course.get();
        //          });
        // p2.nodeify(callback);
    }
    
    // getCourse: function(id, depth, callback) {
    //   // select q.*,aa.* from Problems as p join Questions as q on p.id=q.problemid  join  (select a.* from Problems as p join Answers as a on p.id=a.problemid where examid=1) as aa on p.id=aa.problemid;
    
    //   if (depth.all) {
    //     // db.all('select c.id, c.name, c.code, c.createdAt, c.updatedAt, e.id, e.title, e.code, e.createdAt, e.updatedAt FROM Courses AS c WHERE id=(?) JOIN Exams AS e ON c.id=e.CourseId JOIN Problems AS p on e.id=p.ExamId JOIN TagLinks AS tl on p.id=tl.ProblemId JOIN Questions as Q on p.id=Q.ProblemId JOIN Answers AS a on p.id=a.ProblemId', [id], function(err, rows) {
    //     //             console.log(rows);
    //     //             callback(null, rows);
    //     //         });
    //     //         } else if ()
    //   }
    

    // },
    
    // getAllCourses: function(callback) {
    //   var ccs = models.Course.findAll()
    //             .then(function (courses) {
    //               console.log('Wohoo!');
    //               console.log(courses.get());
    //               return courses;
    //             }).catch(
    //               function(error) {
    //                 console.log(error);
    //               });
    //   console.log('ccs is:' + ccs);
    //   callback(null, ccs);
    //   console.log('received request for getAllCourses');
    //   //callback(null, 'hello world');
    
    //   var courses = models.sequelize.models.Course.findAll(
    //     // {
    //     //       include: [{
    //     //         model: models.Exam,
    //     //         include: [{
    //     //           model: models.Problem,
    //     //           include: [{
    //     //             model: models.Answer
    //     //           }, {
    //     //             model: models.Question
    //     //           }]
    //     //         }]
    //     //       }]
    //     //     }
    //   ).then(function(courses) {
    

    //                   courses.forEach(function (course) {
    //                     console.log(course);
    //                   });
    
    //                   console.log(courses);
    //                   return courses;
    //                   //callback(null, courses);
    //                   // res.render('index', {
    //                   //   title: 'Xmr',
    //                   //   courses: courses
    //                   // });
    //                 });
    
    //   callback(null, courses);

    //   // console.log(db);
    //   // db.all('SELECT id, name, code, createdAt, updatedAt FROM Courses ORDER BY name DESC', function(err, rows) {
    //   //   console.log(rows);
    //   //   callback(null, rows);
    //   // });
    // }
    //,
    
    // add: function(a, b, callback) {
    //   callback(null, a + b);
    // }
});
console.log(config.rpc.port);
server.http().listen(config.rpc.port);
