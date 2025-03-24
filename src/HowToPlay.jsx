import React, { useState, useRef } from 'react';

const HowToPlay = ({ onBackToMenu }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // State for music playback
  const audioRef = useRef(null); // Reference to the audio element

  // Toggle music playback
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause(); // Pause the music
      } else {
        audioRef.current.play(); // Play the music
      }
      setIsMusicPlaying(!isMusicPlaying); // Toggle the state
    }
  };

  return (
    <div style={styles.container}>
      {/* Audio element for background music */}
      <audio ref={audioRef} loop>
        <source src="/src/assets/music/Lullaby of Woe.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Toggle Button (Bubble) */}
      <button onClick={toggleMusic} style={styles.musicButton}>
        {isMusicPlaying ? '🔊' : '🔇'}
      </button>

      {/* Video Background */}
      <video autoPlay loop muted style={styles.videoBackground}>
        <source src="/videos/2715412-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div style={styles.content}>
        <h1 style={styles.title}>How to Play</h1>
        <div style={styles.textContainer}>
          <p style={styles.text}>
            Welcome to the <strong>Towers of Hanoi</strong>! Here's how to play:
          </p>
          <ol style={styles.list}>
            <li style={styles.listItem}>
              The game consists of three pillars and a number of disks of different sizes.
            </li>
            <li style={styles.listItem}>
              The disks are initially stacked on the first pillar in ascending order of size (smallest on top).
            </li>
            <li style={styles.listItem}>
              Your goal is to move the entire stack to the last pillar, following these rules:
              <ul style={styles.subList}>
                <li>Only one disk can be moved at a time.</li>
                <li>You can only move the top disk of a pillar.</li>
                <li>A larger disk cannot be placed on top of a smaller one.</li>
              </ul>
            </li>
            <li style={styles.listItem}>
              Complete the puzzle in as few moves as possible!
            </li>
          </ol>
        </div>
        <button onClick={onBackToMenu} style={styles.button}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
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
    objectFit: 'cover', // Ensures the video covers the entire screen
    zIndex: -1, // Places the video behind the content
  },
  content: {
    backgroundColor: 'rgba(240, 230, 210, 0.8)', // Semi-transparent parchment overlay
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    border: '5px solid #8b7355',
    textAlign: 'center',
    zIndex: 1, // Ensures the content is above the video
    maxWidth: '800px',
    width: '90%',
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    color: '#5a3e2e',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  textContainer: {
    textAlign: 'left',
  },
  text: {
    fontSize: '20px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  list: {
    fontSize: '18px',
    lineHeight: '1.6',
    paddingLeft: '20px',
    marginBottom: '20px',
  },
  listItem: {
    marginBottom: '10px',
  },
  subList: {
    listStyleType: 'disc',
    paddingLeft: '20px',
    marginTop: '5px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#8b7355', // Wooden button
    color: '#f0e6d2', // Parchment text
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker wood
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 223, 186, 0.8)', // Enhanced glow on hover
    },
  },
  musicButton: {
    position: 'absolute', // Position the button in the top-right corner
    top: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%', 
    backgroundColor: '#8b7355', // Match the button color
    color: '#f0e6d2', 
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s, transform 0.2s',
    zIndex: 10, // Ensure the button is on top
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker color on hover
      transform: 'scale(1.1)', // Slightly enlarge on hover
    },
  },
};

export default HowToPlay;