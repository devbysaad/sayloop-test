import React from 'react'

type Props = {}

const InfoSection = (props: Props) => {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section 1 - Free, fun, effective */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20 lg:mb-32">
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-4">
              free. fun. effective.
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Learning with Sayloop is fun, and research shows that it works! With quick, bite-sized lessons, you'll earn points and unlock new levels while gaining real-world communication skills.
            </p>
          </div>
          <div className="flex-1 order-1 lg:order-2 flex justify-center">
            <img 
              src="/api/placeholder/400/400" 
              alt="Fun and effective learning" 
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Section 2 - Backed by science */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20 lg:mb-32">
          <div className="flex-1 flex justify-center">
            <img 
              src="/api/placeholder/400/400" 
              alt="Backed by science" 
              className="w-full max-w-md"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-4">
              backed by science
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              We use a combination of research-backed teaching methods and engaging content that delights both beginners and seasoned language learners to create a truly effective learning experience.
            </p>
          </div>
        </div>

        {/* Section 3 - Stay motivated */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20 lg:mb-32">
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-4">
              stay motivated
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the owl.
            </p>
          </div>
          <div className="flex-1 order-1 lg:order-2 flex justify-center">
            <img 
              src="/api/placeholder/400/400" 
              alt="Stay motivated" 
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Section 4 - Personalized learning */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 flex justify-center">
            <img 
              src="/api/placeholder/400/400" 
              alt="Personalized learning" 
              className="w-full max-w-md"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-4">
              personalized learning
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default InfoSection