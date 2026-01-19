// User and Authentication Types
export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

// Safari Slot Types
export interface SafariSlot {
  slotId: number;
  slotName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCapacity: number;
  availableCapacity: number;
  pricePerPerson: number;
  description: string;
  isActive: boolean;
}

export interface CreateSafariSlotDto {
  slotName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  pricePerPerson: number;
  description: string;
}

// Booking Types
export interface Booking {
  bookingId: number;
  userId: number;
  userName: string;
  slotId: number;
  slotName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  numberOfPersons: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentTransactionId: string;
  bookingDate: string;
  paymentDate?: string;
  specialRequests: string;
}

export interface CreateBookingDto {
  slotId: number;
  numberOfPersons: number;
  specialRequests: string;
}

export interface ProcessPaymentDto {
  bookingId: number;
  paymentMethod: string;
  cardNumber: string;
  cardHolderName: string;
}

// Wildlife Photo Types
export interface WildlifePhoto {
  photoId: number;
  title: string;
  description: string;
  imageUrl?: string;
  fileName?: string;
  imageContentType?: string;
  hasImageData: boolean;
  category: string;
  displayOrder: number;
  isActive: boolean;
  uploadedAt: string;
}

export interface CreateWildlifePhotoDto {
  title: string;
  description: string;
  category: string;
  displayOrder: number;
}

// Booking Rate Types
export interface BookingRate {
  rateId: number;
  rateName: string;
  basePrice: number;
  description: string;
  isActive: boolean;
}

export interface CreateBookingRateDto {
  rateName: string;
  basePrice: number;
  description: string;
}
