import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import { validateEmail } from "../../../../utils/validation";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import { createActivationToken } from "../../../../utils/tokens";
import { activateEmailTemplate } from "../../../../emails/activateEmailTemplate";
import { sendEmail } from './../../../../utils/sendEmails';


export async function POST(req) {
  try {
      await db.connectDb();
      const { name, email, password } = await req.json();
      if(!name || !email || !password){
        return NextResponse.json({ message: "Please fill in all fields" }, { status: 400 });
      }
      if(!validateEmail(email)){
        return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
      }
      const user = await User.findOne({ email })
      if(user){
        return NextResponse.json({ message: "Email Already Exists!" }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ message: "Password must be atleast 6 characters." }, { status: 400 });
      }
      const cryptedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: cryptedPassword });

      const addedUser = await newUser.save();
      const activation_token = createActivationToken({
        id: addedUser._id.toString(),
      });
      const url = `${process.env.BASE_URL}/activate/${activation_token}`;
    sendEmail(email, url, "", "Activate your account.", activateEmailTemplate);
    await db.disconnectDb();
    return NextResponse.json(
      { message: "Registration successful! Please activate your email to start." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
        { message: "An error occurred while registering the user." },
        { status: 500 }
      );
  }
}