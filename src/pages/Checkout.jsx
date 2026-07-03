import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Checkout() {
  const { cart, cartSubtotal, cartTax, cartShipping, clearCart } = useCart();
  const { user, addOrderToHistory } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load discount percentage from local storage if available
  const [discountPercent, setDiscountPercent] = useState(0);
  useEffect(() => {
    const savedDiscount = localStorage.getItem('trendora_applied_discount');
    if (savedDiscount) {
      setDiscountPercent(JSON.parse(savedDiscount));
    }
  }, []);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Form fields states
  const [shippingForm, setShippingForm] = useState({
    firstname: user?.name?.firstname || '',
    lastname: user?.name?.lastname || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    city: user?.address?.city || '',
    zipcode: user?.address?.zipcode || '',
    phone: user?.phone || '',
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: `${user?.name?.firstname || ''} ${user?.name?.lastname || ''}`.trim(),
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculations
  const discountAmount = cartSubtotal * discountPercent;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + cartTax + cartShipping);

  // Auto redirect if cart is empty and not on success step
  useEffect(() => {
    if (cart.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [cart, step, navigate]);

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Shipping submission
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!shippingForm.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!shippingForm.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!shippingForm.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingForm.city.trim()) newErrors.city = 'City is required';
    if (!shippingForm.zipcode.trim()) newErrors.zipcode = 'Zipcode is required';
    if (!shippingForm.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fill out all shipping fields.', 'error');
      return;
    }

    setStep(2);
    setErrors({});
  };

  // Payment/Order submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic regex checks for card inputs
    const cardNumClean = paymentForm.cardNumber.replace(/\s+/g, '');
    if (cardNumClean.length < 15 || cardNumClean.length > 16) {
      newErrors.cardNumber = 'Enter a valid 15 or 16 digit card number';
    }
    if (!paymentForm.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) {
      newErrors.expiry = 'Expiry format must be MM/YY';
    }
    if (paymentForm.cvv.length < 3 || paymentForm.cvv.length > 4) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the payment form fields.', 'error');
      return;
    }

    setLoading(true);
    // Simulate transaction delay
    setTimeout(() => {
      // Record order details
      const order = {
        orderId: `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: shippingForm,
        subtotal: cartSubtotal,
        discount: discountAmount,
        tax: cartTax,
        shippingCost: cartShipping,
        total: finalTotal,
        status: 'Processing'
      };

      addOrderToHistory(order);
      clearCart();
      localStorage.removeItem('trendora_applied_discount');
      
      setStep(3);
      setLoading(false);
      showToast('Payment successful! Your order has been placed.', 'success');
    }, 1500);
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
      {step < 3 ? (
        <div className="space-y-8">
          {/* Header Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Checkout</h1>
            
            {/* Steps indicator tabs */}
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className={step === 1 ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>1. Shipping Info</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step === 2 ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>2. Payment details</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Steps Forms wizard */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <form onSubmit={handleShippingSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Shipping Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      id="firstname"
                      name="firstname"
                      value={shippingForm.firstname}
                      onChange={handleShippingChange}
                      error={errors.firstname}
                      required
                    />
                    <Input
                      label="Last Name"
                      id="lastname"
                      name="lastname"
                      value={shippingForm.lastname}
                      onChange={handleShippingChange}
                      error={errors.lastname}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Input
                        label="Street Address"
                        id="street"
                        name="street"
                        placeholder="8685 El Camino Real"
                        value={shippingForm.street}
                        onChange={handleShippingChange}
                        error={errors.street}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Number"
                        id="number"
                        name="number"
                        placeholder="12"
                        value={shippingForm.number}
                        onChange={handleShippingChange}
                        error={errors.number}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      id="city"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      error={errors.city}
                      required
                    />
                    <Input
                      label="Zipcode"
                      id="zipcode"
                      name="zipcode"
                      value={shippingForm.zipcode}
                      onChange={handleShippingChange}
                      error={errors.zipcode}
                      required
                    />
                  </div>

                  <Input
                    label="Phone Number"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingForm.phone}
                    onChange={handleShippingChange}
                    error={errors.phone}
                    required
                  />

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" className="flex items-center gap-1.5">
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handlePaymentSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-600" /> Card Payment
                  </h3>

                  <Input
                    label="Cardholder Name"
                    id="cardName"
                    name="cardName"
                    value={paymentForm.cardName}
                    onChange={handlePaymentChange}
                    error={errors.cardName}
                    required
                  />

                  <Input
                    label="Card Number"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4111 2222 3333 4444"
                    value={paymentForm.cardNumber}
                    onChange={handlePaymentChange}
                    error={errors.cardNumber}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiration Date (MM/YY)"
                      id="expiry"
                      name="expiry"
                      placeholder="12/28"
                      value={paymentForm.expiry}
                      onChange={handlePaymentChange}
                      error={errors.expiry}
                      required
                    />
                    <Input
                      label="CVV / Security Code"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={paymentForm.cvv}
                      onChange={handlePaymentChange}
                      error={errors.cvv}
                      maxLength={4}
                      required
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl text-xs text-slate-500 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Your transaction is mock secured. No real credit card charges are processed.</span>
                  </div>

                  <div className="pt-4 border-t flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(1)} className="flex items-center gap-1.5">
                      <ChevronLeft className="w-4 h-4" /> Back to Shipping
                    </Button>
                    <Button type="submit" loading={loading} className="flex items-center gap-1.5 shadow-lg shadow-brand-500/25">
                      Confirm & Pay {formatPrice(finalTotal)}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Sticky Order Review Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Order Summary</h3>
              
              {/* Product brief lists */}
              <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 text-sm">
                    <img src={item.image} alt={item.title} className="w-10 h-10 object-contain bg-white border p-1 rounded-lg shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/50 pt-4 text-sm font-medium text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800 dark:text-slate-200">{formatPrice(cartSubtotal)}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-slate-800 dark:text-slate-200">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {cartShipping === 0 ? (
                      <span className="text-emerald-600 font-bold dark:text-emerald-400">Free</span>
                    ) : (
                      formatPrice(cartShipping)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-base font-extrabold text-slate-900 dark:text-slate-50 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span>Grand Total</span>
                <span className="text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 3: Success Screen */
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className="inline-flex bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-full text-emerald-500 mb-2 border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Order Confirmed!</h2>
            <p className="text-slate-500 text-sm">Thank you for your purchase. Your transaction completed successfully and your order is processing.</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-left space-y-1.5 text-xs text-slate-500 font-medium">
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1 text-sm">
              <span>Order Reference</span>
              <span>#{Date.now().toString().slice(-6).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span>3-5 Business Days</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Courier</span>
              <span>DHL Standard Express</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link to="/profile" className="w-full">
              <Button variant="secondary" className="w-full">
                View Order History
              </Button>
            </Link>
            <Link to="/" className="w-full">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
