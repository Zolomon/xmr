/*global angular*/
(function () {
    var xmr = ($http) => {
        var getExam = id =>
            $http.get('/api/exams/' + id)
            .then( response =>response.data);
        

        var getCourses = () => 
            $http.get('/api/courses')
            .then(response => response.data);

        var getCourse = id =>
            $http.get('/api/courses/' + id)
            .then(response =>response.data);
        

        var getProblemsWithTag = tag_slug => 
            $http.get('/api/tags/' + tag_slug)
            .then(response => response.data);

        var getProblem = id => 
            $http.get('/api/problems/' + id)
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
