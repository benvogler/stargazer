import Icon from '@/components/icon/icon';
import styles from './radar.module.css';

export default function Radar() {
    return (
        <div className="border-white border-opacity-10 border ml-4 p-8 bg-sky-950 bg-opacity-25 cursor-grab aspect-square flex-grow h-min"  draggable onDragStart={handleDragStart} onDrag={handleDrag}>
            <div className={styles.container}>
                <div id="sphere" className={styles.sphere} style={{transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'}}>
                    <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                    <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                    <div className={styles.circle + ' border-2 border-sky-400 rounded-full'}></div>
                    <span className={styles.station}>
                        <Icon className="h-[20%] w-[20%]" name="asteroid_station"></Icon>
                    </span>
                    <Icon className="h-[10%] w-[10%] left-[20%] top-[60%] absolute" name="cobra_mkIII"></Icon>
                </div>
            </div>
        </div>
    );
}

let initialRotateX: number = 0;
let initialRotateY: number = 0;
let initialX: number;
let initialY: number;
function handleDragStart(event: any) {
    let preview: any = document.querySelector('#dragPreview');
    if (!preview) {
        preview = document.createElement('div');
        preview.style.backgroundColor = 'rgba(0,0,0,0)';
        preview.style.height = '1px';
        preview.style.width = '1px';
        preview.id = 'dragPreview';
        document.body.appendChild(preview);
    }
    event.dataTransfer.setDragImage(preview, 0, 0);
    let element: any = document.querySelector(`.${styles.sphere}`);
    initialX = event.clientX;
    initialY = event.clientY;
    initialRotateX = parseInt(element.style.transform.match(/rotateX\(([-]?[0-9]*)deg\)/)[1]);
    initialRotateY = parseInt(element.style.transform.match(/rotateY\(([-]?[0-9]*)deg\)/)[1]);
}

let lastX: number;
let lastY: number;

function handleDrag(event: any) {
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
    // document.querySelectorAll(`.${styles.container} svg`).forEach((element: any) => {
    //     element.style.transform = [
    //         `rotateX(${-1 * rotateX}deg)`,
    //         `rotateY(${-1 * rotateY}deg)`,
    //         `rotateZ(0deg)`
    //     ].join(' ');
    // });
}