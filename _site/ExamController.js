(function () {
    var app = angular.module('xmr');

    var ExamController = function($scope, $routeParams, xmr) {

        var onExams = function(data) {
            $scope.exams = data;
        };

        var onExam = function(data) {
            $scope.exam = data;
        };

        var onError = function() {
            $scope.error = "Could not fetch exams";
        };

        if ($routeParams.id !== undefined && Number($routeParams.id) > 0) {
            xmr.getExam($routeParams.id)
                .then(onExam, onError);
        }

        xmr.getExams()
        .then(onExams, onError);
    };

    app.controller('ExamController', ['$scope', '$routeParams', 'xmr', ExamController]);

}());
