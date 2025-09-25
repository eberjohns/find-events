import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {
  const { token, user, logout } = useAuth();

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
            <>
              <NavLink to="/my-events">
                My Events
              </NavLink>
              <NavLink to="/create-event">
                Create Event
              </NavLink>
              {/* Only show Register College if not a rep in a college */}
              {(!user || user.role !== 'REP' || !user.college_id) && (
                <NavLink to="/register-college">
                  Register College
                </NavLink>
              )}
              {/* Only show Admin if user is admin */}
              {user && user.role === 'ADMIN' && (
                <NavLink to="/admin">
                  Admin
                </NavLink>
              )}
              <button
                onClick={logout}
              >
                Logout
              </button>
            </>
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