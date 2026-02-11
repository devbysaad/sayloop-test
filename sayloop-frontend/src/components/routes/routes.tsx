import { Routes, Route } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import Learn from '../../page/Home/Learn'
import Marketing from '../../page/LandingPages/Marketing'

type Props = {}

const routes = (props: Props) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Marketing />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default routes