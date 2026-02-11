import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Mainlogo } from '../../../assets/logo';

type Props = {}

const Nav = (props: Props) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-around">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img src={Mainlogo} alt="Sayloop Logo" className="h-8 sm:h-10" />
          <h1 className="text-xl sm:text-2xl md:text-3xl text-green-600 font-extrabold">
            Sayloop
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link to="/sign-in">
              <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-2xl text-sm sm:text-base uppercase tracking-wide transition-all border-b-4 border-[#58A700] active:border-b-0 active:translate-y-[2px] whitespace-nowrap">
                GET STARTED
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export default Nav