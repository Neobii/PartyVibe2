import { describe, it, expect } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "./query-client";

describe("makeQueryClient", () => {
  it("returns a QueryClient instance", () => {
    const client = makeQueryClient();
    expect(client).toBeInstanceOf(QueryClient);
  });

  it("applies staleTime default", () => {
    const client = makeQueryClient();
    const defaults = client.getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(60 * 1000);
  });
});
