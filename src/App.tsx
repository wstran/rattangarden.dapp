import React from 'react';
import CloudGarden from './components/CloudGarden';

const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-blue-200 flex flex-col items-center scrollbar-hide">
      {/* <header className="w-full bg-blue-600 p-4 text-white text-center">
        Mini Web App for Telegram
      </header> */}
      <main className="flex-1 w-full flex flex-col items-center bg-red-500">
        
      </main>
      {/* <footer className="w-full bg-blue-600 p-4 text-white text-center">
        Footer Content
      </footer> */}
    </div>
  );
};

export default App;