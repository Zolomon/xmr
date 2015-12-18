/*global angular*/
(function () {
    var app = angular.module('xmr');

    var ExamController = ($scope, $routeParams, xmr) => {

        var onCourse = data => $scope.course = data;

        var onExam = data => $scope.exam = data[0];       

        var onError = () => $scope.error = 'Could not fetch exams';

        var courseIdIsValid = $routeParams.course_id !== undefined && Number($routeParams.course_id) > 0;
        
        var examIdIsValid = $routeParams.exam_id !== undefined && Number($routeParams.exam_id) > 0;
        
        if (courseIdIsValid && examIdIsValid) {
            xmr.getExamAsCourse($routeParams.course_id, $routeParams.exam_id)
                .then(onCourse, onError);
        }

        $scope.toDate = date => xmr.toDate(date);
    };

    app.controller('ExamController', ['$scope', '$routeParams', 'xmr', ExamController]);

}());
