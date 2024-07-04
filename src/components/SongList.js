import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import useFetch from '../queries/useFetch';
import ADD_SONG from '../queries/ADD_SONG';
import DELETE_SONG from '../queries/DELETE_SONG';

const SongList = () => {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [canPlayThrough, setCanPlayThrough] = useState(false);
    const [clickedShuffle, setClickedShuffle] = useState(false);
    const inputRef = useRef(null);
    const audioRef = useRef(null);
    
    const { data, refetch } = useFetch();
    // Ensure data and data.songs are defined before usage
    const songs = data?.getSongs ?? [];
    const [addSong] = useMutation(ADD_SONG);
    const [deleteSong] = useMutation(DELETE_SONG);

    //Wait for music to load when shuffle is clicked
    useEffect(() => {
        if (canPlayThrough && clickedShuffle) {
            setClickedShuffle(false);
            handlePlay();
        }
    }, [canPlayThrough, clickedShuffle]);

    // Handle song ended event
    useEffect(() => {
        if (songs.length === 0) {
            setCurrentSongIndex(0);
        }

    const handleEnded = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(prevIndex => prevIndex + 1);
        } else {
            setCurrentSongIndex(0);
        }
    };

    if (audioRef.current) {
        audioRef.current.addEventListener('ended', handleEnded);
    }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, [songs, currentSongIndex]);

    const audioSrc = songs[currentSongIndex]?.url ?? "";

    // Handle file input change
    const handleChange = (e) => {
        e.preventDefault();

        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setName(selectedFile.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    // Handle adding a new song
    const handleAddSongToDB = async () => {
        try {
            const response = await addSong({
                variables: { name: name, url: url }
            });
            console.log('song added', response);
            refetch();
        } catch (error) {
            console.error('Error adding song: ', error);
        }
        setName("");
        setUrl("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    // Handle playing a song
    const handlePlay = () => {
        if (songs.length > 0 && audioRef.current) {
            audioRef.current.play();
        }
    }

    const handleRemove = async (id) => {
        console.log(id);
        try{
            const response = await deleteSong({
                variables: {id}
            });
            console.log("song deleted", response);
            refetch();
        }catch(error){
            console.error(error);
        }
    }

    // Generate random integer for shuffle play
    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    // Handle shuffle play
    const handleShuffle = () => {
        if (songs.length > 0) {
            const randomIndex = getRandomInt(songs.length);
            setCurrentSongIndex(randomIndex);    
            setClickedShuffle(true);
        }
    }

    return (
        <div>
            <h1>Add song to playlist</h1>
            <input type="file" ref={inputRef} onChange={handleChange}></input>

            {name && <button onClick={handleAddSongToDB}>Add</button>}
            
            <div>
                {songs.length > 0 && (
                    <>
                        <button onClick={() => {
                            setCurrentSongIndex(0);
                            handlePlay();
                        }}>Start Playlist</button>
                        <button onClick={handleShuffle}>Shuffle Play</button>
                    </>
                )}
            </div>
           
            <ul>
                {songs.length > 0 && 
                    songs.map((song, index) => (
                        <li key={song._id}>
                            {song.name}
                            <button onClick={() => {
                                setCurrentSongIndex(index);
                                handlePlay();
                            }}>Play</button>
                            <button onClick={() => handleRemove(song._id)}>Remove</button>
                        </li>
                    ))}
            </ul>

            {songs.length > 0 && (
                <>
                    <audio ref={audioRef} 
                        onCanPlayThrough={() => {
                            setCanPlayThrough(true);
                        }}
                        src={audioSrc} 
                        onEnded={() => {
                            if (currentSongIndex < songs.length - 1) {
                                setCurrentSongIndex(prevIndex => prevIndex + 1);
                            } else {
                                setCurrentSongIndex(0);
                            }
                        }}
                        controls
                    />
                    <div>
                        <p>Now Playing: {songs[currentSongIndex].name}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default SongList;
