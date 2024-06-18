import mongoose from 'mongoose';

const UniverseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const UniverseMongo = mongoose.model('Universesss', UniverseSchema);

export default UniverseMongo;
