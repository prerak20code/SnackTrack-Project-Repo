import { Cart } from '../Models/index.js';
import { Snack } from '../Models/index.js';
import { PackagedFood } from '../Models/index.js';

// all the cart data will be stored in cookies locally and while placing an order the same cookies data will be fetched and the final order wiil added to db
const addToCart = async (req, res) => {
    try {
        const { productId, productType, quantity } = req.body;

        if (!productId || !productType || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!',
            });
        }

        let product;
        if (productType === 'snack') {
            product = await Snack.findById(productId);
        } else if (productType === 'packagedFood') {
            product = await PackagedFood.findById(productId);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid product type!',
            });
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found!',
            });
        }

        // Get existing cart from cookies
        let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        // Check if already in the cart
        const existingIndex = cart.findIndex(
            (item) =>
                item.productId === productId && item.productType === productType
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                productId,
                productType,
                quantity,
                price: product.price,
            });
        }

        // Store
        res.cookie('cart', JSON.stringify(cart), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
        });

        res.status(200).json({
            success: true,
            message: 'Item added to cart!',
            cart,
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to cart',
        });
    }
};

const fetchCartItems = (req, res) => {
    try {
        // Read cart from cookies
        let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        if (cart.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart is empty!',
            });
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
        });
    }
};

const updateCartItemQty = async (req, res) => {
    try {
        const { productId, productType, quantity } = req.body;

        if (!productId || !productType || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!',
            });
        }

        let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        // Find the item in the cart
        const itemIndex = cart.findIndex(
            (item) =>
                item.productId === productId && item.productType === productType
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found!',
            });
        }

        if (quantity === 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = quantity;
        }

        // Store updated cart in cookies
        res.cookie('cart', JSON.stringify(cart), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
        });

        res.status(200).json({
            success: true,
            message: 'Cart item quantity updated successfully!',
            cart,
        });
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item quantity',
        });
    }
};

const deleteCartItem = (req, res) => {
    try {
        const { productId, productType } = req.body;

        if (!productId || !productType) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and type are required!',
            });
        }

        let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        console.log('Before Deletion:', cart);

        const updatedCart = cart.filter(
            (item) =>
                !(
                    item.productId === productId &&
                    item.productType === productType
                )
        );

        console.log('After Deletion:', updatedCart);

        if (cart.length === updatedCart.length) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart!',
            });
        }

        // Update cookies
        res.cookie('cart', JSON.stringify(updatedCart), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
            sameSite: 'Strict',
        });

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: updatedCart,
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting item',
        });
    }
};

export { addToCart, fetchCartItems, updateCartItemQty, deleteCartItem };
