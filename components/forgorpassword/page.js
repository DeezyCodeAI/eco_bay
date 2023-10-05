'use client'

import HeaderPage from "../../components/header/page"
import styles from "../../styles/forgot.module.scss"
import FooterPage from "../../components/footer/page"
import { BiLeftArrowAlt } from "react-icons/bi"
import CircledIconBtnpage from "../../components/buttons/circledIconBtn/page"
import LoginInputpage from "../../components/inputs/logininput/page"
import { Form, Formik } from "formik"
import * as Yup from "yup";
import { useState } from "react"
import Link from "next/link"
import axios from "axios"
import BounceLoaderpage from "../../components/loaders/bounceLoader/page"

export default function Forgotpage({country}) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const emailValidation = Yup.object({
        email: Yup.string()
        .required(
            "You'll if you ever need to reset your password"
        )
        .email("Enter a valid email address")
    })
    const forgotHandler = async () => {
      try {
        setLoading(true);
        const {data} = await axios.post("/api/auth/forgot", {email,});
        setError("");
        setSuccess(data.message);
        setLoading(false);
        setEmail("");
      } catch (error) {
        setLoading(false);
        setError(error.response.data.message)
        setSuccess("");
      }
    };

  return (
    <>
        {loading && <BounceLoaderpage loading={loading} />}
      <HeaderPage country={country}/>
      <div className={styles.forgot}>
        <div>
        <div className={styles.forgot__header}>
          <div className={styles.back__svg}>
            <BiLeftArrowAlt/>
          </div>
          <span>
            Forgot Your Password<Link href="/">&nbsp;Or Login</Link>
          </span>
        </div>

      
          <Formik
          enableReinitialize
          initialValues={{
            email,
          }}
          validationSchema={emailValidation}
          onSubmit={() => {
            forgotHandler();
          }}
          >
            {
              (form)=> (
                <Form> 
                  <LoginInputpage 
                  type="text"
                  name="email"
                  icon="email" 
                  placeholder="Enter Email Address"
                  onChange={(e)=> setEmail(e.target.value)}
                  />
                  <CircledIconBtnpage type="submit" text="Send Link"/>
                  <div style={{marginTop: "10px"}}>
                  {error && (
                    <span className={styles.error}>{error}</span>
                  )}
                  {success && (
                    <span className={styles.success}>{success}</span>
                  )}
                  </div>
                </Form>
              )
            }
          </Formik>
        </div>



        </div>
      <FooterPage country={country}/>
    </>
  )
}
