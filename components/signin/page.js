'use client'

import HeaderPage from '../../components/header/page';
import styles from '../../styles/signin.module.scss';
import {BiLeftArrowAlt} from 'react-icons/bi';
import Link from 'next/link';
import FooterPage from '../../components/footer/page';
import { Formik,Form } from 'formik';
import LoginInputpage from './../../components/inputs/logininput/page';
import { useEffect, useState } from 'react';
import * as Yup from "yup";
import CircledIconBtnpage from '@/components/buttons/circledIconBtn/page';
import { getCsrfToken, getProviders, getSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseCallbackUrl } from '../../components/helpers/helpers';
import axios from 'axios';
import BounceLoaderpage from '../../components/loaders/bounceLoader/page';

const initialvalues={
  login_email: "",
  login_password: "",
  name:"",
  email:"",
  password:"",
  conf_password:"",
  success: "",
  error: "",
  login_error: "",
};


export default function  SignInpage ({country}) {
  const [loading, setLoading] = useState();
  const [user, setUser] = useState(initialvalues);
  const router = useRouter();
  const { 
    login_email, 
    login_password,
    name,
    email,
    password,
    conf_password,
    success,
    error,
    login_error,
  } = user;
  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser({ ...user, [name]: value });
  };
  // login validation
  const loginValidation = Yup.object({
    login_email:Yup.string().required("Email address is required.").email("Please enter a valid email address."),
    login_password:Yup.string().required("Please enter a valid password."),
  });

  // registration validation
  const registerValidation = Yup.object({
    name: Yup.string()
      .required("What's your name ?")
      .min(2, "First name must be between 2 and 16 characters.")
      .max(16, "First name must be between 2 and 16 characters.")
      .matches(/^[aA-zZ]/, "Numbers and special characters are not allowed."),
    email: Yup.string()
      .required(
        "You'll need this when you log in and if you ever need to reset your password."
      )
      .email("Enter a valid email address."),
    password: Yup.string()
      .required(
        "Enter a combination of at least six numbers,letters and punctuation marks(such as ! and &)."
      )
      .min(6, "Password must be atleast 6 characters.")
      .max(36, "Password can't be more than 36 characters"),
    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords does not match."),
  });

// fetch providers from next-auth
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);



  // const {req, query} = context;

  // const session = await getSession({ req });
  // const { callbackUrl } = query;

  // if (session) {
  //   return {
  //     redirect: {
  //       destination: callbackUrl,
  //     },
  //   };
  // }
  // const csrfToken = await getCsrfToken(context);


   const signUpHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      setUser({ ...user, error: "", success: data.message });
      setLoading(false);
      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password,
        };
        const res = await signIn("credentials", options);
        router.push("/");
      }, 2000);
    } catch (error) {
      setLoading(false);
      setUser({ ...user, success: "", error: error.response.data.message });
    }
  };


  const params = useSearchParams();
  const callBackUrl = params.get("callbackUrl");


  const signInHandler = async () => {
    setLoading(true);
    let options = {
      email: login_email,
      password: login_password,
      callbackUrl: callBackUrl ? parseCallbackUrl(callBackUrl) : "/",
      redirect: false,
    };
    const res = await signIn("credentials", options);
    setUser({ ...user, success: "", error: "" });
    setLoading(false);
    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      return router.push( callBackUrl || "/" );
    }
  };
  
  return (
    <>
    {loading && <BounceLoaderpage loading={loading} />}
      <HeaderPage country={country}/>

{/* Sign In Session */}
    <div className={styles.login}>
      <div className={styles.login__container}>
        <div className={styles.login__header}>
          <div className={styles.back__svg}>
            <BiLeftArrowAlt/>
          </div>
          <span>
            We'd be happy to join us ! <Link href="/">Go Store</Link>
          </span>
        </div>
       
        <div className={styles.login__form}>
          <h1>Sign In</h1>
          <p>Type your e-mail or phone number to log in or create an Androbay account.</p>
          <Formik
          enableReinitialize
          initialValues={{
            login_email,
            login_password,
          }}
          validationSchema={loginValidation}
          onSubmit={() => {
            signInHandler();
          }}
          >
            {
              (form)=> (
                <Form> 
                  <LoginInputpage 
                  type="text"
                  name="login_email"
                  icon="email" 
                  placeholder="Enter Email Address"
                  onChange={handleChange}
                  />
                  <LoginInputpage 
                  type="password"
                  name="login_password"
                  icon="password" 
                  placeholder="Enter Password"
                  onChange={handleChange}
                  />
                  <CircledIconBtnpage type="submit" text="Sign In"/>
                  {login_error && (
                    <span className={styles.error}>{login_error}</span>
                  )}
                  <div className={styles.forgot}>
                    <Link href="/auth/forgot">
                      Forgot Password
                    </Link>
                  </div>

                </Form>
              )
            }
          </Formik>
{/*  */}
        <div className={styles.login__socials}>
          <span className={styles.or}>Or continue with</span>
         <div className={styles.login__socials_wrap}>
         {providers && Object.values(providers).map((provider) => {
           if (provider.name == "Credentials") {
            return;
          }
          return (
            <div key={provider.name}>
              <button
                className={styles.social__btn}
                onClick={() => signIn(provider.id)}
              >
                <img src={`../../icons/${provider.name}.png`} alt="" />
                Sign in with {provider.name}
              </button>
            </div>
          );
          })}
         </div>
        </div>
{/*  */}
        </div>
      </div>


{/* Sign Up Session */}
      <div className={styles.login__container}>
        <div className={styles.login__form}>
          <h1>Sign Up</h1>
          <p>Sign Up to Create an Androbay account using an email and password</p>
          <Formik
          enableReinitialize
          initialValues={{
            name,
            email,
            password,
            conf_password,
          }}
          validationSchema={registerValidation}
          onSubmit={()=>{
            signUpHandler();
          }}
          >
            {
              (form)=> (
                <Form> 
                  <LoginInputpage 
                  type="text"
                  name="name"
                  icon="user" 
                  placeholder="Enter Your Name"
                  onChange={handleChange}
                  />
                  <LoginInputpage 
                  type="text"
                  name="email"
                  icon="email" 
                  placeholder="Enter Email Address"
                  onChange={handleChange}
                  />
                  <LoginInputpage 
                  type="password"
                  name="password"
                  icon="password" 
                  placeholder="Enter Password"
                  onChange={handleChange}
                  />
                  <LoginInputpage 
                  type="password"
                  name="conf_password"
                  icon="password" 
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  />
                  <CircledIconBtnpage type="submit" text="Sign Up"/>
                </Form>
              )}
          </Formik>
          <div>
              {success && <span className={styles.success}>{success}</span>}
          </div>
          <div>{error && <span className={styles.error}>{error}</span>}</div>
{/*  */}
    
{/*  */}
        </div>
      </div>
    </div>

      <FooterPage country={country}/>
      </>
  )
}


