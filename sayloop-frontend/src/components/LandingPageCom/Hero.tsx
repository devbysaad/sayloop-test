import React from 'react'
import { Link } from 'react-router-dom'
import HeroImg from '../../assets/PNG/hero.png'

type Props = {}

const Hero = (props: Props) => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-6 lg:px-16">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">

        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
          <img 
            src={HeroImg} 
            alt="Learning characters" 
            className="max-w-sm"
          />
        </div>

        <div className="flex flex-col items-center justify-center lg:items-start order-1 lg:order-2">
          <h1 className="text-[32px] lg:text-3xl text-center font-bold text-[#4B4B4B] mb-12 leading-tight  lg:text-left max-w-[500px]">
            The free, fun, and effective way to <br /> learn a language!
          </h1>

          <div className="flex flex-col gap-4 w-full max-w-[330px]">
            <Link to="/sign-up" className="w-full">
              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-[16px] rounded-2xl text-[15px] uppercase tracking-wider transition-all border-b-[4px] border-[#58A700] active:border-b-0">
                GET STARTED
              </button>
            </Link>

            <Link to="/sign-in" className="w-full">
              <button className="w-full bg-white hover:bg-gray-50 text-[#1CB0F6] font-bold py-[16px] rounded-2xl text-[13px] uppercase tracking-wider border-2 border-b-[4px] border-[#E5E5E5] transition-all active:border-b-2">
                I ALREADY HAVE AN ACCOUNT
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
