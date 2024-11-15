
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
 




const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignupValidation>>({
      resolver: zodResolver(SignupValidation),
      defaultValues: {
        name: '',
        username: '',
        email: '',
        password: ''
      },
    })
   
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignupValidation>) {
      const newUser = await createUserAccount(values);

      if(!newUser) {
        return  toast({
          title: 'Sign up failed. Please try again.'
        });
      }

      const session = await signInAccount({
        email: values.email, 
        password: values.password,
      })

      if(!session) {
        return toast({ title:"Something went wrong. Please login your new account"});

        navigate("/sign-in");

        return;
      }

      const isLoggedIn = await checkAuthUser(); 

      if(isLoggedIn){
        form.reset();

        navigate('/')
      } else {
        return toast({ title: "Login failed. Please try again."})
      }
    }




  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <img src="/assets/images/logo1.png" alt="logo"/>

        <h2 className="pt-5 h3-bold md:h3-bold sm:pt-7 ">Create a new account</h2>
        <p className="mt-2 text-light-3 small-medium md:base-regular">To use PeliConnect, please enter your details</p>



        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4">
          <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="gap-2 flex-center">
                <Loader/> Loading...
              </div>
            ) : "Sign Up"}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Already have an account?
            <Link to="/sign-in" className="ml-1 text-primary-500 text-small-semibold">Log In</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
