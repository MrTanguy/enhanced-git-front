import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <main className="home-main">
        <h2 className="home-title">Build a portfolio that reflects you</h2>
        <p className="home-subtitle">
          Connect your GitHub projects, enrich them with content, and showcase what you want, how you want.
        </p>

        <div className="home-features">
          <div className="feature-box">
            <div className="feature-icon">🧩</div>
            <h3>Drag & Drop</h3>
            <p>Easily add blocks like text, titles, GitHub connections, and more.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">💻</div>
            <h3>Highlight your code</h3>
            <p>Link your GitHub account to fetch and customize your projects.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🚀</div>
            <h3>Ready to deploy</h3>
            <p>Share your portfolio, or keep it private — it's your choice.</p>
          </div>
        </div>

        <div className="home-cta">
          <Link to="/dashboard" className="home-button large">Create my portfolio</Link>
        </div>
      </main>

      <footer className="home-footer">
        © {new Date().getFullYear()} Enhanced Git - Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
