(function() {
    var xmr = angular.module('xmr', ['ngRoute']);

    xmr.config(function ($routeProvider) {
        $routeProvider
            .when('/courses', {
                templateUrl: 'js/views/courses.html',
                controller: 'CourseController'
            })
            .when('/courses/:id', {
                templateUrl: 'js/views/course.html',
                controller: 'CourseController'
            })
            .when('/courses/:course_id/exam/:exam_id', {
                templateUrl: 'js/views/exam.html',
                controller: 'ExamController'
            })
            .when('/tags/:tag_slug', {
                templateUrl: 'js/views/tag.html',
                controller: 'TagController'
            })
            .otherwise({
                redirectTo: '/courses'
            });
    });
}());
