import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bounce, ToastContainer } from 'react-toastify';

function AdminLayout() {
    React.useEffect( () => {
        document.body.classList.remove('no-scroll');
    }, []);

    return (
        <div className='bg-background text-textPrimary overflow-x-hidden'>
            <Navbar userType={1} />
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

export default AdminLayout