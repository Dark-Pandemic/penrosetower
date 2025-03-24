import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Points, PointMaterial, Environment } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import SilverForMonsters from '/src/assets/music/SilverForMonsters.mp3';
import Dio from '/src/assets/music/dio.mp3';

/**
 * Floating particles component that creates a decorative particle effect in the 3D scene
 */
const FloatingParticles = () => {
  // Create 500 particles with random positions
  const particles = new Float32Array(500);
  for (let i = 0; i < particles.length; i += 3) {
    particles[i] = (Math.random() - 0.5) * 50; // Random X position (-25 to 25)
    particles[i + 1] = Math.random() * 20;     // Random Y position (0 to 20)
    particles[i + 2] = (Math.random() - 0.5) * 50; // Random Z position (-25 to 25)
  }

  return (
    <Points positions={particles}>
      <PointMaterial
        color="gold"
        size={0.1}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </Points>
  );
};

/**
 * Floor component that loads and displays the 3D floor model
 */
const Floor = () => {
  const { scene, error } = useGLTF('/japanese_shrine_stone_floor_ugrxbjkfa_low.glb');
  
  // Log any errors loading the floor model
  useEffect(() => {
    if (error) console.error('Error loading floor model:', error);
  }, [error]);

  return scene ? (
    <primitive 
      object={scene} 
      scale={[20, 1, 20]} 
      position={[0, -2, 0]} 
    />
  ) : null;
};

/**
 * Pillar component representing each tower in the game
 * @param {Array} position - 3D position [x,y,z]
 * @param {String} asset - Path to 3D model
 * @param {Array} scale - Scaling factor [x,y,z]
 * @param {Function} onClick - Click handler
 */
const Pillar = ({ position, asset, scale = [1, 1, 1], onClick }) => {
  const { scene, error } = useGLTF(asset);
  
  // Log any errors loading the pillar model
  useEffect(() => {
    if (error) console.error('Error loading pillar model:', error);
  }, [error]);

  return scene ? (
    <primitive
      object={scene}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        onClick();
      }}
    />
  ) : null;
};

/**
 * Disk component representing each movable disk in the game
 * @param {Array} position - 3D position [x,y,z]
 * @param {Number} size - Radius of the disk
 * @param {String} texture - Path to texture image
 * @param {Function} onClick - Click handler
 * @param {Boolean} isSelected - Whether disk is currently selected
 */
const Disk = ({ position, size, texture, onClick, isSelected }) => {
  const textureMap = useTexture(texture);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  // Improve texture quality when loaded
  useEffect(() => {
    if (textureMap) textureMap.anisotropy = 16;
  }, [textureMap]);

  // Turn off glow effect when disk is deselected
  useEffect(() => {
    if (!isSelected) setIsGlowing(false);
  }, [isSelected]);

  // Animation properties for selected/bouncing disks
  const springProps = useSpring({
    position: [position[0], position[1], position[2]],
    rotation: [0, 0, Math.PI * 2], // Full rotation
    scale: isSelected ? [1.2, 1.2, 1.2] : isBouncing ? [1.1, 1.1, 1.1] : [1, 1, 1],
    config: { tension: 170, friction: 26 }, // Physics config
  });

  // Trigger bounce animation when disk is placed
  const handleDiskPlacement = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);
  };

  // Pulsing glow effect for selected disks
  useEffect(() => {
    if (isSelected) {
      const interval = setInterval(() => setIsGlowing(prev => !prev), 500);
      return () => clearInterval(interval);
    }
  }, [isSelected]);

  return (
    <a.mesh
      position={springProps.position}
      rotation={springProps.rotation}
      scale={springProps.scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        handleDiskPlacement();
      }}
    >
      <cylinderGeometry args={[size, size, 0.5, 32]} />
      <meshStandardMaterial 
        map={textureMap} 
        color={isSelected ? 'yellow' : 'white'}
        emissive={isSelected ? `hsl(${Math.random() * 360}, 100%, 50%)` : 'black'}
        emissiveIntensity={isSelected ? (isGlowing ? 0.8 : 0.3) : 0}
      />
    </a.mesh>
  );
};

/**
 * Victory/Game Over banner component
 */
const VictoryBanner = ({ 
  moveCount, 
  timer, 
  isTimedMode, 
  timeOut, 
  onRetry, 
  onBackToMenu, 
  onSaveScore,
  showLeaderboard,
  onViewLeaderboard
}) => {
  return (
    <div style={styles.victoryBanner}>
      <h2 style={styles.victoryTitle}>
        {timeOut ? 'Time Expired!' : 'Huzzah!!'}
      </h2>
      <p style={styles.victoryText}>
        {timeOut ? 'The ritual was incomplete!' : 'The ritual has been complete!'}
      </p>
      
      {/* Always show time and moves */}
      <p style={styles.victoryText}>Time: {timer} seconds</p>
      <p style={styles.victoryText}>Moves: {moveCount}</p>
      
      {/* Only show save score and leaderboard in story mode */}
      {!isTimedMode && (
        <button onClick={onSaveScore} style={styles.victoryButton}>
          Save Score
        </button>
      )}
      {showLeaderboard && !isTimedMode && (
        <button onClick={onViewLeaderboard} style={styles.victoryButton}>
          View Leaderboard
        </button>
      )}
      
      {/* Always show retry and menu buttons */}
      <button onClick={onRetry} style={styles.victoryButton}>
        Retry
      </button>
      <button onClick={onBackToMenu} style={styles.victoryButton}>
        Back to Menu
      </button>
    </div>
  );
};

/**
 * Main game component handling both story and timed modes
 */
const BaseGameScene = ({ 
  isTimedMode = false, 
  showLeaderboard = true,
  onBackToMenu,
  onViewLeaderboard = () => {}
}) => {
  // Game state
  const [numDisks, setNumDisks] = useState(3);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [pillars, setPillars] = useState([[], [], []]);
  const [timer, setTimer] = useState(0); // Elapsed time in seconds
  const [history, setHistory] = useState([]); // Move history for undo
  const [future, setFuture] = useState([]); // Redo stack
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60); // Time limit for timed mode
  const [timeLeft, setTimeLeft] = useState(timeLimit); // Time remaining
  const [timeOut, setTimeOut] = useState(false); // Timed mode timeout flag
  
  // Audio refs
  const audioRef = useRef(null);
  const undoSoundRef = useRef(null);
  
  // Timer refs
  const timerIntervalRef = useRef(null);
  const gameTimerRef = useRef(null);

  // Disk size configurations
  const defaultDiskSizes = [3, 2.5, 2, 1.5, 1, 0.8, 0.6];
  const adjustedDiskSizes = [4, 3.5, 3, 2.5, 2, 1.5, 1];
  const diskSizes = numDisks >= 5 ? adjustedDiskSizes : defaultDiskSizes;
  
  // Disk textures
  const texturePaths = [
    '/textures/Runic_Textures_1.png',
    '/textures/Runic_Textures_2.png',
    '/textures/Runic_Textures_3.png',
    '/textures/Runic_Textures_4.png',
  ];

  /**
   * Generates disk objects for the game
   * @param {Number} count - Number of disks to generate
   */
  const generateDisks = (count) => {
    return diskSizes.slice(0, count).map((size, index) => ({
      id: index,
      size: size,
      pillarIndex: 0, // Start all disks on first pillar
      texture: texturePaths[index % texturePaths.length],
    }));
  };

  // Timer countdown for timed mode
  useEffect(() => {
    if (!isGameStarted || !isTimedMode || isVictory) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setIsVictory(true);
          setTimeOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [isGameStarted, isTimedMode, isVictory]);

  // Game timer (always runs when game is active)
  useEffect(() => {
    if (isGameStarted && !isVictory) {
      gameTimerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(gameTimerRef.current);
    }
  }, [isGameStarted, isVictory]);

  // Initialize game state when game starts
  useEffect(() => {
    if (isGameStarted) {
      const newDisks = generateDisks(numDisks);
      setPillars([newDisks, [], []]);
      setMoveCount(0);
      setSelectedDisk(null);
      setHistory([]);
      setFuture([]);
      setIsVictory(false);
      setTimeOut(false);
      setTimer(0);
      setTimeLeft(timeLimit);

      // Start background music
      if (audioRef.current) audioRef.current.play();
    }
  }, [numDisks, isGameStarted, timeLimit]);

  // Check for victory condition
  useEffect(() => {
    if (pillars[2].length === numDisks) {
      setIsVictory(true);
      clearInterval(timerIntervalRef.current);
    }
  }, [pillars, numDisks]);

  /**
   * Handles clicking on a disk
   * @param {Object} disk - The clicked disk
   */
  const handleDiskClick = (disk) => {
    const pillar = pillars[disk.pillarIndex];
    // Only select the top disk of a pillar
    if (pillar.length > 0 && pillar[pillar.length - 1].id === disk.id) {
      setSelectedDisk(disk);
    }
  };

  /**
   * Handles clicking on a pillar
   * @param {Number} pillarIndex - Index of clicked pillar (0-2)
   */
  const handlePillarClick = (pillarIndex) => {
    if (!selectedDisk) return;

    const sourcePillarIndex = selectedDisk.pillarIndex;
    // Clicking same pillar deselects disk
    if (sourcePillarIndex === pillarIndex) {
      setSelectedDisk(null);
      return;
    }

    const targetPillar = pillars[pillarIndex];
    // Check if move is valid (empty pillar or smaller disk on top)
    if (
      targetPillar.length === 0 ||
      targetPillar[targetPillar.length - 1].size > selectedDisk.size
    ) {
      const newPillars = [...pillars];
      // Remove from source pillar
      newPillars[sourcePillarIndex] = newPillars[sourcePillarIndex].filter(
        (d) => d.id !== selectedDisk.id
      );
      // Add to target pillar
      newPillars[pillarIndex] = [
        ...newPillars[pillarIndex],
        { ...selectedDisk, pillarIndex },
      ];

      // Update game state
      setHistory((prevHistory) => [...prevHistory, pillars]);
      setFuture([]);
      setPillars(newPillars);
      setSelectedDisk(null);
      setMoveCount(moveCount + 1);
    } else {
      setSelectedDisk(null); // Invalid move
    }
  };

  /**
   * Undoes the last move
   */
  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setFuture((prevFuture) => [...prevFuture, pillars]);
      setPillars(previousState);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setMoveCount(moveCount - 1);

      // Lower music volume during undo sound
      if (audioRef.current) {
        audioRef.current.volume = 0.1;
      }

      // Play undo sound effect
      if (undoSoundRef.current) {
        undoSoundRef.current.play();
        undoSoundRef.current.onended = () => {
          if (audioRef.current) {
            audioRef.current.volume = 1.0; // Restore volume
          }
        };
      }
    }
  };

  /**
   * Redoes the last undone move
   */
  const handleRedo = () => {
    if (future.length > 0) {
      const nextState = future[future.length - 1];
      setHistory((prevHistory) => [...prevHistory, pillars]);
      setPillars(nextState);
      setFuture((prevFuture) => prevFuture.slice(0, -1));
      setMoveCount(moveCount + 1);
    }
  };

  /**
   * Resets the game to initial state
   */
  const handleRetry = () => {
    setIsVictory(false);
    setIsGameStarted(false);
    setTimer(0);
    setMoveCount(0);
    setSelectedDisk(null);
    setHistory([]);
    setFuture([]);
    setTimeOut(false);
  };

  /**
   * Saves the current score to localStorage
   */
  const handleSaveScore = () => {
    const name = prompt('Enter your name:');
    if (name) {
      const score = { name, moves: moveCount, time: timer };
      const savedScores = JSON.parse(localStorage.getItem('hanoiScores')) || [];
      savedScores.push(score);
      localStorage.setItem('hanoiScores', JSON.stringify(savedScores));
      alert('Score saved!');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Background music */}
      <audio ref={audioRef} src={SilverForMonsters} loop preload="auto" />
      
      {/* Undo sound effect */}
      <audio ref={undoSoundRef} src={Dio} preload="auto" />

      {/* Start menu - shown before game begins */}
      {!isGameStarted && (
        <div style={styles.startMenu}>
          <h2 style={styles.menuTitle}>
            {isTimedMode ? 'Timed Mode' : 'Story Mode'}
          </h2>
          
          {/* Disk count selection */}
          <label htmlFor="diskCount" style={styles.menuLabel}>
            Select Number of Disks: 
          </label>
          <input
            id="diskCount"
            type="range"
            min="3"
            max="7"
            value={numDisks}
            onChange={(e) => setNumDisks(Number(e.target.value))}
            style={styles.slider}
          />
          <p style={styles.menuValue}>{numDisks} Disks</p>
          
          {/* Time limit selection (only in timed mode) */}
          {isTimedMode && (
            <>
              <label htmlFor="timeLimit" style={styles.menuLabel}>
                Select Time Limit (seconds): 
              </label>
              <input
                id="timeLimit"
                type="range"
                min="5"
                max="300"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                style={styles.slider}
              />
              <p style={styles.menuValue}>{timeLimit} seconds</p>
            </>
          )}
          
          {/* Start game button */}
          <button
            onClick={() => setIsGameStarted(true)}
            style={styles.startButton}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game info display - shown during gameplay */}
      {isGameStarted && (
        <div style={styles.gameInfo}>
          <p style={styles.infoText}>Moves: {moveCount}</p>
          
          {/* Timer display - always shown */}
          <p style={{
            ...styles.infoText,
            color: isTimedMode && timeLeft < 10 ? '#ff0000' : '#ffffff'
          }}>
            Time: {timer}s
            {/* Show remaining time in timed mode */}
            {isTimedMode && ` (${timeLeft}s left)`}
          </p>
          
          {/* Game controls */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            style={styles.gameButton}
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={future.length === 0}
            style={styles.gameButton}
          >
            Redo
          </button>
          <button
            onClick={onBackToMenu}
            style={styles.gameButton}
          >
            Back to Menu
          </button>
        </div>
      )}

      {/* Victory/game over banner */}
      {isVictory && (
        <VictoryBanner
          moveCount={moveCount}
          timer={timer}
          isTimedMode={isTimedMode}
          timeOut={timeOut}
          onRetry={handleRetry}
          onBackToMenu={onBackToMenu}
          onSaveScore={handleSaveScore}
          onViewLeaderboard={onViewLeaderboard}
          showLeaderboard={showLeaderboard}
        />
      )}

      {/* 3D Game Canvas */}
      <Canvas style={{ height: '100vh', width: '100vw' }} camera={{ position: [0, 20, 30], fov: 45 }}>
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={50}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 5, 0]}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* Environment */}
        <Environment files="\blue_grotto_4k.hdr" background />
        <FloatingParticles />
        <Floor />

        {/* Render pillars */}
        {[0, 0, 14].map((pos, index) => (
          <Pillar
            key={index}
            position={[pos, index === 0 ? -12 : -2, index === 0 ? 0 : -2]}
            asset={
              index === 1
                ? "/stone_pillar_selvf_mid.glb"
                : index === 2
                ? "/modular_pillar_wmiqcitdw_mid.glb"
                : "/greek_pillar.glb"
            }
            scale={index === 0 ? [4, 5, 4] : [4, 10, 4]}
            onClick={() => handlePillarClick(index)}
          />
        ))}

        {/* Render disks */}
        {isGameStarted && pillars.map((pillar, pillarIndex) =>
          pillar.map((disk, diskIndex) => (
            <Disk
              key={disk.id}
              position={[[-14, 0, 14][pillarIndex], -1.5 + diskIndex * 0.6, -1.7]}
              size={disk.size}
              texture={disk.texture}
              onClick={() => handleDiskClick(disk)}
              isSelected={selectedDisk?.id === disk.id}
            />
          ))
        )}
      </Canvas>
    </div>
  );
};

// Styles for all UI components
const styles = {
  victoryBanner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 30,
    backgroundImage: 'url("/textures/12117.jpg")',
    backgroundSize: 'cover',
    padding: '30px',
    borderRadius: '15px',
    border: '4px solid #8B4513',
    boxShadow: '0 0 20px rgba(139, 69, 19, 0.8)',
    textAlign: 'center',
    fontFamily: 'medieval-font, serif',
    color: '#FFF8DC',
    width: '400px',
  },
  victoryTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#8B4513'
  },
  victoryText: {
    fontSize: '18px',
    marginBottom: '10px'
  },
  victoryButton: {
    padding: '10px 20px',
    margin: '5px',
    fontSize: '18px',
    backgroundColor: '#8B4513',
    color: '#FFF8DC',
    border: '2px solid #5C4033',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'medieval-font, serif',
    boxShadow: '0 0 10px rgba(139, 69, 19, 0.5)'
  },
  startMenu: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 20,
    backgroundImage: 'url("/textures/grunge-paper-background.jpg")',
    backgroundSize: 'cover',
    padding: '30px',
    borderRadius: '15px',
    border: '4px solid #8B4513',
    boxShadow: '0 0 20px rgba(139, 69, 19, 0.8)',
    textAlign: 'center',
    fontFamily: 'medieval-font, serif',
    color: '#5C4033',
  },
  menuTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#8B4513'
  },
  menuLabel: {
    fontSize: '20px',
    color: '#8B4513',
    display: 'block',
    margin: '10px 0'
  },
  menuValue: {
    fontSize: '20px',
    color: '#8B4513',
    margin: '5px 0'
  },
  slider: {
    width: '200px',
    margin: '10px 0',
    accentColor: '#8B4513'
  },
  startButton: {
    padding: '10px 20px',
    fontSize: '20px',
    backgroundColor: '#8B4513',
    color: '#FFF8DC',
    border: '2px solid #5C4033',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'medieval-font, serif',
    boxShadow: '0 0 10px rgba(139, 69, 19, 0.5)',
    marginTop: '15px'
  },
  gameInfo: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    backgroundImage: 'url("/textures/grunge-paper-background.jpg")',
    backgroundSize: 'cover',
    padding: '15px 30px',
    borderRadius: '15px',
    border: '4px solid #8B4513',
    boxShadow: '0 0 20px rgba(139, 69, 19, 0.8)',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    fontFamily: 'medieval-font, serif',
    color: '#5C4033',
  },
  infoText: {
    margin: 0,
    fontSize: '18px',
    color: '#FFF8DC',
    textShadow: '1px 1px 2px #000'
  },
  gameButton: {
    padding: '8px 16px',
    backgroundColor: '#8B4513',
    color: '#FFF8DC',
    border: '2px solid #5C4033',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'medieval-font, serif',
    boxShadow: '0 0 10px rgba(139, 69, 19, 0.5)'
  }
};

export default BaseGameScene;