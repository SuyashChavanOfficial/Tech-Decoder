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

export const getConsultations = async (req, res) => {
  try {
    const { search, status, plan } = req.query;

    const query = { is_deleted: { $ne: true } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (plan && plan !== 'all') {
      query.plan = plan;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { college: searchRegex },
        { whatsapp: searchRegex },
        { referralCode: searchRegex },
        { projectDescription: searchRegex }
      ];
    }

    const consultations = await Consultation.find(query).sort({ createdAt: -1 });

    // Aggregate counts across all active (non-deleted) bookings
    const activeSummary = await Consultation.aggregate([
      { $match: { is_deleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      total: 0,
      pending: 0,
      contacted: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };

    activeSummary.forEach(item => {
      const key = item._id || 'pending';
      if (stats.hasOwnProperty(key)) {
        stats[key] = item.count;
      }
      stats.total += item.count;
    });

    res.status(200).json({
      success: true,
      data: consultations,
      stats
    });
  } catch (error) {
    console.error('Failed to fetch consultations:', error.message);
    res.status(500).json({ message: 'Server error retrieving consultations.' });
  }
};

export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findOne({ _id: id, is_deleted: { $ne: true } });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation submission not found.' });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Failed to retrieve consultation details:', error.message);
    res.status(500).json({ message: 'Server error retrieving consultation details.' });
  }
};

export const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowedStatuses = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation submission not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Consultation updated successfully.',
      data: consultation
    });
  } catch (error) {
    console.error('Failed to update consultation:', error.message);
    res.status(500).json({ message: 'Server error updating consultation.' });
  }
};

export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete: mark is_deleted as true
    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true } },
      { new: true }
    );

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation submission not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Consultation deleted successfully.',
      data: consultation
    });
  } catch (error) {
    console.error('Failed to delete consultation:', error.message);
    res.status(500).json({ message: 'Server error deleting consultation.' });
  }
};

