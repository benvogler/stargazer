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

function createShip(createdPads: Pad[]): Ship {
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
    return ship;
}

function createShips(createdPads: Pad[]): Ship[] {
    const ships: Ship[] = [];
    for (let i = 1; i < createdPads.length; i++) {
        if (Math.random() < 0.33) {
            continue;
        }
        let ship = createShip(createdPads);
        ships.push(ship);
    }
    return ships;
}

export type StationStore = {
    ships: Ship[],
    pads: Pad[],
    startShipActivities: (pubilsh: NotificationsStore['publish']) => boolean
};
let pads = createPads();
const ships = createShips(pads);
let set: any;
let state: StationStore = {
    pads,
    ships,
    startShipActivities
};
export const useStationStore: UseBoundStore<StoreApi<StationStore>> = createStore(s => {
    set = s;
    return state;
});

let hasStartedActivities = false;
function startShipActivities(publish: NotificationsStore['publish']): boolean {
    if (hasStartedActivities) {
        return false;
    }
    hasStartedActivities = true;
    window.setTimeout(() => {
        handleShipDeparture(publish);
    }, 3000);
    window.setTimeout(() => {
        handleShipArrival(publish);
    }, 4000);
    return true;
}

let pity = {
    arrival: 0,
    departure: 0
};

function handleShipDeparture(publish: NotificationsStore['publish']): void {
    window.setTimeout(() => handleShipDeparture(publish), 5000 + (Math.random() * 5000));
    if (Math.random() < (0.95 - pity.departure)) {
        pity.departure += 0.025;
        return;
    }
    pity.departure = 0;
    const filledPads = state.pads.filter(pad => pad.permit);
    if (filledPads.length === 0) {
        return;
    }
    const departingPad = filledPads[Math.round(Math.random() * (filledPads.length - 1))];
    const permit = departingPad.permit!;
    permit.ship.status = 'Undocking';
    pads = [...state.pads];
    set({pads});
    const name = `${permit.ship.captain} (${permit.ship.craft.manufacturer!.shortName} ${permit.ship.callsign})`;
    publish(new Notification({body: `${name} is departing pad ${departingPad.number}`}));
    window.setTimeout(() => {
        publish(new Notification({body: `${name} has departed pad ${departingPad.number}`}));
        permit.ship.status = 'Exited System';
        delete departingPad.permit!.ship.permit;
        delete departingPad.permit;
        set({pads: [...pads]});
    }, 10000 + (Math.random() * 20000));
}

function handleShipArrival(publish: NotificationsStore['publish']): void {
    window.setTimeout(() => handleShipArrival(publish), 5000 + (Math.random() * 5000));
    if (Math.random() < (0.95 - pity.arrival)) {
        pity.arrival += 0.025;
        return;
    }
    pity.arrival = 0;
    const emptyPads = state.pads.filter(pad => !pad.permit);
    if (emptyPads.length === 0) {
        return;
    }
    const ship = createShip(state.pads);
    const status = ship.status;
    ship.status = 'Docking';
    pads = [...state.pads];
    set({pads});
    const name = `${ship.captain} (${ship.craft.manufacturer!.shortName} ${ship.callsign})`;
    publish(new Notification({body: `${name} is arriving at pad ${ship.permit!.pad.number}`}));
    window.setTimeout(() => {
        publish(new Notification({body: `${name} has arrived at pad ${ship.permit!.pad.number}`}));
        ship.status = status;
        pads = [...state.pads];
        set({pads});
    }, 10000 + (Math.random() * 30000));
}
