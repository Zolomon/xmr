/*global angular*/
(function () {
    var app = angular.module('xmr');

    var ExamController = function($scope, $routeParams, xmr) {

        var onCourse = data => $scope.course = data;

        var onExam = data => $scope.exam = data[0];       

        var onError = () => $scope.error = 'Could not fetch exams';
        

        var courseIdIsValid = $routeParams.course_id !== undefined && Number($routeParams.course_id) > 0;
        var examIdIsValid = $routeParams.exam_id !== undefined && Number($routeParams.exam_id) > 0;
        
        if (courseIdIsValid && examIdIsValid) {
            // xmr.getCourse($routeParams.course_id)
            //     .then(onCourse, onError);

            xmr.getExamAsCourse($routeParams.course_id, $routeParams.exam_id)
                .then(onCourse, onError);
        }

    };

    app.controller('ExamController', ['$scope', '$routeParams', 'xmr', ExamController]);

}());
