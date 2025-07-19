import React from 'react'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bounce, ToastContainer } from 'react-toastify';
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../axios-client';

function RemoteUserLayout() {
    const { id } = useParams();
    const navigate = useNavigate();
    React.useEffect( () => {
        document.body.classList.remove('no-scroll');
    }, []);

    const { setName, setToken, setRole, setId, setEmail, setUserKaraokeId, userKaraokeId } = useStateContext();

    function logout(){
        axiosClient.post("/logout")
            .then( (res) => {
                // console.log(res);
                setName(null);
                setToken(null);
                setRole(null);
                setId(null);
                setEmail(null);
                setUserKaraokeId(null);
                navigate(`/r/login/${id}`);
            })
            .catch( (err) => {
                // console.log(err);
                setName(null);
                setToken(null);
                setRole(null);
                setId(null);
                setEmail(null);
                setUserKaraokeId(null);
                navigate(`/r/login/${id}`);
            })
    }

    React.useEffect(() => {
        console.log((userKaraokeId)?.toString());
        console.log((id)?.toString())

        if(userKaraokeId && id && ((userKaraokeId)?.toString() !== (id)?.toString())){
            logout();
            console.log("logout");
        }
    }, [userKaraokeId]);


    return (
        <div className='bg-background text-textPrimary overflow-x-hidden'>
            <Navbar />
            <div className='min-h-[100svh] pt-[72px]'>
                <Outlet context={{
                    
                }} />
            </div>
            <Footer userType={1} />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
                />
        </div>
    )
}

export default RemoteUserLayout