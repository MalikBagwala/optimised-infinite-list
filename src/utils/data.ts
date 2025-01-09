type ItemType = {
  id: number;
  title: string;
};
type ItemResource = {
  read: () => ItemType[];
};
export function fetchItems(page: number = 0, size: number = 13) {
  return new Promise<ItemType[]>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: size }).map((_, index) => {
          const newId = page + index + 1;
          return {
            id: newId,
            title: `Item ${newId}`,
          };
        })
      );
    }, 2000);
  });
}

export const createItemResource = (page: number): ItemResource => {
  let data: ItemType[] | undefined;
  let promise: Promise<ItemType[]>;

  return {
    read() {
      if (!data) {
        if (!promise) {
          promise = fetchItems(page).then((result) => {
            data = result;
          }) as Promise<ItemType[]>;
        }
        throw promise; // Suspense will catch this promise and retry once resolved
      }
      return data;
    },
  };
};
