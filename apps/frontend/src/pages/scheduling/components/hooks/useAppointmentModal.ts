
import { useState } from 'react';
import { format } from 'date-fns';

export const useAppointmentModal = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const clickedDateTime = new Date(date);
    clickedDateTime.setHours(hour, 0, 0, 0);
    setSelectedDate(clickedDateTime);
    setSelectedTime(format(clickedDateTime, 'HH:mm'));
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return {
    selectedDate,
    selectedTime,
    showCreateModal,
    setShowCreateModal,
    handleTimeSlotClick,
    closeModal
  };
};
