'use client'

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { SignInWithGoogle } from "@/lib/actions/user.actions";

export function GoogleSignInForm() {
    const SignInButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button className='w-full' disabled={pending} variant='outline'>
                {pending ? 'Redirecting to Google...' : 'Sign in with Google'}

            </Button>
        )
    }
    return (
        <form action={SignInWithGoogle}>
            <SignInButton />
        </form>
    )
}