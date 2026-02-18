const courseService      = require('./course.service');
const { success, error } = require('../../utils/response');

// GET /api/courses/all
const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    return success(res, courses, 'Courses fetched successfully');
  } catch (err) {
    console.error('Error in getAllCourses:', err);
    return error(res, 'Failed to get courses');
  }
};

// GET /api/courses/get/:userId
const getUserCourses = async (req, res) => {
  try {
    const userId  = parseInt(req.params.userId);
    const courses = await courseService.getUserCourses(userId);
    return success(res, courses, 'User courses fetched successfully');
  } catch (err) {
    console.error('Error in getUserCourses:', err);
    return error(res, 'Failed to get user courses');
  }
};

// POST /api/courses/change
const changeUserCourse = async (req, res) => {
  try {
    const userId    = req.user.dbId;
    const { newCourseId } = req.body;
    const result    = await courseService.changeUserCourse(userId, newCourseId);
    return success(res, result, 'Course changed successfully');
  } catch (err) {
    console.error('Error in changeUserCourse:', err);
    return error(res, err.message || 'Failed to change course', 400);
  }
};

// GET /api/courses/:courseId/sections
const getSectionsByCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const sections = await courseService.getSectionsByCourse(courseId);
    return success(res, sections, 'Sections fetched successfully');
  } catch (err) {
    console.error('Error in getSectionsByCourse:', err);
    return error(res, err.message || 'Failed to get sections', 404);
  }
};

// GET /api/courses/:courseId/sections/ids
const getSectionIdsByCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const sections = await courseService.getSectionIdsByCourse(courseId);
    return success(res, sections, 'Section IDs fetched successfully');
  } catch (err) {
    console.error('Error in getSectionIdsByCourse:', err);
    return error(res, err.message || 'Failed to get section IDs', 404);
  }
};

module.exports = {
  getAllCourses,
  getUserCourses,
  changeUserCourse,
  getSectionsByCourse,
  getSectionIdsByCourse,
};