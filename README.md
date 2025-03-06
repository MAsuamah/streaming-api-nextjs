# AssemblyAI Streaming Transcription NextJs Example

## Description

In this app, we grab an audio stream from the user's computer and then send that over a WebSocket to AssemblyAI for real-time transcription. Once AssemblyAI begins transcribing, we display the text in the browser.

## How To Install and Run the Project

##### ❗Important❗

- Before running this app, you need to upgrade your AssemblyAI account. The Streaming API is only available to upgraded accounts.
- To upgrade your account you need to add a card. You can do that in your dashboard [here](https://app.assemblyai.com/)!

##### Instructions

1. Clone the repo to your local machine.
2. Open a terminal in the main directory housing the project. In this case `streaming-api-nextjs`.
3. Run `npm install` to ensure all dependencies are installed.
4. Add your AssemblyAI key to line 8 in `src/app/api/token/route.js`.
5. Start the app with the command `npm run dev` .
6. Vist `http://localhost:3000/` in the browser and click "Record". As you speak the live transcription will appear in the webpage!
