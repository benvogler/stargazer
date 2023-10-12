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
            <div className="flex gap-2 items-center h-min">
              <div className="text-base" id="volumeLabel">Audio Isolation: Engaged</div>
              <div className="cursor-pointer text-sky-800 transition-all hover:scale-110 hover:drop-shadow-sm">
                <SpeakerWaveIcon id="volumeOnIcon" className="h-6 w-6 hidden" onClick={toggleMute}/>
                <SpeakerXMarkIcon id="volumeOffIcon" className="h-6 w-6" onClick={toggleMute}/>
              </div>
            </div>
            <div className={styles.welcomeMessageWrapper} style={{left: 'calc(50% - 200px)', top: 'calc(50% - 100px)'}} draggable onDragStart={handleDragStart} onDrag={handleDrag}>
              <div id="welcomeModal" className={styles.welcomeMessage + ' transition-opacity'}>
                <div className="flex justify-between">
                  <div className="text-lg text-sky-300 flex gap-2 items-center">
                    <SunIcon className="h-6 w-6 text-yellow-300"/>
                    Welcome, Commander
                  </div>
                  <XCircleIcon className="h-6 w-6 cursor-pointer text-sky-800 transition-all hover:scale-110 hover:drop-shadow-sm" onClick={closeWelcomeMessage}></XCircleIcon>
                </div>
                <div className="text-base">
                  Current Time: {getTime(date)}
                </div>
              </div>
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

let offsetX: number, offsetY: number, left: number, top: number;
function handleDragStart(event: any) {
  console.log(event.currentTarget);
  let preview: any = document.querySelector('#dragPreview');
  if (!preview) {
    preview = document.createElement('div');
    preview.style.backgroundColor = 'rgba(0,0,0,0)';
    preview.style.height = '1px';
    preview.style.width = '1px';
    preview.id = 'dragPreview';
    document.body.appendChild(preview);
  }
  event.dataTransfer.setDragImage(preview, 0, 0);
  let leftMatches = event.target.style.left.match(/50% ([+-]) ([0-9]*)px/);
  let topMatches = event.target.style.top.match(/50% ([+-]) ([0-9]*)px/);
  left = parseInt(leftMatches[2]) * (leftMatches[1] === '+' ? 1 : -1);
  top = parseInt(topMatches[2]) * (topMatches[1] === '+' ? 1 : -1);
  offsetX = event.clientX;
  offsetY = event.clientY;
  // window.setTimeout(() => event.target.style.visibility = 'hidden');
}

function handleDrag(event: any) {
  if (event.clientX === 0 && event.clientY === 0) {
    return;
  }
  event.preventDefault();
  let element: HTMLElement = event.target;
  let updatedLeft = left - (offsetX - event.clientX);
  let updatedTop = top - (offsetY - event.clientY);
  element.style.left = `calc(50% ${updatedLeft >= 0 ? '+' : '-'} ${Math.abs(updatedLeft)}px)`;
  element.style.top = `calc(50% ${updatedTop >= 0 ? '+' : '-'} ${Math.abs(updatedTop)}px)`;
  left = updatedLeft;
  top = updatedTop;
  offsetX = event.clientX;
  offsetY = event.clientY;
}

function closeWelcomeMessage() {
  let modal: any = document.querySelector('#welcomeModal')!;
  modal.classList.add(styles.closeWelcomeMessage);
  modal.style.animation = 'none';
  window.setTimeout(() => modal.style.animation = '', 1);
}
