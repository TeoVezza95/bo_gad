import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {AuthContext} from "@/context/AuthContext.tsx";
import {useContext} from "react";
import axios from "axios";
import {properties} from "../../properties.ts";
import { useNavigate } from 'react-router-dom';
// import { doLogin } from "@/services/auth"; // Assicurati che questo metodo sia implementato

// Definizione dello schema Zod per il login
const loginSchema = z.object({
    email: z.string().email("Email non valida"),
    password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});

// Tipo derivato dallo schema
type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginPage: React.FC<React.ComponentPropsWithoutRef<"div">> = ({
                                                                               className,
                                                                               ...props
                                                                           }) => {
    // Impostiamo react-hook-form con zodResolver
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }
    const { login } = authContext;



    // Funzione di submit che invia i dati a doLogin
    const onSubmit = async (data: LoginFormInputs) => {
        // Qui invii i dati al metodo doLogin
        // doLogin(data);
        try {
            const response = await axios.post(properties.login.baseUrl + properties.login.loginUrl, data);
            const { accessToken, refreshToken } = response.data;
            login(accessToken, refreshToken, data);
            navigate('/bo-gad');
        } catch (error) {
           console.log("error", error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className={cn("flex flex-col gap-6 mx-8", className)} {...props}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        {...register("email")}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
