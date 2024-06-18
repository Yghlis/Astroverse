

const CharacterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  universe: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const CharacterMongo = mongoose.model('Character', CharacterSchema);

export default CharacterMongo;
