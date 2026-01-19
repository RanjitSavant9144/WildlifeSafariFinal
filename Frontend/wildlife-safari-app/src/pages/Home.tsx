import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { WildlifePhoto } from '../types';

const Home: React.FC = () => {
  const [photos, setPhotos] = useState<WildlifePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const data = await api.getAllPhotos();
      setPhotos(data);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>Welcome to Wildlife Safari</h1>
        <p>Experience the thrill of nature's most magnificent creatures</p>
        <Link to="/slots">
          <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            Book Your Safari Now
          </button>
        </Link>
      </div>

      <div className="container">
        <h2>Featured Wildlife</h2>
        {loading ? (
          <div className="loading">Loading wildlife photos...</div>
        ) : (
          <div className="card-grid">
            {photos.map((photo) => (
              <div key={photo.photoId} className="photo-card">
                <img 
                  src={photo.hasImageData 
                    ? api.getPhotoImageUrl(photo.photoId) 
                    : photo.imageUrl || 'https://via.placeholder.com/300x250?text=No+Image'
                  } 
                  alt={photo.title} 
                />
                <div className="photo-card-content">
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                  <span className="badge badge-success">{photo.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem' }}>
          <h2>Why Choose Us?</h2>
          <div className="card-grid">
            <div className="card">
              <h3>🌿 Experienced Guides</h3>
              <p>Our expert guides have years of experience in wildlife tracking and nature conservation.</p>
            </div>
            <div className="card">
              <h3>🦁 Best Wildlife Spots</h3>
              <p>Visit the most renowned wildlife reserves with the highest chances of spotting rare animals.</p>
            </div>
            <div className="card">
              <h3>📸 Photography Opportunities</h3>
              <p>Capture stunning moments with professional photography support and guidance.</p>
            </div>
            <div className="card">
              <h3>🏕️ Safety First</h3>
              <p>Your safety is our priority with well-maintained vehicles and trained staff.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
