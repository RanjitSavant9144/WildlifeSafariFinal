import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Booking, WildlifePhoto, BookingRate, SafariSlot, CreateWildlifePhotoDto, CreateBookingRateDto, CreateSafariSlotDto } from '../types';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'photos' | 'rates' | 'slots'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photos, setPhotos] = useState<WildlifePhoto[]>([]);
  const [rates, setRates] = useState<BookingRate[]>([]);
  const [slots, setSlots] = useState<SafariSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Photo form
  const [photoForm, setPhotoForm] = useState<CreateWildlifePhotoDto>({
    title: '',
    description: '',
    category: '',
    displayOrder: 0
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Rate form
  const [rateForm, setRateForm] = useState<CreateBookingRateDto>({
    rateName: '',
    basePrice: 0,
    description: ''
  });

  // Slot form
  const [slotForm, setSlotForm] = useState<CreateSafariSlotDto>({
    slotName: '',
    slotDate: '',
    startTime: '',
    endTime: '',
    maxCapacity: 20,
    pricePerPerson: 50,
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'bookings') {
          const data = await api.getAllBookings();
          setBookings(data);
        } else if (activeTab === 'photos') {
          const data = await api.getAllPhotos();
          setPhotos(data);
        } else if (activeTab === 'rates') {
          const data = await api.getAllRates();
          setRates(data);
        } else if (activeTab === 'slots') {
          const data = await api.getAvailableSlots();
          setSlots(data);
        }
      } catch (error: any) {
        console.error('Error loading data:', error);
        const errorMessage = error.response?.data?.message 
          || error.message 
          || `Failed to load ${activeTab}. Please check if the backend service is running on port 5003.`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, navigate, activeTab]);

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoFile) {
      setError('Please select an image file');
      return;
    }

    if (!photoForm.title || !photoForm.description) {
      setError('Please fill in all required fields (Title and Description)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Ensure all fields have values (not null/undefined)
      const photoData: CreateWildlifePhotoDto = {
        title: photoForm.title.trim(),
        description: photoForm.description.trim(),
        category: photoForm.category?.trim() || '',
        displayOrder: photoForm.displayOrder || 0
      };
      
      await api.createPhoto(photoData, photoFile);
      setSuccess('Photo added successfully!');
      setPhotoForm({ title: '', description: '', category: '', displayOrder: 0 });
      setPhotoFile(null);
      // Reset file input
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      loadData();
    } catch (err: any) {
      console.error('Error creating photo:', err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to add photo. Please check if the backend Admin service is running on port 5003.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      await api.deletePhoto(photoId);
      setSuccess('Photo deleted successfully!');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete photo');
    }
  };

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRate(rateForm);
      setSuccess('Rate added successfully!');
      setRateForm({ rateName: '', basePrice: 0, description: '' });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add rate');
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSlot(slotForm);
      setSuccess('Slot created successfully!');
      setSlotForm({
        slotName: '',
        slotDate: '',
        startTime: '',
        endTime: '',
        maxCapacity: 20,
        pricePerPerson: 50,
        description: ''
      });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create slot');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
        <button
          className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('photos')}
        >
          Wildlife Photos
        </button>
        <button
          className={`btn ${activeTab === 'rates' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rates')}
        >
          Booking Rates
        </button>
        <button
          className={`btn ${activeTab === 'slots' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('slots')}
        >
          Safari Slots
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {activeTab === 'bookings' && (
            <div>
              <h3>All Bookings ({bookings.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Safari</th>
                      <th>Date</th>
                      <th>Persons</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.userName}</td>
                        <td>{booking.slotName}</td>
                        <td>{formatDate(booking.slotDate)}</td>
                        <td>{booking.numberOfPersons}</td>
                        <td>${booking.totalAmount.toFixed(2)}</td>
                        <td>
                          <span className={`badge badge-${booking.bookingStatus === 'Confirmed' ? 'success' : 'warning'}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${booking.paymentStatus === 'Completed' ? 'success' : 'danger'}`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <h3>Wildlife Photos</h3>
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h4>Add New Photo</h4>
                <form onSubmit={handleCreatePhoto}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={photoForm.title}
                      onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={photoForm.description}
                      onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                      rows={3}
                      placeholder="Enter photo description"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Photo File (JPEG, PNG, GIF - Max 5MB)</label>
                    <input
                      type="file"
                      id="imageFile"
                      className="form-control"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            setError('File size must not exceed 5MB');
                            e.target.value = '';
                            return;
                          }
                          setPhotoFile(file);
                        }
                      }}
                      required
                    />
                  </div>
                  {photoFile && (
                    <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                      <small>Selected: {photoFile.name} ({(photoFile.size / 1024).toFixed(2)} KB)</small>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                      placeholder="e.g., Tiger, Elephant, Birds"
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={photoForm.displayOrder}
                      onChange={(e) => setPhotoForm({ ...photoForm, displayOrder: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Upload Photo</button>
                </form>
              </div>

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
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>
                        {photo.hasImageData ? `File: ${photo.fileName}` : 'URL-based image'}
                      </p>
                      <button
                        className="btn btn-danger"
                        style={{ marginTop: '0.5rem', width: '100%' }}
                        onClick={() => handleDeletePhoto(photo.photoId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rates' && (
            <div>
              <h3>Booking Rates</h3>
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h4>Add New Rate</h4>
                <form onSubmit={handleCreateRate}>
                  <div className="form-group">
                    <label>Rate Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={rateForm.rateName}
                      onChange={(e) => setRateForm({ ...rateForm, rateName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Base Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={rateForm.basePrice}
                      onChange={(e) => setRateForm({ ...rateForm, basePrice: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={rateForm.description}
                      onChange={(e) => setRateForm({ ...rateForm, description: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Rate</button>
                </form>
              </div>

              {rates.map((rate) => (
                <div key={rate.rateId} className="card">
                  <h4>{rate.rateName}</h4>
                  <p><strong>Price:</strong> ${rate.basePrice}</p>
                  <p>{rate.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'slots' && (
            <div>
              <h3>Safari Slots</h3>
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h4>Create New Slot</h4>
                <form onSubmit={handleCreateSlot}>
                  <div className="form-group">
                    <label>Slot Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={slotForm.slotName}
                      onChange={(e) => setSlotForm({ ...slotForm, slotName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={slotForm.slotDate}
                      onChange={(e) => setSlotForm({ ...slotForm, slotDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={slotForm.startTime}
                      onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={slotForm.endTime}
                      onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={slotForm.maxCapacity}
                      onChange={(e) => setSlotForm({ ...slotForm, maxCapacity: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price per Person</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={slotForm.pricePerPerson}
                      onChange={(e) => setSlotForm({ ...slotForm, pricePerPerson: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={slotForm.description}
                      onChange={(e) => setSlotForm({ ...slotForm, description: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Slot</button>
                </form>
              </div>

              {slots.map((slot) => (
                <div key={slot.slotId} className="card">
                  <h4>{slot.slotName}</h4>
                  <p><strong>Date:</strong> {formatDate(slot.slotDate)}</p>
                  <p><strong>Capacity:</strong> {slot.bookedCapacity} / {slot.maxCapacity}</p>
                  <p><strong>Price:</strong> ${slot.pricePerPerson}</p>
                  <p>{slot.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
