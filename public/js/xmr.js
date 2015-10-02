(function () {
    var xmr = function($http) {
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
        }

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
            getCourses: getCourses,
            getCourse: getCourse
        };    
    };

    var module = angular.module("xmr");
    module.factory("xmr", xmr);
}());
