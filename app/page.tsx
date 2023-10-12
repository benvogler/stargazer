'use client';
import { useState, useEffect } from 'react';
import './globals.css'
import styles from './page.module.css';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Welcome from './welcome';
import VolumeControl from './volumeControl';

export default function Home() {
  let [ muted, setMuted ] = useState(true);
  return (
    <main>
      <div className={styles.backgroundVignette}></div>
      <video className={styles.backgroundVideo} autoPlay loop muted={muted}>
        <source src="background.mp4" type="video/mp4"></source>
      </video>
      <div className={styles.interfaceWrapper}>
        <div className={styles.interface}>
          <div className="flex justify-between">
            <div>
              <h1 className="text-base text-sky-300 flex gap-2 items-center tracking-normal">
                <SparklesIcon className="h-5 w-5 text-yellow-300"/>
                Stargazer Station
              </h1>
              <h2 className="text-base">Pleione 10 d, Inner Orion Spur</h2>
            </div>
            <VolumeControl muted={muted} onToggleMute={(value: boolean) => setMuted(value)}></VolumeControl>
          </div>
          <Welcome></Welcome>
        </div>
      </div>
    </main>
  )
}
