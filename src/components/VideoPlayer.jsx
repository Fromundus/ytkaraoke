import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import axiosClient from '../axios-client';
import echo from '../echo';
import FullscreenButton from './FullscreenButton';
import bg from "../assets/blink-twice.mp4";
import QRCode from 'react-qr-code';

const extractVideoId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const VideoPlayer = ({ karaoke_id }) => {
  const playerRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [showFirst, setShowFirst] = useState(true);

  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst(prev => !prev);
    }, 10000); // 20 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPlayList = () => {
    axiosClient.get(`/karaokesongs/${karaoke_id}`) // Adjust route as needed
      .then((res) => {
        console.log(res);
        setPlaylist(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Playlist fetch error', err);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetchPlayList();
  }, [currentIndex]);

  React.useEffect(() => {
    const karaokeId = localStorage.getItem("karaokeId");

    const channel = echo.channel(`karaoke.${karaokeId}`);

    channel.listen('.karaoke.control', (e) => {
      console.log('Received action:', e);

      switch (e.action) {
        case 'play':
          play();
          break;
        case 'pause':
          pause();
          break;
        case 'stop':
          stop();
          break;
        case 'mute':
          mute();
          break;
        case 'unmute':
          unmute();
          break;
        case 'next':
          next();
          break;
        case 'previous':
          previous();
          break;
        case 'songadded':
          fetchPlayList();
          break;
        case 'stopsong':
          nextStop();
          break;
        case 'restart':
          window.location.reload();
          break;
        default:
          console.warn(`Unhandled action: ${e.action}`);
      }
    });

    // Optional: clean up when component unmounts
    return () => {
      echo.leave(`karaoke.${karaokeId}`);
    };
  }, [playlist, currentIndex]);

  console.log("playlist", playlist);

  const currentVideo = playlist[currentIndex];
  const videoId = currentVideo ? extractVideoId(`https://www.youtube.com/watch?v=${currentVideo.code}`) : null;

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    setPlayerReady(true);
    event.target.playVideo();
  };

  const onEnd = () => {
    // setPlaylist((prev) => {
    //   const updated = [...prev];
    //   if (updated[currentIndex]) updated[currentIndex].played = true;
    //   return updated;
    // });

    nextStop();
    setCurrentIndex(0);

    // if (currentIndex < playlist?.length - 1) {
    //   setCurrentIndex((prev) => prev + 1);
    // }
  };

  // Controls
  const play = () => playerRef.current?.playVideo();
  const pause = () => playerRef.current?.pauseVideo();
  const stop = () => playerRef.current?.stopVideo();
  const mute = () => playerRef.current?.mute();
  const unmute = () => playerRef.current?.unMute();

  const next = () => {
    console.log("next");
    console.log(currentIndex);
    if (currentIndex < playlist?.length - 1) {
      setCurrentIndex((prev) => {
        console.log('Incrementing index to', prev + 1); // <-- Add this
        return prev + 1;
      });
    }
  };

  const previous = () => {
    console.log("previous");
    if (currentIndex > 0) {
      setCurrentIndex((prev) => {
        console.log('Incrementing index to', prev - 1); // <-- Add this
        return prev - 1;
      });
    }
  };

  const nextStop = () => {
    console.log("stop playlist", playlist);
    console.log("stop currentIndex", currentIndex);
    const currentPlayingVideo = playlist[currentIndex];

    console.log("stop currentPlayingVideo", currentPlayingVideo);

    const data = {
      karaokeId: currentPlayingVideo.karaoke_id,
      songId: currentPlayingVideo.id,
    }

    console.log(data);
    
    axiosClient.post('/stopsong', data)
      .then((res) => {
        console.log(res);
        setPlaylist(res.data.data);
        setCurrentIndex(0);
        // window.location.reload();
        // next();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    if (playerReady && currentVideo) {
      playerRef.current.loadVideoById(extractVideoId(`https://www.youtube.com/watch?v=${currentVideo.code}`));
    }
  }, [currentIndex]);

  const renderPlaylist = playlist?.slice(0, 4).map((item) => {
    return (
      <div key={item.id}>
        <span className={`text-3xl font-extrabold text-outline-white text-nowrap`} style={{color: item.color}}>{item.code}</span>
      </div>
    )
  });

  if(loading){
    return (
      <div className='min-h-[100vh] flex items-center justify-center'>
        <span className='text-xl'>Loading...</span>
      </div>
    )
  }

  // if(!loading && !currentVideo){
  //   return (
  //     <div className='min-h-[100vh] flex items-center justify-center'>
        
  //     </div>
  //   )
  // }

  console.log(`${process.env.REACT_APP_APP_URL}/r/login/${localStorage.getItem("karaokeId")}`);

  if (!loading && !currentVideo) {
    return (
      <div className="relative w-screen min-h-[100vh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={bg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay content goes here */}
        <div className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center text-center">
          <div className='absolute top-4 left-4'>
            <FullscreenButton />
          </div>
          <div className='text-6xl text-outline-black-bold font-extrabold'>
            <span>Please select a song.</span>
          </div>
          <div className='absolute bottom-4 right-4 bg-white p-4 rounded-lg flex w-fit'>
            <div className='flex flex-col justify-center items-center text-center gap-2'>
              <QRCode className='w-32 h-32' value={`${process.env.REACT_APP_APP_URL}/r/login/${localStorage.getItem("karaokeId")}`} />
              <span className='text-black text-xs font-semibold text-wrap'>Scan to access remote.</span>
              <span className='text-black text-xs font-semibold text-wrap'>Karaoke Id: {localStorage.getItem("karaokeId")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="overflow-hidden">
      <div className='fixed w-full p-4'>
        <div className='flex items-center w-full rounded-lg'>
          <div className='w-96 bg-primary h-14 flex items-center gap-2 justify-center rounded-l-lg'>
            <FullscreenButton />
            <span className='text-4xl text-outline-white font-extrabold'>R ({playlist?.length})</span>
          </div>
          <div className='flex items-center gap-8 h-14 px-8 bg-gray-500 bg-opacity-50 w-full rounded-r-lg'>
            {renderPlaylist}
          </div>
        </div>
        <div className='mt-4'>
          {showFirst ? 
            playlist[0].title &&
            <span className='text-xl font-bold text-outline-black'>Current Song: {playlist[0]?.title}</span>
            :
            playlist[1]?.title &&
            <span className='text-xl font-bold text-outline-black'>Next Song: {playlist[1]?.title}</span>
          }
        </div>
      </div>
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: height.toString(),
          playerVars: {
            autoplay: 1,
            controls: 0,
          },
        }}
        onReady={onPlayerReady}
        onEnd={onEnd}
      />

      {/* <div className="flex gap-2 flex-wrap">
        <button onClick={play}>▶️ Play</button>
        <button onClick={pause}>⏸ Pause</button>
        <button onClick={stop}>⏹ Stop</button>
        <button onClick={mute}>🔇 Mute</button>
        <button onClick={unmute}>🔊 Unmute</button>
        <button onClick={previous}>⏮ Prev</button>
        <button onClick={next}>⏭ Next</button>
      </div> */}
      {/* <FullscreenButton /> */}
    </div>
  );
};

export default VideoPlayer;
