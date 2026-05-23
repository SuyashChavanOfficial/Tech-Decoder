import Consultation from '../models/Consultation.js';

export const createConsultation = async (req, res) => {
  try {
    const { name, whatsapp, college, email, projectDescription, referralCode } = req.body;

    if (!name || !whatsapp || !college) {
      return res.status(400).json({ message: 'Name, whatsapp, and college are required.' });
    }

    // Validation: WhatsApp must be digits only and no more than 12 digits
    const whatsappRegex = /^\d{1,12}$/;
    if (!whatsappRegex.test(whatsapp)) {
      return res.status(400).json({ 
        message: 'WhatsApp number must contain only digits and be no more than 12 digits.' 
      });
    }

    const consultation = await Consultation.create({
      name,
      whatsapp,
      college,
      email: email || '',
      projectDescription: projectDescription || '',
      referralCode: referralCode || ''
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
