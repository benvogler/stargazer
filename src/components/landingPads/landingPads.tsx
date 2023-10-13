import { leftPad } from "@/utils/utils";
import Logo from "../logo/logo";
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { useEffect, useState } from "react";


const initialLandingPads: any[] = [];
const ships = ['eagle', 'sidewinder', 'beluga', 'imperial_eagle', 'python'];
for (let i = 1; i < 79; i++) {
    initialLandingPads.push({
        number: leftPad(i),
        occupied: Math.random() > 0.33,
        ship: ships[Math.round(Math.random() * (ships.length - 1))],
        name: uniqueNamesGenerator({ dictionaries: [names] }) + ' ' + uniqueNamesGenerator({ dictionaries: [names] })
    });
}

let reactiveLandingPads: any;

let locked = false;

export default function LandingPads({onDeparture} : {onDeparture: (landingPad: any) => void}) {
    const [ landingPads, setLandingPads ] = useState(initialLandingPads);
    const [ departureInterval, setDepartureInterval ]: [any, any] = useState(null);
    useEffect(() => {
        reactiveLandingPads = landingPads;
        if (!departureInterval && !locked) {
            locked = true;
            window.setTimeout(() => {
                setDepartureInterval(
                    window.setInterval(() => applyRandomDepartures(reactiveLandingPads, setLandingPads, onDeparture), 1000)
                );
                console.log('created interval');
            }, 10000);
        }
    }, [landingPads, departureInterval, onDeparture])
    return (
        <div className="bg-sky-950 bg-opacity-25 max-h-full overflow-y-hidden hover:overflow-y-auto border border-white border-opacity-5 w-96 p-4 whitespace-nowrap">
            Landing Pads
            {
                landingPads.map(landingPad => {
                    return (
                        <div className="flex h-12 items-center gap-1" key={landingPad.number}>
                            {landingPad.number}
                            {landingPad.occupied ?
                                <>
                                    <Logo type={landingPad.ship} className="h-12 w-12"></Logo>
                                    {landingPad.name}
                                </>
                                : <span className="pl-2">
                                    &lt; Vacant &gt;
                                </span>
                            }
                        </div>
                    );
                })
            }
        </div>
    )
}

function applyRandomDepartures(landingPads: any[], setLandingPads: (landingPads: any[]) => void, onDeparture: (landingPad: any) => void) {
    if (Math.random() < 0.95) {
        return;
    }
    const filledPads = landingPads.filter(pad => pad.occupied);
    if (filledPads.length === 0) {
        return;
    }
    const departingPad = filledPads[Math.round(Math.random() * (filledPads.length - 1))];
    departingPad.occupied = false;
    onDeparture && onDeparture(departingPad);
    console.log(departingPad, 'departed');
    setLandingPads(JSON.parse(JSON.stringify(landingPads)));
}