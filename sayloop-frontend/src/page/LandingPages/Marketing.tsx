import React from 'react'
import Nav from '../../components/LandingPageCom/landingpagecomponent/Navbar'
import Hero from '../../components/LandingPageCom/Hero'
import Footer from '../../components/LandingPageCom/landingpagecomponent/Footer'
import InfoSection from '../../components/LandingPageCom/infoSection'

type Props = {}

const Marketing = (props: Props) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />
      <Hero />
      <InfoSection />
      <Footer />
    </div>
  )
}

export default Marketing