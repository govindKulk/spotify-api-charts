// /api/spotify/new-releases.ts
import { getSpotifyToken } from '@/spotifyTokenManager';
import axios from 'axios';

export  async function GET(req: Request) {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases?country=IN&limit=50', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(response.data, {status: 200})
} catch (error) {
    return Response.json({ error: 'Error fetching data from Spotify' }, {status: 500})
}
}
