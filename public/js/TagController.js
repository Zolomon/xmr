/*eslint no-console:0 */
/*global angular*/
(function () {
    var app = angular.module('xmr');

    var TagController = function($scope, $routeParams, xmr) {

        var onTag = data => $scope.data = data; 

        $scope.updateTagName = newName => {
            $scope.tag.tag.title = newName;            

            xmr.updateTag($scope.tag.tag);
            console.log('New title is: ' + newName);
        };
        
        var onError = () => {
            $scope.error = 'Could not fetch problems.';
        };

        $scope.filterFunction = element => 
            $scope.data.tag.title != element.Tag.title;
        
        if ($routeParams.tag_slug !== undefined) {
            xmr.getProblemsWithTag($routeParams.tag_slug)
                .then(onTag, onError);
        }
    };
    
    app.controller('TagController', ['$scope', '$routeParams', 'xmr', TagController]);

}());
