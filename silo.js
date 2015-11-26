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
var xmr = require('./libxmr.js');

//xmr.findProblem({where: {id: 329}}).then(x => console.log(x));

var server = jayson.server({

    getExam: (id, callback) => 
        xmr.findExam({where: {id: id}, include: include.Exams()})
        .then(exam => callback(null, exam))
        .catch(err => {
            console.log(err);
            callback(err);
        })
            ,

    getExams: (courseId, callback) => 
        xmr.findAllExams({where: {courseId: courseId}, include: include.Exams()})            
        .then(exams => callback(null, exams))
        .catch(err => {
            console.log(err);
            callback(err);
        })
            ,

    getCourse: (id, callback) =>         
        xmr.findCourse({where: {id: id}, include: include.Courses()})
        .then(course => callback(null, course))
        .catch(err => {
            console.log(err);
            callback(err);
        })
            ,

    getCourseFromExamId: (id, callback) => {
        var inclusion = include.Courses();
        inclusion[0].where = {id: id};
        xmr.findAllCourses({include: inclusion})
            .then(course => {callback(null, course.get());})
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    getAllCourses: callback => {
        xmr.findAllCourses({include: include.Courses()})
            .then(courses =>
                  callback(null, courses)
                 )
            .catch(err => {
                console.log(err); 
                callback(err);
            });
    },

    getProblemsWithTag: (tag_slug, callback) =>   {
        var inclusion = include.Courses();
        inclusion[0].include[0].include[2].include[0].where = {slug: tag_slug}; 
        var resultCourse =
            xmr.findAllCourses({include: inclusion})
            .catch(err => {
                console.log(err);
                callback(err);
            });
        
        var resultTag = xmr.findTag({where: {
            slug: tag_slug
        }}).catch(err => {
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
        var includeWhere = include.Courses();
        includeWhere[0].include[0].where = {id: id};

		console.log();
        
        xmr.findAllCourses({
            include: includeWhere
        })        
            .then(problem => {                
                console.log('Getting problem: ' + problem[0]);
                callback (null, problem[0]);
            })
            .catch(err => {
                console.log(err);
                callback(err);
            });
    },

    updateTag: (id, tag, callback) => 
        xmr.updateTag({
            title: tag.title,
            slug: slugify(tag.title),
            updatedAt: sequelize.fn('NOW')
        }, {
            where: {
                id: id
            }
        })
        .then(result => callback(null, result))
    ,
    destroyTagLink: (id, callback) => 
        xmr.destroyTagLink({where: {id: id}})
            .then(result => callback(null, {}))
    ,

    addTagAndTagLinkToProblem: (course_id, exam_id, problem_id, tag_title, callback) => {
        // 1. find or create the tag
        // 2.
        console.log('ADDING!!!');
        xmr.findOrCreateTagWithTagLink(course_id, exam_id, problem_id, tag_title)
            .then(tag => {
                console.log('tag: ' + tag);
                callback(null, {tag: tag});
            }).catch(err => {
                console.log(err);
                callback(err);
            });
    }    
});
console.log(config.rpc.port);

server.http().listen(config.rpc.port);
