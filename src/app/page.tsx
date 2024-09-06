"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Doughnut, Radar, Bubble, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
  
} from 'chart.js'

import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,

)


const Home = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Top 50 India Playlist (Bar Chart)
        const topTracksResponse = await axios.get('/api/spotify/playlist');
        setTopTracks(topTracksResponse.data.items);

        // 2. Fetch New Releases (Doughnut Chart)
        const newReleasesResponse = await axios.get('/api/spotify/new-releases');
        setNewReleases(newReleasesResponse.data.albums.items);

        // 3. Fetch Top Artists (Horizontal Bar Chart)
        const topArtistsResponse = await axios.get('/api/spotify/top-artists');
        setTopArtists(topArtistsResponse.data.artists);

        // 4. Fetch Audio Features (Radar Chart)
        const audioFeaturesResponse = await axios.get('/api/spotify/audio-features');
        setAudioFeatures(audioFeaturesResponse.data.audio_features);

        // 5. Fetch Genres for Bubble Chart
        const genresResponse = await axios.get('/api/spotify/genres');
        setGenres(genresResponse.data.categories.items);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  // 1. Bar chart for Top Tracks (Top 50 India)
  const topTracksData = {
    labels: topTracks.map((track: any) => track.track.name),
    datasets: [{
      label: 'Popularity',
      data: topTracks.map((track: any) => track.track.popularity),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // 2. Doughnut chart for New Releases (Share of Artists)
  const artistCount = newReleases.reduce((acc: any, release: any) => {
    const artistName = release.artists[0].name;
    acc[artistName] = (acc[artistName] || 0) + 1;
    return acc;
  }, {});
  const newReleasesData = {
    labels: Object.keys(artistCount),
    datasets: [{
      label: 'Share of Artists in New Releases',
      data: Object.values(artistCount),
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      borderWidth: 1
    }],
    
  };

  // 3. Horizontal Bar chart for Top Artists
  // const topArtistsData = {
  //   labels: topArtists.map((artist: any) => artist.name),
  //   datasets: [{
  //     label: 'Followers',
  //     data: topArtists.map((artist: any) => artist.followers.total),
  //     backgroundColor: 'rgba(153, 102, 255, 0.2)',
  //     borderColor: 'rgba(153, 102, 255, 1)',
  //     borderWidth: 1
  //   }]
  // };

  // 4. Radar chart for Audio Features
  const audioFeaturesData = {
    labels: ['Danceability', 'Energy', 'Valence', 'Tempo', 'Loudness'],
    datasets: audioFeatures.map((track: any, idx: number) => ({
      label: topTracks[idx]?.track.name || `Track ${idx + 1}`,
      data: [
        track.danceability,
        track.energy,
        track.valence,
        track.tempo / 200, // Normalize tempo for comparison
        track.loudness / 60
      ],
      backgroundColor: `rgba(255, 159, 64, 0.2)`,
      borderColor: `rgba(255, 159, 64, 1)`,
      borderWidth: 1
    }))
  };

  // 5. Bubble chart for Popular Genres
  const genresData = {
    datasets: genres.map((genre: any) => ({
      label: genre.name,
      data: [{ x: genre.name.length, y: Math.random() * 100, r: 10 + Math.random() * 20 }],
      backgroundColor: `rgba(255, 99, 132, 0.2)`,
      borderColor: `rgba(255, 99, 132, 1)`,
      borderWidth: 1
    }))
  };

  return (
    <div className=' bg-slate-700 text-white min-h-screen p-4 '>
      <div className='max-w-screen-lg mx-auto flex flex-col gap-4'>
      <h1 className='text-4xl text-slate-300 font-bold'>Spotify Dashboard</h1>

<div  className='grid md:grid-cols-2 gap-8 max-w-screen-lg md:mx-auto'>

   {/* 5. Bubble chart for Popular Genres */}
<div className='border border-slate-600 shadow-xl rounded-xl p-4'>
  <h2 className="text-slate-200 font-bold text-lg md:text-2xl">Popular Genres by Market</h2>
  <Bubble data={genresData} />
</div>
{/* 2. Doughnut chart for New Releases */}
<div className='border border-slate-600 shadow-xl rounded-xl p-4'>
  <h2 className="text-slate-200 font-bold text-lg md:text-2xl">Share of Artists in New Releases</h2>
  <Bar data={newReleasesData} />
</div>

{/* 3. Horizontal Bar chart for Top Artists */}
{/* <div>
  <h2 className="text-slate-200 font-bold text-lg md:text-2xl">Top Artists Worldwide</h2>
  <HorizontalBar data={topArtistsData} />
</div> */}



</div>

    {/* 4. Radar chart for Audio Features */}
    <div className='border border-slate-600 shadow-xl rounded-xl p-4'>
  <h2 className="text-slate-200 font-bold text-lg md:text-2xl">Audio Features Comparison</h2>
  <Radar data={audioFeaturesData} style={{maxHeight: 500}} />
</div>


<div className='border border-slate-600 shadow-xl rounded-xl p-4'>
  <h2 className="text-slate-200 font-bold text-lg md:text-2xl">Top 50 India Playlist</h2>
  <Bar data={topTracksData}    />
</div>
      </div>
    </div>
  );
};

export default Home;
