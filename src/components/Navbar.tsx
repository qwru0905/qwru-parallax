import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>qwru0905</Link>
      <div className={styles.links}>
        <Link
          to="/dev"
          className={`${styles.link} ${pathname === '/dev' ? styles.active : ''}`}
        >
          DEV
        </Link>
        <Link
          to="/youtube"
          className={`${styles.link} ${pathname === '/youtube' ? styles.active : ''}`}
        >
          YOUTUBE
        </Link>
        <Link
          to="/music"
          className={`${styles.link} ${pathname === '/music' ? styles.active : ''}`}
        >
          MUSIC
        </Link>
      </div>
    </nav>
  )
}
