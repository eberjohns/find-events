import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/">
          FindEvents
        </Link>
        <div>
          <NavLink to="/">
            Home
          </NavLink>
          {token ? (
            <button
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">
                Login
              </NavLink>
              <NavLink to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;