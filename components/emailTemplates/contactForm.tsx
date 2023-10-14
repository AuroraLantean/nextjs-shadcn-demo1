import * as React from 'react';

type props = {
  name: string;
  email: string;
  message: string;
  socialMedia: string;
}
export const ContactFormEmailTemplate: React.FC<Readonly<props>> = ({
  name, email, message, socialMedia
}) => (
  <div>
    <h1>Contact Form Incoming</h1>
    <p>From: {name}</p>
    <p>Email: {email}</p>
    <p>Message: {message}</p>
    <p>Social Media: {socialMedia}</p>
  </div>
);