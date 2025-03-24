import React from 'react';
import BaseGameScene from './BaseGameScene'; 

const TimedGameScene = ({ onBackToMenu }) => {
  return (
    <BaseGameScene 
      isTimedMode={true}
      showLeaderboard={false}
      onBackToMenu={onBackToMenu}
    />
  );
};

export default TimedGameScene;