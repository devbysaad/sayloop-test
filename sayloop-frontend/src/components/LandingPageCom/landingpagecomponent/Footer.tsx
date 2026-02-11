import React from 'react'

type Props = {}

const Footer = (props: Props) => {
  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-white mb-4">About us</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Mission</a></li>
              <li><a href="#" className="hover:text-white">Approach</a></li>
              <li><a href="#" className="hover:text-white">Efficacy</a></li>
              <li><a href="#" className="hover:text-white">Duolingo Handbook</a></li>
              <li><a href="#" className="hover:text-white">Research</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Brand guidelines</a></li>
              <li><a href="#" className="hover:text-white">Store</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Investors</a></li>
              <li><a href="#" className="hover:text-white">Contact us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">Duolingo</a></li>
              <li><a href="#" className="hover:text-white">Duolingo for Schools</a></li>
              <li><a href="#" className="hover:text-white">Duolingo English Test</a></li>
              <li><a href="#" className="hover:text-white">Podcast</a></li>
              <li><a href="#" className="hover:text-white">Duolingo for Business</a></li>
              <li><a href="#" className="hover:text-white">Super Duolingo</a></li>
              <li><a href="#" className="hover:text-white">Gift Super Duolingo</a></li>
              <li><a href="#" className="hover:text-white">Duolingo Max</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Apps</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">Duolingo for Android</a></li>
              <li><a href="#" className="hover:text-white">Duolingo for iOS</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Help and support</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">Duolingo FAQs</a></li>
              <li><a href="#" className="hover:text-white">Schools FAQs</a></li>
              <li><a href="#" className="hover:text-white">Duolingo English Test FAQs</a></li>
              <li><a href="#" className="hover:text-white">Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Privacy and terms</h4>
            <ul className="space-y-2 text-sm text-white/80 mb-6">
              <li><a href="#" className="hover:text-white">Community guidelines</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Do Not Sell or Share My Personal Information</a></li>
            </ul>

            <h4 className="font-bold text-white mb-4">Social</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">TikTok</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="mb-4">
            <h5 className="font-bold text-white mb-3">Site language:</h5>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <a href="#" className="hover:text-white">العربية</a>
              <a href="#" className="hover:text-white">বাংলা</a>
              <a href="#" className="hover:text-white">Čeština</a>
              <a href="#" className="hover:text-white">Deutsch</a>
              <a href="#" className="hover:text-white">Ελληνικά</a>
              <a href="#" className="hover:text-white">English</a>
              <a href="#" className="hover:text-white">Español</a>
              <a href="#" className="hover:text-white">Français</a>
              <a href="#" className="hover:text-white">हिंदी</a>
              <a href="#" className="hover:text-white">Magyar</a>
              <a href="#" className="hover:text-white">Bahasa Indonesia</a>
              <a href="#" className="hover:text-white">Italiano</a>
              <a href="#" className="hover:text-white">日本語</a>
              <a href="#" className="hover:text-white">한국어</a>
              <a href="#" className="hover:text-white">Nederlands</a>
              <a href="#" className="hover:text-white">Polski</a>
              <a href="#" className="hover:text-white">Português</a>
              <a href="#" className="hover:text-white">Română</a>
              <a href="#" className="hover:text-white">Русский</a>
              <a href="#" className="hover:text-white">Svenska</a>
              <a href="#" className="hover:text-white">தமிழ்</a>
              <a href="#" className="hover:text-white">తెలుగు</a>
              <a href="#" className="hover:text-white">ภาษาไทย</a>
              <a href="#" className="hover:text-white">Tagalog</a>
              <a href="#" className="hover:text-white">Türkçe</a>
              <a href="#" className="hover:text-white">Українська</a>
              <a href="#" className="hover:text-white">Tiếng Việt</a>
              <a href="#" className="hover:text-white">中文</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer