import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  school: { type: String },
  branch: { type: String },
  domain: { type: String, required: true },
  idea: { type: String, required: true }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
