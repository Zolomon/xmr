(function() {
    var xmr = angular.module('xmr', ['ngRoute', 'ngMaterial']);

    xmr.controller('AppCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdUtil', '$log',
                               function($scope, $timeout, $mdSidenav, $mdUtil, $log) {
                                   $scope.toggleSidenav = function(menuId) {
                                       $mdSidenav(menuId).toggle();
                                   };

                                   /**
                                    * Build handler to open/close a SideNav; when animation finishes
                                    * report completion in console
                                    */
                                   function buildToggler(navID) {
                                       var debounceFn =  $mdUtil.debounce(function(){
                                           $mdSidenav(navID)
                                               .toggle()
                                               .then(function () {
                                                   $log.debug("toggle " + navID + " is done");
                                               });
                                       },200);
                                       return debounceFn;
                                   }
                                   
                                   $scope.toggleLeft = buildToggler('left');
                               }]);

    xmr.controller('LeftCtrl', ['$scope', '$timeout', '$mdSidenav', '$log',
                                function ($scope, $timeout, $mdSidenav, $log) {
                                    $scope.close = function() {
                                        $mdSidenav('left')
                                            .close()
                                            .then(function () {
                                                $log.debug('close LEFT is done');
                                            });
                                    };
                                }]);
    
    xmr.config(function ($routeProvider) {
        $routeProvider
            .when('/courses', {
                templateUrl: 'js/views/courses.html',
                controller: 'CourseController'
            })
            .when('/course/:id', {
                templateUrl: 'js/views/course.html',
                controller: 'CourseController'
            })
            .otherwise({
                redirectTo: '/courses'
            });
    });
}());
