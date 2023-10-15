
//import * as React from 'react';
import { Html, Body, Head, Heading, Hr, Container, Preview, Section, Text, Button } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

type props = {
  name: string;
  email: string;
  message: string;
  socialMedia: string;
}
export const ContactFormEmailTemplate = ({
  name, email, message, socialMedia
}: props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Message from Contact Form</Preview>
    <Tailwind>
      <Body className="bg-black text-white">
        <Container>
          <Section className="bg-gray-700 border-black my-10 px-10 py-4 rounded-md">
            <Heading className="leading-tight">Message from the Contact Form</Heading>
            <Hr />
            <Text>Sender Name: {name}</Text>
            <Text>Sender Email: {email}</Text>
            <Text>Sender SocialMedia: {socialMedia}</Text>
            <Text>Message: {message}</Text>
          </Section>
          <Button className="bg-cyan-400 text-black" href="https://nextjs-shadcn-demo1.vercel.app/contact-us">
            Click me
          </Button>
        </Container>
      </Body>
    </Tailwind>

  </Html>
);
//https://react.email/docs/components/html
/* 
 */