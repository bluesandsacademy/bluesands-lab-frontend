import React from "react";

const LabOverviewPage = () => {
  return (
    <div className="m-4">
      <iframe
        src="https://www.youtube.com/embed/6R8EFrK0Vk0"
        className="rounded-sm w-full md:w-96 h-52 md:h-80 lg:w-[560px] lg:h-[315px] m-1 md:m-2 lg:m-4 mb-32"
        width="560"
        height="315"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Demo Video"
      ></iframe>
    </div>
  );
};

export default LabOverviewPage;
