import cafes from "../data/cafes.mock.json";

export const listCafes = () => cafes;
export const getCafeById = (id) =>
  cafes.find(c => String(c.id) === String(id));
