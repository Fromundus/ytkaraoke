import React from 'react';
import "./App.css";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import GuestLayout from './layouts/GuestLayout';
import Landing from './pages/Landing';
import RequireAuthentication from './components/RequireAuthentication';
import AdminLayout from './layouts/AdminLayout';
import RemoteUserLayout from './layouts/RemoteUserLayout';
import Login from './pages/Login';
import AdminAccountSettings from './pages/AdminAccountSettings';
import AdminKaraokes from './pages/AdminKaraokes';
import AdminScanner from './pages/AdminScanner';
import AdminRemote from './pages/AdminRemote';
import GuestRemote from './pages/GuestRemote';
import RemoteLogin from './pages/RemoteLogin';

const roles = {
    admin: "admin",
    remote: "remote",
}

const router = createBrowserRouter(createRoutesFromElements(
    <>
        <Route path='/' element={<GuestLayout />}>
            <Route index element={<Landing />} />
            <Route path='login' element={<Login />} />
            <Route path='r/login' element={<RemoteLogin noId={true} />} />
            <Route path='r/login/:id' element={<RemoteLogin />} />
        </Route>

        <Route element={<RequireAuthentication allowedRoles={roles.admin} />}>
            <Route path={`${roles.admin}`} element={<AdminLayout />}>
                <Route index element={<AdminKaraokes />} />
                <Route path='remote/:id' element={<AdminRemote />} />
                <Route path='scanner' element={<AdminScanner />} />
                <Route path='account' element={<AdminAccountSettings userType={1} />} />
            </Route>
        </Route>

        <Route element={<RequireAuthentication allowedRoles={roles.remote} />}>
            <Route path={`${roles.remote}/:id`} element={<RemoteUserLayout /> }>
                <Route index element={<GuestRemote />} />
            </Route>
        </Route>
        
        <Route path='unauthorized' element={<Unauthorized />} />

        <Route path="*" element={<NotFound />} />
    </>
))

function App() {
    return (
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    )
}

export default App