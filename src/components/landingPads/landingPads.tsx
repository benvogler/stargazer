import Icon from "@/components/icon/icon";
import { useEffect, useState } from "react";
import { StationStore, useStationStore } from '@/stores/station';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useStore } from "@/utils/utils";

export default function LandingPads({onDeparture} : {onDeparture: (landingPad: any) => void}) {
    const pads = useStore(useStationStore, (state: StationStore) => state.pads);
    // const [ departureInterval, setDepartureInterval ]: [any, any] = useState(null);
    // useEffect(() => {
    //     reactiveLandingPads = landingPads;
    //     if (!departureInterval && !locked) {
    //         locked = true;
    //         window.setTimeout(() => {
    //             setDepartureInterval(
    //                 window.setInterval(() => applyRandomDepartures(reactiveLandingPads, setLandingPads, onDeparture), 1000)
    //             );
    //             console.log('created interval');
    //         }, 10000);
    //     }
    // }, [landingPads, departureInterval, onDeparture])
    return (
        <div className="bg-sky-950 bg-opacity-25 max-h-full overflow-y-auto border border-white border-opacity-5 basis-1/2 max-w-md p-4 whitespace-nowrap">
            Landing Pads
            {
                pads?.map(pad => {
                    let classes = [
                        'flex flex-col',
                        pad.permit?.ship.status === 'Anomalous' ? 'text-yellow-300' : null,
                        pad.permit?.ship.status === 'Wanted' ? 'text-red-300' : null
                    ].filter(_ => _).join(' ');
                    return (
                        <div className={classes} key={pad.id}>
                            <div className="flex h-12 items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span>
                                        {pad.number}
                                    </span>
                                    <span>
                                        [{pad.size.substring(0, 1)}]
                                    </span>
                                    {pad.permit?.ship ?
                                        <>
                                            <Icon name={pad.permit.ship.craft.iconName} className="h-12 w-12"></Icon>
                                            {pad.permit.ship.captain}
                                        </>
                                        : <span className="pl-2">
                                            &lt; Vacant &gt;
                                        </span>
                                    }
                                </div>
                                <div>
                                    <span className="w-8">
                                        {pad.permit?.ship.status === 'Anomalous' ?
                                            <ExclamationTriangleIcon className="h-8 w-8"></ExclamationTriangleIcon>
                                            : <></>}
                                        {pad.permit?.ship.status === 'Wanted' ?
                                            <ExclamationCircleIcon className="h-8 w-8"></ExclamationCircleIcon>
                                            : <></>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    )
}

// function applyRandomDepartures(landingPads: any[], setLandingPads: (landingPads: any[]) => void, onDeparture: (landingPad: any) => void) {
//     if (Math.random() < 0.95) {
//         return;
//     }
//     const filledPads = landingPads.filter(pad => pad.occupied);
//     if (filledPads.length === 0) {
//         return;
//     }
//     const departingPad = filledPads[Math.round(Math.random() * (filledPads.length - 1))];
//     departingPad.occupied = false;
//     onDeparture && onDeparture(departingPad);
//     console.log(departingPad, 'departed');
//     setLandingPads(JSON.parse(JSON.stringify(landingPads)));
// }