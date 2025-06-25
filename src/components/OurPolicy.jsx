import React from "react";
import {
  Shield,
  ArrowLeftRight,
  Clock,
  Truck,
  HeadphonesIcon,
  BadgeCheck,
} from "lucide-react";
import { Title } from "./Title";

const PolicyHighlight = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 transition-transform hover:transform hover:scale-105">
    <div className="mb-4 p-3 rounded-full bg-orange-50">
      <Icon className="w-8 h-8 text-orange-300" strokeWidth={1.5} />
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm text-center">{description}</p>
  </div>
);

const PolicyHighlights = () => {
  const policies = [
    {
      icon: Clock,
      title: "7 Days Return",
      description: "Full refund within 7 days for manufacturing defects",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Dedicated customer support team at your service",
    },
    {
      icon: BadgeCheck,
      title: "Quality Assured",
      description: "Every product passes our quality checks",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "100% secure payment processing",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on all prepaid orders",
    },
  ];

  return (
    <div className="bg-white py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-2xl">
            <Title text1={"Our"} text2={" Policies"} />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We believe in making your shopping experience as smooth as possible
            with our customer-friendly policies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((policy, index) => (
            <PolicyHighlight
              key={index}
              icon={policy.icon}
              title={policy.title}
              description={policy.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyHighlights;
