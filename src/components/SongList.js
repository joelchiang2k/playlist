import React, {useState, useRef, useEffect, useReducer} from 'react';

const reducer = (state, action) => {
    switch(action.type){
        case "add-song":
            const newId = state.songs.length > 0 ? state.songs[state.songs.length - 1].id + 1 : 1;
            const newSongs = [...state.songs, {id: newId, name: action.name, url: action.url}];
            try{
               localStorage.setItem('songs', JSON.stringify(newSongs)); 
            }catch (e){
                console.log("Local storage is full");
            }
            
            return {
                ...state,
                songs: newSongs
            }
        case "load-songs":
            return {
                ...state,
                songs: action.savedSongs
            };
        case "delete-song":
            const filteredSongs = state.songs.filter(song => song.id !== action.id)
            localStorage.setItem('songs', JSON.stringify(filteredSongs));
            return{
                ...state,
                songs: filteredSongs
            }
        default: 
            return state;
    }
}

const SongList = () => {
    const [{songs}, dispatch] = useReducer(reducer, {songs: []})
    //const [songs, setSongs] = useState([]);
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [selected, setSelected] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const inputRef = useRef(null);
    const audioRef = useRef(null);

    const handleChange = (e) => {
        e.preventDefault();
        
        console.log("onChange");

        const selectedFile = e.target.files[0];

        if(selectedFile){
            setName(selectedFile.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    useEffect(() => {
        if(songs.length === 0){
            setCurrentSongIndex(0)
        }

        const handleEnded = () => {
            if(currentSongIndex < songs.length - 1){
                setCurrentSongIndex((prevIndex) => prevIndex + 1);
                setTimeout(() => {
                    handlePlay();
                }, 2000);
            }else{
                setCurrentSongIndex(0);
                setTimeout(() => {
                    handlePlay();
                }, 2000);
            }
        }

        if(audioRef.current){
            audioRef.current.addEventListener('ended', handleEnded);
        }
       

        return () => {
            if(audioRef.current){
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        }
    }, [songs, currentSongIndex]);

    const handleAddSong = (e) => {
        e.preventDefault();
        dispatch({type: 'add-song', name: name, url: url})
        setName("");
        setUrl("");
        if(inputRef.current){
            inputRef.current.value = "";
        }
    }

    const handlePlay = () => {
        setSelected(true);
        if(songs.length > 0){
            if(audioRef.current){
                audioRef.current.play();
            }
            
            setIsPlaying(true);
        }
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    //function re-renders everytime I press shuffle
    const handleShuffle = () => {
        if(songs.length > 0){
            const randomIndex = getRandomInt(songs.length);
            setCurrentSongIndex(randomIndex);
            setTimeout(() => {
                console.log("playshuffle")
                handlePlay();
            }, 500)
        }
    }

    useEffect(() => {
        console.log("loading saved songs")
        const savedSongs = localStorage.getItem("songs");
        console.log(savedSongs);
        if(savedSongs){
            dispatch({type: 'load-songs', savedSongs: JSON.parse(savedSongs)})
        }
    }, [])


    return (
        <div>
            <h1>Add song to playlist</h1>
            <input type="file" ref={inputRef} onChange={handleChange}></input>
        
            {name && <button onClick={handleAddSong}>Add</button>}
            
            <div>
                {songs.length > 0 && (
                    <>
                        <button onClick={() => {
                            setCurrentSongIndex(0)
                            handlePlay()
                        }
                            }>Start Playlist</button>
                        <button onClick={() => handleShuffle()}>Shuffle Play</button>
                    </>
                    )
                }
            </div>
           
            <ul>
                {songs.length > 0 && 
                    songs.map((song, index) => {
                        return <li key={song.id}>
                            {song.name}
                            <button onClick={() => {
                                setCurrentSongIndex(index)
                                handlePlay()
                            }}>Play</button>
                            <button onClick={() => dispatch({ type: 'delete-song', id: song.id})}>Remove</button>
                            </li>
                    })
                }
            </ul>

            {songs.length > 0 && (
                <>
                    <audio ref={audioRef} 
                        src={songs[currentSongIndex].url} 
                        onEnded={() => {
                            if(currentSongIndex < songs.length - 1){
                                setCurrentSongIndex(prevIndex => prevIndex + 1);
                            }else{
                                setCurrentSongIndex(0);
                            }
                        }}
                    controls/>
                    <div>
                        <p>Now Playing: {songs[currentSongIndex].name}</p>
                    </div>
                </>
            )}

           
    
        </div>
    )
}

export default SongList;