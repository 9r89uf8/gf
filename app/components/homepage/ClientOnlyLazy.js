// app/components/homepage/ClientOnlyLazy.jsx
'use client';
import { useEffect, useRef, useState } from 'react';

export default function ClientOnlyLazy({ children, minHeight = 420 }) {
    const [show, setShow] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reveal = () => (window.requestIdleCallback?.(() => setShow(true))) ?? setShow(true);
        const io = new IntersectionObserver(
            ([e]) => e.isIntersecting && (reveal(), io.disconnect()),
            { rootMargin: '200px' }
        );
        io.observe(el);

        return () => io.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ contentVisibility: 'auto', containIntrinsicSize: `${minHeight}px`, minHeight }}>
            {show ? children : null}
        </div>
    );
}
