import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'Credit Card',
    cardNumber: '',
    cardHolderName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [isAuthenticated, navigate]);

  const loadBookings = async () => {
    try {
      const data = await api.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setError('');
    setSuccess('');

    try {
      await api.processPayment({
        bookingId: selectedBooking.bookingId,
        paymentMethod: paymentDetails.paymentMethod,
        cardNumber: paymentDetails.cardNumber,
        cardHolderName: paymentDetails.cardHolderName
      });

      setSuccess('Payment processed successfully!');
      setSelectedBooking(null);
      setPaymentDetails({ paymentMethod: 'Credit Card', cardNumber: '', cardHolderName: '' });
      loadBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully');
      loadBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading your bookings...</div></div>;
  }

  return (
    <div className="container">
      <h2>My Bookings</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {selectedBooking ? (
        <div className="card">
          <h3>Complete Payment</h3>
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>Booking:</strong> {selectedBooking.slotName}</p>
            <p><strong>Date:</strong> {formatDate(selectedBooking.slotDate)}</p>
            <p><strong>Total Amount:</strong> ${selectedBooking.totalAmount.toFixed(2)}</p>
          </div>

          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                className="form-control"
                value={paymentDetails.paymentMethod}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })
                }
              >
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Net Banking</option>
              </select>
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                className="form-control"
                value={paymentDetails.cardHolderName}
                onChange={(e) =>
                  setPaymentDetails({ ...paymentDetails, cardHolderName: e.target.value })
                }
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Pay ${selectedBooking.totalAmount.toFixed(2)}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {bookings.length === 0 ? (
            <p>You don't have any bookings yet.</p>
          ) : (
            <div>
              {bookings.map((booking) => (
                <div key={booking.bookingId} className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3>{booking.slotName}</h3>
                      <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                      <p><strong>Date:</strong> {formatDate(booking.slotDate)}</p>
                      <p><strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                      <p><strong>Persons:</strong> {booking.numberOfPersons}</p>
                      <p><strong>Total Amount:</strong> ${booking.totalAmount.toFixed(2)}</p>
                      {booking.specialRequests && (
                        <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
                      )}
                      <p><strong>Booked On:</strong> {formatDate(booking.bookingDate)}</p>
                      {booking.paymentTransactionId && (
                        <p><strong>Transaction ID:</strong> {booking.paymentTransactionId}</p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`badge ${
                          booking.bookingStatus === 'Confirmed'
                            ? 'badge-success'
                            : booking.bookingStatus === 'Cancelled'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                      <br />
                      <span
                        className={`badge ${
                          booking.paymentStatus === 'Completed'
                            ? 'badge-success'
                            : booking.paymentStatus === 'Refunded'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                        style={{ marginTop: '0.5rem' }}
                      >
                        Payment: {booking.paymentStatus}
                      </span>
                      <div style={{ marginTop: '1rem' }}>
                        {booking.paymentStatus === 'Pending' && booking.bookingStatus !== 'Cancelled' && (
                          <button
                            className="btn btn-primary"
                            onClick={() => setSelectedBooking(booking)}
                            style={{ marginBottom: '0.5rem', width: '100%' }}
                          >
                            Pay Now
                          </button>
                        )}
                        {booking.bookingStatus !== 'Cancelled' && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleCancelBooking(booking.bookingId)}
                            style={{ width: '100%' }}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
