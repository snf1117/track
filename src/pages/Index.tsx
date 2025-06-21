
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, LogIn, UserPlus, Search } from 'lucide-react';
import { TrackingStatus } from '@/components/TrackingStatus';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { TrackingSearch } from '@/components/TrackingSearch';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState<'auth' | 'tracking'>('auth');

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setCurrentView('tracking');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentView('auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                מעקב משלוחים
              </h1>
            </div>
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">שלום, {userEmail}</span>
                <Button variant="outline" onClick={handleLogout}>
                  התנתק
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto animate-fade-in">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800">ברוכים הבאים</CardTitle>
                <CardDescription className="text-gray-600">
                  התחברו כדי לעקוב אחר המשלוחים שלכם
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      התחברות
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      הרשמה
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <LoginForm onLogin={handleLogin} />
                  </TabsContent>
                  <TabsContent value="register">
                    <RegisterForm onRegister={handleLogin} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">המשלוחים שלי</h2>
              <p className="text-gray-600">עקבו אחר מצב המשלוחים שלכם בזמן אמת</p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <TrackingSearch userEmail={userEmail} />
              </div>
              <div className="lg:col-span-2">
                <TrackingStatus userEmail={userEmail} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
