import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Eye, EyeOff, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface RegisterFormProps {
  onRegister: (email: string) => void;
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "שגיאה",
        description: "אנא מלאו את כל השדות",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "שגיאה",
        description: "הסיסמאות אינן תואמות",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "שגיאה",
        description: "הסיסמה חייבת להכיל לפחות 6 תווים",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await apiService.register(email, password);
      
      toast({
        title: "הרשמה מוצלחת!",
        description: "החשבון נוצר בהצלחה ונשלח מייל אישור",
      });
      
      onRegister(email);
    } catch (error) {
      toast({
        title: "שגיאת הרשמה",
        description: error instanceof Error ? error.message : "הרשמה נכשלה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-email">כתובת אימייל</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="הזינו את כתובת האימייל שלכם"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-right"
          dir="rtl"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reg-password">סיסמה</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="בחרו סיסמה חזקה (לפחות 6 תווים)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-right pr-10"
            dir="rtl"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">אימות סיסמה</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="הזינו שוב את הסיסמה לאימות"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="text-right"
          dir="rtl"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            נרשם...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            הירשם
          </div>
        )}
      </Button>
    </form>
  );
}
