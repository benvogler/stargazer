'use client';
import { useState, useEffect } from 'react';

const useSound = require('use-sound').default;
import { SettingsStore, useSettingsStore } from '@/stores/settings';

import styles from './welcome.module.css';
import { SunIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Sounds } from '@/utils/audio';
import { leftPad } from '@/utils/utils';

export default function Welcome() {
    let [date, setDate]: [any, any] = useState(null);
    useEffect(() => {
        setDate(new Date());
    }, [])
    const { mute } = useSettingsStore((state: SettingsStore) => state);
    useEffect(() => {
        let timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        }
    }, [date]);
    const [minimizeSfx] = useSound(Sounds.minimize, {
        volume: 4
    });
    return (
        <div className={styles.welcomeMessageWrapper} style={{ left: 'calc(50% - 25vh)', top: 'calc(50% - 12.5vh)' }} draggable onDragStart={handleDragStart} onDrag={handleDrag}>
            <div id="welcomeModal" className={styles.welcomeMessage + ' transition-opacity'}>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="flex justify-between mb-2">
                            <div className="text-lg text-sky-300 flex gap-2 items-center">
                                <SunIcon className="h-6 w-6 text-yellow-300" />
                                Welcome, {'<Unknown Employee>'}
                            </div>
                            <XCircleIcon className="h-6 w-6 cursor-pointer text-sky-700 transition-all hover:text-sky-500 hover:scale-110 hover:drop-shadow-sm" onClick={() => closeWelcomeMessage(minimizeSfx, mute)}></XCircleIcon>
                        </div>
                        <p>Station Systems: Nominal</p>
                        <p>Station Population: 372</p>
                        <p>Orbital Distance: 5,572 LS</p>
                        <p>Orbital Angle: 58.3&deg;</p>
                        <p>Xeno Threat Level: Moderate</p>
                    </div>
                    <div className="flex justify-end">
                        <p>{getDate()} {getTime(date)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getTime(d: Date) {
    if (!d) {return ''};
    return `${leftPad(d.getUTCHours())}:${leftPad(d.getUTCMinutes())}:${leftPad(d.getUTCSeconds())}`;
}

function getDate() {
    let d: Date = new Date();
    d.setUTCFullYear(d.getUTCFullYear() + 1300);
    return d.toLocaleDateString('en-us', {year: 'numeric', month: 'short', day: '2-digit'}) ;
}

let offsetX: number, offsetY: number, left: number = 0, top: number = 0;
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
    let leftMatches = event.target.style.left.match(/50% - 25vh ([+-]) ([0-9]*)px/);
    let topMatches = event.target.style.top.match(/50% - 12.5vh ([+-]) ([0-9]*)px/);
    if (leftMatches?.length && topMatches?.length) {
        left = parseInt(leftMatches[2]) * (leftMatches[1] === '+' ? 1 : -1);
        top = parseInt(topMatches[2]) * (topMatches[1] === '+' ? 1 : -1);
    }
    offsetX = event.clientX;
    offsetY = event.clientY;
}

function handleDrag(event: any) {
    if (event.clientX === 0 && event.clientY === 0) {
        return;
    }
    event.preventDefault();
    let element: HTMLElement = event.target;
    let updatedLeft = left - (offsetX - event.clientX);
    let updatedTop = top - (offsetY - event.clientY);
    element.style.left = `calc(50% - 25vh ${updatedLeft >= 0 ? '+' : '-'} ${Math.abs(updatedLeft)}px)`;
    element.style.top = `calc(50% - 12.5vh ${updatedTop >= 0 ? '+' : '-'} ${Math.abs(updatedTop)}px)`;
    left = updatedLeft;
    top = updatedTop;
    offsetX = event.clientX;
    offsetY = event.clientY;
}

function closeWelcomeMessage(minimizeSfx: () => void, mute: boolean) {
    let modal: any = document.querySelector('#welcomeModal')!;
    modal.classList.add(styles.closeWelcomeMessage);
    let wrapper: any = document.querySelector(`.${styles.welcomeMessageWrapper}`);
    wrapper.classList.add(styles.closed);
    modal.style.animation = 'none';
    modal.children[0].style.animation = 'none';
    window.setTimeout(() => {
        if (!mute) {
            minimizeSfx();
        }
        modal.style.animation = '';
        modal.children[0].style.animation = '';
    }, 1);
}
