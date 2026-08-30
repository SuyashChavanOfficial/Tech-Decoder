import mongoose from 'mongoose';

const checklistSchema = new mongoose.Schema({
  text: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  date: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'developer', 'admin'], 
    default: 'student' 
  },
  domain: { type: String, default: '' },
  avatar: { 
    type: String, 
    default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvrYQbpk584ALwTACqL9kqJYe_-m7dsiX07EqLjKmTcxjm-E7HeYIyGbB1FQewyGJZSJ92YI7o_UigaHiBQGLPKMQJQdGzMxaFUyCuVtEuEyOzttt1fIlq1lw_ARwa4O0Ut-toKk_rjE70q0fUjpjqWYLQXalPA9qLIUY4eZ5N_Kg83XSAAJ4qPfPxdZIDNHOAJBPKSIdXA0K21281IzkxPZOVyp9kVS09aO-r0KR9qIwaINcuoNe7Hwn15Mvtrmk_X9SEXopajac'
  },
  modulesCompleted: { type: Number, default: 8 },
  checklist: { 
    type: [checklistSchema], 
    default: [
      { text: 'Review System Architecture Diagram', checked: true },
      { text: 'Prepare answers for DB scaling strategies', checked: false },
      { text: 'Dry run presentation with mentor', checked: false }
    ]
  },
  referrals: { type: Number, default: 0 },
  referralCredits: { type: Number, default: 0 },
  referralCode: { type: String },
  uploadedFiles: { type: [fileSchema], default: [] },
  refreshToken: { type: String }
}, {
  timestamps: true
});

// Pre-save hook to generate unique referral code
userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referralCode = `ARCH-${randomHex}-${randomSuffix}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
