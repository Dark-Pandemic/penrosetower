import React, { useEffect, useState, useRef } from 'react';

const StoryIntro = ({ onPlay, onBack }) => {
  const [displayText, setDisplayText] = useState('');
  const [scrollHeight, setScrollHeight] = useState(0); // For scroll unrolling animation
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false); // Narration state
  const audioRef = useRef(null); // Reference to the audio element

  // Your story
  const fullText = `Upon the eve of spring, in the year 1100, I set quill to this parchment. In the twilight of fate, when the stars whisper secrets unknown, I lay before thee these words, etched in the ink of my heart.

So, so very cold. My breath materializing the path in front of me. Has the world grown darker, or do my eyes seek to shield me from the path ahead? 21 years, and now it is finally here. The Ritual of Penrosia, an ancient ceremony to induct those worthy into the covenant.

Three pillars: Innocence, Suffering, and Resolve. Runes on the first pillar need to be moved onto the last pillar, while the pillars try to seep into your soul and bleed you dry. My muscles tense up. I've faced all manner of creatures, and now I falter? Yesterday's feast seeks to bulimic themselves up my esophagus. I must remember my teachings.

Armed with the Staff of React, blessed by Vite, I feel the emotions in the air linger. They attach themselves to every pore on my body. So many emotions, so much, yet one emotion bubbles up to the surface. Anger. The voices, they are back. "They lied to you. They hated you. They turned their back on you. Stole everything from you." STOP! STOP! No more of this insolence!

I feel anger, but I will not be angry. It is not my rudder controlling where I go. It is the wind in my sail, and I alone am its master, the tempest to its gale force. The sins of man will bind me no longer! NPM RUN DEV!!!!!!!!`;

  // Quill Writing Effect
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust speed of typing here

    return () => clearInterval(interval);
  }, [fullText]);

  // Scroll Unrolling Animation
  useEffect(() => {
    const scrollContainer = document.getElementById('scrollContainer');
    const maxHeight = scrollContainer.scrollHeight;
    let currentHeight = 0;
    const unrollInterval = setInterval(() => {
      if (currentHeight < maxHeight) {
        currentHeight += 10; // Adjust speed of unrolling here
        setScrollHeight(currentHeight);
      } else {
        clearInterval(unrollInterval);
      }
    }, 30); // Adjust interval for smoothness

    return () => clearInterval(unrollInterval);
  }, []);

  // Narration Toggle
  const toggleNarration = () => {
    if (audioRef.current) {
      if (isNarrationPlaying) {
        audioRef.current.pause(); // Pause narration
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Audio playback failed:', error);
        }); // Play narration
      }
      setIsNarrationPlaying(!isNarrationPlaying); // Toggle state
    }
  };

  return (
    <div style={styles.container}>
      {/* Audio element for narration */}
      <audio ref={audioRef} src="public\audio\story-narration.mp3" loop={false} />

      {/* Narration Toggle Button */}
      <button style={styles.narrationButton} onClick={toggleNarration}>
        {isNarrationPlaying ? '🔊 Narration On' : '🔇 Narration Off'}
      </button>

      {/* Scroll Background */}
      <div
        id="scrollContainer"
        style={{ ...styles.scrollContainer, height: `${scrollHeight}px` }}
      >
        <div style={styles.scrollContent}>
          <h1 style={styles.title}>The Legend of the Towers</h1>
          <div style={styles.storyText}>
            <p style={styles.inkyText}>{displayText}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={onPlay}>
          Play
        </button>
        <button style={styles.button} onClick={onBack}>
          Back
        </button>
      </div>
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
    backgroundColor: '#d2b48c', // Parchment-like background color
    fontFamily: '"Courier New", Courier, monospace', // Handwritten-style font
    padding: '20px',
  },
  scrollContainer: {
    backgroundImage: 'url("/textures/grunge-paper-background.jpg")', // Scroll texture from public folder
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    width: '80%',
    maxWidth: '800px',
    padding: '60px 40px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    overflowY: 'auto', // Enable scrolling
    transition: 'height 1s ease-in-out', // Smooth unrolling animation
  },
  scrollContent: {
    textAlign: 'center',
    color: '#5a3e2e', // Dark brown text color
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    fontFamily: '"MedievalSharp", cursive', // Medieval-style font for the title
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  storyText: {
    fontSize: '20px',
    lineHeight: '1.6',
    textAlign: 'left',
    fontFamily: '"Dancing Script", cursive', // Handwritten-style font for the story
  },
  inkyText: {
    background: 'linear-gradient(to bottom, #5a3e2e, #3a2a1e)', // Gradient for ink effect
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))', // Subtle shadow for depth
  },
  buttonContainer: {
    marginTop: '40px',
    display: 'flex',
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
    fontFamily: '"MedievalSharp", cursive',
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker wood color on hover
      transform: 'scale(1.05)', // Slightly enlarge on hover
    },
  },
  narrationButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#8b7355', // Wooden button color
    color: '#f0e6d2', // Parchment text color
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    fontFamily: '"MedievalSharp", cursive',
    ':hover': {
      backgroundColor: '#6b5a4a', // Darker wood color on hover
      transform: 'scale(1.05)', // Slightly enlarge on hover
    },
  },
};

export default StoryIntro;