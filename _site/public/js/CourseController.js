(function() {
    var app = angular.module('xmr');

    var CourseController = function($scope, $routeParams, xmr) {

        var onCourses = function (data) {
            $scope.courses = data;
        };

        var onCourse = function(data) {
            $scope.course = data;
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
