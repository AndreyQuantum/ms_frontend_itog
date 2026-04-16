import { useEffect, useRef, useCallback } from 'react';

export function useAutoScroll(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);
  const prevMessageCount = useRef(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const threshold = 100;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < threshold;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const currentCount = el.querySelectorAll('[class*="message"]').length;
    const isNewMessage = currentCount > prevMessageCount.current;
    prevMessageCount.current = currentCount;

    if (isNewMessage || shouldAutoScroll.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: isNewMessage ? 'instant' : 'smooth',
      });
      shouldAutoScroll.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      shouldAutoScroll.current = true;
    }
  }, []);

  return { containerRef, handleScroll, scrollToBottom };
}
