import React from "react";
import Hero from "../components/Hero";

import OurPolicy from "../components/OurPolicy";
import CollectionsView from "../components/CollectionsView";

function Home() {
  return (
    <div>
      <Hero />
      {/* <LatestCollections /> */}
      <CollectionsView />
      <OurPolicy />
    </div>
  );
}

export default Home;
