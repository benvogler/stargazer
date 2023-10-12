'use client';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="background.mp4" type="video/mp4"></source>
      </video>
    </main>
  )
}

function toggleMute() {

}
