import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getSpotifyToken } from '@/spotifyTokenManager';

export  async function GET(req: NextApiRequest) {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/browse/categories?country=IN', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Response.json(response.data, { status: 200 });

} catch (error) {
    return Response.json({ error: 'Error fetching data from Spotify' }, { status: 500 });
}
}
