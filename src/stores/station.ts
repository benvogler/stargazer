import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { StoreApi, UseBoundStore, create as createStore } from 'zustand';

import { leftPad } from "@/utils/utils";
import { Ship, Pad } from '@/data/types';
import { ShipModels } from '@/data/ships';

function createPads(): Pad[] {
    type PadCount = {
        size: 'small'|'medium'|'large';
        amount: number;
    }
    let padCounts: Array<PadCount> = [{size: 'small', amount: 4}, {size: 'medium', amount: 8}, {size: 'large', amount: 6}];
    const pads: Pad[] = [];
    for (let padCount of padCounts) {
        for (let i = 0; i < padCount.amount; i++) {
            pads.push(new Pad({number: leftPad(pads.length + 1), size: padCount.size}));
        }
    }
    return pads;
}

function createCallsign(): string {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let rand = () => alphabet[Math.round(Math.random() * (alphabet.length - 1))];
    return [rand(), rand(), rand()].join('');
}

function createShips(pads: Pad[]): Ship[] {
    const ships: Ship[] = [];
    for (let i = 1; i < pads.length; i++) {
        if (Math.random() < 0.33) {
            continue;
        }
        let status = Math.random();
        const ship = new Ship({
            captain: uniqueNamesGenerator({ dictionaries: [names] }) + ' ' + uniqueNamesGenerator({ dictionaries: [names] }),
            craft: ShipModels[Math.round(Math.random() * (ShipModels.length - 1))],
            callsign: createCallsign(),
            pad: pads[Math.round(Math.random() * (pads.length - 1))],
            status: status < 0.1 ? 'Anomalous' : status >= 0.1 && status < 0.2 ? 'Wanted' : 'Idle'
        });
        ship.pad!.occupant = ship;
        ships.push(ship);
    }
    return ships;
}

export type StationStore = {
    ships: Ship[],
    pads: Pad[]
};
const pads = createPads();
export const useStationStore: UseBoundStore<StoreApi<StationStore>> = createStore(set => ({
    pads,
    ships: createShips(pads),
}));
