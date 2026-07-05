import { MockProvider } from "./data/mockProvider";
import { Overview } from "./pages/Overview";

/**
 * Provider wiring happens HERE and only here.
 * Swapping MockProvider for StaticProvider (#43) or EmbeddedProvider (#45)
 * is a one-line change — no component knows the difference.
 */
const provider = new MockProvider();

export default function App() {
  return <Overview provider={provider} />;
}
