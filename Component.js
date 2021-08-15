import { useState, useEffect, useMemo } from "./XReact.js";

export default function Component({ propCount, btn }) {
    const [ count, setCount ] = useState(0);

    const propCountDoubled = useMemo(() => {
        console.info('Hello UseMemo')
        return propCount * 2;
    }, [ propCount ]);

    useEffect(() => {
        console.info('Hello UseEffect')
        const handler = () => setCount(currCount => currCount + 1);
        btn.addEventListener("click", handler);

        return () => btn.removeEventListener("click", handler);
    }, [ btn ])

    return `
        State: ${count}
        Prop: ${propCount}
        PropDoubled = ${propCountDoubled}
    `
}