import React, {useState, useEffect, useRef} from 'react';

const YoutubePlayer = () => {
    const [query, setQuery] = useState("");
    const YOUTUBE_API_KEY = 'AIzaSyDsYTLQcR4WMSrpwsCxY7sFxPv7ocPYJuE';
    const [queue, setQueue] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef();
    
    useEffect(() => {
        //Load Youtube Iframe Player API
        if(queue.length > 0){
            console.log(queue);
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            //Initialize player
            window.onYouTubeIframeAPIReady = () => {
                playerRef.current = new window.YT.Player('player', {
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange,
                    },
                });
            }
        }
    
    }, [queue]);

    const onPlayerReady = (event) => {
        console.log("player ready");
        if(queue.length > 0){
            console.log(queue);
            playVideo(queue[currentVideoIndex].videoId);
        }
    };

    const onPlayerStateChange = (event) => {
        if(event.data === window.YT.PlayerState.ENDED){
            handleVideoEnd();
        }
    }

    const handleSearch = async () => {
        try{
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`);
            const data = await response.json();
            const videoId = data.items[0].id.videoId;
            const videoName = data.items[0].snippet.title;

            setQueue((prevQueue) => {
                const id = prevQueue.length > 0 ? prevQueue[prevQueue.length - 1].id + 1 : 1;
                return [...prevQueue, {id: id, name: videoName, videoId: videoId}]
            })
        }
        
        catch(error){
            console.error("Error", error);
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        const input = e.target.value;
        setQuery(input);
    }

    const playVideo = (videoId) => {
        console.log(queue);
        setIsPlaying(true);
        if(playerRef.current){
            playerRef.current.loadVideoById(videoId);
        }
    };

    const handleVideoEnd = () => {
        console.log("video ended");
        setIsPlaying(false);
        
        if (currentVideoIndex < queue.length) {
            setCurrentVideoIndex(prevIndex => prevIndex + 1);
        } 
    }

    useEffect(() => {
        if (queue.length > 0 && playerRef.current) {
            playVideo(queue[currentVideoIndex].videoId);
        }
    }, [currentVideoIndex]);

    return (
        <div>
            <input onChange={(e) => handleChange(e)}></input>
            <button onClick={() => handleSearch()}>Search Video</button>
            
            <div id="player"></div>
        
            {queue.length > 0 && <p>Now Playing: {queue[currentVideoIndex].name}</p>}
            
            <p>Current Playlist</p>
            {queue.length > 0 && 
                queue.map((video) => {
                    return <li key={video.videoId}>{video.name}</li>
                })
            }
        </div>
    )
}

export default YoutubePlayer;