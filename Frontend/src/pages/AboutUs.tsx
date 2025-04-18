import React from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, Users, CheckSquare, Bell, ArrowRight, Target, Heart, Shield, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import ScrollToTopLink from '../components/ScrollToTopLink';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-50/50 to-primary/10 rounded-3xl -z-10 transform rotate-3 max-w-[90vw] mx-auto"></div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 animate-fade-in bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            About PackPal
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
            We're on a mission to revolutionize group event planning and make it accessible to everyone.
            Our platform combines powerful features with an intuitive interface to help teams organize better.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To empower teams and organizations with the tools they need to plan and execute events seamlessly.
                We believe that great events start with great planning, and we're here to make that process easier.
              </p>
              <div className="flex items-center space-x-4">
                <Target className="h-6 w-6 text-primary" />
                <span className="text-gray-600">Streamline event planning</span>
              </div>
              <div className="flex items-center space-x-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-gray-600">Enhance team collaboration</span>
              </div>
              <div className="flex items-center space-x-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-gray-600">Ensure event success</span>
              </div>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                We envision a world where event planning is no longer a source of stress but a catalyst for creativity and connection.
                Our platform is designed to bring people together and make every event memorable.
              </p>
              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="text-gray-600 italic">
                  "At PackPal, we're not just building a tool – we're creating a movement towards better, more organized events."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-r from-primary/5 to-blue-50/50 py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">SJ</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Sarah Johnson</h3>
                <p className="text-gray-500 text-center mb-4">CEO & Founder</p>
                <p className="text-gray-600 text-center">
                  Passionate about making event planning accessible to everyone.
                </p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">MC</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Michael Chen</h3>
                <p className="text-gray-500 text-center mb-4">CTO</p>
                <p className="text-gray-600 text-center">
                  Tech enthusiast focused on creating seamless user experiences.
                </p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">AR</span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Alex Rodriguez</h3>
                <p className="text-gray-500 text-center mb-4">Head of Design</p>
                <p className="text-gray-600 text-center">
                  Creating beautiful and intuitive interfaces for our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">User-Centric</h3>
              <p className="text-gray-600 leading-relaxed">
                We put our users first in everything we do, ensuring our platform meets their needs.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <CheckSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every feature and every interaction.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 transform group">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously innovate to provide the best solutions for our users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-blue-50/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join thousands of teams who are already using PackPal to organize their events.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="group bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-xl hover:scale-105 transform flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 