import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String }
}, {
  timestamps: true
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;
