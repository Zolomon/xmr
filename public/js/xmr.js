/*global angular*/
(function () {
    var xmr = function($http) {
        var getExam = function(id) {
            return $http.get('/api/exams/' + id)
                .then(function (response) {
                    return response.data;
                });
        };

        var getCourses = function () {
            return $http.get('/api/courses')
                .then(function (response) {
                    return response.data;
                });
        };

        var getCourse = function(id) {
            return $http.get('/api/courses/' + id)
                .then(function (response) {
                    return response.data;
                });
        };

        var getProblemsWithTag = tag_slug => 
            $http.get('/api/tags/' + tag_slug)
            .then(response => response.data);

        var getProblem = id => 
            $http.get('/api/problem/' + id)
            .then(response => response.data);        

        return {
            getExam: getExam,
            getCourses: getCourses,
            getCourse: getCourse,
            getProblemsWithTag: getProblemsWithTag,
            getProblem: getProblem
        };
    };

    var module = angular.module('xmr');
    module.factory('xmr', xmr);
}());
