import React from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, Users, CheckSquare, Bell, Twitter, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import ScrollToTopLink from '../components/ScrollToTopLink';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-50/50 to-primary/10 rounded-3xl -z-10 transform rotate-3 max-w-[90vw] mx-auto"></div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 animate-fade-in bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            Organize Group Events with Ease
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
            PackPal helps you manage group logistics efficiently. Create checklists,
            assign tasks, and track progress in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up">
            <Link
              to="/register"
              className="group bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:scale-105 transform flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Role-Based Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Assign different roles to team members with specific permissions
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <CheckSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Checklists</h3>
              <p className="text-gray-600 leading-relaxed">
                Create and manage categorized checklists with drag-and-drop
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications about task progress and changes
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <PackageCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Export & Share</h3>
              <p className="text-gray-600 leading-relaxed">
                Export checklists as PDFs and share progress with stakeholders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-primary/5 to-blue-50/50 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-3">10K+</h3>
                <p className="text-gray-600 text-lg">Active Users</p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-3">50K+</h3>
                <p className="text-gray-600 text-lg">Checklists Created</p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <h3 className="text-4xl sm:text-5xl font-bold text-primary mb-3">99%</h3>
                <p className="text-gray-600 text-lg">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">"PackPal has revolutionized how we organize our team events. The checklist feature is a game-changer!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-primary font-bold">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Event Manager</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">"The real-time updates and role-based access make collaboration seamless. Highly recommended!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-primary font-bold">MC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-500">Project Lead</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}