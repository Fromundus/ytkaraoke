import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import axiosClient from '../axios-client';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import echo from '../echo';
import Button from '../components/ui/Button';
import VideoPlayer from '../components/VideoPlayer';

const Landing = () => {
  const [karaokeId, setKaraokeId] = React.useState(null);
  const [karaoke, setKaraoke] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedId = localStorage.getItem('karaokeId');

    if(storedId){
      setKaraokeId(storedId);
    } else {
      // const newId = uuidv4();
      const newId = generateAlphanumericCode();
      
      localStorage.setItem('karaokeId', newId);
      setKaraokeId(newId);
    }
  }, []);

  React.useEffect(() => {
    if(karaokeId){
      registerKaraoke();
    }
  }, [karaokeId]);

  function generateAlphanumericCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const registerKaraoke = async () => {
    setLoading(true);

    try {
      const data = {
        karaokeId: karaokeId
      }

      const res = await axiosClient.post('/savekaraoke', data);
      setKaraoke(res.data.data);
      console.log(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    echo.channel(`karaoke.${(localStorage.getItem("karaokeId"))?.toString()}`)
      .listen('.karaoke.control', (e) => {
        console.log('Received action:', e);
        // Play/pause/skip song
        if(e.action.action === "update" && e.action.karaoke){
          setKaraoke(e.action.karaoke);
        }
      });
  }, []);

  if(loading){
    return (
      <div className='min-h-[100vh] flex items-center justify-center text-center'>
        <span className='text-xl'>Loading...</span>
      </div>
    )
  }

  if(!loading && !karaoke){
    return (
      <div className='min-h-[100vh] flex items-center justify-center'>
        <span className='text-xl'>Connection Error.</span>
      </div>
    )
  }

  if(karaokeId && karaoke?.status === "pending" && !loading){
    return (
      <>
      <div className='flex sm:hidden md:hidden lg:hidden min-h-[100vh] items-center justify-center'>
        <Button
          label={"Connect to Remote"}
          onClick={() => navigate('/r/login')}
          className={"bg-primary"}
        />
      </div>

      <div className='hidden sm:flex md:flex lg:flex min-h-[100vh] flex-col gap-4 items-center justify-center p-4 text-center'>
        <span className='text-xl font-semibold'>Register Karaoke</span>
        <div className='bg-white p-4 rounded-lg flex w-fit'>
          <div className='flex flex-col justify-center items-center text-center gap-2'>
            <QRCode className='w-32 h-32' value={karaokeId} />
            {/* <span className='text-black text-xs font-semibold text-wrap'>Scan to register karaoke.</span> */}
          </div>
        </div>
        <span className='text-2xl text-white'>KARAOKE ID: <span className='font-bold'>{karaokeId}</span></span>
        <p>Login to your account at <span className='font-semibold text-primary'>{`${process.env.REACT_APP_APP_URL}/login`}</span>. Scan the qrcode or copy the karaoke id. Create name and password, and register.</p>
      </div>
      </>
    )
  }

  return (
    <div className='h-screen'>
      {/* <p>Session ID: {karaokeId}</p>
      {karaoke.name} */}
      <div className='flex sm:hidden md:hidden lg:hidden min-h-[100vh] items-center justify-center'>
        <Button
          label={"Connect to Remote"}
          onClick={() => navigate('/r/login')}
          className={"bg-primary"}
        />
      </div>

      <div className='hidden sm:block md:block lg:block min-h-[100vh]'>
        <VideoPlayer karaoke_id={karaoke?.id} />
      </div>
    </div>
  )
}

export default Landing
