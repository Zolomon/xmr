var fs = require('fs');
var path = require('path');
var p = require('process');
var Promise = require('bluebird');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config.json')[env];
var m = require('./silo/models');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var include = require('./includes.js');
var xmr = require('./libxmr.js');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var extend = require('util')._extend;

fs = Promise.promisifyAll(fs);

var args = p.argv;
var course_dir = args[2];
var course_code = args[2];
var course_title = args[3];

if (args.length != 4) {
    console.log('Usage: <code> "<Title>"');
    process.exit();
}

var options = {
    basePath: './public/images/',
    basePathToStoreInSqlite: 'images/'
};

var dirs = ['exams', 'solutions'];

var onError = error => emitter.emit('error', error);

emitter.on('error', error => {
    console.log(error);
});

emitter.on('create_course', course_code =>
           xmr.findCourse({where: {code: course_code}})
           .then(course => {
               console.log('Found: ' + course);
               console.log('Description: ' + course_title);

               var context = {};

               context.courseCode = course_code;
               context.courseTitle = course_title;
               context.courseDir = `${options.basePath}courses/${course_code}/`;
               context.sqliteCourseDir = `${options.basePathToStoreInSqlite}courses/${course_code}/`;
               context.examCode = '';
               context.problemType = '';
               context.problemIndex = '';

               // Create course if it doesn't exist.
               if (course === null) {
                   xmr.createCourse({
                       code: course_code,
                       name: course_title
                   })
                       .then(newCourse => {
                           context.course = newCourse;
                           emitter.emit('new_course', extend({}, context));
                       })
                       .catch(onError);
               } else {
                   // Course already exists...
                   context.course = course;
                   emitter.emit('new_course', extend({}, context));
               }               
           })
          );

emitter.on('new_course', context => {
    var pathToExams = `${context.courseDir}/exams`;

    // Find exams
    fs.readdirAsync(pathToExams)
        .then(exams => {
            context.exams = exams;

            // Resolve new exams, so that we no we'll only create problems
            // for new exams
            exams.forEach(examCode => {
                context.examCode = examCode;

                xmr.findExam({where: {code: examCode}})
                    .then(theExam => {
                        if (theExam === null) {
                            xmr.createExam({code: examCode})
                                .then(newExam => {
                                    newExam.setCourse(context.course);

                                    context.examCode = examCode;
                                    context.exam = newExam;

                                    emitter.emit('new_exam', extend({}, context));
                                }).catch(onError);
                        } else {
                            // Exam already exists...
                            context.examCode = examCode;
                            context.exam = theExam;

                            emitter.emit('new_exam', extend({}, context));
                        }
                    }).catch(onError);
            });
        }).catch(onError);
});

emitter.on('new_exam', context => {
    var pathToQuestions = `${context.courseDir}exams/${context.examCode}/`;
    var pathToSolutions = `${context.courseDir}solutions/${context.examCode}/`;

    fs.readdirAsync(pathToQuestions)
        .then(problems => {

            problems.forEach(problem => {

                var matches = /(\d+)\.png/.exec(problem);
                var index = matches[1];

                context.problemIndex = index;
                
                emitter.emit('new_problem', extend({}, context));
            });
        }).catch(onError);
});

emitter.on('new_problem', context => {
    context.pathToQuestions = `${context.courseDir}exams/${context.examCode}/`;
    context.pathToSolutions = `${context.courseDir}solutions/${context.examCode}/`;

    xmr.findProblem({
        where: {
            index: context.problemIndex,
            ExamId: context.exam.id
        }})
        .then(theProblem => {
            if (theProblem === null) {
                xmr.createProblem({index: context.problemIndex})
                    .then(newProblem => {
                        newProblem.setExam(context.exam);
                        context.problem = newProblem;
                        emitter.emit('new_question', extend({},  context));
                    });
            } 
            // Problem already exists...
        });
});

emitter.on('new_question', context => {
    xmr.createQuestion({
        filename: `${context.sqliteCourseDir}exams/${context.examCode}/${context.problemIndex}.png`
    }).then(question => {
        question.setProblem(context.problem);
        context.question = question;
        context.problemType = 'Q';
        emitter.emit('new_answer', extend({}, context));
    }).catch(onError);
});

emitter.on('new_answer', context => {
    var answerPath = `${context.pathToSolutions}/${context.problemIndex}.png`;

    if (fs.existsSync(answerPath)) {

        xmr.createAnswer({
            filename: `${context.sqliteCourseDir}solutions/${context.examCode}/${context.problemIndex}.png`
        }).then(answer => {
            answer.setProblem(context.problem);
            context.problemType = 'A';
            context.answer = answer;
            emitter.emit('done', context);
        }).catch(onError);
    }
    // Answer does not exist...
});

emitter.on('done', c => {
    console.log(`${c.courseCode} ${c.examCode} ${c.problemType}:${c.problemIndex} imported`);
});

emitter.emit('create_course', course_code);
