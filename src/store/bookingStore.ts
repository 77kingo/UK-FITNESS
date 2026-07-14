import { create } from 'zustand';
import { ClassType, ScheduleSlot, Booking } from '../types';
import { supabase, isMockMode } from '../lib/supabaseClient';

interface BookingState {
  classTypes: ClassType[];
  scheduleSlots: ScheduleSlot[];
  userBookings: Booking[];
  loading: boolean;
  error: string | null;
  
  // Database actions
  fetchClassTypes: () => Promise<void>;
  fetchScheduleSlots: () => Promise<void>;
  fetchUserBookings: (userId: string) => Promise<void>;
  
  // Booking operations
  createBooking: (userId: string, slotId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  cancelBookingBySlot: (userId: string, slotId: string) => Promise<boolean>;
  
  // Admin actions
  adminAddClassType: (classType: Omit<ClassType, 'id'>) => Promise<boolean>;
  adminAddScheduleSlot: (slot: Omit<ScheduleSlot, 'id' | 'currentOccupancy'>) => Promise<boolean>;
}

// Local mock storage keys
const MOCK_CLASSES_KEY = 'uk_fitness_mock_classes';
const MOCK_SLOTS_KEY = 'uk_fitness_mock_slots';
const MOCK_BOOKINGS_KEY = 'uk_fitness_mock_bookings';

const DEFAULT_CLASSES: ClassType[] = [
  {
    id: 'class-1',
    name: 'VOLT CONDITIONING',
    category: 'HIIT',
    description: 'A high-energy interval training class combining cardio, battle ropes, and kettlebells to push your limits and burn maximum calories.',
    durationMinutes: 45,
    capacity: 20,
    imageUrl: '/assets/class_hiit.jpg',
  },
  {
    id: 'class-2',
    name: 'ZEN MOBILITY FLOW',
    category: 'Yoga',
    description: 'A calming yet challenging dynamic flow targeting recovery, mobility, core alignment, and breathwork to destress and restore.',
    durationMinutes: 60,
    capacity: 15,
    imageUrl: '/assets/class_yoga.jpg',
  },
  {
    id: 'class-3',
    name: 'APEX POWER BUILD',
    category: 'Strength',
    description: 'Focus on compound strength movements (deadlifts, squats, and presses). Ideal for muscle development, form correction, and power output.',
    durationMinutes: 50,
    capacity: 12,
    imageUrl: '', // Will use a default gradient overlay
  }
];

// Helper to generate dynamic slot dates (today, tomorrow, next few days)
const getFutureDate = (daysAhead: number, hours: number, minutes = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const DEFAULT_SLOTS: ScheduleSlot[] = [
  // Today's classes
  {
    id: 'slot-1',
    classTypeId: 'class-1',
    trainerId: 'trainer-1',
    trainerName: 'Sarah Jenkins',
    startTime: getFutureDate(0, 7, 0), // 7:00 AM today
    endTime: getFutureDate(0, 7, 45),
    roomNumber: 'Studio A - Red Zone',
    currentOccupancy: 8,
  },
  {
    id: 'slot-2',
    classTypeId: 'class-3',
    trainerId: 'trainer-2',
    trainerName: 'Marcus Vance',
    startTime: getFutureDate(0, 12, 0), // 12:00 PM today
    endTime: getFutureDate(0, 12, 50),
    roomNumber: 'Iron Room 2',
    currentOccupancy: 12, // Full
  },
  {
    id: 'slot-3',
    classTypeId: 'class-2',
    trainerId: 'trainer-3',
    trainerName: 'Elena Rostova',
    startTime: getFutureDate(0, 18, 30), // 6:30 PM today
    endTime: getFutureDate(0, 19, 30),
    roomNumber: 'Mind & Body Sanctuary',
    currentOccupancy: 5,
  },
  // Tomorrow's classes
  {
    id: 'slot-4',
    classTypeId: 'class-1',
    trainerId: 'trainer-1',
    trainerName: 'Sarah Jenkins',
    startTime: getFutureDate(1, 9, 30),
    endTime: getFutureDate(1, 10, 15),
    roomNumber: 'Studio A - Red Zone',
    currentOccupancy: 14,
  },
  {
    id: 'slot-5',
    classTypeId: 'class-2',
    trainerId: 'trainer-3',
    trainerName: 'Elena Rostova',
    startTime: getFutureDate(1, 17, 0),
    endTime: getFutureDate(1, 18, 0),
    roomNumber: 'Mind & Body Sanctuary',
    currentOccupancy: 3,
  },
  // Day after tomorrow
  {
    id: 'slot-6',
    classTypeId: 'class-3',
    trainerId: 'trainer-2',
    trainerName: 'Marcus Vance',
    startTime: getFutureDate(2, 6, 30),
    endTime: getFutureDate(2, 7, 20),
    roomNumber: 'Iron Room 2',
    currentOccupancy: 2,
  }
];

export const useBookingStore = create<BookingState>((set, get) => ({
  classTypes: [],
  scheduleSlots: [],
  userBookings: [],
  loading: false,
  error: null,

  fetchClassTypes: async () => {
    set({ loading: true, error: null });
    
    if (isMockMode) {
      const stored = localStorage.getItem(MOCK_CLASSES_KEY);
      const classes = stored ? JSON.parse(stored) : DEFAULT_CLASSES;
      if (!stored) localStorage.setItem(MOCK_CLASSES_KEY, JSON.stringify(DEFAULT_CLASSES));
      set({ classTypes: classes, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase.from('class_types').select('*');
      if (error) throw error;
      set({ classTypes: data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchScheduleSlots: async () => {
    set({ loading: true, error: null });

    if (isMockMode) {
      const stored = localStorage.getItem(MOCK_SLOTS_KEY);
      const slots = stored ? JSON.parse(stored) : DEFAULT_SLOTS;
      if (!stored) localStorage.setItem(MOCK_SLOTS_KEY, JSON.stringify(DEFAULT_SLOTS));
      
      // Resolve class types nested object
      const resolvedSlots = slots.map((s: any) => {
        const cls = get().classTypes.find(c => c.id === s.classTypeId);
        return { ...s, classType: cls };
      });

      set({ scheduleSlots: resolvedSlots, loading: false });
      return;
    }

    try {
      // Fetch slot join with class details
      const { data, error } = await supabase
        .from('schedule_slots')
        .select(`
          *,
          classType:class_types(*)
        `);
      if (error) throw error;

      // Map snake_case to camelCase
      const formatted = (data || []).map((s: any) => ({
        id: s.id,
        classTypeId: s.class_type_id,
        trainerId: s.trainer_id,
        startTime: s.start_time,
        endTime: s.end_time,
        roomNumber: s.room_number,
        currentOccupancy: s.current_occupancy,
        classType: s.classType,
        trainerName: 'Elite Coach', // Fallback or joined profile details
      }));

      set({ scheduleSlots: formatted, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchUserBookings: async (userId) => {
    set({ loading: true, error: null });

    if (isMockMode) {
      const stored = localStorage.getItem(MOCK_BOOKINGS_KEY);
      const bookings: Booking[] = stored ? JSON.parse(stored) : [];
      const userBookings = bookings
        .filter(b => b.userId === userId)
        .map(b => {
          const slot = get().scheduleSlots.find(s => s.id === b.scheduleSlotId);
          return { ...b, scheduleSlot: slot };
        });
      set({ userBookings, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          schedule_slot:schedule_slots(
            *,
            class_type:class_types(*)
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;

      const formatted = (data || []).map((b: any) => {
        const slot = b.schedule_slot;
        const cls = slot?.class_type;
        return {
          id: b.id,
          userId: b.user_id,
          scheduleSlotId: b.schedule_slot_id,
          status: b.status,
          createdAt: b.created_at,
          scheduleSlot: slot ? {
            id: slot.id,
            classTypeId: slot.class_type_id,
            trainerId: slot.trainer_id,
            startTime: slot.start_time,
            endTime: slot.end_time,
            roomNumber: slot.room_number,
            currentOccupancy: slot.current_occupancy,
            classType: cls,
          } : undefined
        };
      });

      set({ userBookings: formatted, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createBooking: async (userId, slotId) => {
    set({ error: null });

    // Validate occupancy
    const slots = get().scheduleSlots;
    const slotIndex = slots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) return false;
    const targetSlot = slots[slotIndex];
    if (targetSlot.classType && targetSlot.currentOccupancy >= targetSlot.classType.capacity) {
      set({ error: 'Class is already at maximum capacity.' });
      return false;
    }

    if (isMockMode) {
      // Check duplicate
      const storedBookings = localStorage.getItem(MOCK_BOOKINGS_KEY);
      const bookings: Booking[] = storedBookings ? JSON.parse(storedBookings) : [];
      const duplicate = bookings.some(b => b.userId === userId && b.scheduleSlotId === slotId);
      if (duplicate) {
        set({ error: 'You are already registered for this class.' });
        return false;
      }

      // Add Booking
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        userId,
        scheduleSlotId: slotId,
        status: 'booked',
        createdAt: new Date().toISOString(),
      };
      bookings.push(newBooking);
      localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));

      // Increment occupancy in local state slots
      const storedSlots = JSON.parse(localStorage.getItem(MOCK_SLOTS_KEY) || '[]');
      const localSlotIdx = storedSlots.findIndex((s: any) => s.id === slotId);
      if (localSlotIdx !== -1) {
        storedSlots[localSlotIdx].currentOccupancy += 1;
        localStorage.setItem(MOCK_SLOTS_KEY, JSON.stringify(storedSlots));
      }

      // Sync state
      await get().fetchScheduleSlots();
      await get().fetchUserBookings(userId);
      return true;
    }

    try {
      // 1. Insert booking record
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          schedule_slot_id: slotId,
        });
      
      if (insertError) throw insertError;

      // 2. Increment occupancy on slot
      const { error: updateError } = await supabase
        .from('schedule_slots')
        .update({ current_occupancy: targetSlot.currentOccupancy + 1 })
        .eq('id', slotId);

      if (updateError) throw updateError;

      // Sync state
      await get().fetchScheduleSlots();
      await get().fetchUserBookings(userId);
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  cancelBooking: async (bookingId) => {
    set({ error: null });
    const userB = get().userBookings.find(b => b.id === bookingId);
    if (!userB) return false;
    const slotId = userB.scheduleSlotId;

    if (isMockMode) {
      const stored = localStorage.getItem(MOCK_BOOKINGS_KEY);
      const bookings: Booking[] = stored ? JSON.parse(stored) : [];
      const filtered = bookings.filter(b => b.id !== bookingId);
      localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(filtered));

      // Decrement slot occupancy
      const storedSlots = JSON.parse(localStorage.getItem(MOCK_SLOTS_KEY) || '[]');
      const localSlotIdx = storedSlots.findIndex((s: any) => s.id === slotId);
      if (localSlotIdx !== -1 && storedSlots[localSlotIdx].currentOccupancy > 0) {
        storedSlots[localSlotIdx].currentOccupancy -= 1;
        localStorage.setItem(MOCK_SLOTS_KEY, JSON.stringify(storedSlots));
      }

      // Sync state
      await get().fetchScheduleSlots();
      if (userB.userId) {
        await get().fetchUserBookings(userB.userId);
      }
      return true;
    }

    try {
      // 1. Delete booking record
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      
      if (deleteError) throw deleteError;

      // 2. Decrement occupancy on slot
      const slot = get().scheduleSlots.find(s => s.id === slotId);
      if (slot && slot.currentOccupancy > 0) {
        const { error: updateError } = await supabase
          .from('schedule_slots')
          .update({ current_occupancy: slot.currentOccupancy - 1 })
          .eq('id', slotId);

        if (updateError) throw updateError;
      }

      // Sync state
      await get().fetchScheduleSlots();
      await get().fetchUserBookings(userB.userId);
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  cancelBookingBySlot: async (userId, slotId) => {
    const booking = get().userBookings.find(
      b => b.userId === userId && b.scheduleSlotId === slotId
    );
    if (!booking) return false;
    return get().cancelBooking(booking.id);
  },

  adminAddClassType: async (classType) => {
    set({ error: null });

    if (isMockMode) {
      const stored = localStorage.getItem(MOCK_CLASSES_KEY);
      const classes: ClassType[] = stored ? JSON.parse(stored) : DEFAULT_CLASSES;
      const newClass: ClassType = {
        ...classType,
        id: `class-${Date.now()}`,
      };
      classes.push(newClass);
      localStorage.setItem(MOCK_CLASSES_KEY, JSON.stringify(classes));
      await get().fetchClassTypes();
      return true;
    }

    try {
      const { error } = await supabase.from('class_types').insert({
        name: classType.name,
        description: classType.description,
        duration_minutes: classType.durationMinutes,
        capacity: classType.capacity,
        image_url: classType.imageUrl,
        category: classType.category,
      });

      if (error) throw error;
      await get().fetchClassTypes();
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  adminAddScheduleSlot: async (slot) => {
    set({ error: null });

    if (isMockMode) {
      const stored = localStorage.getItem(MOCK_SLOTS_KEY);
      const slots: ScheduleSlot[] = stored ? JSON.parse(stored) : DEFAULT_SLOTS;
      const newSlot: ScheduleSlot = {
        ...slot,
        id: `slot-${Date.now()}`,
        currentOccupancy: 0,
      };
      slots.push(newSlot);
      localStorage.setItem(MOCK_SLOTS_KEY, JSON.stringify(slots));
      await get().fetchScheduleSlots();
      return true;
    }

    try {
      const { error } = await supabase.from('schedule_slots').insert({
        class_type_id: slot.classTypeId,
        trainer_id: slot.trainerId,
        start_time: slot.startTime,
        end_time: slot.endTime,
        room_number: slot.roomNumber,
        current_occupancy: 0,
      });

      if (error) throw error;
      await get().fetchScheduleSlots();
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  }
}));
