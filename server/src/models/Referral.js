import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  // Link to referrer (can be null if user is deleted)
  referrer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  // Permanent fallback records to ensure historical traceability even if users are deleted
  referrerName: { 
    type: String, 
    required: true 
  },
  referrerEmail: { 
    type: String, 
    required: true 
  },
  referrerCode: { 
    type: String, 
    required: true 
  },
  
  // Link to referred user (can be null if user is deleted)
  referredUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  referredName: { 
    type: String, 
    required: true 
  },
  referredEmail: { 
    type: String, 
    required: true 
  },
  
  type: { 
    type: String, 
    enum: ['registration', 'consultation'], 
    default: 'registration' 
  },
  
  // Financial and Payout Tracking
  status: {
    type: String,
    enum: ['pending', 'successful', 'paid', 'cancelled'],
    default: 'successful' // Default registration referrals are marked successful upon account creation
  },
  rewardAmount: {
    type: Number,
    default: 100 // Default to 100 credits/currency unit per referral payout
  },
  purchaseAmount: {
    type: Number,
    default: 0 // The purchase amount paid by the referred user (if applicable)
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
