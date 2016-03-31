/*global angular*/
/*eslint no-unused-vars: 0*/
(function() {
    var app = angular.module('xmr');

    var ProblemController = function ($scope, $routeParams, xmr) {
        $scope.onCourse = data => $scope.course = data;

        $scope.deleteTagLink = tagLink => {
            console.log($scope.course.Exams[0].Problems[0]);
            var index = $scope.course.Exams[0].Problems[0].TagLinks.indexOf(tagLink);
            $scope.course.Exams[0].Problems[0].TagLinks.splice(index, 1);

            xmr.deleteTagLink(tagLink.id);
        };


        $scope.addTagAndTagLinkToProblem = (course_id, exam_id, problem_id, tag_title) => {
            xmr.addTagAndTagLinkToProblem(course_id, exam_id, problem_id, tag_title)
                .then(tagLink => {
                    xmr.getProblem($routeParams.problem_id)
                        .then($scope.onCourse, onError);
                }, onError);

            $scope.tag.title = '';
        };

        $scope.toDate = date => xmr.toDate(date);

        $scope.onTags = data => $scope.tags = data;

        var onError = () => $scope.error = 'Could not fetch problem.';

        if ($routeParams.problem_id !== undefined &&
            Number($routeParams.problem_id) > 0)
        {
            xmr.getProblem($routeParams.problem_id)
                .then($scope.onCourse, onError);

            xmr.getTagsFromCourse($routeParams.course_id)
                .then($scope.onTags, onError);

            $scope.tag = {title: ''};
        }
    };

    app.controller('ProblemController', ['$scope', '$routeParams', 'xmr', ProblemController]);
}());
