import Consultation from '../models/Consultation.js';
import User from '../models/User.js';
import Referral from '../models/Referral.js';

export const createConsultation = async (req, res) => {
  try {
    const { name, whatsapp, college, email, projectDescription, referralCode, referralOptIn, plan } = req.body;

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
      referralCode: referralCode || '',
      referralOptIn: referralOptIn || false,
      plan: plan || ''
    });

    // Track this booking as a referral transaction if code is present and user opted in
    if (referralCode && referralOptIn) {
      try {
        const referrerUser = await User.findOne({ referralCode });
        const referredUser = await User.findOne({ email });

        await Referral.create({
          referrer: referrerUser ? referrerUser._id : null,
          referrerName: referrerUser ? referrerUser.name : 'Unknown Referrer',
          referrerEmail: referrerUser ? referrerUser.email : 'unknown@referrer.com',
          referrerCode: referralCode,
          referredUser: referredUser ? referredUser._id : null,
          referredName: name,
          referredEmail: email || 'unknown@referred.com',
          type: 'consultation'
        });
      } catch (refError) {
        console.error('Failed to track referral during consultation booking:', refError.message);
      }
    }

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
