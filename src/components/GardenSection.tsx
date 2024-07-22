import React, { useEffect, useRef } from 'react';

const GardenSection: React.FC = () => {
  const sections = [
    { id: 'section1', content: 'Section 1 Content' },
    { id: 'section2', content: 'Section 2 Content' },
    { id: 'section3', content: 'Section 3 Content' },
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollBy({
          top: event.deltaY,
          behavior: 'smooth',
        });
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="flex flex-col w-full h-full overflow-y-auto">
      {sections.map((section) => (
        <div key={section.id} className="min-h-screen flex items-center justify-center bg-green-200 m-4 rounded shadow-lg">
          {section.content}
        </div>
      ))}
    </div>
  );
};

export default GardenSection;