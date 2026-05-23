import Inquiry from '../models/Inquiry.js';

export const createInquiry = async (req, res) => {
  try {
    const { name, email, school, branch, domain, idea } = req.body;

    if (!name || !email || !domain || !idea) {
      return res.status(400).json({ message: 'Name, email, domain, and project idea are required.' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      school,
      branch,
      domain,
      idea
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry saved successfully.',
      data: inquiry
    });
  } catch (error) {
    console.error('Inquiry submission failed:', error.message);
    res.status(500).json({ message: 'Server error processing inquiry.' });
  }
};
