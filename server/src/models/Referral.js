import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

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
    default: 'pending'
  },
  rewardAmount: {
    type: Number,
    default: 0
  },
  purchaseAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },

  // Audit log history of status updates
  statusHistory: {
    type: [statusHistorySchema],
    default: []
  }
}, {
  timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
