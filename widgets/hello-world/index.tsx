import { createCustomElement } from "@/widgets";
import { Root } from "react-dom/client";
import { WidgetContainer } from "@/widgets/hello-world/container";

const ensureDependencies = () =>
  Promise.all([
    import("react"),
    import("react-dom/client"),
    import("./container"),
  ]);

createCustomElement(
  "hello-world",
  () =>
    class extends HTMLElement {
      root?: Root;

      connectedCallback() {
        if (!this.isConnected) return;
        ensureDependencies().then(
          ([React, { createRoot }, { WidgetContainer }]) => {
            this.root = createRoot(this);
            this.root.render(<WidgetContainer />);
          }
        );
      }

      disconnectedCallback() {
        if (!this.root) return;

        this.root.unmount();
        delete this.root;
      }
    }
).catch((error) =>
  console.error(`Could not load custom element hello-world: ${error.message}`)
);
