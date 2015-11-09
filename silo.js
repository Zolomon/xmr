/*eslint no-unused-vars: 0 no-console: 0*/
/*eslint-env node*/
var jayson = require('jayson');
var env = process.env.NODE_ENV || 'development';
var models = require('./silo/models');
var config = require('./config/config.json')[env];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var include = require('./includes.js');
var slugify = require('slug');

var server = jayson.server({

    getExam: (id, callback) => {
        new Promise((resolve, reject) => {
            var exams = models.Exam.findAll({
                where: {
                    id: id
                },
                include: include.Exams()                
            });
            resolve(exams);
        })
            .then(exam => callback(null, exam))
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    getExams: (courseId, callback) => {
        new Promise((resolve, reject) => {
            resolve(models.Exams.findAll({
                where: {
                    courseId: courseId
                },
                include: include.Exams()
            }));
        })
            .then(exams =>  Promise.all( exams.map(exam => exam.get())))
            .then(exams => callback(null, exams))
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    getCourse: (id, callback) => {
        new Promise((resolve, reject) => {
            resolve(models.Course.findOne({
                where: {
                    id: id
                },
                include: include.Courses()                
            }));
        })
            .then(course => callback(null, course.get()))
            .catch(err => {
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

    getAllCourses: callback => {
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
    },

    getProblem: (id, callback) => {
        new Promise((resolve, reject) => {
            resolve(models.Problem.find({
                where: {
                    id: id
                }, include: [{
                    model: models.Answer
                }, {
                    model: models.Question
                }, {
                    model: models.TagLink,
                    include: [{
                        model: models.Tag
                    }]
                }]
            }));
        })
            .then(problem => {
                console.log(problem);
                callback (null, problem);
            })
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    updateTag: (id, tag, callback) => {
        new Promise((resolve, reject) => {
            console.log('id: ' + id);
            console.log('tag: ' + tag);
            resolve(models.Tag.update(
                {
                    title: tag.title,
                    slug: slugify(tag.title),
                    updatedAt: sequelize.fn('NOW')
                },
                {
                    where: {
                        id: id
                    }
                }
            ));
            
        })            
            .then(result => callback(null, result));
    },

    addTagToProblem: (problem_id, tag_title, callback) => {
        new Promise((resolve, reject) => {
            console.log('adding tag: ' + tag_title);
            var tag = models.Tag.find({
                where: {
                    slug: slugify(tag_title)
                }}).then(tag => {
                    if (tag === null || tag === undefined) {
                        
                    }
                    
                    models.TagLinks.create({
                        title: tag.title,
                        createdAt: sequelize.fn('NOW'),
                        updatedAt: sequelize.fn('NOW'),
                        ProblemId: problem_id,
                        TagId: tag.id
                    })
                });
            // 1. Find tag
            // 2. Create tag if it didn't exist
            // 3. Create a taglink to the problem for the tag.
            // Return the tag
        })
    }
});

console.log(config.rpc.port);

server.http().listen(config.rpc.port);
