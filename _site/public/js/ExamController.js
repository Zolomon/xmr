(function () {
    var app = angular.module('xmr');

    var ExamController = function($scope, $routeParams, xmr) {

        var onExams = data => {
            $scope.exams = data;
        };

        var onCourse = data => {
            $scope.course = data[0];
        };

        var onExam = function(data) {
            $scope.exam = data[0];
        };

        var onError = function() {
            $scope.error = "Could not fetch exams";
        };

        if ($routeParams.id !== undefined && Number($routeParams.id) > 0) {
            console.log('this happenz');
            xmr.getCourseFromExamId($routeParams.id)
                .then(onCourse, onError);

            xmr.getExam($routeParams.id)
                .then(onExam, onError);
        }

        // xmr.getExams()
        // .then(onExams, onError);
    };

    app.controller('ExamController', ['$scope', '$routeParams', 'xmr', ExamController]);

}());
