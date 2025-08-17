
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, MapPin, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 mb-6">
              Host or Join
              <span className="block text-neutral-700">Epic Tournaments</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-neutral-700 mb-12 leading-relaxed">
              Create incredible tournaments, manage registrations effortlessly, and discover amazing sporting events in your city. 
              Connect with athletes and organize unforgettable competitions.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/register?role=organizer" 
                className="btn btn-primary btn-lg group hover-scale"
              >
                <Trophy className="w-5 h-5" />
                I'm an Organizer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/register?role=participant" 
                className="btn btn-outline btn-lg group hover-scale"
              >
                <Users className="w-5 h-5" />
                I'm a Participant
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 mb-2">500+</div>
                <div className="text-neutral-700">Tournaments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 mb-2">10K+</div>
                <div className="text-neutral-700">Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 mb-2">25+</div>
                <div className="text-neutral-700">Sports</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Champo?
            </h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              Everything you need to create, manage, and participate in amazing tournaments
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 hover-lift">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <Trophy className="w-8 h-8 text-neutral-700" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Easy Tournament Creation</h3>
              <p className="text-neutral-700">
                Create tournaments in minutes with our intuitive interface. Set dates, locations, and rules effortlessly.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 hover-lift">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <Users className="w-8 h-8 text-neutral-700" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Smart Registration</h3>
              <p className="text-neutral-700">
                Manage participant registrations, track attendance, and communicate with your community seamlessly.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 hover-lift">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <Calendar className="w-8 h-8 text-neutral-700" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Discover Events</h3>
              <p className="text-neutral-700">
                Find tournaments in your area, filter by sport, date, or location. Never miss an opportunity to compete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Popular Sports
            </h2>
            <p className="text-xl text-neutral-700">
              From basketball to cricket, we support all your favorite sports
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Basketball', icon: '🏀' },
              { name: 'Football', icon: '⚽' },
              { name: 'Cricket', icon: '🏏' },
              { name: 'Tennis', icon: '🎾' },
              { name: 'Badminton', icon: '🏸' },
              { name: 'Volleyball', icon: '🏐' },
              { name: 'Table Tennis', icon: '🏓' },
              { name: 'Swimming', icon: '🏊' },
              { name: 'Athletics', icon: '🏃' },
              { name: 'Cycling', icon: '🚴' },
              { name: 'Boxing', icon: '🥊' },
              { name: 'Martial Arts', icon: '🥋' }
            ].map((sport, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover-lift hover-scale">
                <div className="text-4xl mb-2">{sport.icon}</div>
                <div className="text-sm font-medium text-neutral-900">{sport.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
  <div className="container mx-auto px-6 text-center">
    
    {/* Heading */}
    <h2 className="text-4xl font-bold text-black mb-4">
      Ready to Get Started?
    </h2>
    
    {/* Subtext */}
    <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
      Join thousands of athletes and organizers who are already using <span className="font-semibold">Champo</span> to create amazing sporting experiences.
    </p>
    
    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {/* Organizer Button */}
      <Link 
        to="/register?role=organizer" 
        className="px-6 py-3 rounded-xl bg-black text-white font-semibold flex items-center gap-2 
                   transition transform hover:scale-105 hover:bg-neutral-800"
      >
        <Trophy className="w-5 h-5" />
        Start Organizing
      </Link>

      {/* Participant Button */}
      <Link 
        to="/register?role=participant" 
        className="px-6 py-3 rounded-xl bg-black text-white font-semibold flex items-center gap-2 
                   transition transform hover:scale-105 hover:bg-neutral-600"
      >
        <Users className="w-5 h-5" />
        Join Tournaments
      </Link>
    </div>
  </div>
</section>



      {/* Footer */}
      <footer className="mt-16 py-12 bg-white text-black border-t border-neutral-200">
  <div className="container mx-auto px-6 text-center">
    
    {/* Logo */}
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center hover-scale">
        <Trophy className="w-6 h-6 text-black" />
      </div>
      <span className="text-2xl font-bold">Champo</span>
    </div>

    {/* Tagline */}
    <p className="text-neutral-600 mb-4">
      Connecting athletes and organizers through amazing tournaments
    </p>

    {/* Links */}
    <div className="flex justify-center gap-6 text-sm text-neutral-600 mb-6">
      <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
      <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
      <a href="#" className="hover:text-black transition-colors">Contact Us</a>
    </div>

    {/* Copyright */}
    <p className="text-neutral-500 text-xs">
      © {new Date().getFullYear()} Champo. All rights reserved.
    </p>

  </div>
</footer>



    </div>
  );
}