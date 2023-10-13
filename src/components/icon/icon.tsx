import Icons from "./icons";

export default function Icon({ name, className }: { name: string, className?: string }) {
    let DynamicIcon: any = Icons.get(name);
    if (!DynamicIcon) {
        console.error('Invalid Icon:', name);
        return <></>;
    }
    return <DynamicIcon className={className}></DynamicIcon>;
}