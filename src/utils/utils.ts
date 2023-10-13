export function leftPad(num: number, count = 2) {
    let str: string = '' + num;
    while (str.length < count) {
        str = '0' + num;
    }
    return str;
}