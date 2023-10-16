"use server"
import { Resend } from 'resend';
import { InputContactForm } from './validators';
import { ContactFormEmailTemplate } from '@/components/emailTemplates/contactForm';
import React from 'react';

export const sendEmail = async (formData: InputContactForm) => {
  console.log("formData", formData)
  /* if formData is from HTML form:
    console.log(formData.get("senderEmail"))
    console.log(formData.get("message"))
    if(!message || typeof message !== "string") ... */
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not found');
    return { error: 'RESEND_API_KEY not found' };
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
      from: 'Contact Form <onboarding@resend.dev>',
      to: [destEmail],
      reply_to: `${formData.email}`,
      subject: 'Message from NextJs-Shadcn contact form',
      text: "",// `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}\nSocialMedia: ${formData.socialMedia}`,
      react: React.createElement(ContactFormEmailTemplate, { ...formData }),
    });//
    console.log("resend result data:", data)
    console.log("email is sent!")
    return { error: "" };
  } catch (error: any) {
    console.log("error:", error)
    return { error: error.toString() };
  }
}