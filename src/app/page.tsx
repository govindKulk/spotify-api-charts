'use client';

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
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import axios from 'axios';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, RadialLinearScale, ArcElement);

const Home = () => {
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState([]);
  const [genres, setGenres] = useState([]);
  
  const [popularityFilter, setPopularityFilter] = useState(50); // for top tracks
  const [selectedPlaylist, setSelectedPlaylist] = useState('37i9dQZEVXbLZ52XmnySJg'); // India Top 50 playlist ID
  const [artistFilter, setArtistFilter] = useState(''); // For top artists
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const topTracksResponse = await axios.get(`/api/spotify/playlist?id=${selectedPlaylist}`);
        setTopTracks(topTracksResponse.data.items);

        const newReleasesResponse = await axios.get('/api/spotify/new-releases');
        setNewReleases(newReleasesResponse.data.albums.items);

        const topArtistsResponse = await axios.get('/api/spotify/top-artists');
        setTopArtists(topArtistsResponse.data.artists);

        const audioFeaturesResponse = await axios.get('/api/spotify/audio-features');
        setAudioFeatures(audioFeaturesResponse.data.audio_features);


        const genresResponse = await axios.get('/api/spotify/genres');
        setGenres(genresResponse.data.categories.items);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [selectedPlaylist]);


  const topTracksData = {
    labels: topTracks
      .filter((track: any) => track.track.popularity >= popularityFilter)
      .map((track: any) => track.track.name),
    datasets: [
      {
        label: 'Popularity',
        data: topTracks
          .filter((track: any) => track.track.popularity >= popularityFilter)
          .map((track: any) => track.track.popularity),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };


  const artistCount = newReleases.reduce((acc: any, release: any) => {
    const artistName = release.artists[0].name;
    acc[artistName] = (acc[artistName] || 0) + 1;
    return acc;
  }, {});
  const newReleasesData = {
    labels: Object.keys(artistCount),
    datasets: [
      {
        label: 'Share of Artists in New Releases',
        data: Object.values(artistCount),
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };


  const topArtistsData = {
    labels: topArtists
      .filter((artist: any) => artist.name.toLowerCase().includes(artistFilter.toLowerCase()))
      .map((artist: any) => artist.name),
    datasets: [
      {
        label: 'Followers',
        data: topArtists
          .filter((artist: any) => artist.name.toLowerCase().includes(artistFilter.toLowerCase()))
          .map((artist: any) => artist.followers.total),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };


  const audioFeaturesData = {
    labels: ['Danceability', 'Energy', 'Valence', 'Tempo', 'Loudness'],
    datasets: audioFeatures.map((track: any, idx: number) => ({
      label: topTracks[idx]?.track.name || `Track ${idx + 1}`,
      data: [
        track.danceability,
        track.energy,
        track.valence,
        track.tempo / 200, // Normalize tempo for comparison
        track.loudness / 60,
      ],
      backgroundColor: `rgba(255, 159, 64, 0.2)`,
      borderColor: `rgba(255, 159, 64, 1)`,
      borderWidth: 1,
    })),
  };


  const genresData = {
    datasets: genres.map((genre: any) => ({
      label: genre.name,
      data: [{ x: genre.name.length, y: Math.random() * 100, r: 10 + Math.random() * 20 }],
      backgroundColor: `rgba(255, 99, 132, 0.2)`,
      borderColor: `rgba(255, 99, 132, 1)`,
      borderWidth: 1,
    })),
  };

  return (
    <div className="bg-slate-800 text-white p-4">
      <h1 className='text-4xl font-bold text-slate-400'>Spotify Dashboard</h1>

      <div className='max-w-screen-lg lg:mx-auto grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Bar chart for Top Tracks */}
      <div className="shadow-xl rounded-xl border-slate-400 bg-slate-900 p-4 text-slate-300 font-bold flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold ">Top 50 India Playlist</h2>
        <label>
          Filter by Popularity :
          <input
            type="number"
            value={popularityFilter}
            onChange={(e) => setPopularityFilter(Number(e.target.value))}
          />
        </label>
    
        <Bar data={topTracksData} />
      </div>


      <div className="shadow-xl rounded-xl border-slate-400 bg-slate-900 p-4 text-slate-300 font-bold flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold ">Share of Artists in New Releases</h2>
        <Doughnut data={newReleasesData} />
      </div>


      <div className="shadow-xl rounded-xl border-slate-400 bg-slate-900 p-4 text-slate-300 font-bold flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold ">Top Artists Worldwide</h2>
        <label>
          Filter by Artist Name:
          <input
            type="text"
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
          />
        </label>
        <Bar data={topArtistsData} options={{ indexAxis: 'y' }} />
      </div>

      <div className="shadow-xl rounded-xl border-slate-400 bg-slate-900 p-4 text-slate-300 font-bold flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold ">Audio Features Comparison</h2>
        <Radar data={audioFeaturesData} />
      </div>


      <div className="shadow-xl rounded-xl border-slate-400 bg-slate-900 p-4 text-slate-300 font-bold flex flex-col gap-2">
        <h2 className="text-lg md:text-2xl font-bold ">Popular Genres by Market</h2>
        <Bubble data={genresData} />
      </div>
      </div>
    </div>
  );
};

export default Home;
