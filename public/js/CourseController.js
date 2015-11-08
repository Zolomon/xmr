/*global angular*/
(function() {
    var app = angular.module('xmr');

    var CourseController = ($scope, $routeParams, xmr) => {
        var onCourses = data => $scope.courses = data;

        var onCourse = data => {
            $scope.course = data;

            var examToTaglink = e => e.Problems.map(x => x.TagLinks);
            var mapExams = [].concat.apply([], data.Exams.map(examToTaglink));
            var tagLinks = [].concat.apply([], mapExams);

            var flattenedTagLinks = {};

            for(var t in tagLinks) {
                var tag = tagLinks[t];
                if (!(tag.title in flattenedTagLinks)) {
                    flattenedTagLinks[tag.title] = [];
                }

                flattenedTagLinks[tag.title].push(tag);
            }

            var sortedTagLinks = [];

            for (var ft in flattenedTagLinks) {
                sortedTagLinks.push(flattenedTagLinks[ft]);
            }

            $scope.tagLinks = sortedTagLinks.sort(function (a, b) {
                return b.length - a.length;
            });
        };

        var onError = () => $scope.error = 'Could not fetch courses';

        if ($routeParams.id !== undefined && Number($routeParams.id) > 0) {
            xmr.getCourse($routeParams.id)
                .then(onCourse, onError);

        } else {
            xmr.getCourses()
                .then(onCourses, onError);

        }
    };

    app.controller('CourseController', ['$scope', '$routeParams', 'xmr',
                                        CourseController]);
}());
