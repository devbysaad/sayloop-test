const courseService = require('./course.service')

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses()
        return res.status(200).json(courses)
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        return res.status(500).json({ error: 'Failed to get courses' });
    }
}

const changeUserCourse = async (req, res) => {
    try {
        const userId = req.userId
        const { newCourse } = req.body
        if (!newCourse) {
            return res.status(400).json({ error: 'New course ID is required' });
        }
        const result = await courseService.changeUserCourse(userId, newCourse);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in changeUserCourse:', error);
        return res.status(500).json({ error: 'Failed to change course' });
    }
}

const getUserCourses = async (req, res) => {
    try {
      const { userId } = req.params;
      const courses = await courseService.getUserCourses(parseInt(userId));
      return res.status(200).json(courses);
    } catch (error) {
      console.error('Error in getUserCourses:', error);
      return res.status(500).json({ error: 'Failed to get user courses' });
    }
  };
  module.exports = {
    getAllCourses,
    changeUserCourse,
    getUserCourses
  };