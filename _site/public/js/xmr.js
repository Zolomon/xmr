(function () {
    var xmr = function($http) {
        var getExam = function(id) {
            return $http.get('/api/exam/' + id)
                .then(function (response) {
                    return response.data;
                });
        };

        var getCourseFromExamId = examId =>
                $http.get('/api/course/exam/' + examId)
                .then(response => response.data);

        var getCourses = function () {
            return $http.get("/api/courses")
                .then(function (response) {
                    return response.data;
                });
        };

        var getCourse = function(id) {
            return $http.get("/api/course/" + id)
                .then(function (response) {
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
            getCourseFromExamId: getCourseFromExamId
        };
    };

    var module = angular.module("xmr");
    module.factory("xmr", xmr);
}());
