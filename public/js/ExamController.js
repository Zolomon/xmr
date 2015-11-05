(function () {
    var app = angular.module('xmr');

    var ExamController = function($scope, $routeParams, xmr) {

        var onExams = data => {
            $scope.exams = data;
        };

        var onCourse = data => {
            $scope.course = data[0];
        };

        var onExam = data => {
            $scope.exam = data[0];
        };

        var onError = () => {
            $scope.error = "Could not fetch exams";
        };

        var courseIdIsValid = $routeParams.course_id !== undefined && Number($routeParams.course_id) > 0;
        var examIdIsValid = $routeParams.exam_id !== undefined && Number($routeParams.exam_id) > 0;
        
        if (courseIdIsValid && examIdIsValid) {
            console.log('this happenz');
            xmr.getCourse($routeParams.course_id)
                .then(onCourse, onError);

            xmr.getExam($routeParams.exam_id)
                .then(onExam, onError);
        }

        // xmr.getExams()
        // .then(onExams, onError);
    };

    app.controller('ExamController', ['$scope', '$routeParams', 'xmr', ExamController]);

}());
