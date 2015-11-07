/*global angular*/
(function () {
    var app = angular.module('xmr');

    var TagController = function($scope, $routeParams, xmr) {

        var onTag = data => $scope.tag = data; 

        var onError = () => {
            $scope.error = 'Could not fetch problems.';
        };
        
        if ($routeParams.tag_slug !== undefined) {
            xmr.getProblemsWithTag($routeParams.tag_slug)
                .then(onTag, onError);
        }
    };
    
    app.controller('TagController', ['$scope', '$routeParams', 'xmr', TagController]);

}());
