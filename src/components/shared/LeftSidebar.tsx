import { Link, NavLink, useNavigate , useLocation} from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';


const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if(isSuccess) navigate(0)
  },[isSuccess])



  return (
  <nav className='leftsidebar'> 
    <div className='flex flex-col gap-11'>
    <Link to="/" className='flex items-center gap-3'>
          <img 
            src='/assets/images/logo1.png'
            alt='logo'
            width={200}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className='flex items-center gap-3'>
          <img 
            src={user.imageUrl || '/assets/icons/profile-placeholder.svg' }
            alt='profile'
            className='rounded-full h-14 w-14'
          />

          <div className='flex flex-col'>
            <p className='body-bold'>
              {user.name}
            </p>
            <p className='small-regular text-light-3'>
              @{user.username}
            </p>
          </div>
        </Link>
        
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) =>{
            const isActive = pathname === link.route;
             
            return (
              <li key={link.label}
              className={`leftsidebar-link group ${
                isActive && 'bg-primary-500' 
              }`}>
              
                <NavLink
                  to={link.route}
                  className='flex items-start gap-4 p-4'
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white
                    ${isActive && 'invert-white'}
                    `}
                    
                  />
                  {link.label}
                </NavLink>
                
              </li>
            )
          })}
        </ul>
    </div>

    <Button variant='ghost' className='shad-button_ghost' onClick={() => signOut()}>
        <img 
            src='/assets/icons/logout.svg'
            alt='logout'
         />
        <p className='small-medium lg:base-medium'>Logout</p>
   </Button>
  </nav>
  )
}

export default LeftSidebar
