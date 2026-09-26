import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsapp: { type: String, required: true },
  college: { type: String, required: true },
  email: { type: String, default: '' },
  projectDescription: { type: String, default: '' },
  referralCode: { type: String, default: '' },
  referralOptIn: { type: Boolean, default: false },
  plan: { 
    type: String, 
    enum: ['', 'Basic Project', 'Priority Project', 'Complete Project Package'],
    default: '' 
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
