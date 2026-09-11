import { useEffect, useRef } from "react";
import { animate, useInView} from "framer-motion";

// داله عداد لقسم stats
export const Counter = ({ from, to }: { from: number; to: number }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true }); 

  useEffect(() => {
    if (isInView) {
      const node = nodeRef.current;
      const controls = animate(from, to, {
        duration: 2, // مدة العداد (ثانيتين)
        ease: "easeOut",
        onUpdate(value) {
          if (node) node.textContent = Math.round(value).toString();
        },
      });
      return () => controls.stop();
    }
  }, [from, to, isInView]);

  return <span ref={nodeRef} />;
};