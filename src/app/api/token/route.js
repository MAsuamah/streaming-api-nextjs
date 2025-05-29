import axios from 'axios';
import 'dotenv/config'


export async function GET() {
  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/realtime/token',
      { expires_in: 60 },
      { headers: { authorization: process.env.ASSEMBLYAI_API_KEY} }
    );

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    const { response } = error;
    return Response.json(response?.data || { error: 'Internal Server Error' }, { status: response?.status || 500 });
  }
}
