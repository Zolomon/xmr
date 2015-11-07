(function () {
    var xmr = function($http) {
        var getExam = function(id) {
            return $http.get('/api/exams/' + id)
                .then(function (response) {
                    return response.data;
                });
        };

        var getCourses = function () {
            return $http.get("/api/courses")
                .then(function (response) {
                    return response.data;
                });
        };

        var getCourse = function(id) {
            return $http.get("/api/courses/" + id)
                .then(function (response) {
                    return response.data;
                });
        };

        var getProblemsWithTag = tag_slug => {
            return $http.get('/api/tags/' + tag_slug)
                .then(response => {
                    return response.data;
                });
        };

        // var getRepoDetails = function(username, reponame) {
        //     var repo;
        //     var repoUrl = "https://api.github.com/repos/" + username + "/" + reponame;

        //     return $http.get(repoUrl)
        //         .then(function (response) {
        //             repo = response.data;
        //             return $http.get(repoUrl + "/collaborators");
        //         })
        //         .then(function (response) {
        //             repo.collaborators = response.data;
        //             return repo;
        //         });
        // };

        return {
            getExam: getExam,
            getCourses: getCourses,
            getCourse: getCourse,
            getProblemsWithTag: getProblemsWithTag
        };
    };

    var module = angular.module("xmr");
    module.factory("xmr", xmr);
}());
