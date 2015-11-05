(function() {
    var app = angular.module('xmr');

    var CourseController = function($scope, $routeParams, xmr) {

        var onCourses = function (data) {
            $scope.courses = data;
        };

        var onCourse = function(data) {
            $scope.course = data;
            //$scope.problems = data.map(x => x.)
            var tagLinks = [].concat.apply([],
                             [].concat.apply([],
                               data.Exams.map(e =>
                                 e.Problems.map(x => x.TagLinks))));

            console.log(tagLinks);
            
            var flattenedTagLinks = {};

            for(var t in tagLinks) {
                var tag = tagLinks[t];
                if (!(tag.title in flattenedTagLinks)) {
                    flattenedTagLinks[tag.title] = [];
                }
                
                flattenedTagLinks[tag.title].push(tag);
            }

            var sortedTagLinks = [];

            for (var t in flattenedTagLinks) {
                sortedTagLinks.push(flattenedTagLinks[t]);
            }            

            $scope.tagLinks = sortedTagLinks.sort(function (a, b) {
                return b.length - a.length;
            });
            
            console.log($scope.tagLinks);
        };
        
        var onError = function() {
            $scope.error = "Could not fetch courses";
        };

        if ($routeParams.id !== undefined && Number($routeParams.id) > 0) {
            xmr.getCourse($routeParams.id)
                .then(onCourse, onError);
            
        } else {

            xmr.getCourses()
                .then(onCourses, onError);

        }
    };

    app.controller('CourseController', ['$scope', '$routeParams', 'xmr', CourseController]);
}());
