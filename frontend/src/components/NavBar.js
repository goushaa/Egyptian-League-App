import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/NavBar.module.css';

function NavBar({ authData, onLogout }) {
  const { token, role } = authData;

  return (
    <nav className={styles.navBar_nav}>
      <ul className={styles.navBar_ul}>
        <li className={styles.navBar_home}>
          <Link to="/" className={styles.navBar_a}>
            <img
              src="https://upload.wikimedia.org/wikipedia/ar/6/60/Egyptian_Football_Association.svg"
              alt="Home"
              className={styles.navBar_logo}
            />
          </Link>
        </li>
        {role === 'manager' && (
          <>
            <li>
              <Link to="/edit-matches" className={styles.navBar_a}>Edit Matches</Link>
            </li>
            <li>
              <Link to="/create-stadium" className={styles.navBar_a}>Add Stadium</Link>
            </li>
          </>
        )}
        {role === 'admin' && (
          <>
            <li>
              <Link to="/edit-users" className={styles.navBar_a}>Edit Users</Link>
            </li>
          </>
        )}
        {role === 'fan' && (
          <>
            <li>
              <Link to="/reserve-ticket" className={styles.navBar_a}>Reserve Ticket</Link>
            </li>
            <li>
              <Link to="/edit-profile" className={styles.navBar_a}>Edit Profile</Link>
            </li>
          </>
        )}
        <div className={styles.navBar_rightLinks}>
          {!token ? (
            <>
              <li>
                <Link to="/login" className={styles.navBar_a}>Login</Link>
              </li>
              <li>
                <Link to="/signup" className={styles.navBar_a}>Sign Up</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={onLogout} className={styles.navBar_logoutButton}>
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