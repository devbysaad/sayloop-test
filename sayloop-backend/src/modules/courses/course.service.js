const db = require('../../config/database')

const getAllCourses = async () => {
    try {
        const result = await db.query("SELECT * FROM course ORDER BY id ASC")
        return result.rows

    } catch (error) {
        console.log('Error in getAllCourses', error)
        throw error
    }
}

const getCoursebyId = async (courseId) => {
    try {
        const result = await db.query(
            'SELECT * FROM course WHERE id = $1',
            [courseId]
        );
        if (result.rows.length === 0) {
            throw new Error('Course not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error in getCourseById:', error);
        throw error;
    }
}

const changeUserCourse = async (userId, newCourseId) => {
    try {
        await db.query(
            'UPDATE users SET current_course_id = $1 WHERE id = $2',
            [newCourseId, userId]
        );

        const firstLesson = await db.query(
            `SELECT l.id as lesson_id 
             FROM lessons l
             INNER JOIN units u ON l.unit_id = u.id
             WHERE u.course_id = $1
             ORDER BY u.order_index ASC, l.order_index ASC
             LIMIT 1`,
            [newCourseId]
        );
        if (firstLesson.rows.length > 0) {
            // Check if user course progress exists
            const existingProgress = await db.query(
                'SELECT * FROM user_course_progress WHERE user_id = $1 AND course_id = $2',
                [userId, newCourseId]
            );
            if (existingProgress.rows.length === 0) {
                // Create new progress entry
                await db.query(
                    `INSERT INTO user_course_progress (user_id, course_id, current_lesson_id)
                 VALUES ($1, $2, $3)`,
                    [userId, newCourseId, firstLesson.rows[0].lesson_id]
                );
            }
            return {
                newCourseId: newCourseId,
                currentLessonId: firstLesson.rows[0].lesson_id
            };
        }
        return {
            newCourseId: newCourseId,
            currentLessonId: null
        };
    } catch (error) {
        console.error('Error in changeUserCourse:', error);
        throw error;
    }
}

const getUserCourses = async (userId) => {
    try {
        const result = await db.query(
            `SELECT DISTINCT c.*
         FROM course c
         INNER JOIN user_course_progress ucp ON c.id = ucp.course_id
         WHERE ucp.user_id = $1`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getUserCourses:', error);
        throw error;
    }
};
module.exports = {
    getAllCourses,
    getCoursebyId,
    changeUserCourse,
    getUserCourses
};