import React from "react";
import { Camera } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "For Businesses"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "Track Order"],
  },
  {
    title: "Company",
    links: ["About", "Privacy", "Terms"],
  },
];

const socialLinks = [
  { label: "Twitter", icon: FaXTwitter, href: "#" },
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-[#f6f4f2]">
      <div className="h-3 w-full bg-[#35558b]" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,0.6fr))]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#35558b] text-white">
                <Camera className="h-4 w-4" />
              </div>
              <span className="text-xl font-semibold text-[#1f2937]">Washa</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#6b7280]">
              Transparent laundry service with photo verification at every
              step. Trust through accountability.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-[#1f2937]">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#6b7280]">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="transition hover:text-[#35558b]" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-[#e5e7eb] pt-6">
          <div className="flex flex-col gap-4 text-sm text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Washa. All rights reserved.</p>

            <div className="flex items-center gap-5">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    aria-label={item.label}
                    className="transition hover:text-[#35558b]"
                    href={item.href}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
