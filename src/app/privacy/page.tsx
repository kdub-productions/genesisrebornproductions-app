import React from 'react';
import './privacyPolicy.css';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="privacyPolicyContainer">
      <h1 className="privacyPolicyTitle">Privacy Policy for Genesis Reborn Productions</h1>

      <p>
        Welcome to Genesis Reborn Productions. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including beat selling, mixing, and mastering.
      </p>

      <h2 className="privacyPolicySectionTitle">1. Information We Collect</h2>

      <ul className="privacyPolicyList">
        <li>
          <strong>Personal Information:</strong> When you create an account, make a purchase, or contact us, we may collect personal information such as your name, email address, billing address, and payment details.
        </li>
        <li>
          <strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including your IP address, browser type, operating system, pages visited, and the dates and times of your visits.
        </li>
        <li>
          <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience, analyze website traffic, and personalize content. You can manage your cookie preferences through your browser settings.
        </li>
        <li>
          <strong>Communication Data:</strong> If you contact us via email or through our website's contact form, we may collect and store the content of your communication.
        </li>
      </ul>

      <h2 className="privacyPolicySectionTitle">2. How We Use Your Information</h2>

      <ul className="privacyPolicyList">
        <li>
          <strong>Order Processing and Fulfillment:</strong> We use your information to process your orders, deliver beats, and provide mixing and mastering services.
        </li>
        <li>
          <strong>Communication and Customer Support:</strong> We use your information to communicate with you about your orders, respond to your inquiries, and provide customer support.
        </li>
        <li>
          <strong>Improving Our Services:</strong> We analyze usage data to understand how our website and services are used, which helps us improve our offerings and user experience.
        </li>
        <li>
          <strong>Marketing and Promotions:</strong> With your consent, we may send you promotional emails about new beats, special offers, and other updates. You can opt out of these communications at any time.
        </li>
        <li>
          <strong>Legal Compliance:</strong> We may use your information to comply with applicable laws, regulations, and legal processes.
        </li>
      </ul>

      <h2 className="privacyPolicySectionTitle">3. Information Sharing and Disclosure</h2>

      <ul className="privacyPolicyList">
        <li>
          <strong>Third-Party Service Providers:</strong> We may share your information with third-party service providers who assist us with payment processing, website hosting, email delivery, and other essential services. These providers are contractually obligated to protect your information.
        </li>
        <li>
          <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid legal requests, such as subpoenas or court orders.
        </li>
        <li>
          <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of the transaction.
        </li>
      </ul>

      <h2 className="privacyPolicySectionTitle">4. Data Security</h2>

      <p>
        We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure. Therefore, while we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
      </p>

      <h2 className="privacyPolicySectionTitle">5. Your Rights</h2>

      <ul className="privacyPolicyList">
        <li>
          <strong>Access, Correction, and Deletion:</strong> You have the right to access, correct, or delete your personal information. You can do this by contacting us directly.
        </li>
        <li>
          <strong>Opt-Out of Marketing:</strong> You can opt out of receiving marketing communications from us by contacting us.
        </li>
        <li>
          <strong>Contact for Inquiries:</strong> If you have any questions or concerns about our privacy practices, please contact us using the information provided below.
        </li>
      </ul>

      <h2 className="privacyPolicySectionTitle">6. Children's Privacy</h2>

      <p>
        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you believe that we have inadvertently collected information from a child under 18, please contact us immediately.
      </p>

      <h2 className="privacyPolicySectionTitle">7. Changes to This Privacy Policy</h2>

      <p>
        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
      </p>

      <h2 className="privacyPolicySectionTitle">8. Contact Us</h2>

      <p>
        If you have any questions about this Privacy Policy, please contact us at:
        <br />
        Email: <a href="mailto:genesisrebornproductions@gmail.com">genesisrebornproductions@gmail.com</a>
        <br />
        [Your Business Address (Optional)]
      </p>

      <p className="text-sm text-gray-500 mt-4">
        Last Updated: [Date]
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
