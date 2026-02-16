const api = "/api"


// basepath
const COURSES = `${api}/courses`
const LEADERBOARD = `${api}/leaderboard`;
const QUESTS = `${api}/quests`;
// path
const paths = {
    COURSES,
    LEADERBOARD,
    QUESTS,
    // course endpoint
    GET_ALL_COURSES: '/all',
    GET_USER_COURSES: '/get/:userId',
    CHANGE_COURSE: '/change',
    GET_SECTIONS_BY_COURSE: '/:courseId/sections',
    GET_SECTION_IDS_BY_COURSE: '/:courseId/sections/ids',

    // Leaderboard endpoints
    GET_PAGINATED_LEADERBOARD: '/paginated',
    GET_TOP_LEADERBOARD: '/top',
    // Quest endpoints
    GET_QUESTS_BY_USER: '/get',
    GET_MONTHLY_CHALLENGE_BY_USER: '/get',
}


module.exports = paths