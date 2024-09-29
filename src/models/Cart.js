import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new mongoose.Schema({
    products: [productSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
