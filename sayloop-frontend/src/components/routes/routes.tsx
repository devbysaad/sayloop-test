import { Routes, Route } from 'react-router-dom'
import Learn from '../../page/Home/Learn'
import Marketing from '../../page/LandingPages/Marketing'
import SignInPage from '../modules/auth/SignIn'
import SignUpPage from '../modules/auth/SignUp'
import DebatePage from '../../page/Debate/DebatePage'
import HomePage from '../../page/Home/Home'
import ProfilePage from '../../page/Home/Profile'
import LeaderboardPage from '../../page/Home/LeaderBoard'
import QuestPage from '../../page/Home/Quest'
import MorePage from '../../page/Home/More'
import ShopPage from '../../page/Home/ShopPage'

type Props = {}

const routes = (props: Props) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Marketing />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/quests" element={<QuestPage />} />
        <Route path="/more" element={<MorePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/debate" element={<DebatePage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default routes