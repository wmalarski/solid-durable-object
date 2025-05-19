import { onCleanup, onMount } from "solid-js";

export const createPreventMenu = () => {
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  onMount(() => {
    document.addEventListener("contextmenu", onContextMenu);
  });

  onCleanup(() => {
    document.removeEventListener("contextmenu", onContextMenu);
  });
};
