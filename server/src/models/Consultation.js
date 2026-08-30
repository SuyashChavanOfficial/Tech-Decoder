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
  }
}, {
  timestamps: true
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
