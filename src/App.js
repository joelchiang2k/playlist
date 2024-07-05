import React from 'react';
import SongList from './components/SongList.js';
import YoutubePlayer from './components/YoutubePlayer.js';

function App() {
  return (
    <div>
      <YoutubePlayer />
      <SongList />
      
    </div>
  );
}

export default App;
