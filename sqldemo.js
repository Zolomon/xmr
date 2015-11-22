var Xmr = (function() {    
    
    var env = process.env.NODE_ENV || 'development';
    var config = require('./config/config.json')[env];
    var models = require('./silo/models');
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
    var include = require('./includes.js');
    var slugify = require('slug');      


    var findCourse = options => new Promise(
        (resolve, reject) =>
            models.Course.find(options)
            .then(course => resolve(course))
            .catch(reject));

    var findExam = options => new Promise(
        (resolve, reject) => 
            models.Exam.find(options)
                .then(exam => resolve(exam))
                .catch(reject));
    
    var findProblem = options =>
        new Promise(        
            (resolve, reject) =>                         
                models.Problem.find(options)
                    .then(problem => resolve(problem))
                    .catch(reject));

    
    var findTag = options => new Promise(
        (resolve, reject) => 
            models.Tag.find(options)
                .then (tag => resolve (tag))
                .catch (reject));

    var createTag = options => new Promise(
        (resolve, reject) => 
            models.Tag.create( options)
            .then(tag => resolve(tag))
            .catch(reject));

    var createTagLink = options => new Promise(
        (resolve, reject) => 
            models.TagLink.create(options)
                .then(tagLink => resolve(tagLink))
                .catch(reject));

    var findTagLink = options => new Promise(
        (resolve, reject) => 
            models.TagLink.find(options)
            .then(tagLink => resolve(tagLink))
            .catch(reject));

    var findOrCreateTag = (course_id, exam_id, problem_id, tag_title) => new Promise((resolve, reject) => {    
        findTag({ where: { slug: slugify(tag_title) } })
            .then(tag => {
                return new Promise(
                    (resolveTag, rejectTag) => {
                        if (tag === undefined || tag === null) {
                            createTag( { title: title, slug: slugify(title) } )
                                .then(newTag => resolveTag(newTag))
                                .catch(rejectTag);

                        } else {
                            resolveTag(tag);
                        }
                    });            
            }).then(newTag => {
                findCourse({where:{id: course_id}, include: include.Courses()})
                    .then(course => {
                        findExam({where:{id: exam_id}}).then(exam => {
                            findProblem({where:{id: problem_id}}).then(problem => {

                                newTag.setCourse(course);
                                newTag.setExam(exam);
                                newTag.setProblem(problem);

                                createTagLink({
                                    title: newTag.title
                                }).then(tagLink => {

                                    tagLink.setTag(newTag);
                                    tagLink.setProblem(problem);
                                    
                                    resolve(newTag);
                                    
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);                
            });
    }); 

    Promise.all([
        //findCourse,
        //findProblem(329),
        //findTag('dubbeal')
        findOrCreateTag(6, 50, 329, 'dubbeal')
    ])
        .then(values => values.forEach(x => console.log(x)))
        .catch(err => console.log(err));

    return {
        findCourse: findCourse,
        findExam: findExam,
        findProblem: findProblem,
        findTag: findTag,
        findOrCreateTag: findOrCreateTag,        
        findTagLink: findTagLink
    };
}());
