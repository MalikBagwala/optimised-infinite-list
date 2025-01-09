import { useEffect, useState } from "react";
type ItemType = {
  id: number;
  title: string;
};

function generateItems(prevId: number = 0, size: number = 13) {
  return new Promise<ItemType[]>((resolve) => {
    setTimeout(() => {
      return resolve(
        Array.from({ length: size }).map((_, index) => {
          const newId = prevId + index + 1;
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
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      const response = await generateItems();
      setLoading(false);
      setItems(response);
    }
    const observer = new IntersectionObserver(
      async (entries) => {
        const sentinal = entries[0];
        if (sentinal.isIntersecting) {
          setLoading(true);
          const response = await generateItems(items.at(-1)?.id);
          setLoading(false);
          setItems((prev) => prev.concat(response));
          // setItems((prev) => {
          //   const lastItem = prev.at(-1);
          //   return prev.concat(generateItems(lastItem?.id));
          // });
        }
      },
      { threshold: 1 }
    );
    const sentinalElement = document.getElementById("card-sentinal");
    if (sentinalElement) observer.observe(sentinalElement);
    fetchInitialData();
  }, []);
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
        ) : items.length ? (
          <div id="card-sentinal"></div>
        ) : null}
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
