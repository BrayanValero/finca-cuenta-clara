
import AuthForm from '@/components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-farm-beige dark:bg-farm-darkgreen">
      <div className="w-full max-w-md bg-white dark:bg-farm-green p-8 rounded-xl shadow-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
