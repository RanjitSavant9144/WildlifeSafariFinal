import axios, { AxiosInstance } from 'axios';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  SafariSlot,
  CreateBookingDto,
  Booking,
  ProcessPaymentDto,
  WildlifePhoto,
  CreateWildlifePhotoDto,
  BookingRate,
  CreateBookingRateDto,
  CreateSafariSlotDto
} from '../types';

const AUTH_API_URL = 'http://localhost:5001/api';
const BOOKING_API_URL = 'http://localhost:5002/api';
const ADMIN_API_URL = 'http://localhost:5003/api';

class ApiService {
  private authApi: AxiosInstance;
  private bookingApi: AxiosInstance;
  private adminApi: AxiosInstance;

  constructor() {
    this.authApi = axios.create({ baseURL: AUTH_API_URL });
    this.bookingApi = axios.create({ baseURL: BOOKING_API_URL });
    this.adminApi = axios.create({ baseURL: ADMIN_API_URL });

    // Add token to requests
    this.setupInterceptors();
  }

  private setupInterceptors() {
    const addToken = (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    this.authApi.interceptors.request.use(addToken);
    this.bookingApi.interceptors.request.use(addToken);
    this.adminApi.interceptors.request.use(addToken);
  }

  // Authentication APIs
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.authApi.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.authApi.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  // Safari Slots APIs
  async getAvailableSlots(fromDate?: string): Promise<SafariSlot[]> {
    const params = fromDate ? { fromDate } : {};
    const response = await this.bookingApi.get<SafariSlot[]>('/booking/slots', { params });
    return response.data;
  }

  async getSlotById(slotId: number): Promise<SafariSlot> {
    const response = await this.bookingApi.get<SafariSlot>(`/booking/slots/${slotId}`);
    return response.data;
  }

  // Booking APIs
  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const response = await this.bookingApi.post<Booking>('/booking/create', data);
    return response.data;
  }

  async processPayment(data: ProcessPaymentDto): Promise<Booking> {
    const response = await this.bookingApi.post<Booking>('/booking/payment', data);
    return response.data;
  }

  async getUserBookings(): Promise<Booking[]> {
    const response = await this.bookingApi.get<Booking[]>('/booking/user/bookings');
    return response.data;
  }

  async getBookingById(bookingId: number): Promise<Booking> {
    const response = await this.bookingApi.get<Booking>(`/booking/bookings/${bookingId}`);
    return response.data;
  }

  async getAllBookings(): Promise<Booking[]> {
    const response = await this.bookingApi.get<Booking[]>('/booking/all');
    return response.data;
  }

  async cancelBooking(bookingId: number): Promise<Booking> {
    const response = await this.bookingApi.put<Booking>(`/booking/cancel/${bookingId}`);
    return response.data;
  }

  // Wildlife Photos APIs
  async getAllPhotos(): Promise<WildlifePhoto[]> {
    const response = await this.adminApi.get<WildlifePhoto[]>('/admin/photos');
    return response.data;
  }

  getPhotoImageUrl(photoId: number): string {
    return `${ADMIN_API_URL}/admin/photos/${photoId}/image`;
  }

  async createPhoto(data: CreateWildlifePhotoDto, imageFile: File): Promise<WildlifePhoto> {
    const formData = new FormData();
    formData.append('Title', data.title || '');
    formData.append('Description', data.description || '');
    formData.append('Category', data.category || '');
    formData.append('DisplayOrder', (data.displayOrder || 0).toString());
    formData.append('ImageFile', imageFile);

    const response = await this.adminApi.post<WildlifePhoto>('/admin/photos', formData);
    return response.data;
  }

  async updatePhoto(photoId: number, data: CreateWildlifePhotoDto, imageFile?: File): Promise<WildlifePhoto> {
    const formData = new FormData();
    formData.append('Title', data.title || '');
    formData.append('Description', data.description || '');
    formData.append('Category', data.category || '');
    formData.append('DisplayOrder', (data.displayOrder || 0).toString());
    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }

    const response = await this.adminApi.put<WildlifePhoto>(`/admin/photos/${photoId}`, formData);
    return response.data;
  }

  async deletePhoto(photoId: number): Promise<void> {
    await this.adminApi.delete(`/admin/photos/${photoId}`);
  }

  // Booking Rates APIs
  async getAllRates(): Promise<BookingRate[]> {
    const response = await this.adminApi.get<BookingRate[]>('/admin/rates');
    return response.data;
  }

  async createRate(data: CreateBookingRateDto): Promise<BookingRate> {
    const response = await this.adminApi.post<BookingRate>('/admin/rates', data);
    return response.data;
  }

  async updateRate(rateId: number, data: CreateBookingRateDto): Promise<BookingRate> {
    const response = await this.adminApi.put<BookingRate>(`/admin/rates/${rateId}`, data);
    return response.data;
  }

  // Admin Safari Slots APIs
  async createSlot(data: CreateSafariSlotDto): Promise<SafariSlot> {
    const response = await this.adminApi.post<SafariSlot>('/admin/slots', data);
    return response.data;
  }

  async updateSlot(slotId: number, data: CreateSafariSlotDto): Promise<SafariSlot> {
    const response = await this.adminApi.put<SafariSlot>(`/admin/slots/${slotId}`, data);
    return response.data;
  }

  async deleteSlot(slotId: number): Promise<void> {
    await this.adminApi.delete(`/admin/slots/${slotId}`);
  }
}

export default new ApiService();
