var //models = require('../models'),
express = require('express'),
    router = express.Router(),
    jayson = require('jayson'),
    Promise = require('bluebird'),
    env = process.env.NODE_ENV || "development",    
    config = require('../config/config.json')[env],    
    client = jayson.client.http({port: config.rpc.port, hostname: config.rpc.hostname});

/* GET home page. */
router.get('/', function(req, res) {
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

module.exports = router;
