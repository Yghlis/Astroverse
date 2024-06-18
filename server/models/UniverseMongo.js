import mongoose from 'mongoose';

const UniverseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  color1: { type: String, required: true },
  color2: { type: String, required: true },
  colorText: { type: String, required: true },
  link: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const UniverseMongo = mongoose.model('Universe', UniverseSchema);

export default UniverseMongo;
