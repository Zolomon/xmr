/*global angular*/
(function() {
    var app = angular.module('xmr');

    var ProblemController = ($scope, $routeParams, xmr) => {
        var onProblem = data => $scope.problem = data;

        var onError = () => $scope.error = 'Could not fetch problem.';

        if ($routeParams.problem_id !== undefined &&
            Number($routeParams.problem_id) > 0)
        {
            xmr.getProblem($routeParams.problem_id)
                .then(onProblem, onError);
        }
    };

    app.controller('ProblemController', ['$scope', '$routeParams', 'xmr', ProblemController]);
}());
