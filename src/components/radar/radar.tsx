import Icon from '@/components/icon/icon';
import styles from './radar.module.css';
import { useEffect, useState } from 'react';
import { useStore } from '@/utils/utils';
import { StationStore, useStationStore } from '@/stores/station';

export default function Radar() {
    const [rotation, setRotation] = useState({x: -33, y: 27});
    const [dragging, setDragging] = useState(false);
    const [time, setTime] = useState(new Date());
    const [autoRotateTimeout, setAutoRotateTimeout] = useState(0);
    const [positions, setPositions]: [any, any] = useState({});
    const ships = useStore(useStationStore, (state: StationStore) => state.ships);
    useEffect(() => {
        if (!dragging && !autoRotateTimeout) {
            setRotation({
                ...rotation,
                y: rotation.y + 1
            });
            setAutoRotateTimeout(window.setTimeout(() => setAutoRotateTimeout(0), 1000));
        }
    }, [dragging, autoRotateTimeout, rotation]);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const filteredShips = ships?.filter(ship => ['Entering Station', 'Exited Station'].includes(ship.status));
    return (
        <div className="border-white border-opacity-10 border ml-4 p-4 bg-sky-950 bg-opacity-25 aspect-square h-[70vh] w-[70vh]">
            <p>
                Station Radar
            </p>
            <p className="h-0">
                {filteredShips?.length || 'No'} Contact{filteredShips?.length === 1 ? '' : 's'}
            </p>
            <div className="cursor-grab h-full w-full p-4 overflow-hidden" onMouseDown={event => handleDragStart(event, rotation, setDragging)} onMouseMove={event => handleDrag(event, setRotation, dragging)} onMouseUp={event => handleDrop(event, setDragging)} onMouseLeave={event => handleDrop(event, setDragging)}>
                <div className={styles.container}>
                    <div id="sphere" className={`${styles.sphere} ${dragging ? '' : 'transition-all ease-linear duration-1000'}`} style={{transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(0deg)`}}>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <span className={styles.station}>
                            <div className={`${dragging ? '' : 'transition-all ease-linear duration-1000'} flex flex-col items-center justify-center w-min`} style={{transform: `rotateZ(0deg) rotateY(${rotation.y * -1}deg) rotateX(${rotation.x * -1}deg)`}}>
                                Stargazer
                                <Icon className="h-[6vh] w-[6vh]" name="asteroid_station"></Icon>
                            </div>
                        </span>
                        {
                            filteredShips?.map(ship => {
                                if (!positions[ship.id]) {
                                    const getRandomValue = (min: number, max: number) => (min + (Math.random() * (max - min))) * (Math.random() >= 0.5 ? -1 : 1);
                                    const getRandomCoord = (random: number, winners: number[], min1: number, min2: number, max1: number, max2: number) => (
                                        getRandomValue(
                                            winners.includes(random) ? min2 : min1,
                                            winners.includes(random) ? max2 : max1
                                        )
                                    );
                                    const getRandomPosition = (min1: number, min2: number, max1: number, max2: number) => {
                                        let random = Math.floor(Math.random() * 4);
                                        return {
                                            x: getRandomCoord(random, [0, 1], min1, min2, max1, max2),
                                            y: getRandomCoord(random, [0, 2], min1, min2, max1, max2),
                                            z: getRandomCoord(random, [0, 3], min1, min2, max1, max2) * 3
                                        }
                                    };
                                    let far = getRandomPosition(0, 50, 20, 70);
                                    let near = getRandomPosition(0, 2, 2, 4);
                                    positions[ship.id] = {
                                        from: ship.status === 'Exited Station' ? near : far,
                                        to: ship.status === 'Exited Station' ? far : near,
                                        ease: ship.status === 'Exited Station' ? 'ease-in' : 'ease-in-out',
                                        duration: ship.statusDuration,
                                        hasRendered: false,
                                        isAnimating: false,
                                        isStartingAnimation: false
                                    };
                                    setPositions(positions);
                                }
                                let { from, to, ease, duration, hasRendered, isAnimating, isStartingAnimation } = positions[ship.id];
                                let pos = from;
                                if (hasRendered && !isStartingAnimation) {
                                    window.setTimeout(() => {
                                        positions[ship.id].isAnimating = true;
                                        setPositions(positions);
                                    }, 1000);
                                    positions[ship.id].isStartingAnimation = true;
                                    setPositions(positions);
                                }
                                if (isAnimating) {
                                    pos = to;
                                }
                                if (!hasRendered) {
                                    positions[ship.id].hasRendered = true;
                                    setPositions(positions);
                                }
                                let getPos = (val: number) => `calc(calc(50% - 3rem) + ${val}%)`;
                                let style = {
                                    top: `${getPos(pos.x)}`,
                                    left: `${getPos(pos.y)}`,
                                    transform: `translateZ(${pos.z}px)`,
                                    transition: `all ${duration}ms ${ease}`
                                };
                                return (
                                    <span key={ship.id} className={`${styles.iconContainer} whitespace-nowrap`} style={style}>
                                        <div className="flex flex-col items-center justify-center w-min" style={{transform: `rotateZ(0deg) rotateY(${rotation.y * -1}deg) rotateX(${rotation.x * -1}deg)`}}>
                                            {`${ship.craft.manufacturer?.shortName} ${ship.callsign}`}
                                            <Icon className="h-[5vh] w-[5vh]" name={ship.craft.iconName}></Icon>
                                        </div>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

let initialRotateX: number = 0;
let initialRotateY: number = 0;
let initialX: number;
let initialY: number;
function handleDragStart(event: any, rotation: any, setDragging: any) {
    setDragging(true);
    initialX = event.clientX;
    initialY = event.clientY;
    lastX = initialX;
    lastY = initialY;
    initialRotateX = rotation.x;
    initialRotateY = rotation.y;
}

let lastX: number;
let lastY: number;

function handleDrag(event: any, setRotation: any, dragging: boolean) {
    if (!dragging) {
        return;
    }
    if (event.clientX === 0 || event.clientY === 0 || (!isNaN(lastX) && Math.abs(lastX - event.clientX) > 100) || (!isNaN(lastY) && Math.abs(lastY - event.clientY) > 100)) {
        return;
    }
    lastX = event.clientX;
    lastY = event.clientY;
    let rotateX = Math.round(initialRotateX + ((initialY - event.clientY) / 2));
    rotateX = rotateX % 360 * (Math.floor(rotateX / 360) % 2 === 0 ? -1 : 1) * (rotateX < 0 ? 1 : -1);
    let rotateY = Math.round(initialRotateY + ((event.clientX - initialX) / 2));
    rotateY = rotateY % 360 * (Math.floor(rotateY / 360) % 2 === 0 ? -1 : 1) * (rotateY < 0 ? 1 : -1);
    setRotation({x: rotateX, y: rotateY});
    event.preventDefault();
    return false;
}

function handleDrop(event: any, setDragging: any) {
    setDragging(false);
    event.preventDefault();
    return false;
}