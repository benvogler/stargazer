import { ShipModel, ShipModelDetails, Manufacturer, ManufacturerDetails } from '../types';
import manufacturers from './manufacturers.json';
import ships from './ships.json';

const Manufacturers: Array<Manufacturer> = manufacturers.map(m => new Manufacturer({...m}));
const ShipModels: Array<ShipModel> = ships.map(s => {
    const ship: ShipModel = new ShipModel({...s});
    ship.manufacturer = Manufacturers.find(m => m.name === ship.manufacturerName);
    return ship;
});

export { Manufacturers, ShipModels };
export type { ShipModel as Ship, ShipModelDetails as ShipDetails, Manufacturer, ManufacturerDetails };
