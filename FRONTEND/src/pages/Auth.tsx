import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotel, Shield, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("admin@grandhotel.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("guest");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "You have been logged in successfully." });
        navigate(activeTab === "staff" ? "/staff-dashboard" : "/guest-portal");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before signing in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center space-y-2">
          <Hotel className="h-12 w-12 mx-auto text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GRANDHOTLE
          </h1>
          <p className="text-muted-foreground">Sign in to access your portal</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guest" className="gap-2">
              <User className="h-4 w-4" />
              Guest Portal
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Shield className="h-4 w-4" />
              Staff Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guest">
            <Card>
              <CardHeader>
                <CardTitle>Guest Portal</CardTitle>
                <CardDescription>
                  {isLogin
                    ? "Sign in to manage your bookings and preferences"
                    : "Create an account to start booking your stay"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm
                  isLogin={isLogin}
                  email={email}
                  password={password}
                  loading={loading}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onSubmit={handleAuth}
                  onToggle={() => setIsLogin(!isLogin)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Login</CardTitle>
                <CardDescription>
                  {isLogin
                    ? "Sign in to access the management dashboard"
                    : "Register a new staff account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm
                  isLogin={isLogin}
                  email={email}
                  password={password}
                  loading={loading}
                  onEmailChange={setEmail}
                  onPasswordChange={setPassword}
                  onSubmit={handleAuth}
                  onToggle={() => setIsLogin(!isLogin)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggle: () => void;
}

const AuthForm = ({
  isLogin, email, password, loading,
  onEmailChange, onPasswordChange, onSubmit, onToggle,
}: AuthFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        minLength={6}
      />
    </div>
    <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
      {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
    </Button>
    <p className="text-center text-sm text-muted-foreground">
      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
      <button type="button" onClick={onToggle} className="text-primary hover:underline font-medium">
        {isLogin ? "Sign Up" : "Sign In"}
      </button>
    </p>
  </form>
);

export default Auth;
