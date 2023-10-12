'use client';
import { useState, useEffect } from 'react';
import styles from './welcome.module.css';
import { SunIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Welcome() {
  let [ date, setDate ] = useState(new Date());
  useEffect(() => {
    let timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    }
  }, [date]);
  return (
    <div className={styles.welcomeMessageWrapper} style={{left: 'calc(50% - 200px)', top: 'calc(50% - 100px)'}} draggable onDragStart={handleDragStart} onDrag={handleDrag}>
        <div id="welcomeModal" className={styles.welcomeMessage + ' transition-opacity'}>
            <div>
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
  )
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
  modal.children[0].style.animation = 'none';
  window.setTimeout(() => {
    modal.style.animation = '';
    modal.children[0].style.animation = '';
  }, 1);
}
