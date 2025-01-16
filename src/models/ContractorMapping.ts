import mongoose from 'mongoose';

const ContractorMappingSchema = new mongoose.Schema({
  contractorId: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
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
ContractorMappingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create a compound unique index
ContractorMappingSchema.index({ contractorId: 1 }, { unique: true });

export const ContractorMapping = mongoose.models.ContractorMapping || 
  mongoose.model('ContractorMapping', ContractorMappingSchema); 