import React from 'react'
import Hero from "../components/Hero"
import Slider from "../components/Slider"
import Genres from "../components/Genres"
import { useMoviesShows } from "../context/Context"

const Home = () => {
  const { trendingContent, popularContent, topRatedContent, loading } = useMoviesShows();
  
  return (
    <>
      <Hero content={trendingContent}/>
      <div>
        {!loading && (
          <>
            <Slider title="Trending Now" content={trendingContent}/>
            <Slider title="Popular" content={popularContent}/>
            <Slider title="Top Rated" content={topRatedContent}/>
            <Genres mediaType="all"/>
          </>
        )}
      </div>
    </>
  )
}

export default Home