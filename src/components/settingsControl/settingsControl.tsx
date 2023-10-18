'use client';
const useSound = require('use-sound').default;
import { SettingsStore, useSettingsStore } from '@/stores/settings';

import { EyeIcon, EyeSlashIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { Sounds, createSounds } from '@/utils/audio';

export default function VolumeControl() {
    const { mute, toggleMute, privacy, togglePrivacy } = useSettingsStore((state: SettingsStore) => state);
    const [ muteSfx, unmuteSfx, muffleSfx, unmuffleSfx ] = createSounds(
        useSound,
        [ Sounds.mute, Sounds.unmute, Sounds.muffle, Sounds.unmuffle ]
    );
    function doToggleMute() {
        toggleMute();
        let music: HTMLAudioElement = document.querySelector('#music')!;
        if (mute) {
            unmuffleSfx();
            unmuteSfx();
            music.play();
            music.volume = 0.5;
        } else {
            muffleSfx();
            muteSfx();
            music.pause();
        }
    }
    function doTogglePrivacy() {
        togglePrivacy();
        if (mute) {
            return;
        }
        if (privacy) {
            muffleSfx();
            muteSfx();
        } else {
            unmuffleSfx();
            unmuteSfx();
        }
    }
    return (
        <div className="flex flex-col w-max">
            <div className="flex gap-2 items-center justify-between h-min w-full">
                <audio id="music" src="/sounds/floating.mp3" loop></audio>
                <div className="text-base">Audio Isolation: {mute ? 'Engaged' : 'Disengaged'}</div>
                <div className="cursor-pointer text-sky-800 hover:text-sky-500 transition-all hover:scale-110 hover:drop-shadow-sm">
                    <SpeakerWaveIcon className={`h-6 w-6 ${mute ? ' hidden' : ''}`} onClick={doToggleMute}/>
                    <SpeakerXMarkIcon className={`h-6 w-6 ${!mute ? ' hidden' : ''}`} onClick={doToggleMute}/>
                </div>
            </div>
            <div className="flex gap-2 items-center justify-between h-min w-full">
                <div className="text-base">Opaque Terminal: {privacy ? 'Engaged' : 'Disengaged'}</div>
                <div className="cursor-pointer text-sky-800 hover:text-sky-500 transition-all hover:scale-110 hover:drop-shadow-sm">
                    <EyeIcon className={`h-6 w-6 ${privacy ? ' hidden' : ''}`} onClick={doTogglePrivacy}/>
                    <EyeSlashIcon className={`h-6 w-6 ${!privacy ? ' hidden' : ''}`} onClick={doTogglePrivacy}/>
                </div>
            </div>
        </div>
    )
}
