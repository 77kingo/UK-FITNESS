export type UserRole = 'member' | 'trainer' | 'admin';
export type MembershipStatus = 'inactive' | 'active' | 'suspended' | 'cancelled';
export type BookingStatus = 'booked' | 'attended' | 'cancelled' | 'no_show';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  tierName: string;
  status: MembershipStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
}

export interface ClassType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  capacity: number;
  imageUrl: string;
  category: string;
}

export interface ScheduleSlot {
  id: string;
  classTypeId: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  roomNumber?: string;
  currentOccupancy: number;
  classType?: ClassType;
  trainerName?: string;
}

export interface Booking {
  id: string;
  userId: string;
  scheduleSlotId: string;
  status: BookingStatus;
  createdAt: string;
  scheduleSlot?: ScheduleSlot;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}
