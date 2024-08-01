import { useRef, useState, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { createRoot } from 'react-dom/client';
import { openDB } from 'idb';
import { idb_name, idb_objects } from '../config';

// Types
interface MoveOptions {
  duration?: number;
  onArrival?: null | 'hide' | 'delete';
}

// Internal Cryptos
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

// External Cryptos
export const generateMD5 = (index: string): string => {
  const md5String = CryptoJS.MD5(`${index}::${Date.now()}${Math.random()}`).toString();

  const formattedString = [
    md5String.substring(0, 4),
    md5String.substring(4, 8),
    md5String.substring(8, 16),
    md5String.substring(16)
  ].join('-');

  return formattedString;
};

// External Hooks
export const useElementCanMove = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [elementId] = useState(generateMD5('useElementCanMove'));
  const [state, setState] = useState<{ is_moving: boolean }>({ is_moving: false });

  const setMoveToTarget = useCallback((targetId: string, options: MoveOptions = {}) => {
    if (state.is_moving === true) return;

    const targetElement = document.getElementById(targetId);
    const element = elementRef.current;

    if (targetElement && element) {
      const { duration = 500, onArrival = null } = options;

      const boundingClientRect = element.getBoundingClientRect();
      const targetBoundingClientRect = targetElement.getBoundingClientRect();

      const startX = boundingClientRect.left + window.pageXOffset;
      const startY = boundingClientRect.top + window.pageYOffset;

      const endX = targetBoundingClientRect.left + window.pageXOffset + (targetElement.offsetWidth / 2) - (element.offsetWidth / 2);
      const endY = targetBoundingClientRect.top + window.pageYOffset + (targetElement.offsetHeight / 2) - (element.offsetHeight / 2);

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
            elementRef.current?.remove();
          }
        }
      };

      requestAnimationFrame(animateScroll);

      setState(prev => ({ ...prev, is_moving: true }));
    }
  }, [state]);

  const Element = useCallback(({ children }: { children: JSX.Element }) => (
    <div id={elementId} ref={elementRef} style={{ display: isVisible ? 'block' : 'none' }}>
      {children}
    </div>
  ), [isVisible]);

  return { elementId, setMoveToTarget, Element } as const;
}

export const useDraggable = (
  dropTargets: string[],
  onEventHandle: (event_type: string, target_id: string) => void
) => {
  const dragItem = useRef<HTMLElement | null>(null);
  const [targets] = useState(new Set(dropTargets));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    dragItem.current = e.target as HTMLElement;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target_id = (e.target as HTMLElement).id;
    targets.has(target_id) && onEventHandle('drop', target_id);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target_id = (e.target as HTMLElement).id;
    targets.has(target_id) && onEventHandle('drag', target_id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragEnter,
    handleDragOver,
  };
}

// External Functions
export const changeChildrenElementId = (elementId: string, children: JSX.Element) => {
  const element = document.getElementById(elementId);

  const root = element && createRoot(element);

  root?.render(children);
}

export const removeElementId = (elementId: string) => {
  document.getElementById(elementId)?.remove();
}

const dbPromise = openDB(idb_name, 1, {
  upgrade(db) {
    for (let i = 0; i < idb_objects.length; ++i) {
      db.createObjectStore(idb_objects[i]);
    };
  },
})

export const ImageInstance = {
  getImage: async (db_name: string, id: string): Promise<any> => {
    const db = await dbPromise;
    return await db.get(db_name, id);
  },
  setImage: async (db_name: string, id: string, image: Blob) => {
    const db = await dbPromise;
    await db.put(db_name, image, id);
  },
  removeImage: async (db_name: string, id: string) => {
    const db = await dbPromise;
    await db.delete(db_name, id);
  },
}