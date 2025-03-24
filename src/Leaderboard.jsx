import React, { useState, useRef, useEffect } from 'react';

const Leaderboard = ({ onBackToMenu }) => {
  const [scores, setScores] = useState([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // State for music playback
  const audioRef = useRef(null); // Reference to the audio element

  // Dummy data to compare to user scores 
  const dummyScores = [
    { name: 'Bruce The omnipotent', moves: 10, time: 28 },
    { name: 'Ivar The bloody baron', moves: 20, time: 88 },
    { name: 'Vandal The grey', moves: 25, time: 90 },
    { name: 'Fergus The bold', moves: 30, time: 200 },
  ];

  // Fetch saved scores from localStorage
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('hanoiScores')) || [];
    const allScores = [...savedScores, ...dummyScores];
    allScores.sort((a, b) => a.moves - b.moves || a.time - b.time); // Sort by moves, then time
    setScores(allScores.slice(0, 10)); // Show top 10 scores
  }, []);

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
        <source src="/src/assets/music/Drink.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Music Toggle Button (Bubble) */}
      <button onClick={toggleMusic} style={styles.musicButton}>
        {isMusicPlaying ? '🔊' : '🔇'}
      </button>

      <h1 style={styles.title}>Leaderboard</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Moves</th>
            <th style={styles.th}>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index} style={styles.tr}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{score.name}</td>
              <td style={styles.td}>{score.moves}</td>
              <td style={styles.td}>{score.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onBackToMenu} style={styles.button}>
        Back to Menu
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundImage: 'url("/textures/grunge-paper-background.jpg")', // Medieval parchment texture
    backgroundSize: 'cover',
    color: '#5a3e2e', // Dark brown text
    fontFamily: '"MedievalSharp", cursive',
    padding: '20px',
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    color: '#f0e6d2', // Light parchment text
    textShadow: '0 0 10px rgba(255, 223, 186, 0.8), 0 0 20px rgba(255, 223, 186, 0.6)', // Glow effect
  },
  table: {
    width: '60%',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(240, 230, 210, 0.8)', // Semi-transparent parchment
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 223, 186, 0.6)', // Glow and shadow
    borderRadius: '10px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#8b7355', // Wooden color
    color: '#f0e6d2', // Parchment text
    padding: '15px',
    fontSize: '20px',
    textAlign: 'left',
    textShadow: '0 0 5px rgba(255, 223, 186, 0.5)', // Subtle glow
  },
  tr: {
    borderBottom: '1px solid #8b7355',
  },
  td: {
    padding: '15px',
    fontSize: '18px',
    textShadow: '0 0 5px rgba(255, 223, 186, 0.3)', // Subtle glow
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#8b7355', // Wooden button
    color: '#f0e6d2', // Parchment text
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 223, 186, 0.5)', // Glow and shadow
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
    backgroundColor: '#8b7355', 
    color: '#f0e6d2', 
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 223, 186, 0.5)', // Glow and shadow
    transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.3s',
    zIndex: 10, 
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker color on hover
      transform: 'scale(1.1)', // Slightly enlarge on hover
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 223, 186, 0.8)', // Enhanced glow on hover
    },
  },
};

export default Leaderboard;