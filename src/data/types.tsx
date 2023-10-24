import Icon from '@/components/icon/icon';

class Model {
    constructor() {
        this._id = Model.latestId++;
    }
    private static latestId: number = 0;
    private _id: number;
    public get id() {
        return this._id;
    }
}

export class Manufacturer extends Model {
    public name: string;
    public shortName: string;
    public iconName: string;
    public description: string;
    public details: ManufacturerDetails;
    public constructor({name, iconName, description, details, shortName}: {name: string, iconName: string, description: string, details: ManufacturerDetails, shortName?: string}) {
        super();
        this.name = name;
        this.shortName = shortName || name;
        this.iconName = iconName;
        this.description = description;
        this.details = details;
    }

    public get icon(): JSX.Element {
        return (
            <Icon name={this.iconName}></Icon>
        );
    }
};

export class ManufacturerDetails {
    public sector: string;
    public headquarters: string;
    public areaServed: string;
    public products: string;
    public founded: number;
    public constructor({sector, headquarters, areaServed, products, founded}: {sector: string, headquarters: string, areaServed: string, products: string, founded: number}) {
        this.sector = sector;
        this.headquarters = headquarters;
        this.areaServed = areaServed;
        this.products = products;
        this.founded = founded;
    }
}

export class ShipModel extends Model {
    public name: string;
    public iconName: string;
    public description: string;
    public manufacturerName: string;
    public manufacturer?: Manufacturer;
    public details: ShipModelDetails;
    public constructor({name, iconName, description, manufacturerName, details}: {name: string, iconName: string, description: string, manufacturerName: string, details: ShipModelDetails}) {
        super();
        this.name = name;
        this.iconName = iconName;
        this.description = description;
        this.manufacturerName = manufacturerName;
        this.details = details;
    }

    public get icon(): JSX.Element {
        return (
            <Icon name={this.iconName}></Icon>
        );
    }
};

export class ShipModelDetails {
    public years_produced: string;
    public type: string;
    public landing_pad_size: string;
    public dimensions: string;
    public pilot_seats: number;
    public hull_mass: number;
    public shields: number;
    public heat_capacity: number;
    public fuel_capacity: number;
    public constructor({years_produced, type, landing_pad_size, dimensions, pilot_seats, hull_mass, shields, heat_capacity, fuel_capacity}: {years_produced: string, type: string, landing_pad_size: string, dimensions: string, pilot_seats: number, hull_mass: number, shields: number, heat_capacity: number, fuel_capacity: number}) {
        this.years_produced = years_produced;
        this.type = type;
        this.landing_pad_size = landing_pad_size;
        this.dimensions = dimensions;
        this.pilot_seats = pilot_seats;
        this.hull_mass = hull_mass;
        this.shields = shields;
        this.heat_capacity = heat_capacity;
        this.fuel_capacity = fuel_capacity;
    }
};

export class Pad extends Model {
    public number: string;
    public size: 'small' | 'medium' | 'large';
    public permit?: Permit;
    public constructor({number, size, permit}: {number: string, size: 'small' | 'medium' | 'large', permit?: Permit}) {
        super();
        this.number = number;
        this.size = size;
        this.permit = permit;
    }
};

export class Permit extends Model {
    public ship: Ship;
    public pad: Pad;
    public start: EpochTimeStamp;
    public end: EpochTimeStamp;
    public constructor({ship, pad, start, end}: {ship: Ship, pad: Pad, start: EpochTimeStamp, end: EpochTimeStamp}) {
        super();
        this.ship = ship;
        this.pad = pad;
        this.start = start;
        this.end = end;
    }
};

export class Ship extends Model {
    public captain: string;
    public craft: ShipModel;
    public callsign: string;
    public status: 'Entering Station' | 'Docking' | 'Idle' | 'Undocking' | 'Exited Station' | 'Exited System' | 'Anomalous' | 'Wanted';
    public permit?: Permit;
    public statusDuration?: number;
    public constructor({captain, craft, callsign, status, permit}: {captain: string, craft: ShipModel, callsign: string, status: any, permit?: Permit}) {
        super();
        this.captain = captain;
        this.craft = craft;
        this.callsign = callsign;
        this.status = status;
        this.permit = permit;
    }
}
