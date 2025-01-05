import React, { useState } from "react";

const PolicyLayout = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">{children}</div>
    </div>
  );
};

const AccordionSection = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
        onClick={onClick}
      >
        <span className="font-medium text-lg">{title}</span>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
    </div>
  );
};

const ReturnPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <PolicyLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Return & Exchange Policy</h1>
      </div>

      <AccordionSection
        title="Return/Exchange Window"
        isOpen={openSection === "window"}
        onClick={() => toggleSection("window")}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>
            You can return or exchange your order within 30 days of delivery
          </li>
          <li>We offer reverse pickup facility for most pin codes</li>
          <li>
            For non-serviceable pin codes, self-shipping option is available
          </li>
        </ul>
      </AccordionSection>

      <AccordionSection
        title="Return/Exchange Process"
        isOpen={openSection === "process"}
        onClick={() => toggleSection("process")}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">For Returns:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pickup will be arranged within 3 business days</li>
              <li>Refund will be initiated within 24-48 hours after pickup</li>
              <li>Amount will reflect in your account within 7 days</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">For Exchanges:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pickup will be arranged within 2 business days</li>
              <li>Only same product in different size is allowed</li>
              <li>No partial returns for combo packs</li>
            </ul>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Terms & Conditions"
        isOpen={openSection === "conditions"}
        onClick={() => toggleSection("conditions")}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>Products must be unused and in original condition</li>
          <li>All tags and packaging must be intact</li>
          <li>
            Certain categories are non-returnable (masks, boxers, shorts, etc.)
          </li>
          <li>Gift wrapping charges are non-refundable</li>
          <li>COD/Shipping charges are non-refundable</li>
        </ul>
      </AccordionSection>
    </PolicyLayout>
  );
};

const ShippingPolicy = () => {
  return (
    <PolicyLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">Shipping Rates</h3>
          <p>
            Free shipping across India for all prepaid orders. Additional fee
            applicable for COD orders.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Delivery Timeline</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Metro cities: 2-3 business days</li>
            <li>Rest of India: 3-5 business days</li>
            <li>Order processing time: 1-2 business days</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Order Tracking</h3>
          <p>
            A tracking number will be provided via email/SMS once your order is
            dispatched.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
};

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <PolicyLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      </div>

      <AccordionSection
        title="Collection of Information"
        isOpen={openSection === "collection"}
        onClick={() => toggleSection("collection")}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>We collect only necessary information for business purposes</li>
          <li>Information collected includes name, address, contact details</li>
          <li>We do not store credit card information</li>
          <li>Anonymous cookies are used to improve website functionality</li>
        </ul>
      </AccordionSection>

      <AccordionSection
        title="Use of Information"
        isOpen={openSection === "usage"}
        onClick={() => toggleSection("usage")}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>Process orders and provide customer service</li>
          <li>Respond to queries and complaints</li>
          <li>Customize offerings and analyze user trends</li>
          <li>Send important updates about products/services</li>
          <li>Comply with legal requirements</li>
        </ul>
      </AccordionSection>

      <AccordionSection
        title="Security Practices"
        isOpen={openSection === "security"}
        onClick={() => toggleSection("security")}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>Reasonable security measures are implemented</li>
          <li>Third-party agreements include security standards</li>
          <li>Regular updates to security practices</li>
        </ul>
      </AccordionSection>
    </PolicyLayout>
  );
};

const TermsOfService = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <PolicyLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      </div>

      <AccordionSection
        title="Overview"
        isOpen={openSection === "overview"}
        onClick={() => toggleSection("overview")}
      >
        <p className="mb-4">
          By accessing and using this website, you agree to these terms and
          conditions. If you do not agree, please do not use our services.
        </p>
      </AccordionSection>

      <AccordionSection
        title="Prohibited Uses"
        isOpen={openSection === "prohibited"}
        onClick={() => toggleSection("prohibited")}
      >
        <ul className="list-disc pl-6 space-y-2">
          <li>Posting defamatory or offensive content</li>
          <li>Violating intellectual property rights</li>
          <li>Spreading misinformation</li>
          <li>Using the service for illegal activities</li>
          <li>Attempting to compromise website security</li>
        </ul>
      </AccordionSection>

      <AccordionSection
        title="Limitation of Liability"
        isOpen={openSection === "liability"}
        onClick={() => toggleSection("liability")}
      >
        <p>
          We are not liable for any direct, indirect, incidental, or
          consequential damages arising from your use of our service or
          products.
        </p>
      </AccordionSection>

      <AccordionSection
        title="Governing Law"
        isOpen={openSection === "jurisdiction"}
        onClick={() => toggleSection("jurisdiction")}
      >
        <p>
          These terms are governed by the laws of India, and disputes shall be
          subject to the exclusive jurisdiction of courts in Bangalore.
        </p>
      </AccordionSection>
    </PolicyLayout>
  );
};

export { ReturnPolicy, ShippingPolicy, PrivacyPolicy, TermsOfService };
