import React from 'react'
import { Scanner } from '@yudiel/react-qr-scanner';
import Form from '../components/ui/Form';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axiosClient from '../axios-client';
import AdminPage from '../components/ui/AdminPage';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useStateContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

const AdminScanner = () => {
    const { id } = useStateContext();
    const [karaokeId, setKaraokeId] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [registerModal, setRegisterModal] = React.useState(false);

    const [data, setData] = React.useState({
        name: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = React.useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if(name === "karaokeId"){
            setKaraokeId(value);
        } else {
            setData((prev) => {
                return {
                    ...prev,
                    [name]: value,
                }
            });
        }

        setErrors({});
    };

    const handleToggleRegisterModal = (action) => {
        action ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');
        setRegisterModal(action ? true : false);
        setErrors({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await axiosClient.get(`/karaoke/${karaokeId}`);
            console.log(res);
            if(res.status === 200){
                handleToggleRegisterModal(true);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            if(err.response.status === 404){
                setErrors({
                    karaokeId: "Karaoke is not found or is already registered."
                });
            } else {
                setErrors(err.response.data.message);
            }
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const form = {
                userId: id,
                karaokeId: karaokeId,
                name: data.name,
                password: data.password,
                password_confirmation: data.password_confirmation,
            }

            const res = await axiosClient.post(`/registerkaraoke/${karaokeId}`, form);
            console.log(res);
            if(res){
                handleToggleRegisterModal(false);
                navigate('/admin');
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            setErrors(err.response.data.message);
            setLoading(false);
        }
    };

    console.log(karaokeId);

    return (
        <AdminPage className={'flex flex-col gap-8 items-center'}>
            <div className='max-w-sm'>
                <Scanner onScan={(result) => setKaraokeId(result[0].rawValue)} />
            </div>

            <Card className={"w-full"}>
                <Form onSubmit={handleSubmit}>
                    <Input
                        id="karaokeId"
                        type={"text"}
                        name={"karaokeId"}
                        placeholder={"Karaoke ID"}
                        onChange={handleChange}
                        value={karaokeId}
                        disabled={loading}
                        error={errors.karaokeId}
                    />
                    <Button
                        loading={loading}
                        disabled={loading || !karaokeId}
                        className={"bg-primary flex items-center justify-center"}
                        label={"Register"}
                    />
                </Form>
            </Card>

            {registerModal &&
            <Modal title={"Register Karaoke"} onClose={() => handleToggleRegisterModal(false)}>
                <Form onSubmit={handleUpdate}>
                    <Input
                        id="name"
                        type={"text"}
                        name={"name"}
                        placeholder={"Name"}
                        onChange={handleChange}
                        value={data.name}
                        disabled={loading}
                        error={errors.name}
                    />

                    <Input
                        id="password"
                        type={"password"}
                        name={"password"}
                        placeholder={"Password"}
                        onChange={handleChange}
                        value={data.password}
                        disabled={loading}
                        error={errors.password}
                    />

                    <Input
                        id="password_confirmation"
                        type={"password"}
                        name={"password_confirmation"}
                        placeholder={"Confirm Password"}
                        onChange={handleChange}
                        value={data.password_confirmation}
                        disabled={loading}
                        error={errors.password_confirmation}
                    />

                    <Button
                        loading={loading}
                        disabled={loading || !data.name || !data.password || !data.password_confirmation}
                        className={"bg-primary flex items-center justify-center"}
                        label={"Register"}
                    />
                </Form>
            </Modal>}
        </AdminPage>
    )
}

export default AdminScanner
