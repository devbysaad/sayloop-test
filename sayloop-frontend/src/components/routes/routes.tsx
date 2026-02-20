import { Routes, Route } from 'react-router-dom'
import Learn from '../../page/Home/Learn'
import Marketing from '../../page/LandingPages/Marketing'
import SignInPage from '../modules/auth/SignIn'
import SignUpPage from '../modules/auth/SignUp'
import DebatePage from '../../page/Debate/DebatePage'

type Props = {}

const routes = (props: Props) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Marketing />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/debate" element={<DebatePage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default routes