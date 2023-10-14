"use server"
import { Resend } from 'resend';
import { InputContactForm } from './validators';
import { ContactFormEmailTemplate } from '@/components/emailTemplates/contactForm';

export const sendEmail = async (formData: InputContactForm) => {
  console.log("formData", formData)
  //console.log(formData.get("senderEmail"))
  //console.log(formData.get("message"))
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_APIKEY not found');
    return { error: 'RESEND_APIKEY not found' };
  }
  const destEmail = process.env.CONTACT_EMAIL;
  if (!destEmail) {
    console.log('CONTACT_EMAIL not found');
    return { error: 'CONTACT_EMAIL not found' };
  }
  console.log("destEmail:", destEmail)
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [destEmail],
      subject: 'Message from NextJs-Shadcn contact form',
      text: "",// `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}\nSocialMedia: ${formData.socialMedia}`,
      react: ContactFormEmailTemplate({ ...formData }),
    });
    console.log("resend result data:", data)
    console.log("email is sent!")
    return { error: "" };
  } catch (error: any) {
    console.log("error:", error)
    return { error: error.toString() };
  }
}