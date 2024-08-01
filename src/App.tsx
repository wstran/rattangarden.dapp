import React, { useState, useRef, useEffect } from 'react';
import Game from './layouts/Game';
import Loading from './layouts/Loading';
import { generateMD5 } from './hooks/engine';

type Screen = 'loading' | 'game';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('loading');

    useEffect(() => {
        if (screen === 'loading') {
            
        };
    }, [screen]);

    let Screen;

    if (screen === 'loading') {
        Screen = Loading;
    } else if (screen === 'game') {
        Screen = Game;
    };

    return (
        <div className="flex flex-col items-center justify-center overflow-hidden">
            
        </div>
    );
};

export default App;