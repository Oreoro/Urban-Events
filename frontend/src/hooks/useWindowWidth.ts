import {useEffect, useState} from "react";
import debounce from "lodash/debounce";

export const useWindowWidth = () => {
    const initialWidth = typeof window !== 'undefined' ? window?.innerWidth : 0;
    const [width, setWidth] = useState(initialWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window?.innerWidth);
        };

        const debouncedHandleResize = debounce(handleResize, 100);
        window?.addEventListener('resize', debouncedHandleResize);

        return () => {
            window?.removeEventListener('resize', debouncedHandleResize);
            debouncedHandleResize.cancel();
        };
    }, []);

    return width;
}
