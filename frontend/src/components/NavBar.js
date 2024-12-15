import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/NavBar.module.css';

function NavBar({ authData, onLogout }) {
  const { token, role } = authData;

  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.home}>
          <Link to="/">Home</Link>
        </li>
        {role === 'manager' && (
          <li>
            <Link to="/edit-matches">Edit Matches</Link>
          </li>
        )}
        {role === 'admin' && (
          <>
            <li>
              <Link to="/edit-users">Edit Users</Link>
            </li>
          </>
        )}
        {role === 'fan' && (
          <>
            <li>
              <Link to="/reserve-ticket">Reserve Ticket</Link>
            </li>
            <li>
              <Link to="/edit-profile">Edit Profile</Link>
            </li>
          </>
        )}
        <div className={styles.rightLinks}>
          {!token ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={onLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default NavBar;