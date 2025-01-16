import mongoose from 'mongoose';

const ContractorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps on save
ContractorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Contractor = mongoose.models.Contractor || 
  mongoose.model('Contractor', ContractorSchema); 