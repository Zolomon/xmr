(function() {
    var app = angular.module('xmr');
    
    var CourseController = function($scope, $routeParams, xmr) {
        var onCourses = function (data) {
            $scope.courses = data;
        };

        var onError = function() {
            $scope.error = "Could not fetch courses";
        };

        xmr.getCourses()
            .then(onCourses, onError);
    };

    app.controller('CourseController', ['$scope', '$http', 'xmr', CourseController]);
}());
