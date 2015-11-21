var env = process.env.NODE_ENV || 'development';
var config = require('./config/config.json')[env];
var models = require('./silo/models');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var include = require('./includes.js');

var findCourse = new Promise((resolve, reject) => 
	                         resolve(models.Course.find({
		                         id: 1                                 
	                         }, {
                                 include: include.Courses()
                             })))
	.then(course => course.get())
    .catch(err => console.log(err));

var inclusion = include.Courses();

var findProblem = id =>
    
    //inclusion[0].include[0].where = {id: 329};
	models.Course.findAll({

		include: [{
            model: models.Exam,
            include: [{
                model: models.Problem,
                where: {
                    id: id
                },
                include: [{
                    model: models.Answer
                }, {
                    model: models.Question
                }, {
                    model: models.TagLink,
                    include: [{
                        model: models.Tag
                    }, {
                        model: models.Problem
                    }]
                }]                
            }]
        }]
	})
//.then(x => x)
    .catch(err => console.log(err));


Promise.all([
    //findCourse,
    findProblem(329)])
    .then(values => values.forEach(x => console.log(x)))
    .catch(err => console.log(err));


