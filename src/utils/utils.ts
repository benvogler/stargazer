import { useEffect, useState } from 'react'

export const useStore = <T, F>(
    store: (callback: (state: T) => unknown) => unknown,
    callback: (state: T) => F,
) => {
    const result = store(callback) as F;
    const [data, setData] = useState<F>();

    useEffect(() => {
        setData(result);
    }, [result]);

    return data;
}

export function leftPad(num: number, count = 2) {
    let str: string = '' + num;
    while (str.length < count) {
        str = '0' + num;
    }
    return str;
}