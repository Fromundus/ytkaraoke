import React from 'react'
import karaokeImage from '../assets/karaoke.png';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import Form from './ui/Form';
import Input from './ui/Input';
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../axios-client';
import notify from '../lib/notify';
import { useNavigate } from 'react-router-dom';

const KaraokeCard = ({ karaoke, setKaraokes }) => {
    const { id } = useStateContext();
    const [updateModal, setUpdateModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [data, setData] = React.useState({
        name: karaoke?.name || "",
        password: karaoke?.password || "",
        password_confirmation: karaoke?.password_confirmation || "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        });

        setErrors({});
    };

    const handleToggleUpdateModal = (action) => {
        action ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');
        setUpdateModal(action ? true : false);
        setErrors({});
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const form = {
                userId: id,
                karaokeId: karaoke?.karaoke_id,
                name: data.name,
                password: data.password,
                password_confirmation: data.password_confirmation,
            }

            const res = await axiosClient.post(`/registerkaraoke/${karaoke?.karaoke_id}`, form);
            console.log(res);
            if(res){
                setData({
                    name: res.data.data.name,
                    password: "",
                    password_confirmation: "",
                })
                setKaraokes(res.data.karaokes);
                handleToggleUpdateModal(false);
                notify(res.data.message);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            setErrors(err.response.data.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Card className={"w-full flex flex-col gap-2 items-center justify-center"} maxW={"max-w-xs"}>
                <img className='w-44' src={karaokeImage} alt="" />
                <div>
                    <span className='font-semibold text-xl'>{karaoke?.name} ({karaoke?.karaoke_id})</span>
                </div>
                <div className='w-full flex gap-2'>
                    <Button
                        label={"Edit"}
                        className={"bg-white text-black w-full items-center justify-center"}
                        onClick={() => handleToggleUpdateModal(true)}
                    />
                    <Button
                        label={"Connect"}
                        className={"bg-primary w-full items-center justify-center"}
                        onClick={() => navigate(`remote/${karaoke?.karaoke_id}`)}
                    />
                </div>
            </Card>

            {updateModal &&
            <Modal title={"Update Karaoke"} onClose={() => handleToggleUpdateModal(false)}>
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
                        disabled={loading}
                        className={"bg-primary flex items-center justify-center"}
                        label={"Update"}
                    />
                </Form>
            </Modal>}
        </>
    )
}

export default KaraokeCard
