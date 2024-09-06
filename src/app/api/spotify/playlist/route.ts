// pages/api/spotify/playlist.ts
import { getSpotifyToken } from '@/spotifyTokenManager';
import axios from 'axios';

const playlistId = '37i9dQZEVXbLZ52XmnySJg'; // Top 50 India Playlist ID

export async function GET(req: Request) {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Response.json(response.data, {status: 200})
  } catch (error) {
    return Response.json({ error: 'Error fetching data from Spotify' }, {status: 500})
  }
}


