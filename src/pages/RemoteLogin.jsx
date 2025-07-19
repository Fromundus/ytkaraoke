import React from 'react'
import axiosClient from '../axios-client';
import { useStateContext } from '../context/ContextProvider';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Page from '../components/ui/Page';
import Card from '../components/ui/Card';
import Form from '../components/ui/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';

function RemoteLogin({ noId }) {
    React.useEffect( () => {
        window.scrollTo(0 ,0);
    }, [])

    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsloading] = React.useState(false);
    const { setToken, setRole, setName, setId } = useStateContext();
    const [data, setData] = React.useState({
        karaoke_id: "",
        password: "",
    });

    const [errors, setErrors] = React.useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData( (prev) => {
            return {
                ...prev,
                [name]: value
            }
        })

        setErrors("");
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsloading(true);
        setErrors("");

        const form = {
            karaoke_id: noId ? data.karaoke_id : id,
            password: data.password,
            role: "remote",
        }

        axiosClient.post("/remotelogin", form)
            .then( (res) => {
                console.log(res);
                if(res.data.message === "Invalid Credentials"){
                    setErrors(res.data.message);
                } else if (res.data.message === "Pending Account"){
                    setErrors(res.data.message);
                }

                setToken(res.data.token);
                setRole(res.data.role);
                setName(res.data.name);
                setId(res.data.id);
                setIsloading(false);
            })
            .catch( (err) => {
                console.log(err)
                if(err?.response?.status === 422){
                    setErrors("Invalid Credentials")
                }

                if(err.message === "Network Error"){
                    setErrors("Server Offline")
                }
                setIsloading(false);
            })
    }

    return (
        <Page className={"min-h-[80svh] w-full flex items-center justify-center flex-col gap-8"}>
            <Card title={`Connect to ${id ? id : "Remote"}`} className={"w-full"} tcenter={1}>
                <Form onSubmit={handleSubmit}>
                    {errors && !isLoading && <span className='text-center bg-red-400 p-1.5 rounded text-white font-semibold mb-2'>{errors}</span>}

                    {noId && <Input 
                         id="karaoke_id"
                         type={"text"}
                         name={"karaoke_id"}
                         placeholder={"karaoke Id"}
                         onChange={handleChange}
                         value={data.karaoke_id}
                         error={errors.karaoke_id}
                     />}

                     <Input 
                         id="password"
                         type={"password"}
                         name={"password"}
                         placeholder={"password"}
                         onChange={handleChange}
                         value={data.password}
                         error={errors.password}
                     />

                     <Button
                         label={"Login"}
                         className={"bg-primary text-white flex justify-center"}
                         type={"submit"}
                         disabled={data.password.length === 0 || isLoading}
                         loading={isLoading}
                     />
                </Form>
            </Card>
            <div className='flex items-center gap-4'>
                {id && <Button
                    label={"Remote Login"}
                    className={"bg-accent"}
                    onClick={() => navigate('/r/login')}
                />}
                <Button
                    label={"Admin Login"}
                    className={"bg-accent"}
                    onClick={() => navigate('/login')}
                />
            </div>
        </Page>
    )
}

export default RemoteLogin