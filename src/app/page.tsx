'use client';
import styles from './page.module.css';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <main>
      <div className={styles.backgroundVignette}></div>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="background.mp4" type="video/mp4"></source>
      </video>

      <div className={styles.interface + ' p-4'}>
        <div className="flex justify-between">
          <div>
            <h1 className="text-lg text-sky-400">Stargazer Station</h1>
            <h2 className="text-base">Pleione 10 d, Inner Orion Spur</h2>
          </div>
          <div className="flex gap-2 align-middle">
            <div className="text-sm" id="volumeLabel">Audio Isolation: Engaged</div>
            <div className="cursor-pointer text-sky-800 hover:scale-110 hover:drop-shadow-sm">
              <SpeakerWaveIcon id="volumeOnIcon" className="h-6 w-6 hidden" onClick={toggleMute}/>
              <SpeakerXMarkIcon id="volumeOffIcon" className="h-6 w-6" onClick={toggleMute}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function toggleMute() {
  let video: HTMLVideoElement = document.querySelector(`.${styles.backgroundVideo}`)!;
  video.muted = !video.muted;
  document.querySelector('#volumeOnIcon')?.classList.toggle('hidden');
  document.querySelector('#volumeOffIcon')?.classList.toggle('hidden');
  document.querySelector('#volumeLabel')!.innerHTML = `Audio Isolation: ${video.muted ? 'Engaged' : 'Disengaged'}`;
}
