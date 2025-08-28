import React from "react";
import Hero from "../components/Hero";

import OurPolicy from "../components/OurPolicy";

import CollectionsCategory from "../components/CollectionsCategory";

function Home() {
  return (
    <div>
      <Hero />
      {/* <LatestCollections /> */}
      {/* <CollectionsView /> */}
      <CollectionsCategory />
      <OurPolicy />
    </div>
  );
}

export default Home;
