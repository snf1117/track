
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit } from 'lucide-react';

const mockShipments = [
  {
    trackingNumber: 'TR12345ABC',
    customerEmail: 'customer1@example.com',
    itemDescription: 'אוזניות Bluetooth',
    status: 'purchased',
    createdAt: '2024-01-15'
  },
  {
    trackingNumber: 'TR67890DEF',
    customerEmail: 'customer2@example.com',
    itemDescription: 'כיסוי לטלפון',
    status: 'shipped',
    createdAt: '2024-01-14'
  },
  {
    trackingNumber: 'TR11111GHI',
    customerEmail: 'customer3@example.com',
    itemDescription: 'שעון חכם',
    status: 'arrived_country',
    createdAt: '2024-01-13'
  }
];

const statusLabels = {
  purchased: 'נרכש',
  shipped: 'יצא למשלוח',
  arrived_country: 'הגיע לארץ',
  arrived_pickup: 'הגיע לאיסוף',
  out_for_delivery: 'יצא לשילוח'
};

const statusColors = {
  purchased: 'bg-gray-100 text-gray-800',
  shipped: 'bg-blue-100 text-blue-800',
  arrived_country: 'bg-yellow-100 text-yellow-800',
  arrived_pickup: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-green-100 text-green-800'
};

export const ShipmentList = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [shipments, setShipments] = useState(mockShipments);
  const [editingShipment, setEditingShipment] = useState<string | null>(null);

  const filteredShipments = shipments.filter(shipment =>
    shipment.customerEmail.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const updateShipmentStatus = (trackingNumber: string, newStatus: string) => {
    setShipments(prev =>
      prev.map(shipment =>
        shipment.trackingNumber === trackingNumber
          ? { ...shipment, status: newStatus as keyof typeof statusLabels }
          : shipment
      )
    );
    setEditingShipment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">חיפוש משלוחים</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="searchEmail">חיפוש לפי מייל לקוח</Label>
        <Input
          id="searchEmail"
          type="email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="הכנס כתובת מייל לחיפוש"
          dir="rtl"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">מספר מעקב</TableHead>
              <TableHead className="text-right">מייל לקוח</TableHead>
              <TableHead className="text-right">תיאור פריט</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">תאריך יצירה</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.map((shipment) => (
              <TableRow key={shipment.trackingNumber}>
                <TableCell className="font-mono">{shipment.trackingNumber}</TableCell>
                <TableCell>{shipment.customerEmail}</TableCell>
                <TableCell>{shipment.itemDescription}</TableCell>
                <TableCell>
                  {editingShipment === shipment.trackingNumber ? (
                    <select
                      value={shipment.status}
                      onChange={(e) => updateShipmentStatus(shipment.trackingNumber, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge className={statusColors[shipment.status]}>
                      {statusLabels[shipment.status]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{shipment.createdAt}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingShipment(
                      editingShipment === shipment.trackingNumber ? null : shipment.trackingNumber
                    )}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredShipments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          לא נמצאו משלוחים עבור החיפוש שלך
        </div>
      )}
    </div>
  );
};
