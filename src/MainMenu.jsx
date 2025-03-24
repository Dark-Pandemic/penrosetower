import React, { useState, useRef } from 'react';
import VoodooDollGif from '/src/assets/animated-icons/voodoo-doll.gif'; // Absolute path for the Play button icon(used absolute path because of source issues )
import HandWithCrownGif from '/src/assets/animated-icons/hand-with-crown.gif'; // Absolute path for the Leaderboard button icon
import WizardGif from '/src/assets/animated-icons/wizard.gif'; // Absolute path for the How to Play button icon
import MainMenuMusic from '/src/assets/music/The Trail.mp3'; // Background music file

// Main menu with props to navigate 
const MainMenu = ({ onPlay, onLeaderboard, onHowToPlay }) => {
  const [isHovered, setIsHovered] = useState(false); // hover effect tracking 
  const [isActive, setIsActive] = useState(false); // track button clicked
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // music playback
  const audioRef = useRef(null); 

  // play music back when button clicked 
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause(); // Pause music if in play
      } else {
        audioRef.current.play(); // Play the music if paused
      }
      setIsMusicPlaying(!isMusicPlaying); 
    }
  };

  // Button hover and click effects
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);

  // Style for buttons
  const buttonStyle = {
    ...styles.button,
    backgroundColor: isHovered ? '#6b5a4a' : '#8b7355', // Change color on hover
    transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Slightly enlarge on hover
    boxShadow: isHovered ? '0 6px 8px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.3)',
    ...(isActive && {
      transform: 'scale(0.95)', // Slightly shrink when clicked
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    }),
  };

  return (
    <div style={styles.menuContainer}>
      {/* Audio element for background music */}
      <audio ref={audioRef} loop>
        <source src={MainMenuMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Toggle Button  */}
      <button onClick={toggleMusic} style={styles.musicButton}>
        {isMusicPlaying ? '🔊' : '🔇'} {/* Speaker icon toggles based on music state */}
      </button>

      {/* Video Background for the menu screen */}
      <video autoPlay loop muted style={styles.videoBackground}>
        <source src="/videos/5416362-uhd_4096_2160_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Parchment-style Background for the menu UI */}
      <div style={styles.parchmentBackground}>
        <h1 style={styles.title}>Towers of Hanoi</h1> {/* Game title */}

        {/* Button Container for Play, Leaderboard, and How to Play */}
        <div style={styles.buttonContainer}>
          {/* Play Button */}
          <button
            style={buttonStyle}
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause(); // Stop music when existing page
              }
              onPlay(); // Navigate to the game
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Play <div style={styles.iconWrapper}><img src={VoodooDollGif} alt="Play" style={styles.icon} /></div>
          </button>

          {/* Leaderboard Button */}
          <button
            style={buttonStyle}
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause(); // Stop music on exit
              }
              onLeaderboard(); // Navigate to the leaderboard
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            Leaderboard <div style={styles.iconWrapper}><img src={HandWithCrownGif} alt="Leaderboard" style={styles.icon} /></div>
          </button>

          {/* How to Play Button */}
          <button
            style={buttonStyle}
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause(); // Stop musix on exxit
              }
              onHowToPlay(); // Navigate to How to Play section
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            How to Play <div style={styles.iconWrapper}><img src={WizardGif} alt="How to Play" style={styles.icon} /></div>
          </button>
        </div>
      </div>
    </div>
  );
};

//  inline styling
const styles = {
  menuContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
  },
  parchmentBackground: {
    backgroundColor: '#f0e6d2',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    border: '5px solid #8b7355',
    textAlign: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    color: '#5a3e2e',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '24px',
    backgroundColor: '#8b7355',
    color: '#f0e6d2',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    fontFamily: 'MedievalSharp, cursive',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px', 
  },
  iconWrapper: {
    backgroundColor: '#8b7355', 
    borderRadius: '4px', 
    padding: '4px', 
  },
  icon: {
    width: '24px', 
    height: '24px',
  },
  musicButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%', 
    backgroundColor: '#8b7355',
    color: '#f0e6d2',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
};

export default MainMenu;
