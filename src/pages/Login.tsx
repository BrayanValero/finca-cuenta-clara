
import AuthForm from '@/components/AuthForm';

const Login = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/lovable-uploads/bcff9eea-6955-4ded-b04d-0c4c8c806397.png')",
      }}
    >
      <div className="w-full max-w-md bg-white/90 dark:bg-farm-green/90 p-8 rounded-xl shadow-lg backdrop-blur-sm">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
