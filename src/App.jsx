import React from 'react'
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import Shows from "./pages/Shows"
import WatchList from "./pages/WatchList"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import { MoviesShowsProvider } from "./context/Context"
import { Navigate, Route, Routes } from "react-router-dom"
import Details from "./components/Details"

const App = () => {
  return (
    <MoviesShowsProvider>
      <div className="min-h-screen">
        <Navbar/>
        <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<Shows />} />
          <Route path="/watch-list" element={<WatchList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </main>
        <Footer/>
        <Details />
        <ScrollToTop/>
      </div>
    </MoviesShowsProvider>
  )
}

export default App