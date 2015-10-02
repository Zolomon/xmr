var jayson = require('jayson');
//var Promise = require('bluebird');
var env = process.env.NODE_ENV || 'development';
var models = require('./silo/models');
var config = require('./config/config.json')[env];
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var include = require('./includes.js');

var server = jayson.server({

    getCourse: function(id, callback) {
        console.log('getCourse');
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
            callback(err);
        });
    },
    
    getAllCourses: function(callback) {
        new Promise(function(resolve, reject) {
            resolve(models.Course.findAll({include: include.Courses()}));
        }).then(function(courses) {
            return Promise.all(
                courses.map(function(course){
                    return course.get();
                }));
        }).then(function(courses) {
            callback(null, courses);
        }).catch(function(err) {
            callback(err);
        });
        
        // Promise.try(function() {
        //     return models.Course.findAll({
        //         include: include.Courses()
        //     });
        // }).map(function(course) {
        //     return course.get();
        // }).catch(function(error){
        //     console.log(error);
        // }).nodeify(callback);
        
        // getCourses(0,0)
        //     .then(function(courses) {
        //         return courses.map(function(course) {
        //             return course.get();
        //         });                
        //     }).catch(function(err) {
        //         console.log(err);
        //     }).nodeify(callback);               
    }
    
});
console.log(config.rpc.port);
server.http().listen(config.rpc.port);
