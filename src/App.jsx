import React, { useState } from 'react';
import MainMenu from './MainMenu';
import BaseGameScene from './BaseGameScene';
import TimedGameScene from './TimedGameScene';
import GameModeSelection from './GameModeSelection';
import StoryIntro from './StoryIntro';
import Leaderboard from './Leaderboard';
import HowToPlay from './HowToPlay';

const App = () => {
  // State to track the current screen being displayed
  const [currentScreen, setCurrentScreen] = useState('menu');
  
  // State to track the selected game mode (either 'story' or 'timed')
  const [gameMode, setGameMode] = useState(null);

  // Handler to navigate to the game mode selection screen
  const handlePlay = () => {
    setCurrentScreen('gameModeSelection');
  };

  // Handler to navigate to the leaderboard screen
  const handleLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  // Handler to navigate to the How To Play screen
  const handleHowToPlay = () => {
    setCurrentScreen('howToPlay');
  };

  // Handler to return to the main menu and reset game mode
  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setGameMode(null);
  };

  // Handler to select the story mode and navigate to the story introduction
  const handleSelectStoryMode = () => {
    setGameMode('story');
    setCurrentScreen('storyIntro');
  };

  // Handler to select the timed mode and navigate to the game screen
  const handleSelectTimedMode = () => {
    setGameMode('timed');
    setCurrentScreen('game');
  };

  // Handler to start the game, used after the story intro
  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  return (
    <div className="app-container">
      {/* Display the Main Menu screen */}
      {currentScreen === 'menu' && (
        <MainMenu
          onPlay={handlePlay}
          onLeaderboard={handleLeaderboard}
          onHowToPlay={handleHowToPlay}
        />
      )}

      {/* Display the Game Mode Selection screen */}
      {currentScreen === 'gameModeSelection' && (
        <GameModeSelection
          onSelectStoryMode={handleSelectStoryMode}
          onSelectTimedMode={handleSelectTimedMode}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {/* Display the Story Introduction screen */}
      {currentScreen === 'storyIntro' && (
        <StoryIntro
          onPlay={handleStartGame}
          onBack={() => setCurrentScreen('gameModeSelection')}
        />
      )}

      {/* Display the Game Scene for Story Mode */}
      {currentScreen === 'game' && gameMode === 'story' && (
        <BaseGameScene
          isTimedMode={false}
          showLeaderboard={true}
          onBackToMenu={handleBackToMenu}
          onViewLeaderboard={handleLeaderboard}
        />
      )}

      {/* Display the Game Scene for Timed Mode */}
      {currentScreen === 'game' && gameMode === 'timed' && (
        <BaseGameScene
          isTimedMode={true}
          showLeaderboard={false}
          onBackToMenu={handleBackToMenu}
        />
      )}

      {/* Display the Leaderboard screen */}
      {currentScreen === 'leaderboard' && (
        <Leaderboard onBackToMenu={handleBackToMenu} />
      )}

      {/* Display the How To Play screen */}
      {currentScreen === 'howToPlay' && (
        <HowToPlay onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
};

export default App;
