/*global angular*/
(function () {
    var xmr = ($http) => {
        var getExamAsCourse = (course_id, exam_id) =>
            $http.get(`/api/courses/${course_id}/exams/${exam_id}`)
            .then( response =>response.data);


        var getCourses = () =>
            $http.get('/api/courses')
            .then(response => response.data);

        var getCourse = id =>
            $http.get(`/api/courses/${id}`)
            .then(response =>response.data);


        var getProblemsWithTag = tag_slug =>
            $http.get(`/api/tags/${tag_slug}`)
            .then(response => response.data);

        var getProblem = id =>
            $http.get(`/api/problems/${id}`)
            .then(response => response.data);

        var updateTag = tag =>
            $http.put(`/api/tags/${tag.id}`, tag)
            .then(response => response.data);

        var deleteTagLink = taglink_id => {
            $http.delete(`/api/taglinks/${taglink_id}`)
                .then(response => response.data);
        };

        var addTagAndTagLinkToProblem = (course_id, exam_id, problem_id, tag_title) =>
            $http.post('/api/tags', {
                course_id: course_id,
                exam_id: exam_id,
                problem_id: problem_id,
                tag_title: tag_title
            })
            .then(response => response.data);

        var toDate = date => {
            var pattern = /(\d{4})(\d{2})(\d{2})/;
            return new Date(date.replace(pattern, '$1-$2-$3'));
        };

        var getTagsFromCourse = courseId =>
            $http.get(`/api/courses/${courseId}/tags`)
                .then(response => response.data);

        return {
            getExamAsCourse: getExamAsCourse,
            getCourses: getCourses,
            getCourse: getCourse,
            getProblemsWithTag: getProblemsWithTag,
            getProblem: getProblem,
            updateTag: updateTag,
            addTagAndTagLinkToProblem: addTagAndTagLinkToProblem,
            deleteTagLink: deleteTagLink,
            toDate: toDate,
            getTagsFromCourse: getTagsFromCourse
        };
    };

    var module = angular.module('xmr');
    module.factory('xmr', xmr);
}());
