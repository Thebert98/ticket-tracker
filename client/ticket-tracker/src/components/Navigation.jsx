import { NavLink } from 'react-router-dom';
import logo from '../imgs/logo.jpg';
import '../App.css';

const Navigation = () => {
  return (
    <nav className='nav-bar'>
      <div className='left-nav'>
        <NavLink className='logo-link' to='/'>
          <img src={logo} alt='logo failed to load' className='logo' />
        </NavLink>
        <NavLink className='nav-link' to='/' activeclassname='active'> 
          Home
        </NavLink>
      </div>
      <div className='right-nav'>
        <NavLink className='nav-link' to='/admin' activeclassname='active'> 
          Admin Panel
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
