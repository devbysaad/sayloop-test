const express = require('express')

const router = express.Router()
const courseController = require('./course.controller')
const path = require('../../config/constants')

router.get(path.GET_ALL_COURSES, courseController.getAllCourses)
router.post(path.CHANGE_COURSE,courseController.changeUserCourse)

router.get(path.GET_USER_COURSES, courseController.getUserCourses)
module.exports = router