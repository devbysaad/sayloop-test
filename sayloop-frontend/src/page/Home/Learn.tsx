import React from 'react'
import Sidebar from '../../components/modules/home/Sidebar'
import RightSidebar from '../../components/modules/home/Rightsidebar'
import Header from '../../components/modules/home/Header'
import TopBar from '../../components/modules/home/TopBar'

type Props = {}

const Learn = (props: Props) => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Mobile TopBar - Stats bar at the top */}
      <TopBar />
      
      {/* Mobile Header - Bottom Navigation */}
      <Header />

      {/* Left Sidebar - Only show on desktop (>=1024px) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Spacer for fixed Sidebar (width: 288px = w-72), hidden on small screens */}
      <div className="hidden lg:block w-72 flex-shrink-0" />
      
      {/* Main Content Area - Centered */}
      <main className="flex-1 flex justify-center pt-14 lg:pt-0 pb-20 lg:pb-0 lg:mr-80">
        <div className="w-full max-w-4xl px-4 sm:px-8 py-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-[#58CC02] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-white text-xs sm:text-sm font-bold mb-2">← SECTION 1, UNIT 1</p>
                <h1 className="text-white text-lg sm:text-2xl font-bold">Solo trip: Compare travel experiences</h1>
              </div>
              <button className="bg-white text-[#58CC02] px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
                <span>≡</span>
                GUIDEBOOK
              </button>
            </div>
          </div>

          {/* Learning Path Section */}
          <div className="flex flex-col items-center space-y-6 py-8">
            
            {/* Start Button - Green Circle */}
            <div className="relative">
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-[#58CC02] rounded-full flex items-center justify-center shadow-lg border-4 border-[#46A302]">
                <div className="text-white text-center">
                  <div className="text-2xl sm:text-3xl">✓</div>
                  <div className="text-xs font-bold mt-1">START</div>
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-1 h-8 bg-gray-700"></div>

            {/* Star Button */}
            <div className="relative">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#58CC02] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D5016]">
                <div className="text-white text-2xl sm:text-3xl">⭐</div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-1 h-8 bg-gray-700"></div>

            {/* Treasure Chest - Locked */}
            <div className="w-28 sm:w-32 h-20 sm:h-24 bg-[#3C5A6E] rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#2D4556] relative">
              <div className="text-3xl sm:text-4xl">📦</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-1 h-8 bg-gray-700"></div>

            {/* Duo Character Circle */}
            <div className="relative">
              <div className="w-28 sm:w-32 h-28 sm:h-32 bg-[#46A302] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D5016]">
                <div className="text-5xl sm:text-6xl">🦉</div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-1 h-8 bg-gray-700"></div>

            {/* Progress Circle - Locked */}
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#3C5A6E] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D4556] relative">
              <div className="text-white text-xl sm:text-2xl">🧩</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-1 h-8 bg-gray-700"></div>

            {/* Trophy Circle - Locked */}
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#3C5A6E] rounded-full flex items-center justify-center shadow-lg border-4 border-[#2D4556] relative">
              <div className="text-white text-xl sm:text-2xl">🏆</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
            </div>

          </div>

          {/* Bottom Section Title */}
          <div className="text-center mt-12 py-8 border-t border-gray-600">
            <p className="text-gray-400 text-xs sm:text-sm">Solo trip: Ask about transportation</p>
          </div>

        </div>
      </main>
      
      {/* Right Sidebar - Fixed on desktop */}
      <RightSidebar />
    </div>
  )
}

export default Learn