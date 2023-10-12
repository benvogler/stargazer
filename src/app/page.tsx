'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { SparklesIcon, SunIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';

export default function Home() {
  let [ date, setDate ] = useState(new Date());
  useEffect(() => {
    let timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    }
  });
  return (
    <main>
      <div className={styles.backgroundVignette}></div>
      <video className={styles.backgroundVideo} autoPlay loop muted>
        <source src="background.mp4" type="video/mp4"></source>
      </video>

      <div className={styles.interface + ' p-4'}>
        <div className="flex justify-between">
          <div>
            <h1 className="text-base text-sky-300 flex gap-1 items-center">
              <SparklesIcon className="h-5 w-5 text-yellow-300"/>
              Stargazer Station
            </h1>
            <h2 className="text-base">Pleione 10 d, Inner Orion Spur</h2>
          </div>
          <div className="flex gap-2 items-center h-min">
            <div className="text-base" id="volumeLabel">Audio Isolation: Engaged</div>
            <div className="cursor-pointer text-sky-800 transition-all hover:scale-110 hover:drop-shadow-sm">
              <SpeakerWaveIcon id="volumeOnIcon" className="h-6 w-6 hidden" onClick={toggleMute}/>
              <SpeakerXMarkIcon id="volumeOffIcon" className="h-6 w-6" onClick={toggleMute}/>
            </div>
          </div>
          <div id="welcomeModal" className={styles.welcomeMessage + ' p-4 transition-opacity'}>
            <div className="flex justify-between">
              <div className="text-lg text-sky-300 flex gap-2 items-center">
                <SunIcon className="h-6 w-6 text-yellow-300"/>
                Welcome, Commander
              </div>
              <XCircleIcon className="h-6 w-6 cursor-pointer text-sky-800 transition-all hover:scale-110 hover:drop-shadow-sm" onClick={() => document.querySelector('#welcomeModal')!.classList.add('opacity-0')}></XCircleIcon>
            </div>
            <div className="text-base">
              Current Time: {getTime(date)}
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

function leftPad(num: Number, count=2) {
  let str: String = '' + num;
  while (str.length < count) {
    str = '0' + num;
  }
  return str;
}

function getTime(d: Date) {
  return `${leftPad(d.getUTCHours())}:${leftPad(d.getUTCMinutes())}:${leftPad(d.getUTCSeconds())}`;
}
