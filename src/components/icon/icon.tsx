import { CSSProperties } from "react";
import Icons from "./icons";

export default function Icon({ name, className, style }: { name: string, className?: string, style?: CSSProperties }) {
    let DynamicIcon: any = Icons.get(name);
    if (!DynamicIcon) {
        console.error('Invalid Icon:', name);
        return <></>;
    }
    return <DynamicIcon className={className} style={style}></DynamicIcon>;
}