'use client';
const useSound = require('use-sound').default;
import { SettingsStore, useSettingsStore } from '@/stores/settings';

import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { Sounds, createSounds } from '@/utils/audio';

export default function VolumeControl() {
    const { mute, toggleMute } = useSettingsStore((state: SettingsStore) => ({mute: state.mute, toggleMute: state.toggleMute}));
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
    return (
        <div className="flex gap-2 items-center h-min">
            <audio id="music" src="/sounds/floating.mp3" loop></audio>
            <div className="text-base" id="volumeLabel">Audio Isolation: {mute ? 'Engaged' : 'Disengaged'}</div>
            <div className="cursor-pointer text-sky-800 hover:text-sky-500 transition-all hover:scale-110 hover:drop-shadow-sm">
                <SpeakerWaveIcon id="volumeOnIcon" className={'h-6 w-6' + (mute ? ' hidden' : '')} onClick={doToggleMute}/>
                <SpeakerXMarkIcon id="volumeOffIcon" className={'h-6 w-6' + (!mute ? ' hidden' : '')} onClick={doToggleMute}/>
            </div>
        </div>
    )
}
