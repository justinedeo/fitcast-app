import React from 'react';
import './Home.css'; // Optional: for styling

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to FitCast</h1>
        <p>Your fitness forecasting companion</p>
      </header>

      <main className="home-main">
        <section className="hero">
          <h2>Stay Fit, Stay Informed</h2>
          <p>Get personalized fitness insights and weather-aware workout recommendations</p>
          <button className="cta-button">Get Started</button>
        </section>

        <section className="features">
          <div className="feature-card">
            <h3>Smart Planning</h3>
            <p>Plan workouts based on weather forecasts</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Updates</h3>
            <p>Stay updated with live fitness data</p>
          </div>
          <div className="feature-card">
            <h3>Performance Tracking</h3>
            <p>Monitor your progress over time</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;