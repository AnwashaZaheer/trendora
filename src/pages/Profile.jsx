import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { User, ShoppingBag, MapPin, Settings, Calendar, Info } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders' or 'details'

  // Update profile states
  const [profileForm, setProfileForm] = useState({
    firstname: user?.name?.firstname || '',
    lastname: user?.name?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.address?.city || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    zipcode: user?.address?.zipcode || '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      updateProfile({
        email: profileForm.email,
        phone: profileForm.phone,
        name: {
          firstname: profileForm.firstname,
          lastname: profileForm.lastname
        },
        address: {
          city: profileForm.city,
          street: profileForm.street,
          number: parseInt(profileForm.number) || 0,
          zipcode: profileForm.zipcode
        }
      });
      setLoading(false);
      showToast('Profile updated successfully!', 'success');
    }, 1000);
  };

  const orderHistory = user?.orderHistory || [];

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* User Sidebar Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm text-center space-y-4">
            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center border border-brand-200/50 rounded-full mx-auto uppercase text-2xl font-extrabold">
              {user?.name?.firstname[0]}
              {user?.name?.lastname[0]}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                {user?.name?.firstname} {user?.name?.lastname}
              </h3>
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">@{user?.username}</p>
            </div>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-50 dark:border-slate-800/50 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveSubTab('orders')}
                className={`py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 ${
                  activeSubTab === 'orders'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Order History
              </button>
              <button
                onClick={() => setActiveSubTab('details')}
                className={`py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 ${
                  activeSubTab === 'details'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4" /> Account Details
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="md:col-span-3">
          {activeSubTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                Order History ({orderHistory.length})
              </h2>

              {orderHistory.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl text-center space-y-4">
                  <p className="text-slate-400 text-sm">You haven't placed any orders yet.</p>
                  <Button variant="secondary" onClick={() => window.location.href = '/products'}>
                    Shop Our Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4 text-sm"
                    >
                      {/* Order Header Summary */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/50">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Order ID: {order.orderId}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5" /> Ordered on {order.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="success">{order.status}</Badge>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 text-base">{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Items thumbnails in order */}
                      <div className="flex flex-wrap gap-4 pt-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl max-w-xs w-full border border-slate-100 dark:border-slate-850">
                            <img src={item.image} alt={item.title} className="w-10 h-10 object-contain bg-white border p-1 rounded-lg shrink-0" />
                            <div className="min-w-0 flex-grow text-xs">
                              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                              <p className="text-slate-400 mt-0.5">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'details' && (
            <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                Profile Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  id="firstname"
                  name="firstname"
                  value={profileForm.firstname}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  id="lastname"
                  name="lastname"
                  value={profileForm.lastname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone Number"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleInputChange}
                />
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" /> Shipping Address
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Street Address"
                    id="street"
                    name="street"
                    value={profileForm.street}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Input
                    label="Number"
                    id="number"
                    name="number"
                    value={profileForm.number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  id="city"
                  name="city"
                  value={profileForm.city}
                  onChange={handleInputChange}
                />
                <Input
                  label="Zipcode"
                  id="zipcode"
                  name="zipcode"
                  value={profileForm.zipcode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" loading={loading} className="px-6 shadow-lg shadow-brand-500/25">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
