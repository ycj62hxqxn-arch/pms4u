import { describe, expect, it } from "vitest";
import { isForbiddenHostname, isForbiddenIpAddress } from "../../lib/security/network";

describe("security/network", () => {
  it("blocks localhost and metadata hostnames", () => {
    expect(isForbiddenHostname("localhost")).toBe(true);
    expect(isForbiddenHostname("localhost.localdomain")).toBe(true);
    expect(isForbiddenHostname("metadata.google.internal")).toBe(true);
    expect(isForbiddenHostname("metadata")).toBe(true);
    expect(isForbiddenHostname("service.internal")).toBe(true);
    expect(isForbiddenHostname("169.254.169.254")).toBe(true);
  });

  it("blocks loopback and RFC1918 IPv4 ranges", () => {
    expect(isForbiddenIpAddress("127.0.0.1")).toBe(true);
    expect(isForbiddenIpAddress("10.0.0.5")).toBe(true);
    expect(isForbiddenIpAddress("172.16.4.1")).toBe(true);
    expect(isForbiddenIpAddress("192.168.1.100")).toBe(true);
  });

  it("blocks IPv6 loopback and link-local", () => {
    expect(isForbiddenIpAddress("::1")).toBe(true);
    expect(isForbiddenIpAddress("fe80::1")).toBe(true);
  });

  it("blocks metadata and documentation ranges", () => {
    expect(isForbiddenIpAddress("169.254.169.254")).toBe(true);
    expect(isForbiddenIpAddress("198.51.100.42")).toBe(true);
    expect(isForbiddenIpAddress("203.0.113.10")).toBe(true);
    expect(isForbiddenIpAddress("2001:db8::1")).toBe(true);
  });

  it("allows public hostnames and public IPs", () => {
    expect(isForbiddenHostname("example.com")).toBe(false);
    expect(isForbiddenIpAddress("8.8.8.8")).toBe(false);
    expect(isForbiddenIpAddress("2606:4700:4700::1111")).toBe(false);
  });
});
