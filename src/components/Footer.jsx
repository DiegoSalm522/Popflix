import React from 'react'
import { AiFillTikTok } from "react-icons/ai"
import { FaFacebookSquare, FaInstagram } from "react-icons/fa"
import { FaSquareXTwitter } from "react-icons/fa6"
import { Link, NavLink } from "react-router-dom"

const Footer = () => {
  return (
    <div className="bg-neutral-900 text-neutral-400 border-t border-neutral-800 ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-6 text-red-500 font-bold text-3xl">
              POPFLIX
            </Link>
            <p className="mb-4 text-sm">
              Discover and explore a world of movies, from timeless classics to the latest releases — all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" className="text-neutral-500 hover:text-red-500 transition-colors">
                <FaFacebookSquare size={28}/>
              </a>
              <a href="https://www.twitter.com" className="text-neutral-500 hover:text-red-500 transition-colors">
                <FaSquareXTwitter size={28} />
              </a>
              <a href="https://www.instagram.com" className="text-neutral-500 hover:text-red-500 transition-colors">
                <FaInstagram size={28} />
              </a>
              <a href="https://www.tiktok.com" className="text-neutral-500 hover:text-red-500 transition-colors">
                <AiFillTikTok size={28}/>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              LINKS
            </h3>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/" className="hover:text-red-400 transition-all">Home</NavLink></li>
              <li><NavLink to="/movies" className="hover:text-red-400 transition-all">Movies</NavLink></li>
              <li><NavLink to="/tv-shows" className="hover:text-red-400 transition-all">TV Shows</NavLink></li>
              <li><NavLink to="/watch-list" className="hover:text-red-400 transition-all">Watch List</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              RESOURCES
            </h3>
            <ul className="space-y-2 text-sm">
              <li><p className="hover:text-red-400 transition-all cursor-pointer">About</p></li>
              <li><p className="hover:text-red-400 transition-all cursor-pointer">Blog</p></li>
              <li><p className="hover:text-red-400 transition-all cursor-pointer">Contact</p></li>
              <li><p className="hover:text-red-400 transition-all cursor-pointer">FAQ</p></li>
              <li><p className="hover:text-red-400 transition-all cursor-pointer">Help Center</p></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              SUBSCRIBE NOW
            </h3>
            <p className="text-sm mb-4">
              Stay up to date with the latest movies
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email....."
                  className="w-full bg-neutral-800 border-neutral-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              <button className="w-full bg-red-600 hover:-translate-y-1 text-white font-semibold py-3 rounded-full transition-all duration-200 text-sm cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-xs">
            © 2025 Popflix. All rights reserved. <br className="md:hidden"/>
            Powered by {" "}
            <a href="https://www.themoviedb.org/" className="text-red-400 hover:text-red-300">
              TMDB API
            </a>
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-xs">
            <p className="hover:text-red-400 transition-all cursor-pointer">
              Privacy Policy
            </p>
            <p className="hover:text-red-400 transition-all cursor-pointer">
              Terms of Use
            </p>
            <p className="hover:text-red-400 transition-all cursor-pointer">
              Cookie Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer