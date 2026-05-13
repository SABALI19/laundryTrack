import React from "react";
import {
  CircleHelp,
  Clock3,
  Headphones,
  ShieldCheck,
  Smartphone,
  Star,
} from "lucide-react";

const reasons = [
  {
    title: "Complete Transparency",
    description:
      "See exactly where your items are at every stage with detailed photo documentation and real-time updates.",
    icon: CircleHelp,
  },
  {
    title: "Item Safety Guaranteed",
    description:
      "Every piece is tracked individually with photo proof, ensuring nothing gets lost or damaged during processing.",
    icon: ShieldCheck,
  },
  {
    title: "Mobile Convenience",
    description:
      "Track your orders, view photos, and communicate with our team all from your mobile device.",
    icon: Smartphone,
  },
  {
    title: "Real-Time Updates",
    description:
      "Get instant notifications when your laundry moves to the next stage of processing.",
    icon: Clock3,
  },
  {
    title: "Premium Quality",
    description:
      "Professional cleaning with attention to detail, ensuring your clothes look their absolute best.",
    icon: Star,
  },
  {
    title: "24/7 Support",
    description:
      "Our customer service team is always available to help with questions or special requests.",
    icon: Headphones,
  },
];

const WhyWasha = () => {
  return (
    <section className="bg-[#f6f4f2] px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-[#202020] sm:text-3xl">
            Why Choose LaundryTrack?
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#666666] sm:text-base">
            Built for trust and transparency, giving you complete peace of mind
            with every order.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="rounded-2xl border border-[#ece7e2] bg-white p-6 shadow-[0_10px_30px_rgba(24,39,75,0.05)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff0ef]">
                  <Icon className="h-4 w-4 text-[#178b8f]" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#202020]">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#666666]">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyWasha;
