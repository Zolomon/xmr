var Xmr = (function() {    
    
    var env = process.env.NODE_ENV || 'development';
    var config = require('./config/config.json')[env];
    var m = require('./silo/models');
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
    var include = require('./includes.js');
    var slugify = require('slug');      

    var create = (model, options) => 
        new Promise((resolve, reject) => 
                    model.create(options)
                    .then(resolve)
                    .catch(reject));

    var findAll = (model, options) =>
        new Promise((resolve, reject) =>
                    model.findAll(options)
                    .then(resolve)
                    .catch(reject));
    
    var find = (model, options) =>
        new Promise((resolve, reject) =>
                    model.find(options)
                    .then(resolve)
                    .catch(reject));

    var destroy = (model, options) =>
        new Promise((resolve, reject) =>
                    model.destroy(options)
                    .then(resolve)
                    .catch(reject));

    var update = (model, values,  options) =>
        new Promise((resolve, reject) =>
                    model.update(values, options)
                    .then(resolve)
                    .catch(reject));
    
    var createCourse = options => create(m.Course, options);
    var updateCourse = (values, options) => update(m.Course, values, options);
    var findCourse = options => find(m.Course, options);
    var findAllCourses = options => findAll(m.Course, options);
    var destroyCourse = options => destroy(m.Course, options);
    
    var createExam = options => create(m.Exam, options);
    var updateExam = (values, options) => update(m.Exam, values, options);
    var findAllExams = options => findAll(m.Exam, options);
    var findExam = options => find(m.Exam, options);
    var destroyExam = options => destroy(m.Exam, options);

    var createProblem = options => create(m.Problem, options);
    var updateProblem = (values, options) => update(m.Problem, values, options);
    var findAllProblems = options => findAll(m.Problem, options);
    var findProblem = options => find(m.Problem, options);
    var destroyProblem = options => destroy(m.Problem, options);

    var createTag = options => create(m.Tag, options);
    var updateTag = (values, options) => update(m.Tag, values, options);
    var findAllTags = options => findAll(m.Tag, options);
    var findTag = options => find(m.Tag, options);
    var destroyTag = options => destroy(m.Tag, options);
    
    var createTagLink = options => create(m.TagLink, options);
    var updateTagLink = (values, options) => update(m.TagLink, values, options);
    var findAllTagLinks = options => findAll(m.TagLink, options);
    var findTagLink = options => find(m.TagLink, options);
    var destroyTagLink = options => destroy(m.TagLink, options);    

    var findOrCreateTagWithTagLink = (course_id, exam_id, problem_id, tag_title) => new Promise((resolve, reject) => {
        console.log('Calling findOrCreateTagWithTagLink');
        findTag({ where: { slug: slugify(tag_title) } })
            .then(tag => {
                console.log('found the tag: ' + tag);
                return new Promise(
                    (resolveTag, rejectTag) => {
                        if (tag === undefined || tag === null) {
                            createTag( { title: tag_title, slug: slugify(tag_title) } )
                                .then(newTag => {
                                    console.log('created the tag: ' + newTag);
                                    resolveTag({new: true, tag: newTag});
                                })
                                .catch(rejectTag);

                        } else {
                            console.log('Found the tag: ' + tag);
                            resolveTag({new: false, tag: tag});
                        }
                    });            
            }).then(newTag => {
                if (newTag.new) {
                    findCourse({where:{id: course_id}, include: include.Courses()})
                        .then(course => {
                            findExam({where:{id: exam_id}})
                                .then(exam => {
                                    findProblem({where:{id: problem_id}})
                                        .then(problem => {

                                            newTag.setCourse(course);
                                            newTag.setExam(exam);
                                            newTag.setProblem(problem);

                                            createTagLink({
                                                title: newTag.tag.title
                                            }).then(tagLink => {

                                                tagLink.setTag(newTag.tag);
                                                tagLink.setProblem(problem);
                                                
                                                resolve(tagLink);
                                                
                                            }).catch(reject);
                                        }).catch(reject);
                                }).catch(reject);
                        }).catch(reject);
                } else {
                    findProblem({where: {id: problem_id}})
                        .then(problem => {
                            createTagLink({
                                title: newTag.tag.title
                            }).then(tagLink => {
                                
                                tagLink.setTag(newTag.tag);
                                tagLink.setProblem(problem);
                                
                                resolve(tagLink);
                                
                            }).catch(reject);
                        }).catch(reject);                    
                    
                    //resolve(newTag.tag);
                }
            });
    });

    return {        
        findOrCreateTagWithTagLink: findOrCreateTagWithTagLink,
        
        createCourse: createCourse,
        updateCourse: updateCourse,
        findCourse: findCourse,
        findAllCourses: findAllCourses,
        destroyCourse: destroyCourse,
        
        createExam: createExam,
        updateExam: updateExam,
        findAllExams: findAllExams,
        findExam: findExam,
        destroyExam: destroyExam,

        createProblem: createProblem,
        updateProblem: updateProblem,
        findAllProblems: findAllProblems,
        findProblem: findProblem,
        destroyProblem: destroyProblem,

        createTag: createTag,
        updateTag: updateTag, 
        findAllTags: findAllTags,
        findTag: findTag,
        destroyTag: destroyTag,

        createTagLink: createTagLink,
        updateTagLink: updateTagLink,
        findAllTagLinks: findAllTagLinks,
        findTagLink: findTagLink,
        destroyTagLink: destroyTagLink
    };
}());

module.exports = Xmr;
