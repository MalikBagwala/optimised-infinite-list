import React, { Suspense, useState } from "react";
import { createItemResource } from "./utils/data";

const ListItem = React.lazy(() => import("./ListItem")); // Lazy-loaded component

const InfiniteList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [resources, setResources] = useState([createItemResource(0)]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setResources((prev) => [...prev, createItemResource(nextPage)]);
    setPage(nextPage);
  };

  return (
    <div>
      {resources.map((resource, index) => (
        <Suspense key={index} fallback={<div>Loading Page {index + 1}...</div>}>
          <Page resource={resource} />
        </Suspense>
      ))}
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
};
