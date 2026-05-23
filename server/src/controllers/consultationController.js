import Consultation from '../models/Consultation.js';

export const createConsultation = async (req, res) => {
  try {
    const { name, email, timeSlot, notes } = req.body;

    if (!name || !email || !timeSlot) {
      return res.status(400).json({ message: 'Name, email, and timeslot are required.' });
    }

    const consultation = await Consultation.create({
      name,
      email,
      timeSlot,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully.',
      data: consultation
    });
  } catch (error) {
    console.error('Consultation booking failed:', error.message);
    res.status(500).json({ message: 'Server error booking consultation.' });
  }
};
