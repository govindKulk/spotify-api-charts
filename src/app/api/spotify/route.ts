import axios from 'axios';

const getSpotifyToken = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const token_url = 'https://accounts.spotify.com/api/token';
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`
    }
  };

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  console.log(token_url, data, headers);

  try {
    const response = await axios.post(token_url, data, headers);
    
    console.log("access_token", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify token', error);
    throw error;
  }
};

const getSpotifyData = async (token: string) => {
  const headers = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.get('https://api.spotify.com/v1/browse/new-releases?country=IN', headers);

    console.log('albums', response.data.albums.items);

    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify data', error);
    throw error;
  }
};



export async function GET(request: Request){
    try {
        const token = await getSpotifyToken();
        const data = await getSpotifyData(token);
        
        return Response.json(data, {
            status: 200
        });
      } catch (error) {
        return Response.json({ error: 'Error fetching data from Spotify' }, {
            status: 500
        });
      }
}

