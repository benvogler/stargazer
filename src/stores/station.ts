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

function createShip(pads: Pad[]): Ship {
    let status = Math.random();
    const ship = new Ship({
        captain: uniqueNamesGenerator({ dictionaries: [names] }) + ' ' + uniqueNamesGenerator({ dictionaries: [names] }),
        craft: ShipModels[Math.round(Math.random() * (ShipModels.length - 1))],
        callsign: createCallsign(),
        status: status < 0.1 ? 'Anomalous' : status >= 0.1 && status < 0.2 ? 'Wanted' : 'Idle'
    });
    const remainingPads = pads.filter(pad => !pad.permit);
    ship.permit = new Permit({
        ship,
        pad: remainingPads[Math.round(Math.random() * (remainingPads.length - 1))],
        start: new Date().getTime(),
        end: new Date().getTime() + 60 * 60 * 60 * 1000
    });
    ship.permit.pad.permit = ship.permit;
    return ship;
}

function createShips(pads: Pad[]): Ship[] {
    const ships: Ship[] = [];
    for (let i = 1; i < pads.length; i++) {
        if (Math.random() < 0.33) {
            continue;
        }
        let ship = createShip(pads);
        ships.push(ship);
    }
    return ships;
}

export type StationStore = {
    ships: Ship[],
    pads: Pad[],
    startShipActivities: (pubilsh: NotificationsStore['publish']) => boolean
};

class StationStoreState implements StationStore {

    private _pads: Pad[] = createPads();
    public get pads() {
        return this._pads;
    }
    public set pads(value) {
        this._pads = value;
        this.set({pads: this._pads});
    }

    private _ships: Ship[] = createShips(this.pads);
    public get ships() {
        return this._ships;
    }
    public set ships(value) {
        this._ships = value;
        this.set({ships: this._ships});
    }


    public set: (partial: StationStore | Partial<StationStore> | ((state: StationStore) => StationStore | Partial<StationStore>), replace?: boolean | undefined) => void
    public constructor({set}: {set: (partial: StationStore | Partial<StationStore> | ((state: StationStore) => StationStore | Partial<StationStore>), replace?: boolean | undefined) => void}) {
        this.set = set;
    }

    private hasStartedActivities = false;
    private pity = {
        arrival: 0,
        departure: 0
    };

    startShipActivities(publish: NotificationsStore['publish']): boolean {
        if (this.hasStartedActivities) {
            return false;
        }
        this.hasStartedActivities = true;
        window.setTimeout(() => {
            this.handleShipDeparture(publish);
        }, 3000);
        window.setTimeout(() => {
            this.handleShipArrival(publish);
        }, 4000);
        return true;
    }

    handleShipDeparture(publish: NotificationsStore['publish']): void {
        window.setTimeout(() => this.handleShipDeparture(publish), 5000 + (Math.random() * 5000));
        if (Math.random() < (0.95 - this.pity.departure)) {
            this.pity.departure += 0.025;
            return;
        }
        this.pity.departure = 0;
        const filledPads = this.pads.filter(pad => pad.permit);
        if (filledPads.length === 0) {
            return;
        }
        const departingPad = filledPads[Math.round(Math.random() * (filledPads.length - 1))];
        const permit = departingPad.permit!;
        permit.ship.status = 'Undocking';
        this.pads = [...this.pads];
        this.ships = [...this.ships];
        console.log('set ships', this.ships);
        const name = `${permit.ship.captain} (${permit.ship.craft.manufacturer!.shortName} ${permit.ship.callsign})`;
        publish(new Notification({body: `${name} is departing pad ${departingPad.number}`}));
        window.setTimeout(() => {
            publish(new Notification({body: `${name} has departed pad ${departingPad.number}`}));
            permit.ship.status = 'Exited Station';
            delete departingPad.permit!.ship.permit;
            delete departingPad.permit;
            this.pads = [...this.pads];
            this.ships = [...this.ships];
            console.log('set ships', this.ships);
            window.setTimeout(() => {
                permit.ship.status = 'Exited System';
                this.ships = this.ships.filter(s => s.id !== permit.ship.id);
                console.log('set ships', this.ships);
                publish(new Notification({body: `${name} has exited the system.`}));
            }, 10000 + (Math.random() * 20000));
        }, 10000 + (Math.random() * 20000));
    }

    handleShipArrival(publish: NotificationsStore['publish']): void {
        window.setTimeout(() => this.handleShipArrival(publish), 5000 + (Math.random() * 5000));
        if (Math.random() < (0.95 - this.pity.arrival)) {
            this.pity.arrival += 0.025;
            return;
        }
        this.pity.arrival = 0;
        const emptyPads = this.pads.filter(pad => !pad.permit);
        if (emptyPads.length === 0) {
            return;
        }
        const ship = createShip(this.pads);
        const status = ship.status;
        ship.status = 'Docking';
        this.pads = [...this.pads];
        this.ships = [...this.ships, ship];
        console.log('set ships (arrival)', this.ships);
        const name = `${ship.captain} (${ship.craft.manufacturer!.shortName} ${ship.callsign})`;
        publish(new Notification({body: `${name} is arriving at pad ${ship.permit!.pad.number}`}));
        window.setTimeout(() => {
            publish(new Notification({body: `${name} has arrived at pad ${ship.permit!.pad.number}`}));
            ship.status = status;
            this.pads = [...this.pads];
            this.ships = [...this.ships];
            console.log('set ships (arrival)', this.ships);
        }, 10000 + (Math.random() * 30000));
    }
}
export const useStationStore: UseBoundStore<StoreApi<StationStore>> = createStore(set => {
    const store = new StationStoreState({set});
    return {
        get ships() {
            return store.ships
        },
        get pads() {
            return store.pads
        },
        startShipActivities: (publish) => store.startShipActivities.bind(store)(publish)
    };
});
