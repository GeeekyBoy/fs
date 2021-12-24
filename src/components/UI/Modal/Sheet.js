import React, { useEffect, useRef, useState } from "react";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring, config } from '@react-spring/web'
import styles from "./Sheet.module.scss"

const Sheet = ({ content }) => {

    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0)
    useEffect(() => {
       const height = containerRef?.current.getBoundingClientRect().height;
       setContainerHeight(height || 0) 
    }, [containerRef]);

    const [{ y }, api] = useSpring(() => ({ y: 312 }))

    const openSheet = ({ canceled }) => {
        api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
    }
    
    const closeSheet = () => {
        api.start({
            y: 312,
            immediate: false,
            config: { ...config.stiff },
            onResolve: () => {
                console.log('resolved')
            }
        })
    }
  
    const bind = useDrag(
        ({ last, velocity: [, vy], movement: [, my], cancel, canceled }) => {
            if (my < 0) {
                cancel()
            }
            if (last) {
                my > 312 * 0.5 || vy > 0.5 ?
                closeSheet() :
                openSheet({ canceled })
            } else {
                api.start({ y: my, immediate: true })
            }
        },
        {
            from: () => [0, y.get()],
            filterTaps: true,
            bounds: { top: 0 },
            rubberband: true
        }
    )
  
    const overlayBG = y.to((py) => `rgba(0, 0, 0, ${((312 - py) / 312) * 0.5})`)
    const display = y.to((py) => (py < 312 ? null : "none"))
  
    useEffect(() => {
        openSheet({ canceled: null })
    }, [])
    return (
        <animated.div
            className={styles.SheetShell}
            style={{ display, backgroundColor: overlayBG }}
        >
            <animated.div
                className={styles.SheetContainer}
                style={{ display, y }}
                ref={containerRef}
                {...bind()}
            >
                {content}
            </animated.div>
        </animated.div>
    )
}

export default Sheet