import { getSpotifyToken } from '@/spotifyTokenManager';
import axios from 'axios';
import { NextApiRequest } from 'next';

export async function GET (req: NextApiRequest) {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/artists?ids=3TVXtAsR1Inumwj472S9r4,66CXWjxzNUsdJxJ2JdwvnR', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Response.json(response.data, {status: 200})
  } catch (error) {
    return Response.json({ error: 'Error fetching data from Spotify' },{status: 500});
}
}
