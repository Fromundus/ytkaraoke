import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useStateContext } from '../context/ContextProvider'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axiosClient from '../axios-client';
import { Bounce, ToastContainer } from 'react-toastify';

function GuestLayout() {
    const { role, id, token, name, userKaraokeId } = useStateContext();

    React.useEffect( () => {
        document.body.classList.remove('no-scroll');
    }, []);

    if(role === "admin" && id && token && name){
        return <Navigate to={`${role}`} />
    }

    if(role === "remote" && id && userKaraokeId && token && name){
        return <Navigate to={`${role}/${userKaraokeId}`} />
    }

    return (
        <div className="bg-background text-textPrimary overflow-x-hidden bg[url('https://i.pinimg.com/1200x/fd/36/34/fd363452b137ba4f37585288f3b0d116.jpg')] bg-cover bg-center bg-fixed transition-all">
            {/* <Navbar /> */}
            <div className='min-h-[100svh]'>
                <Outlet context={{
                    
                }} />
            </div>
            {/* <Footer /> */}
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
        </div>
    )
}

export default GuestLayout