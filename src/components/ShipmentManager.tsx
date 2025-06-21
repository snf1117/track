
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Package } from 'lucide-react';

export const ShipmentManager = () => {
  const [newShipment, setNewShipment] = useState({
    customerEmail: '',
    itemDescription: ''
  });

  const generateTrackingNumber = () => {
    return 'TR' + Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newShipment.customerEmail && newShipment.itemDescription) {
      const trackingNumber = generateTrackingNumber();
      
      // כאן נוסיף לבסיס הנתונים
      console.log('יצירת משלוח חדש:', {
        trackingNumber,
        customerEmail: newShipment.customerEmail,
        itemDescription: newShipment.itemDescription,
        status: 'purchased',
        createdAt: new Date()
      });

      alert(`משלוח נוצר בהצלחה!\nמספר מעקב: ${trackingNumber}`);
      
      setNewShipment({
        customerEmail: '',
        itemDescription: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">יצירת משלוח חדש</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerEmail">כתובת מייל הלקוח</Label>
          <Input
            id="customerEmail"
            type="email"
            value={newShipment.customerEmail}
            onChange={(e) => setNewShipment(prev => ({ ...prev, customerEmail: e.target.value }))}
            placeholder="הכנס כתובת מייל"
            required
            dir="rtl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemDescription">תיאור הפריט</Label>
          <Input
            id="itemDescription"
            type="text"
            value={newShipment.itemDescription}
            onChange={(e) => setNewShipment(prev => ({ ...prev, itemDescription: e.target.value }))}
            placeholder="תאר את הפריט שנשלח"
            required
            dir="rtl"
          />
        </div>

        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          יצירת משלוח
        </Button>
      </form>
    </div>
  );
};
