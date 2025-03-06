import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/realtime/token',
      { expires_in: 3600 },
      { headers: { authorization: "<YOUR_API_KEY>" } }
    );

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    const { response } = error;
    return Response.json(response?.data || { error: 'Internal Server Error' }, { status: response?.status || 500 });
  }
}
