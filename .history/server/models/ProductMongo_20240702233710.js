import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discounted_price: { type: Number, required: false },
  is_promotion: { type: Boolean, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  number_of_purchases: { type: Number, default: 0 },
  number_of_favorites: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  characterId: { type: String, required: true },
  universeId: { type: String, required: true },
  reference: { type: String, required: false },
  tags: { type: [String], required: false },
  availability_status: { type: String, required: true },
  views_count: { type: Number, default: 0 },
  image_preview: { type: String, required: false },
  image_gallery: { type: [String], required: false }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const ProductMongo = mongoose.model('Product', productSchema);

export default ProductMongo;
