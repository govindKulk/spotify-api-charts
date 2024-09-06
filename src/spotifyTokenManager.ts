// lib/spotifyTokenManager.ts
import axios from 'axios';

let spotifyToken: string | null = null;
let tokenExpiryTime: number | null = null;

// Function to get Spotify token
export async function getSpotifyToken() {
  if (spotifyToken && tokenExpiryTime && tokenExpiryTime > Date.now()) {
    // If token exists and hasn't expired, return it
    return spotifyToken;
  }

  // Otherwise, fetch a new token
  try {
    console.log('Fetching new Spotify token');

    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store the new token and its expiration time (typically 3600 seconds)
    spotifyToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000;

    return spotifyToken;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    throw new Error('Failed to fetch Spotify token');
  }
}
