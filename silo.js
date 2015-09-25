var jayson = require('jayson'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('data/data.db');

var server = jayson.server({
    
    
    getCourse: function(id, depth, callback) {
        // select q.*,aa.* from Problems as p join Questions as q on p.id=q.problemid  join  (select a.* from Problems as p join Answers as a on p.id=a.problemid where examid=1) as aa on p.id=aa.problemid;
        
        if (depth.all) {
// db.all('select c.id, c.name, c.code, c.createdAt, c.updatedAt, e.id, e.title, e.code, e.createdAt, e.updatedAt FROM Courses AS c WHERE id=(?) JOIN Exams AS e ON c.id=e.CourseId JOIN Problems AS p on e.id=p.ExamId JOIN TagLinks AS tl on p.id=tl.ProblemId JOIN Questions as Q on p.id=Q.ProblemId JOIN Answers AS a on p.id=a.ProblemId', [id], function(err, rows) {
//             console.log(rows);
//             callback(null, rows);
//         });
//         } else if ()
      }

      

    },
    
    getAllCourses: function(callback) {
        console.log(db);
        db.all('SELECT id, name, code, createdAt, updatedAt FROM Courses ORDER BY name DESC', function(err, rows) {
            console.log(rows);
            callback(null, rows);
        });
    },
    
    add: function(a, b, callback) {
        callback(null, a + b);
    }
});

server.tcp().listen(3000);
