import { marked } from "marked";

const content = `
# Privacy Policy for Llama Drive

Last updated: 08/08/2023

## 1. Introduction

Welcome to Llama Drive. This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of Llama Drive. By using our services, you consent to the practices described in this policy.

## 2. Information We Collect

**2.1 Information You Provide to Us**

- **Account Information**: When you sign up for Llama Drive, you provide us with personal information, such as your name, email address, and other relevant details.

- **Google Drive Access**: We use the Google Drive API to load data into a vector store to provide chat functionalities. By granting us access, you allow us to retrieve, read, and utilize the specific files and data you choose.

**2.2 Automatically Collected Information**

- **Usage Information**: We collect information about how you interact with our services, including the time, frequency, and duration of your activities.

- **Device Information**: We do not collect information about the device you are using, such as the type of device, operating system, and other related details.

## 3. How We Use Your Information

- **To Provide Our Services**: We use your information to operate, maintain, and provide the various features of Llama Drive, such as loading data into a vector store and enhancing chat functionalities.

- **For Analytics and Improvements**: We analyze usage patterns to better understand how our services are being used and to enhance the user experience.

## 4. Sharing and Disclosure

- **With Your Consent**: We will never share your information with third parties.

- **Legal Requirements**: We may disclose your information if required by law, regulation, or legal process.

## 5. Security

We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.

## 6. Your Choices and Rights

You have the right to access, modify, or delete your personal information at any time. Please contact us at aaditya01work@gmail.com to exercise these rights.

## 7. Changes to this Policy

We may update this Privacy Policy from time to time. The updated version will be indicated by an updated “Last revised” date, and the updated version will be effective as soon as it is accessible.

## 8. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Llama Drive
B-21 Sector 62, Model Town, Jaipur, Rajasthan, India
arkumawat78@gmail.com
+91 9351101486
`;

export default function PrivacyPolicy() {
  return (
    <div
      className="w-[700px] border-x m-auto marked p-4"
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    ></div>
  );
}
