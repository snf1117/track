
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLogin } from '@/components/AdminLogin';
import { ShipmentManager } from '@/components/ShipmentManager';
import { ShipmentList } from '@/components/ShipmentList';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">פאנל ניהול משלוחים</h1>
          <p className="text-gray-600">ניהול ומעקב אחר כל המשלוחים במערכת</p>
        </div>

        <Tabs defaultValue="shipments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="shipments">רשימת משלוחים</TabsTrigger>
            <TabsTrigger value="add">הוספת משלוח חדש</TabsTrigger>
          </TabsList>

          <TabsContent value="shipments">
            <Card>
              <CardHeader>
                <CardTitle>כל המשלוחים</CardTitle>
                <CardDescription>חיפוש ועדכון סטטוס משלוחים</CardDescription>
              </CardHeader>
              <CardContent>
                <ShipmentList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>הוספת משלוח חדש</CardTitle>
                <CardDescription>יצירת משלוח חדש במערכת</CardDescription>
              </CardHeader>
              <CardContent>
                <ShipmentManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            התנתקות
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
