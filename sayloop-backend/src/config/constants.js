const api = "/api"


// basepath
const COURSES = `${api}/courses`


// path
const paths = {
    COURSES,


    // course endpoint
    GET_ALL_COURSES: '/all',
    GET_USER_COURSES: '/get/:userId',
    CHANGE_COURSE: '/change',
    GET_SECTIONS_BY_COURSE: '/:courseId/sections',
    GET_SECTION_IDS_BY_COURSE: '/:courseId/sections/ids',
}


module.exports = paths