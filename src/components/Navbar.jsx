import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import LogoutButton from './LogoutButton';
import Button from './ui/Button';
import { useStateContext } from '../context/ContextProvider';

const Navbar = ({ userType }) => {
  const [dropDown, setDropDown] = React.useState(false);
  const navigate = useNavigate();
  const { userKaraokeId } = useStateContext();

  const dropDownToggle = () => {
    setDropDown(prev => !prev);
  }

  return (
    <>
      <nav className='fixed top-0 left-0 w-full p-4 transition-all duration-[1s] backdrop-blur-sm' style={{zIndex: 1000}}>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 items-center h-[40px]'>
          <a href='/admin' className='text-xl font-extrabold text-primary w-fit'>
              YT Karaoke
          </a>
          <div className='hidden sm:flex md:flex lg:flex items-center gap-6 w-full justify-center z-50'>
            {userType && <NavLink to={'/admin'}
              className={({isActive}) => 
                `font-extrabold ${isActive ? "text-primary" : "text-white"}`
              }
              end
            >
                KARAOKES
            </NavLink>}

            {userType && <NavLink to={'/admin/scanner'}
              className={({isActive}) => 
                `font-extrabold ${isActive ? "text-primary" : "text-white"}`
              }
            >
                REGISTER
            </NavLink>}

            {userType && <NavLink to={'/admin/account'}
              className={({isActive}) => 
                `font-extrabold ${isActive ? "text-primary" : "text-white"}`
              }
            >
                ACCOUNT
            </NavLink>}
          </div>

          {!userType && <div className='flex justify-end'>
            <LogoutButton karaokeId={userKaraokeId} label={"DISCONNECT"} className={'bg-accent text-white'} />
          </div>}

          <div className='hidden sm:flex md:flex lg:flex justify-end'>              
              {userType && <LogoutButton className={'bg-accent text-white'} />}
          </div>

          {userType && <div className='flex sm:hidden md:hidden lg:hidden justify-end'>
              <button className='text-2xl' onClick={dropDownToggle}>
                {!dropDown ? <RiMenu3Fill /> : <IoClose />}
              </button>
          </div>}
        </div>
      </nav>
      {dropDown && <div className='fixed top-[70px] w-full transition-all duration-[1s] backdrop-blur-sm p-4 sm:hidden md:hidden lg:hidden' style={{zIndex: 1000}}>
        <div className='flex flex-col gap-4'>
            {!userType && <Button 
              type={"button"}
              label={"LOGIN"}
              className={"bg-accent text-white w-full flex justify-center"}
              onClick={() => {
                dropDownToggle()
                navigate('/login')
              }}
            />}

            {userType && <LogoutButton className={'bg-accent text-white w-full flex justify-center'} />}

            <NavLink to={'/admin'}
              end
              className={({isActive}) => 
                `font-extrabold mt-2 text-nowrap ${isActive ? "text-primary" : "text-white"}`
              }
              onClick={dropDownToggle}
            >
                KARAOKES
            </NavLink>
            <NavLink to={'/admin/scanner'}
              end
              className={({isActive}) => 
                `font-extrabold text-nowrap ${isActive ? "text-primary" : "text-white"}`
              }
              onClick={dropDownToggle}
            >
                REGISTER
            </NavLink>
            {userType && <NavLink to={'/admin/account'}
              className={({isActive}) => 
                `font-extrabold ${isActive ? "text-primary" : "text-white"}`
              }
              onClick={dropDownToggle}
            >
                ACCOUNT
            </NavLink>}
          </div>
      </div>}
    </>
  )
}

export default Navbar
