import { useRef, useState, useCallback, Component } from 'react';
import CryptoJS from 'crypto-js';

interface MoveOptions {
  duration?: number;
  onArrival?: null | 'hide' | 'delete';
};

export const generateMD5 = (index: string): string => {
  return CryptoJS.MD5(`${index}::${Date.now()}${Math.random()}`).toString();
};

export const useElementCanMove = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [elementId] = useState(generateMD5('useElementCanMove'));

  const setMoveToTarget = useCallback((targetId: string, options: MoveOptions = {}) => {
    const targetElement = document.getElementById(targetId);
    const element = elementRef.current;

    if (targetElement && element) {
      const { duration = 500, onArrival = null } = options;

      const startX = element.getBoundingClientRect().left + window.pageXOffset;
      const startY = element.getBoundingClientRect().top + window.pageYOffset;

      const endX = targetElement.getBoundingClientRect().left + window.pageXOffset + (targetElement.offsetWidth / 2) - (element.offsetWidth / 2);
      const endY = targetElement.getBoundingClientRect().top + window.pageYOffset + (targetElement.offsetHeight / 2) - (element.offsetHeight / 2);

      const distanceX = endX - startX;
      const distanceY = endY - startY;
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const runX = easeInOutQuad(timeElapsed, startX, distanceX, duration);
        const runY = easeInOutQuad(timeElapsed, startY, distanceY, duration);
        element.style.transform = `translate(${runX - startX}px, ${runY - startY}px)`;
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          element.style.transform = `translate(${distanceX}px, ${distanceY}px)`;
          if (onArrival === 'hide') {
            setIsVisible(false);
          } else if (onArrival === 'delete') {
            document.getElementById(elementId)?.remove();
          }
        }
      };

      const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animateScroll);
    }
  }, []);

  const Element = useCallback(({ children }: { children: JSX.Element }) => (
    <div id={elementId} ref={elementRef} style={{ display: isVisible ? 'block' : 'none', position: 'absolute' }}>
      {children}
    </div>
  ), [isVisible]);

  return [setMoveToTarget, Element] as const;
};