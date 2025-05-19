import { createSignal, onMount } from "solid-js";

export const createIsMounted = () => {
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
  });

  return isMounted;
};
