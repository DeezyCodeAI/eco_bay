'use client'

import { useParams } from "next/navigation";
import HeaderPage from "../../components/header/page";
import styles from "../../styles/forgot.module.scss";
import FooterPage from "../../components/footer/page";
import { BiLeftArrowAlt } from "react-icons/bi";
import CircledIconBtnpage from "../../components/buttons/circledIconBtn/page";
import LoginInputpage from "../../components/inputs/logininput/page";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import BounceLoaderpage from "../../components/loaders/bounceLoader/page";
import Link from "next/link";


export default function ResetPasswordpage({country}) {
    const [password, setPassword] = useState("");
    const [conf_password, setConf_Password] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // accessing token from url nextjs
    const { token } = useParams();

    const passwordValidation = Yup.object({
        password: Yup.string()
        .required(
          "Please enter your new password. Combination of special characters"
        )
        .min(6, "Password must be atleast 6 characters.")
        .max(36, "Password can't be more than 36 characters"),
      conf_password: Yup.string()
        .required("Confirm your password.")
        .oneOf([Yup.ref("password")], "Passwords does not match."),
    });
    const resetHandler = async () => {
      try {
        setLoading(true);
        const res = await axios.post("/api/auth/reset", {
          password,
          conf_password,
        });
        setError("");
        setLoading(false);
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
            Reset Your Password<Link href="/">&nbsp;Or Login</Link>
          </span>
        </div>

      
          <Formik
          enableReinitialize
          initialValues={{
            password, conf_password,
          }}
          validationSchema={passwordValidation}
          onSubmit={() => {
            resetHandler();
          }}
          >
            {
              (form)=> (
                <Form> 
                  <LoginInputpage 
                  type="password"
                  name="password"
                  icon="password" 
                  placeholder="Reset Password"
                  onChange={(e)=> setPassword(e.target.value)}
                  />
                  <LoginInputpage 
                  type="password"
                  name="conf_password"
                  icon="password" 
                  placeholder="Confirm Password"
                  onChange={(e)=> setConf_Password(e.target.value)}
                  />
                  <CircledIconBtnpage type="submit" text="Change password"/>
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
