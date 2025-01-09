import { useCallback, useEffect, useState } from "react";
type ItemType = {
  id: number;
  title: string;
};

function getSentinal() {
  return document.getElementById("card-sentinal");
}
function generateItems(page: number = 1, size: number = 13) {
  return new Promise<ItemType[]>((resolve) => {
    setTimeout(() => {
      return resolve(
        Array.from({ length: size }).map((_, index) => {
          const newId = (page - 1) * size + (index + 1);
          return {
            id: newId,
            title: `Item ${newId}`,
          };
        })
      );
    }, 2000);
  });
}

function App() {
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);
  const [page, setPage] = useState(1);

  const observerCallback = useCallback<IntersectionObserverCallback>(
    async (entries) => {
      const sentinal = entries[0];
      if (sentinal.isIntersecting) {
        const newPage = page + 1;
        setPage(newPage);
        setLoading(true);
        const response = await generateItems(newPage);
        console.log("INTERSECTING", newPage, response);
        setLoading(false);
        setItems((prev) => prev.concat(response));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, items.length]
  );
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const response = await generateItems();
      setLoading(false);
      setItems(response);
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    const sentinalElement = getSentinal();
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1,
    });
    if (sentinalElement) observer.observe(sentinalElement);

    return function cleanup() {
      observer.disconnect();
    };
  }, [observerCallback]);
  return (
    <div className="app">
      <div className="sidebar">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className="cards">
        {items.map(({ id, title }) => (
          <div className="card" key={id}>
            {title}
          </div>
        ))}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          items.length && <div id="card-sentinal"></div>
        )}
      </div>
      <div className="notes">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
        expedita commodi officiis sint nisi eum ipsam animi. Molestiae,
        reprehenderit debitis.
      </div>
    </div>
  );
}

export default App;
