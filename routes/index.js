var express = require('express'),
    router = express.Router(),
    jayson = require('jayson'),
    env = process.env.NODE_ENV || "development",
    config = require('../config/config.json')[env],
    client = jayson.client.http({port: config.rpc.port, hostname: config.rpc.hostname});

/* GET home page. */
router.get('/api/exams/:exam_id', function(req, res) {
    console.log(req.params.exam_id);

    new Promise(function(resolve, reject) {
        client.request('getExam', [req.params.exam_id], function(err, error, response) {
            if (err) {
                reject(err);
            } else {
                console.log(response);
                resolve(response);
            }
        });
    }).then(function (response) {
        res.send(response);
    }).then(function (err) {
        res.send(err);
    });
});

router.get('/api/courses', function(req, res) {
    new Promise(function(resolve, reject) {
        client.request('getAllCourses', [], function(err, error, response) {
            if(err) {
                reject(err);
            }
            else {
                console.log(response);
                resolve(response);
            }
        });
    }).then(function(response) {
        res.send(response);
    }).catch(function(err) {
        res.send(err);
    });
});

router.get('/api/courses/:course_id', function(req, res) {
    new Promise(function(resolve, reject) {
        client.request('getCourse', [req.params.course_id], function(err, error, response) {
            if(err) {
                reject(err);
            } else {
                console.log(response);
                resolve(response);
            }
        });
    }).then(function(response) {
        res.send(response);
    }).catch(function(err) {
        res.send(err);
    });
});

module.exports = router;
