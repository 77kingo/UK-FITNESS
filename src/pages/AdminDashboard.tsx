import React, { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { Plus, Users, Calendar, PlusCircle, Check, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ClassType } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    classTypes,
    scheduleSlots,
    error,
    fetchClassTypes,
    fetchScheduleSlots,
    adminAddClassType,
    adminAddScheduleSlot,
  } = useBookingStore();

  // Tab State: 'classes' vs 'schedule'
  const [activeTab, setActiveTab] = useState<'classes' | 'schedule'>('classes');

  // Form State: Add Class Type
  const [className, setClassName] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [classCategory, setClassCategory] = useState('HIIT');
  const [classDuration, setClassDuration] = useState(45);
  const [classCapacity, setClassCapacity] = useState(20);
  const [classImgUrl, setClassImgUrl] = useState('');

  // Form State: Add Schedule Slot
  const [selectedClassTypeId, setSelectedClassTypeId] = useState('');
  const [trainerId, setTrainerId] = useState('trainer-1');
  const [trainerName, setTrainerName] = useState('Sarah Jenkins');
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [roomNumber, setRoomNumber] = useState('Studio A');

  // Feedback states
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClassTypes();
    fetchScheduleSlots();
  }, [fetchClassTypes, fetchScheduleSlots]);

  // Set default class type select on classTypes load
  useEffect(() => {
    if (classTypes.length > 0 && !selectedClassTypeId) {
      setSelectedClassTypeId(classTypes[0].id);
    }
  }, [classTypes, selectedClassTypeId]);

  const trainers = [
    { id: 'trainer-1', name: 'Sarah Jenkins' },
    { id: 'trainer-2', name: 'Marcus Vance' },
    { id: 'trainer-3', name: 'Elena Rostova' },
  ];

  const handleAddClassTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    if (!className || !classDesc) {
      setActionError('Please fill in Class Name and Description.');
      setSubmitting(false);
      return;
    }

    const payload: Omit<ClassType, 'id'> = {
      name: className,
      description: classDesc,
      category: classCategory,
      durationMinutes: Number(classDuration),
      capacity: Number(classCapacity),
      imageUrl: classImgUrl || '',
    };

    const success = await adminAddClassType(payload);
    setSubmitting(false);
    if (success) {
      setActionSuccess(`Class Type "${className}" added successfully.`);
      // Reset inputs
      setClassName('');
      setClassDesc('');
      setClassDuration(45);
      setClassCapacity(20);
      setClassImgUrl('');
    } else {
      setActionError('Failed to add Class Type.');
    }
  };

  const handleAddScheduleSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);

    if (!selectedClassTypeId || !slotDate || !slotTime) {
      setActionError('Please select a Class, Date, and Start Time.');
      setSubmitting(false);
      return;
    }

    // Combine date and time
    const startDateTime = new Date(`${slotDate}T${slotTime}`);
    const selectedClass = classTypes.find((c) => c.id === selectedClassTypeId);
    if (!selectedClass) {
      setActionError('Invalid Class Type selected.');
      setSubmitting(false);
      return;
    }

    // End time = start time + duration
    const endDateTime = new Date(startDateTime.getTime() + selectedClass.durationMinutes * 60 * 1000);

    const payload = {
      classTypeId: selectedClassTypeId,
      trainerId,
      trainerName,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      roomNumber,
    };

    const success = await adminAddScheduleSlot(payload);
    setSubmitting(false);
    if (success) {
      setActionSuccess(`Slot scheduled successfully on ${slotDate} at ${slotTime}.`);
      setSlotDate('');
      setSlotTime('');
    } else {
      setActionError('Failed to schedule class slot.');
    }
  };

  const totalBookingsCount = scheduleSlots.reduce((acc, curr) => acc + curr.currentOccupancy, 0);
  const totalCapacityCount = scheduleSlots.reduce((acc, curr) => {
    return acc + (curr.classType ? curr.classType.capacity : 0);
  }, 0);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <section className="border-b border-gray-900 pb-8">
        <span className="text-brand-neon text-sm font-extrabold uppercase tracking-widest">MANAGEMENT HUB</span>
        <h1 className="text-4xl font-extrabold text-white mt-1 uppercase tracking-tight">ADMIN CONTROL PANEL</h1>
        <p className="text-gray-400 text-sm mt-1">Configure class inventory, schedule new daily sessions, and review occupancy stats.</p>
      </section>

      {/* Metrics Summary Rows */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6" aria-label="Occupancy Statistics">
        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-brand-neon/10 border border-brand-neon/15 flex items-center justify-center text-brand-neon">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Total Bookings</div>
            <div className="text-white text-2xl font-black mt-0.5">{totalBookingsCount}</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/15 flex items-center justify-center text-teal-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Scheduled Slots</div>
            <div className="text-white text-2xl font-black mt-0.5">{scheduleSlots.length}</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-400">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Overall Occupancy</div>
            <div className="text-white text-2xl font-black mt-0.5">
              {totalCapacityCount > 0 ? `${Math.round((totalBookingsCount / totalCapacityCount) * 100)}%` : '0%'}
            </div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {actionSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3">
          <Check className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{actionSuccess}</span>
        </div>
      )}
      {(actionError || error) && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{actionError || error}</span>
        </div>
      )}

      {/* Control Tabs */}
      <div className="border-b border-gray-900 flex gap-6">
        <button
          onClick={() => {
            setActiveTab('classes');
            setActionSuccess(null);
            setActionError(null);
          }}
          className={`pb-4 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'classes' ? 'text-brand-neon border-brand-neon' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Add Class Type
        </button>
        <button
          onClick={() => {
            setActiveTab('schedule');
            setActionSuccess(null);
            setActionError(null);
          }}
          className={`pb-4 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'schedule' ? 'text-brand-neon border-brand-neon' : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Schedule a Slot
        </button>
      </div>

      {/* Tab Contents */}
      <section className="glass-card p-6 md:p-8 rounded-2xl max-w-2xl border border-gray-900">
        {activeTab === 'classes' ? (
          /* Add Class Type Form */
          <form onSubmit={handleAddClassTypeSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Create New Class Type</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="class-name">
                  Class Name *
                </label>
                <input
                  id="class-name"
                  type="text"
                  placeholder="e.g. Iron Hypertrophy"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="class-category">
                  Category
                </label>
                <select
                  id="class-category"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:outline-none"
                  value={classCategory}
                  onChange={(e) => setClassCategory(e.target.value)}
                >
                  <option value="HIIT">HIIT</option>
                  <option value="Strength">Strength</option>
                  <option value="Yoga">Yoga</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="class-desc">
                Description *
              </label>
              <textarea
                id="class-desc"
                placeholder="Describe the class format, key moves, and target recovery profile."
                rows={3}
                className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                value={classDesc}
                onChange={(e) => setClassDesc(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="class-duration">
                  Duration (Minutes)
                </label>
                <input
                  id="class-duration"
                  type="number"
                  min="15"
                  max="180"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={classDuration}
                  onChange={(e) => setClassDuration(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="class-capacity">
                  Max Capacity (Attendees)
                </label>
                <input
                  id="class-capacity"
                  type="number"
                  min="1"
                  max="100"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={classCapacity}
                  onChange={(e) => setClassCapacity(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="class-img">
                Image Asset URL (Optional)
              </label>
              <input
                id="class-img"
                type="text"
                placeholder="e.g. /assets/class_custom.jpg"
                className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                value={classImgUrl}
                onChange={(e) => setClassImgUrl(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto" isLoading={submitting}>
              <Plus className="h-4 w-4 mr-2" />
              <span>Create Class Type</span>
            </Button>
          </form>
        ) : (
          /* Add Schedule Slot Form */
          <form onSubmit={handleAddScheduleSlotSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Schedule Class Instance</h2>

            <div>
              <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="slot-class-select">
                Select Class *
              </label>
              <select
                id="slot-class-select"
                className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:outline-none"
                value={selectedClassTypeId}
                onChange={(e) => setSelectedClassTypeId(e.target.value)}
                required
              >
                {classTypes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category} - {c.durationMinutes} mins)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="slot-trainer">
                  Assigned Trainer
                </label>
                <select
                  id="slot-trainer"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:outline-none"
                  value={trainerId}
                  onChange={(e) => {
                    setTrainerId(e.target.value);
                    const name = trainers.find((t) => t.id === e.target.value)?.name || 'Elite Trainer';
                    setTrainerName(name);
                  }}
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="slot-room">
                  Studio Room Location
                </label>
                <input
                  id="slot-room"
                  type="text"
                  placeholder="e.g. Studio A - Volt Ring"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="slot-date">
                  Start Date *
                </label>
                <input
                  id="slot-date"
                  type="date"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-2" htmlFor="slot-time">
                  Start Time *
                </label>
                <input
                  id="slot-time"
                  type="time"
                  className="w-full bg-brand-dark border border-gray-800 rounded-md py-2.5 px-4 text-white text-sm focus:border-brand-neon focus:ring-1 focus:ring-brand-neon focus:outline-none"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto" isLoading={submitting}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>Schedule Slot</span>
            </Button>
          </form>
        )}
      </section>
    </div>
  );
};
