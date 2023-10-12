export const Sounds = {
    music: '/sounds/floating.mp3',
    mute: '/sounds/PremiumBeat_SFX/PremiumBeat_0013_cursor_selection_16.wav',
    unmute: '/sounds/PremiumBeat_SFX/PremiumBeat_0013_cursor_selection_11.wav',
    muffle: '/sounds/PremiumBeat_SFX/PremiumBeat_0013_move_cursor_13.wav',
    unmuffle: '/sounds/PremiumBeat_SFX/PremiumBeat_0013_move_cursor_13_reversed.wav',
    minimize: '/sounds/PremiumBeat_SFX/PremiumBeat_0013_move_cursor_25.wav'
};

export function createSounds(useSound: (sound: string) => [(() => void)], sounds: string[]) {
    return sounds.map(sound => useSound(sound)[0]);
}