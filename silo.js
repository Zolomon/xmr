/*eslint no-unused-vars: 0 no-console: 0*/
/*eslint-env node*/
var jayson = require('jayson');
var env = process.env.NODE_ENV || 'development';
var models = require('./silo/models');
var config = require('./config/config.json')[env];
//var Sequelize = require('sequelize');
//var sequelize = new Sequelize(config.database, config.username, config.password, config);
var include = require('./includes.js');

var server = jayson.server({

    getExam: function(id, callback) {
        new Promise(function(resolve, _) {
            var exams = models.Exam.findAll({
                where: {
                    id: id
                },
                include: include.Exams()                
            });
            resolve(exams);
        }).then(function(exam) {
            callback(null, exam);
        }).catch(function(err) {
            console.log(err);
            callback(err);
        });
    },

    getExams: function(courseId, callback) {
        new Promise(function(resolve, reject) {
            resolve(models.Exams.findAll({
                where: {
                    courseId: courseId
                },
                include: include.Exams()
            }));
        }).then(function(exams) {
            return Promise.all(
                exams.map(function(exam){
                    return exam.get();
                }));
        }).then(function(exams) {
            callback(null, exams);
        }).catch(function(err) {
            console.log(err);
            callback(err);
        });
    },

    getCourse: function(id, callback) {
        new Promise(function(resolve, reject) {
            resolve(models.Course.findOne({
                where: {
                    id: id
                },
                include: include.Courses()                
            }));
        }).then(function(course) {
            callback(null, course.get());
        }).catch(function (err) {
            console.log(err);
            callback(err);
        });
    },

    getCourseFromExamId: (id, callback) => {
        new Promise((resolve, reject) => {
            resolve(models.Course.findAll({
                where: {
                    'Exam.id': id
                }, include: include.Courses()
            }));
        }).then(course => {callback(null, course.get());})
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    getAllCourses: function(callback) {
        new Promise((resolve, reject) => {
            resolve(models.Course.findAll({
                include: include.Courses()
            }));
        }).then(courses =>
                Promise.all(courses.map(course => course.get()))
               ).then(courses =>
                      callback(null, courses)
                     )
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    getProblemsWithTag: (tag_slug, callback) => {
        var resultCourse = new Promise((resolve,reject) => {
            resolve(models.Course.findAll({
                include: [{model: models.Exam,
                           include: [{
                               model: models.Problem,
                               include: [{
                                   model: models.Answer
                               }, {
                                   model: models.Question
                               }, {
                                   model: models.TagLink,
                                   include: [{
                                       model: models.Tag,
                                       where: {
                                           slug: tag_slug
                                       }
                                   }]
                               }]
                           }]
                          }]
            }));
        })
            .catch(err => {
                console.log(err);
                callback(err);
            });
        
        var resultTag = new Promise((resolve, reject) => {
            resolve(models.Tag.find({
                where: {
                    slug: tag_slug
                }
            }));
        })
            .catch(err => {
                console.log(err);
                callback(err);
            });

        var result = Promise.all([resultCourse, resultTag]);
        
        result.then(data => {            
            var result = {
                course: data[0],
                tag: data[1]
            };
            callback (null, result);
        }).catch(err => {
            console.log(err);
            callback(err);
        });
    }
});

console.log(config.rpc.port);

server.http().listen(config.rpc.port);
