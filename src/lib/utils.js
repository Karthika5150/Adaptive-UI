import { cvA } from "class-variance-authority";

export const cn = (...inputs) => {
  return inputs.filter(Boolean).join(" ");
};