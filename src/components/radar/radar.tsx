import Icon from '@/components/icon/icon';
import styles from './radar.module.css';
import { useEffect, useState } from 'react';

export default function Radar() {
    const [rotation, setRotation] = useState({x: -13, y: 27});
    const [dragging, setDragging] = useState(false);
    const [time, setTime] = useState(new Date());
    const [autoRotateTimeout, setAutoRotateTimeout] = useState(0);
    useEffect(() => {
        if (!dragging && !autoRotateTimeout) {
            setRotation({
                ...rotation,
                y: rotation.y + 1
            });
            setAutoRotateTimeout(window.setTimeout(() => setAutoRotateTimeout(0), 1000));
        }
    }, [dragging, autoRotateTimeout]);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="border-white border-opacity-10 border ml-4 p-4 bg-sky-950 bg-opacity-25 aspect-square h-[70vh] w-[70vh]">
            <span>
                Station Radar
            </span>
            <div className="cursor-grab h-full w-full p-4" onMouseDown={event => handleDragStart(event, rotation, setDragging)} onMouseMove={event => handleDrag(event, setRotation, dragging)} onMouseUp={event => handleDrop(event, setDragging)} onMouseLeave={event => handleDrop(event, setDragging)}>
                <div className={styles.container}>
                    <div id="sphere" className={`${styles.sphere} ${dragging ? '' : 'transition-all ease-linear duration-1000'}`} style={{transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(0deg)`}}>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <span className={styles.station}>
                            <div className="flex flex-col items-center justify-center w-min" style={{transform: `rotateZ(0deg) rotateY(${rotation.y * -1}deg) rotateX(${rotation.x * -1}deg)`}}>
                                Stargazer
                                <Icon className="h-[6vh] w-[6vh]" name="asteroid_station"></Icon>
                            </div>
                        </span>
                        <span className={`${styles.iconContainer} left-[20%] top-[60%] whitespace-nowrap`} style={{transform: 'translateZ(100px)'}}>
                            <div className="flex flex-col items-center justify-center w-min" style={{transform: `rotateZ(0deg) rotateY(${rotation.y * -1}deg) rotateX(${rotation.x * -1}deg)`}}>
                                DeLacy RMJ
                                <Icon className="h-[5vh] w-[5vh]" name="cobra_mkIII"></Icon>
                            </div>
                        </span>
                        <span className={`${styles.iconContainer} left-[70%] top-[20%] whitespace-nowrap`} style={{transform: 'translateZ(-220px)'}}>
                            <div className="flex flex-col items-center justify-center w-min" style={{transform: `rotateZ(0deg) rotateY(${rotation.y * -1}deg) rotateX(${rotation.x * -1}deg)`}}>
                                Zorgon DZR
                                <Icon className="h-[5vh] w-[5vh]" name="fer_de_lance"></Icon>
                            </div>
                        </span>
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