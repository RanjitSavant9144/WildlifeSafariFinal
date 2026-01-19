import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { SafariSlot } from '../types';
import { useAuth } from '../context/AuthContext';

const SafariSlots: React.FC = () => {
  const [slots, setSlots] = useState<SafariSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<SafariSlot | null>(null);
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const data = await api.getAvailableSlots();
      setSlots(data);
    } catch (error) {
      console.error('Error loading slots:', error);
      setError('Failed to load safari slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlot) return;

    setError('');
    setSuccess('');

    try {
      const booking = await api.createBooking({
        slotId: selectedSlot.slotId,
        numberOfPersons,
        specialRequests
      });

      setSuccess(`Booking created successfully! Booking ID: ${booking.bookingId}`);
      setSelectedSlot(null);
      setNumberOfPersons(1);
      setSpecialRequests('');
      loadSlots(); // Refresh slots

      // Navigate to payment after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading safari slots...</div></div>;
  }

  return (
    <div className="container">
      <h2>Available Safari Slots</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {selectedSlot ? (
        <div className="card">
          <h3>Book Your Safari</h3>
          <div style={{ marginBottom: '1rem' }}>
            <h4>{selectedSlot.slotName}</h4>
            <p><strong>Date:</strong> {formatDate(selectedSlot.slotDate)}</p>
            <p><strong>Time:</strong> {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
            <p><strong>Price per Person:</strong> ${selectedSlot.pricePerPerson}</p>
            <p><strong>Available Capacity:</strong> {selectedSlot.availableCapacity}</p>
          </div>

          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label htmlFor="numberOfPersons">Number of Persons</label>
              <input
                type="number"
                id="numberOfPersons"
                className="form-control"
                min="1"
                max={selectedSlot.availableCapacity}
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests (Optional)</label>
              <input
                type="text"
                id="specialRequests"
                className="form-control"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                Total Amount: ${(selectedSlot.pricePerPerson * numberOfPersons).toFixed(2)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedSlot(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {slots.length === 0 ? (
            <p>No safari slots available at the moment.</p>
          ) : (
            slots.map((slot) => (
              <div key={slot.slotId} className="slot-card">
                <div className="slot-info">
                  <h3>{slot.slotName}</h3>
                  <p className="slot-details">
                    📅 {formatDate(slot.slotDate)}
                  </p>
                  <p className="slot-details">
                    🕐 {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>
                  <p className="slot-details">
                    👥 Available: {slot.availableCapacity} / {slot.maxCapacity}
                  </p>
                  <p className="slot-details">{slot.description}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="slot-price">${slot.pricePerPerson}</div>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>per person</p>
                  {slot.availableCapacity > 0 ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      Book Now
                    </button>
                  ) : (
                    <span className="badge badge-danger">Fully Booked</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SafariSlots;
