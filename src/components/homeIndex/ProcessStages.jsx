import React from "react";
import Pickup from "../../assets/images/process-image1.png";
import Sorting from "../../assets/images/Process-image2.png";
import Cleaning from "../../assets/images/Process-image3.png";
import Ready from "../../assets/images/Process-image4.png";
const stages = [
  {
    id: "1",
    title: "Pickup & Photo",
    description: "We photograph all items during pickup for your records",
    image:
      Pickup,
    alt: "Laundry pickup with photo verification",
  },
  {
    id: "2",
    title: "Sorting & Processing",
    description: "Items are sorted and processed with detailed documentation",
    image: Sorting,
    alt: "Laundry sorting and processing area",
  },
  {
    id: "3",
    title: "Professional Cleaning",
    description: "Expert cleaning with real-time status updates",
    image:
      Cleaning,
    alt: "Professional washing machines in a laundry facility",
  },
  {
    id: "4",
    title: "Ready for Pickup",
    description: "Final photos and notification when your order is ready",
    image:
      Ready,
    alt: "Clean folded laundry ready for pickup",
  },
];

const ProcessStages = () => {
  return (
    <section className="bg-[#fafbfc] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-[#202020] sm:text-3xl">
            See Every Step of Your Laundry Journey
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#666666] sm:text-base">
            From the moment we pick up your items to the final delivery, every
            step is documented with photos so you always know your laundry is
            safe.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => (
            <article
              key={stage.id}
              className="mx-auto flex max-w-[240px] flex-col items-center text-center"
            >
              <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <img
                  src={stage.image}
                  alt={stage.alt}
                  className="h-36 w-full object-cover"
                />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#178b8f] text-sm font-semibold text-white shadow">
                  {stage.id}
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#202020]">
                {stage.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-sm leading-6 text-[#666666]">
                {stage.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessStages;
