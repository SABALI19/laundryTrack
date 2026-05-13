import React from "react";
import { PhoneCall, Play } from "lucide-react";
import Button from "../Button.jsx"; 
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();


  return (
    <section className="bg-[#f6f4f2] ">
      <div className="mx-auto w-full rounded-none bg-[#35558b] px-6 py-14 text-center text-white sm:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">
          Experience Laundry You Can Trust
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
          Join thousands of customers who trust LaundryTrack for transparent,
          accountable laundry service. See every step of your laundry journey.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
          variant=""
           onClick={() => navigate('/dashboard/customer')}
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#35558b] shadow-sm transition hover:bg-[#f3f5f8]"
          >
            <Play className="h-4 w-4" />
            Start Your First Order
          </Button>

          <Button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
          >
            <PhoneCall className="h-4 w-4" />
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
