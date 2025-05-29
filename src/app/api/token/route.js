import axios from 'axios';
import 'dotenv/config';

export async function GET() {
  const expiresInSeconds = 60;
  const url = `https://streaming.assemblyai.com/v3/token?expires_in_seconds=${expiresInSeconds}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: process.env.ASSEMBLYAI_API_KEY,
      },
    });

    return new Response(JSON.stringify({ token: response.data.token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating temp token:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch token" }), { status: 500 });
  }
}
