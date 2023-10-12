import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';

export default function VolumeControl({muted, onToggleMute}: {muted: boolean, onToggleMute: (muted: boolean) => void}) {
    return (
        <div className="flex gap-2 items-center h-min">
            <div className="text-base" id="volumeLabel">Audio Isolation: {muted ? 'Engaged' : 'Disengaged'}</div>
            <div className="cursor-pointer text-sky-800 transition-all hover:scale-110 hover:drop-shadow-sm">
                <SpeakerWaveIcon id="volumeOnIcon" className={'h-6 w-6' + (muted ? ' hidden' : '')} onClick={() => onToggleMute(!muted)}/>
                <SpeakerXMarkIcon id="volumeOffIcon" className={'h-6 w-6' + (!muted ? ' hidden' : '')} onClick={() => onToggleMute(!muted)}/>
            </div>
        </div>
    )
}
