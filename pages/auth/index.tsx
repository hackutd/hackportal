import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Image from 'next/image';

import GoogleIcon from '@/public/icons/googleicon.png';

import { useAuthContext } from '@/lib/user/AuthContext';

import EmailInput from '@/components/auth/EmailInput';
import PasswordInput from '@/components/auth/PasswordInput';
/**
 * A page that allows the user to sign in.
 *
 * Route: /auth
 */
export default function AuthPage() {
  const { isSignedIn, signInWithGoogle, updateUser } = useAuthContext();
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordResetDialog, setPasswordResetDialog] = useState(false);
  const [sendVerification, setSendVerification] = useState(false);
  const [signInOption, setSignInOption] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const signIn = () => {
    setSendVerification(false);
    firebase
      .auth()
      .signInWithEmailAndPassword(currentEmail, currentPassword)
      .then(async ({ user }) => {
        // Signed in
        if (!user.emailVerified) {
          setSendVerification(true);
          throw new Error('Email is not verified. Verify your email before logging in.');
        }
        await updateUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMsg(errorMessage);
      });
  };

  const signUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(currentEmail, currentPassword)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        //send email verification
        firebase
          .auth()
          .currentUser.sendEmailVerification()
          .then(() => {
            router.push('/auth');
            alert(
              'Account created! Check your email/spam folder to verify your account and log in.',
            );
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setErrorMsg(errorMessage);
      });
  };

  const sendResetEmail = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(currentEmail)
      .then(() => {
        alert('Password reset email sent');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setErrorMsg(errorMessage);
      });
  };

  const sendVerificationEmail = () => {
    //send email verification
    try {
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          router.push('/auth');
          alert('Verification email sent, check your email to verify your account and log in');
        });
    } catch (error) {
      alert(
        'There has been a problem sending a verfication email.\nWait a few minutes before sending another request.',
      );
    }
  };

  function handleSubmit() {
    if (signInOption) {
      signIn();
    } else {
      signUp();
    }
  }

  const prettyPrint = (s: string) => {
    if (s.startsWith('Firebase')) return s.substring(10, s.indexOf('('));
  };

  if (isSignedIn) {
    router.push('/profile');
  }

  return (
    <>
      <section className="min-h-screen mb-16">
        <div className="hidden md:flex p-4">
          <Link href="/" passHref legacyBehavior>
            <div className="cursor-pointer items-center inline-flex text-white font-bold bg-[#5D5A88] rounded-[30px] pr-5 pl-2 py-3 border-2 border-white">
              <ChevronLeftIcon />
              Home
            </div>
          </Link>
        </div>
        <div className="mt-24 md:mt-0 py-2 md:px-16 px-0 flex items-center justify-center flex-wrap">
          <div className="xl:w-1/2 lg:w-2/3 w-5/6 my-4">
            <section
              id="signInSection"
              className="bg-white 2xl:min-h-[30rem] min-h-[28rem] rounded-lg p-6"
            >
              {!passwordResetDialog ? (
                <>
                  <h1 className="md:text-3xl text-2xl text-center text-[#5D5A88] mt-4 poppins-bold">
                    {signInOption ? 'Login' : 'Create an account'}
                  </h1>
                  <div className="text-center text-[#4C495080] mt-4 mb-12 poppins-semibold">
                    {signInOption ? ' New to HackPortal?' : 'Already have an account?'}{' '}
                    <span
                      onClick={() =>
                        signInOption ? setSignInOption(false) : setSignInOption(true)
                      }
                      className="text-[#5D5A88] cursor-pointer underline"
                    >
                      {signInOption ? 'Register here!' : 'Sign in'}
                    </span>
                  </div>
                  <React.Fragment>
                    <form
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === 'Enter') {
                          keyEvent.preventDefault();
                        }
                      }}
                      onSubmit={handleSubmit}
                      className="mt-4"
                    >
                      <EmailInput
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        placeholder="Enter your email address"
                        value={currentEmail}
                      />
                      <PasswordInput
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your password"
                      />

                      <div className="inline-flex md:flex justify-between md:flex-row flex-col-reverse poppins-semibold text-sm">
                        <div className="text-[#5D5A88]">
                          {/* TODO: should this feature be implemented or does it already exist? */}
                          <input
                            className="mr-2 r text-[#5D5A88] focus:ring-0 border border-[#5D5A88] text-sm cursor-pointer"
                            type="checkbox"
                            onClick={() => setRememberMe(!rememberMe)}
                          />
                          Remember me
                        </div>
                        <div
                          className="hover:underline cursor-pointer text-left text-[#5D5A88] mb-4 md:mb-0"
                          onClick={() => {
                            setPasswordResetDialog(true);
                            setErrorMsg('');
                            setSendVerification(false);
                          }}
                        >
                          Forgot password?
                        </div>
                        <input className="hidden" type="submit" value="Submit" />
                      </div>
                      <div className="flex justify-center mt-6 mb-4">
                        <button
                          type="button"
                          className="rounded-lg text-base w-full text-white bg-[#5D5A88] hover:brightness-90 px-4 py-2"
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          {signInOption ? 'Sign in' : 'Create an account'}
                        </button>
                      </div>
                    </form>
                    {/* Error and verification messages */}
                    <div className="poppins-regular text-center">{prettyPrint(errorMsg)}</div>
                    {/* !change if needed */}
                    {/* Uncomment to allow resend verification email option (users could spam) */}
                    {/* {sendVerification && (
                    <div className='flex justify-center'>
                      <button className="underline" onClick={() => sendVerificationEmail()}>
                        Resend verification
                      </button>
                    </div>
                  )} */}
                    <div className="poppins-regular text-complementaryLight flex justify-center">
                      <p>or continue with</p>
                    </div>
                    <button
                      className="mt-2 px-4 py-2 w-full rounded-lg border border-[#4C495026] text-[#79767C] bg-white my-4 text-base font-bold text-center flex items-center justify-center"
                      onClick={() => signInWithGoogle()}
                    >
                      <Image src={GoogleIcon} alt="GoogleIcon" width={25} height={25} />
                      <p className="mx-2">Sign in with Google</p>
                    </button>
                  </React.Fragment>
                </>
              ) : (
                <React.Fragment>
                  <div className="text-left">
                    <ArrowBackIcon
                      className="cursor-pointer text-[#5D5A88]"
                      onClick={() => {
                        setPasswordResetDialog(false);
                        setErrorMsg('');
                      }}
                    />
                  </div>
                  <h1 className="md:text-3xl text-2xl font-black text-center text-[#5D5A88] mt-4">
                    Reset Password
                  </h1>
                  <div className="text-center text-[#5D5A88] mt-4 mb-12">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </div>

                  <input
                    className="w-full rounded-md border border-complementary/20 p-2 mb-4"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    type="text"
                    name="email"
                    autoComplete="email"
                    placeholder="Email Address*"
                  ></input>
                  <div className="flex justify-center mt-6 mb-4">
                    <button
                      type="button"
                      className="rounded-full text-base w-full text-white bg-[#5D5A88] hover:brightness-90 px-4 py-2"
                      onClick={() => {
                        sendResetEmail();
                        setErrorMsg('');
                      }}
                    >
                      Send reset link
                    </button>
                  </div>
                  {/* Error and verification messages */}
                  <div className="text-left">{errorMsg}</div>
                </React.Fragment>
              )}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
