import * as icons from './icons';
const Icons: Map<string, JSX.Element> = new Map();
for (let key in icons) {
    Icons.set((key as any), (icons as any)[key]);
}
export default Icons;
