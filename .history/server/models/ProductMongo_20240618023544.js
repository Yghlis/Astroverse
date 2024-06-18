// server/models/ProductMongo.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: String,
  title: String,
  brand: String,
  price: Number,
  discounted_price: Number,
  is_promotion: Boolean,
  description: String,
  stock: Number,
  number_of_purchases: Number,
  number_of_favorites: Number,
  rating: Number,
  image_preview: String,
  image_gallery: [String],
  character: String,
  universe: {
    id: { type: String, required: true },
    name: { type: String, required: true }
},
  reference: String,
  details: mongoose.Schema.Types.Mixed,
  tags: [String],
  availability_status: String,
  views_count: Number,
  created_at: Date,
  updated_at: Date
});

const ProductMongo = mongoose.model('ProductMongo', productSchema);

export default ProductMongo;
