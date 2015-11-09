/*eslint no-console: 0*/
var express = require('express'),
    router = express.Router(),
    jayson = require('jayson'),
    env = process.env.NODE_ENV || 'development',
    config = require('../config/config.json')[env],
    client = jayson.client.http({port: config.rpc.port, hostname: config.rpc.hostname});

/* GET home page. */
router.get('/api/exams/:exam_id', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('getExam', [req.params.exam_id], (err, error, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
        .then(response => res.send(response))
        .then(err => res.send(err));
});

router.get('/api/courses', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('getAllCourses', [], (err, error, response) =>{
            if(err) {
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    })
        .then(response => res.send(response))
        .catch(err => res.send(err));
});

router.get('/api/courses/:course_id', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('getCourse', [req.params.course_id], (err, error, response) =>{
            if(err) {
                reject(err);
            } else {                
                resolve(response);
            }
        });
    })
        .then(response => res.send(response))
        .catch(err => res.send(err));
});

router.get('/api/tags/:tag_slug', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('getProblemsWithTag', [req.params.tag_slug], (err, error, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
        .then(response => res.send(response))
        .catch(err => res.send(err));    
});

router.put('/api/tags/:tag_id', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('updateTag', [req.params.tag_id, req.body], (err, error, response) => {
            if(err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
        .then(response => res.send(response))
        .catch(err => res.send(err));
});

router.delete('/api/taglinks/:taglink_id', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('deleteTaglink', [req.params.taglink_id], (err, error, response)  => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
            .then(response => res.send(response))
            .catch(err => res.send(err));        
    });
});

router.post('/api/tags', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('addTagToProblem', [req.body.problem_id, req.body.tag_title], (err, error, response) => {
            if(err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    })
        .then(response => res.send(response))
        .catch(err => res.send(err));
})

router.get('/api/problems/:problem_id', (req, res) => {
    new Promise((resolve, reject) => {
        client.request('getProblem', [req.params.problem_id], (err, error, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });        
    })
        .then(response => {
            console.log(response);
            res.send(response);
        })
        .catch(err => res.send(err));
});

module.exports = router;
