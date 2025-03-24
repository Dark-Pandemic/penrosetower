import React, { useState, useRef, useEffect } from 'react';

// Absolute paths for the icons
const ParchmentIcon = 'src/assets/animated-icons/parchment.gif'; // Scroll icon for Story Mode
const TimeIcon = 'src/assets/animated-icons/time.gif'; // Hourglass icon for Timed Mode

// Absolute path for the music
import SteelForHumans from '/src/assets/music/SteelForHumans.mp3';

const GameModeSelection = ({ onSelectStoryMode, onSelectTimedMode, onBackToMenu }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // track music playback
  const audioRef = useRef(null); 

  // Toggle music playback
  const toggleMusic = () => {
    console.log('Button clicked'); // Debugging: Log button click
    if (audioRef.current) {
      console.log('Audio element found'); // Debugging: Log audio element
      if (isMusicPlaying) {
        console.log('Pausing music'); // Debugging: Log pause action
        audioRef.current.pause(); // Pause the music
      } else {
        console.log('Playing music'); // Debugging: Log play action
        audioRef.current.muted = false; // Ensure the audio is unmuted
        audioRef.current.play().catch((error) => {
          console.log('Play failed:', error); // Debugging: Log play error
        }); // Play the music
      }
      setIsMusicPlaying(!isMusicPlaying); // Toggle the state
    } else {
      console.log('Audio element not found'); // Debugging: Log missing audio element
    }
  };


  useEffect(() => {
    if (audioRef.current) {
      console.log('Audio element initialized'); // Debugging: Log initialization
      audioRef.current.volume = 0.5; 
    } else {
      console.log('Audio element not initialized'); // Debugging: Log initialization error
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Audio element for background music */}
      <audio ref={audioRef} loop muted={!isMusicPlaying}>
        <source src={SteelForHumans} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Toggle Button (Bubble) */}
      <button onClick={toggleMusic} style={styles.musicButton}>
        {isMusicPlaying ? '🔊' : '🔇'}
      </button>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        style={styles.videoBackground}
      >
        <source src="/videos/3133456-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>Select Game Mode</h1>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={onSelectStoryMode}>
            Story Mode <img src={ParchmentIcon} alt="Scroll" style={styles.icon} />
          </button>
          <button style={styles.button} onClick={onSelectTimedMode}>
            Timed Mode <img src={TimeIcon} alt="Hourglass" style={styles.icon} />
          </button>
          <button style={styles.backButton} onClick={onBackToMenu}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the video covers the entire screen
    zIndex: -1, // Places the video behind the content
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    color: '#f0e6d2', // Light parchment text color
    fontFamily: 'MedievalSharp, cursive',
  },
  title: {
    fontSize: '48px',
    marginBottom: '40px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '24px',
    backgroundColor: '#8b7355', // Wooden button color
    color: '#f0e6d2', // Parchment text color
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between text and icon
    gap: '10px', // Adds space between text and icon
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker wood color on hover
      transform: 'scale(1.05)', // Slightly enlarge on hover
    },
  },
  icon: {
    width: '24px', // Adjust icon size
    height: '24px',
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#6b5a4a',
    color: '#f0e6d2',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#5a4a3a',
    },
  },
  musicButton: {
    position: 'absolute', // Position the button in the top-right corner
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%', 
    backgroundColor: '#8b7355', 
    color: '#f0e6d2', 
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s, transform 0.2s',
    zIndex: 10, 
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker color on hover
      transform: 'scale(1.1)', // Slightly enlarge on hover
    },
  },
};

export default GameModeSelection;