import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import { validateEmail } from "../../../../utils/validation";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import { createActivationToken, createResetToken } from "../../../../utils/tokens";
import { sendEmail } from '../../../../utils/sendEmails';
import { resetEmailTemplate } from "../../../../emails/resetEmailTemplate";


export async function POST(req) {
  try {
      await db.connectDb();
      const { email } = await req.json();
      const user = await User.findOne({ email });
      if(!user){
        return NextResponse.json(
            { message: "User not found." },
            { status: 404 }
          );
      }
      const user_id = createResetToken({
        id: user._id.toString(),
      });
      const url = `${process.env.BASE_URL}/auth/reset/${user_id}`;
    sendEmail(email, url, "", "Reset your password.", resetEmailTemplate);
    await db.disconnectDb();
    return NextResponse.json(
      { message: "An email has been sent to your inbox, use it to reset your password" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
        { message: "An error occurred while registering the user." },
        { status: 500 }
      );
  }
}