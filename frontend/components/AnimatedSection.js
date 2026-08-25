import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setMotionReady(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal ${motionReady ? "motion-ready" : ""} ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </section>
  );
}
