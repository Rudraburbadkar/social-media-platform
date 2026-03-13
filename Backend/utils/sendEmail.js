import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({path:"./.env"});

console.log("Loaded RESEND_API_KEY =>", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);


export const sendVerifyEmail = async (sendVerifyEmail,verifycode) => {
   try {
      await resend.emails.send({
        from:"onboarding@resend.dev",
        to: sendVerifyEmail,
        subject: "Verify your email",
        html: `<p>Your verification code is: <strong>${verifycode}</strong></p>`,
      });

      console.log("Verification email sent to: ", sendVerifyEmail);
      
   } catch (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send verification email");
   }
}