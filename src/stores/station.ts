import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { StoreApi, UseBoundStore, create as createStore } from 'zustand';

import { leftPad } from "@/utils/utils";
import { Ship, Pad, Permit } from '@/data/types';
import { ShipModels } from '@/data/ships';
import { Notification, type NotificationsStore } from './notifications';

function createPads(): Pad[] {
    type PadCount = {
        size: 'small'|'medium'|'large';
        amount: number;
    }
    let padCounts: Array<PadCount> = [{size: 'small', amount: 4}, {size: 'medium', amount: 8}, {size: 'large', amount: 6}];
    const createdPads: Pad[] = [];
    for (let padCount of padCounts) {
        for (let i = 0; i < padCount.amount; i++) {
            createdPads.push(new Pad({number: leftPad(createdPads.length + 1), size: padCount.size}));
        }
    }
    return createdPads;
}

function createCallsign(): string {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let rand = () => alphabet[Math.round(Math.random() * (alphabet.length - 1))];
    return [rand(), rand(), rand()].join('');
}

function createShips(createdPads: Pad[]): Ship[] {
    const ships: Ship[] = [];
    for (let i = 1; i < createdPads.length; i++) {
        if (Math.random() < 0.33) {
            continue;
        }
        let status = Math.random();
        const ship = new Ship({
            captain: uniqueNamesGenerator({ dictionaries: [names] }) + ' ' + uniqueNamesGenerator({ dictionaries: [names] }),
            craft: ShipModels[Math.round(Math.random() * (ShipModels.length - 1))],
            callsign: createCallsign(),
            status: status < 0.1 ? 'Anomalous' : status >= 0.1 && status < 0.2 ? 'Wanted' : 'Idle'
        });
        const remainingPads = createdPads.filter(pad => !pad.permit);
        ship.permit = new Permit({
            ship,
            pad: remainingPads[Math.round(Math.random() * (remainingPads.length - 1))],
            start: new Date().getTime(),
            end: new Date().getTime() + 60 * 60 * 60 * 1000
        });
        ship.permit.pad.permit = ship.permit;
        ships.push(ship);
    }
    return ships;
}

export type StationStore = {
    ships: Ship[],
    pads: Pad[],
    startShipDepartures: (pubilsh: NotificationsStore['publish']) => boolean
};
const pads = createPads();
const ships = createShips(pads);
let set: any;
let state: StationStore = {
    pads,
    ships,
    startShipDepartures
};
export const useStationStore: UseBoundStore<StoreApi<StationStore>> = createStore(s => {
    set = s;
    return state;
});

let hasStartedDepartures = false;
function startShipDepartures(publish: NotificationsStore['publish']): boolean {
    if (hasStartedDepartures) {
        return false;
    }
    hasStartedDepartures = true;
    window.setTimeout(() => {
        window.setInterval(() => {
            if (Math.random() < 0.95) {
                console.log('skip');
                return;
            }
            const filledPads = state.pads.filter(pad => pad.permit);
            if (filledPads.length === 0) {
                return;
            }
            const departingPad = filledPads[Math.round(Math.random() * (filledPads.length - 1))];
            const permit = departingPad.permit!;
            const name = `${permit.ship.captain} (${permit.ship.craft.manufacturer!.name} ${permit.ship.callsign})`;
            publish(new Notification({body: `${name} is departing pad ${departingPad.number}`}));
            window.setTimeout(() => {
                publish(new Notification({body: `${name} has departed pad ${departingPad.number}`}));
                delete departingPad.permit!.ship.permit;
                delete departingPad.permit;
                set({pads: [...pads]});
            }, Math.random() * 30000);
        }, 10000);
    }, 5000);
    return true;
}
