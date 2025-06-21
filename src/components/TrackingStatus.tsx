
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, Plane, MapPin, Home, CheckCircle } from 'lucide-react';

interface TrackingStatusProps {
  userEmail: string;
}

interface TrackingItem {
  id: string;
  trackingNumber: string;
  description: string;
  currentStatus: number;
  createdAt: string;
}

const statusSteps = [
  { id: 0, title: 'פריט נרכש', description: 'ההזמנה התקבלה והפריט נרכש', icon: CheckCircle, color: 'bg-green-500' },
  { id: 1, title: 'פריט יצא למשלוח', description: 'הפריט נאסף ויצא למשלוח', icon: Package, color: 'bg-blue-500' },
  { id: 2, title: 'פריט הגיע לארץ', description: 'הפריט עבר את המכס והגיע לארץ', icon: Plane, color: 'bg-purple-500' },
  { id: 3, title: 'פריט הגיע לאיסוף', description: 'הפריט הגיע למרכז החלוקה המקומי', icon: MapPin, color: 'bg-orange-500' },
  { id: 4, title: 'פריט יצא לשילוח אל יד הלקוח', description: 'הפריט בדרך אליכם - יגיע בקרוב!', icon: Truck, color: 'bg-red-500' },
  { id: 5, title: 'פריט הגיע ליעד', description: 'הפריט הגיע בהצלחה!', icon: Home, color: 'bg-green-600' }
];

export function TrackingStatus({ userEmail }: TrackingStatusProps) {
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);

  useEffect(() => {
    // Simulate loading tracking data
    const mockData: TrackingItem[] = [
      {
        id: '1',
        trackingNumber: 'TK123456789',
        description: 'אוזניות בלוטוס Sony WH-1000XM4',
        currentStatus: 2,
        createdAt: '2025-01-15'
      },
      {
        id: '2',
        trackingNumber: 'TK987654321',
        description: 'ספר "למידת מכונה למתחילים"',
        currentStatus: 4,
        createdAt: '2025-01-10'
      }
    ];
    setTrackingItems(mockData);
  }, [userEmail]);

  const getStatusProgress = (currentStatus: number) => {
    return ((currentStatus + 1) / statusSteps.length) * 100;
  };

  if (trackingItems.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">אין משלוחים פעילים</h3>
          <p className="text-gray-500 text-center">
            לא מצאנו משלוחים הקשורים לחשבון שלכם.
            <br />
            המשלוחים יופיעו כאן לאחר הרכישה.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {trackingItems.map((item) => (
        <Card key={item.id} className="shadow-lg border-0 bg-white/90 backdrop-blur overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-800">{item.description}</CardTitle>
              <div className="text-left">
                <Badge variant="outline" className="mb-1">
                  {item.trackingNumber}
                </Badge>
                <p className="text-xs text-gray-500">נרכש: {item.createdAt}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>התקדמות המשלוח</span>
                <span>{Math.round(getStatusProgress(item.currentStatus))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getStatusProgress(item.currentStatus)}%` }}
                />
              </div>
            </div>

            {/* Status Steps */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= item.currentStatus;
                const isCurrent = index === item.currentStatus;
                const IconComponent = step.icon;
                
                return (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted 
                          ? `${step.color} text-white shadow-lg` 
                          : 'bg-gray-200 text-gray-500'
                        }
                        ${isCurrent ? 'ring-4 ring-blue-200 scale-110' : ''}
                      `}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`
                          absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 transition-colors duration-300
                          ${isCompleted ? 'bg-blue-300' : 'bg-gray-200'}
                        `} />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium transition-colors duration-300 ${
                          isCompleted ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <Badge className="bg-blue-500 text-white text-xs animate-pulse">
                            שלב נוכחי
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm transition-colors duration-300 ${
                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
