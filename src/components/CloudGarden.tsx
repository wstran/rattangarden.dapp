import React, { useRef, useEffect } from 'react';

function smoothScrollTo(element: HTMLElement, target: number, duration: number) {
    const start = element.scrollTop;
    const change = target - start;
    const increment = 20;
    let currentTime = 0;
  
    const animateScroll = () => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
  
    animateScroll();
  }
  
  function easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

const CloudGarden: React.FC = () => {
  const gardenRef = useRef<HTMLDivElement>(null);
  const sections = [100, 200, 300, 400]; // Định nghĩa chiều cao các ngăn
    console.log(document.onscroll)

    useEffect(() => {
        document.onscrollend = (event) =>{
            console.log(event);
           /*  const scrollTop = gardenRef.current.scrollTop;
            let targetSection = sections[0];

            for (let i = 0; i < sections.length; i++) {
            if (scrollTop < sections[i]) {
                targetSection = sections[i];
                break;
            }
            }

            if (scrollTop > targetSection - 50) {
            targetSection = targetSection;
            } else {
            targetSection = sections[sections.indexOf(targetSection) - 1] || sections[0];
            } */
            console.log(document.getElementById('scroll-4')?.scrollHeight)
            document.scrollingElement?.scrollTo({
            top: (document.getElementById('scroll-4')?.scrollHeight || 0) - 125,
            behavior: 'smooth',
            });
        }
    }, []);

  /* useEffect(() => {
    const handleScroll = () => {
      if (gardenRef.current) {
        const scrollTop = gardenRef.current.scrollTop;
        let targetSection = sections[0];

        for (let i = 0; i < sections.length; i++) {
          if (scrollTop < sections[i]) {
            targetSection = sections[i];
            break;
          }
        }

        if (scrollTop > targetSection - 50) {
          targetSection = targetSection;
        } else {
          targetSection = sections[sections.indexOf(targetSection) - 1] || sections[0];
        }

        gardenRef.current.scrollTo({
          top: targetSection,
          behavior: 'smooth',
        });
      }
    };

    const garden = gardenRef.current;
    if (garden) {
      garden.addEventListener('scrollend', handleScroll);
    }

    return () => {
      if (garden) {
        garden.removeEventListener('scrollend', handleScroll);
      }
    };
  }, []); */

  return (
    <div ref={gardenRef} className="cloud-garden flex flex-col w-full h-full overflow-y-auto">
      {[...Array(10)].map((_, index) => (
        <div key={index} id={`scroll-${index}`} className="cloud-row flex justify-center my-4 w-full mx-auto relative bg-white rounded-lg shadow-lg">
          {[...Array(4)].map((_, colIndex) => (
            <div key={colIndex} className="w-1/4 p-4">
              <div className="flower-pot w-full h-40 bg-yellow-200 rounded-lg flex items-center justify-center">
                🌸
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CloudGarden;