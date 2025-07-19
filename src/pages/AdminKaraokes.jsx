import React from 'react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useNavigate } from 'react-router-dom'
import AdminPage from '../components/ui/AdminPage'
import axiosClient from '../axios-client'
import { useStateContext } from '../context/ContextProvider'
import KaraokeCard from '../components/KaraokeCard'

const AdminKaraokes = () => {
  const { id } = useStateContext();
  const navigate = useNavigate();
  const [karaokes, setKaraokes] = React.useState([]);

  const fetchKaraokes = async () => {
    try {
      const res = await axiosClient.get(`/karaokes/${id}`);
      console.log(res);
      setKaraokes(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    fetchKaraokes();
  }, []);

  const renderKaraokes = karaokes?.map((item) => {
    return (
      <KaraokeCard key={item.id} karaoke={item} setKaraokes={setKaraokes} />
    )
  });

  return (
      <AdminPage>
        <Button
          label={"Scanner"}
          className={"bg-primary"}
          onClick={() => navigate('/admin/scanner')}
        />
        <div className='flex flex-wrap w-full mt-8 gap-4 items-center justify-center'>
          {renderKaraokes}
        </div>
      </AdminPage>
  )
}

export default AdminKaraokes