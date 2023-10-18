import Icon from '@/components/icon/icon';
import styles from './radar.module.css';

export default function Radar() {
    return (
        <div className="border-white border-opacity-10 border ml-4 p-4 bg-sky-950 bg-opacity-25 aspect-square h-[70vh] w-[70vh]">
            <span>
                Station Radar
            </span>
            <div className="cursor-grab h-full w-full p-4" onMouseDown={handleDragStart} onMouseMove={handleDrag} onMouseUp={handleDrop} onMouseLeave={handleDrop}>
                <div className={styles.container}>
                    <div id="sphere" className={styles.sphere} style={{transform: 'rotateX(-13deg) rotateY(27deg) rotateZ(0deg)'}}>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                        <span className={styles.station}>
                            <div className="flex flex-col items-center justify-center w-min" style={{transform: 'rotateZ(0deg) rotateY(-27deg) rotateX(13deg)'}}>
                                Stargazer
                                <Icon className="h-[6vh] w-[6vh]" name="asteroid_station"></Icon>
                            </div>
                        </span>
                        <span className={`${styles.iconContainer} left-[20%] top-[60%] whitespace-nowrap`} style={{transform: 'translateZ(100px)'}}>
                            <div className="flex flex-col items-center justify-center w-min" style={{transform: 'rotateZ(0deg) rotateY(-27deg) rotateX(13deg)'}}>
                                DeLacy RMJ
                                <Icon className="h-[5vh] w-[5vh]" name="cobra_mkIII"></Icon>
                            </div>
                        </span>
                        <span className={`${styles.iconContainer} left-[70%] top-[20%] whitespace-nowrap`} style={{transform: 'translateZ(-220px)'}}>
                            <div className="flex flex-col items-center justify-center w-min" style={{transform: 'rotateZ(0deg) rotateY(-27deg) rotateX(13deg)'}}>
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
let dragging = false;
function handleDragStart(event: any) {
    dragging = true;
    let element: any = document.querySelector(`.${styles.sphere}`);
    initialX = event.clientX;
    initialY = event.clientY;
    lastX = initialX;
    lastY = initialY;
    initialRotateX = parseInt(element.style.transform.match(/rotateX\(([-]?[0-9]*)deg\)/)[1]);
    initialRotateY = parseInt(element.style.transform.match(/rotateY\(([-]?[0-9]*)deg\)/)[1]);
}

let lastX: number;
let lastY: number;

function handleDrag(event: any) {
    if (!dragging) {
        return;
    }
    if (event.clientX === 0 || event.clientY === 0 || (!isNaN(lastX) && Math.abs(lastX - event.clientX) > 100) || (!isNaN(lastY) && Math.abs(lastY - event.clientY) > 100)) {
        return;
    }
    lastX = event.clientX;
    lastY = event.clientY;
    let element: any = document.querySelector(`.${styles.sphere}`);
    let rotateX = Math.round(initialRotateX + ((initialY - event.clientY) / 2));
    rotateX = rotateX % 360 * (Math.floor(rotateX / 360) % 2 === 0 ? -1 : 1) * (rotateX < 0 ? 1 : -1);
    let rotateY = Math.round(initialRotateY + ((event.clientX - initialX) / 2));
    rotateY = rotateY % 360 * (Math.floor(rotateY / 360) % 2 === 0 ? -1 : 1) * (rotateY < 0 ? 1 : -1);
    element.style.transform = [
        `rotateX(${rotateX}deg)`,
        `rotateY(${rotateY}deg)`,
        `rotateZ(0deg)`
    ].join(' ');
    document.querySelectorAll(`.${styles.iconContainer} > div, .${styles.station} > div`).forEach((element: any) => {
        element.style.transform = element.style.transform.replace(/rotateY\([-]?[0-9]*deg\)/, `rotateY(${-1 * rotateY}deg)`);
        element.style.transform = element.style.transform.replace(/rotateX\([-]?[0-9]*deg\)/, `rotateX(${-1 * rotateX}deg)`);
    });
    event.preventDefault();
    return false;
}

function handleDrop(event: any) {
    dragging = false;
    event.preventDefault();
    return false;
}