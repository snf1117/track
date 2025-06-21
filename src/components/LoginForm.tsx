
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "שגיאה",
        description: "אנא מלאו את כל השדות",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await apiService.login(email, password);
      toast({
        title: "התחברות מוצלחת!",
        description: "ברוכים הבאים למערכת מעקב המשלוחים",
      });
      onLogin(email);
    } catch (error) {
      toast({
        title: "שגיאת התחברות",
        description: error instanceof Error ? error.message : "התחברות נכשלה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">כתובת אימייל</Label>
        <Input
          id="email"
          type="email"
          placeholder="הזינו את כתובת האימייל שלכם"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-right"
          dir="rtl"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="הזינו את הסיסמה שלכם"
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

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            מתחבר...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            התחבר
          </div>
        )}
      </Button>
    </form>
  );
}
