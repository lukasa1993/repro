import HelloWorld from "./HelloWorld";
import { render, screen } from "@testing-library/react";

beforeEach(() => {
  screen.debug();
});

test("renders a heading", () => {
  const { container } = render(<HelloWorld />);
  expect(container.firstChild).toHaveRole("heading");
});

test("greets the world", () => {
  render(<HelloWorld />);
  expect(screen.getByRole("heading")).toHaveTextContent("Hello World");
});
