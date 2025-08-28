import { useState, useRef, useEffect } from 'react';

const TabContainer = ({ tabs, activeTab, onTabChange }) => {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    const container = containerRef.current;
    
    if (activeTabElement && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      // Get exact position relative to container, accounting for gap and padding
      const left = tabRect.left - containerRect.left - 8;
      const width = tabRect.width;
      const top = tabRect.top - containerRect.top - 8;
      const height = tabRect.height;
      
      setIndicatorStyle({
        left: left,
        width: width,
        top: top,
        height: height,
        opacity: 1
      });
    }
  }, [activeTab]);

  // Initialize on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tabs.length > 0) {
        const firstTab = tabs[0];
        const firstTabElement = tabRefs.current[firstTab];
        const container = containerRef.current;
        
        if (firstTabElement && container) {
          const containerRect = container.getBoundingClientRect();
          const tabRect = firstTabElement.getBoundingClientRect();
          
          const left = tabRect.left - containerRect.left - 8;
          const width = tabRect.width;
          const top = tabRect.top - containerRect.top - 8;
          const height = tabRect.height;
          
          setIndicatorStyle({
            left: left,
            width: width,
            top: top,
            height: height,
            opacity: 1
          });
        }
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [tabs]);

  return (
    <div 
      ref={containerRef}
      className=" w-[100%] relative flex items-center gap-2 p-2 lg:p-4 bg-white rounded-3xl border border-gray-200"
    >
      {/* Sliding background indicator - now matches exact tab dimensions */}
      <div 
        className="absolute bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-lg transition-all duration-300 ease-out border border-slate-700/50"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          top: `${indicatorStyle.top}px`,
          height: `${indicatorStyle.height}px`,
          opacity: indicatorStyle.opacity || 0
        }}
      />
      
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          tab={tab}
          isActive={activeTab === tab}
          onClick={onTabChange}
          ref={(el) => {
            if (el) {
              tabRefs.current[tab] = el;
            }
          }}
        />
      ))}
    </div>
  );
};

const TabButton = ({ tab, isActive, onClick, ...props }) => (
  <button
    {...props}
    onClick={() => onClick(tab)}
    className={`
      relative flex-1  py-6 lg:py-8 font-medium rounded-2xl
      transition-all duration-300 ease-out
      transform active:scale-95
      focus:outline-none focus:ring-offset-2 focus:ring-slate-500
      ${isActive
        ? 'text-white z-10 shadow-sm bg-orange-300 text-xl lg:text-3xl'
        : 'text-gray-600 hover:text-gray-800 z-0 text-sm'
      }
      text-center
    `}
  >
    <span className="relative z-10 select-none font-semibold">
      {tab}
    </span>
    
    {/* Hover effect for inactive tabs */}
    {!isActive && (
      <div className="absolute inset-0 bg-white/40 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
    )}
  </button>
);

export default TabContainer;