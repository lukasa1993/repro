import { hydrateRoot } from "react-dom/client";
import { startTransition } from "react";
import Root from "./root";

const el = document.getElementById("root");
startTransition(() => {
  hydrateRoot(el!, <Root />);
});
