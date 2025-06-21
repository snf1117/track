
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrackingSearchProps {
  userEmail: string;
}

export function TrackingSearch({ userEmail }: TrackingSearchProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזינו מספר מעקב",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      toast({
        title: "חיפוש הושלם",
        description: `חיפוש מספר מעקב: ${trackingNumber}`,
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <Card className="h-fit shadow-lg border-0 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Search className="h-5 w-5 text-blue-600" />
          חיפוש משלוח
        </CardTitle>
        <CardDescription>
          הזינו מספר מעקב כדי לחפש משלוח ספציפי
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking">מספר מעקב</Label>
            <Input
              id="tracking"
              placeholder="הזינו מספר מעקב"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                מחפש...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                חפש משלוח
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">טיפ שימושי</h4>
              <p className="text-sm text-blue-700">
                מספר המעקב נשלח אליכם במייל לאחר רכישת הפריט. אם אינכם מוצאים אותו, בדקו בתיקיית הספאם.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
