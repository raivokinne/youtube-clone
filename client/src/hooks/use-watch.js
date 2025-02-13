import { useEffect } from "react";

export const useWatch = (fn, inputs) => useEffect(fn, inputs);
