import React from 'react'
import AdminPage from '../components/ui/AdminPage'
import Button from '../components/ui/Button'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import { FaPowerOff, FaPlay, FaPause, FaSearch, FaStop, FaVolumeMute, FaFastBackward, FaFastForward } from "react-icons/fa";
import Input from '../components/ui/Input'
import axiosClient from '../axios-client'
import { FaArrowsRotate, FaVolumeHigh } from 'react-icons/fa6'
import { useStateContext } from '../context/ContextProvider'

const RenderRemote = () => {
  const { id } = useParams();
  const { role } = useStateContext();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [karaoke, setKaraoke] = React.useState();

  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState();

  const [data, setData] = React.useState({
      search: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name === "search"){
      setSearchResults([]);
      setSearch(value);
    }

    setData((prev) => {
        return {
            ...prev,
            [name]: value,
        }
    });

    setErrors({});
  };

  const fetchKaraoke = async () => {
    try {
      const res = await axiosClient.get(`/showkaraoke/${id}`);
      console.log(res);
      setKaraoke(res.data.data);
    } catch(err){
      console.log(err);
    }
  }

  React.useEffect(() => {
    fetchKaraoke();
  }, []);

  const submitAction = async (action) => {
    setLoading(true);
    try {
        const res = await axiosClient.post('/karaoke/control', {
            karaokeId: id,
            action: action,
        });
        console.log(res);
        setLoading(false);
    } catch(err){
      console.log(err);
        setLoading(false);
    }
  }

  // const handleSearch = async (e) => {
  //   e.preventDefault();

  //   try { 
  //     const res = await searchYouTube(`${search} karaoke`);
  //     console.log(res);
  //     setSearchResults(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchLoading(true);

    try { 
      const res = await axiosClient.post('/youtube/search', { query: search });
      console.log(res);
      setSearchResults(res.data.data);
      setLoading(false);
      setSearchLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleReserve = async (song) => {
    setLoading(true);

    const data = {
      karaokeId: karaoke.id,
      karaokeKaraokeId: id,
      code: song.code,
      thumbnail: song.thumbnail,
      title: song.title,
      channel: song.channel,
      color: song.color,
    }

    try {
      const res = await axiosClient.post(`/reservesong`, data);
      console.log(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const renderResults = searchResults?.map((item) => {
    return (
      <div key={item.code} className='border border-border rounded-lg p-4 bg-background'>
        <div className='flex items-center gap-4'>
          <img className='rounded flex w-28' src={item.thumbnail} alt="" />
          <div className='flex flex-col gap-2'>
            <span className='font-semibold'>{item.channel}</span>
            <span className='text-textSecondary'>{item.title}</span>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            label={"Reserve"}
            loading={loading}
            disabled={loading}
            className={"bg-green-500 w-full sm:w-fit md:w-fit lg:w-fit flex items-center justify-center h-14 mt-4"}
            onClick={() => handleReserve(item)}
          />
        </div>
      </div>
    )
  });

  return (
    <AdminPage>
      {role === "admin" && <Button
        label={"Disconnect"}
        className={"bg-primary"}
        onClick={() => navigate('/admin')}
      />}

      {karaoke && <>
        <Card className={"mt-8"} title={id}>
          <div className='w-full grid grid-rows-3 gap-4'>
            <div className='grid grid-cols-1 gap-4'>
              {/* <Button
                label={!loading && <FaPowerOff />}
                className={"bg-white text-xl text-black flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('off')}
              /> */}
              <Button
                label={!loading && <FaArrowsRotate  />}
                className={"bg-white text-xl text-black flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('restart')}
              />
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <Button
                label={!loading && <FaPlay />}
                className={"bg-green-500 text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('play')}
              />
              <Button
                label={!loading && <FaPause />}
                className={"bg-gray-500 text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('pause')}
              />
              <Button
                label={!loading && <FaStop />}
                className={"bg-primary text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('stopsong')}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Button
                label={!loading && <FaVolumeMute />}
                className={"bg-gray-500 text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('mute')}
              />
              <Button
                label={!loading && <FaVolumeHigh />}
                className={"bg-gray-500 text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('unmute')}
              />
              {/* <Button
                label={!loading && <FaFastBackward  />}
                className={"bg-gray-500 text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('previous')}
              />
              <Button
                label={!loading && <FaFastForward  />}
                className={"bg-gray-500 text-xl flex items-center justify-center h-14"}
                loading={loading}
                disabled={loading}
                onClick={() => submitAction('next')}
              /> */}
            </div>
          </div>
        </Card>
        <Card className={"mt-4"} title={"Songbook"}>
          <div className='w-full flex items-center gap-2'>
            <Input 
              id="search"
              className={"w-full"}
              type={"text"}
              name={"search"}
              onChange={handleChange}
              value={search}
              placeholder={"Search..."}
              noTop={true}
              disabled={searchLoading}
              error={errors.name}
            />
            <Button
              label={!searchLoading && <FaSearch />}
              className={"bg-primary text-xl flex items-center justify-center"}
              loading={searchLoading}
              disabled={searchLoading}
              onClick={handleSearch}
            />
          </div>
          {searchLoading && <div className='text-center w-full justify-center'>Searching youtube...</div>}
          {searchResults?.length > 0 && !searchLoading && <div className='flex flex-col gap-2'>
            {renderResults}
          </div>}
        </Card>
      </>}
    </AdminPage>
  )
}

export default RenderRemote
