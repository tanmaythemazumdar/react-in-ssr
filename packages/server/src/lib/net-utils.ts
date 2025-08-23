import net from 'node:net'
import os from 'node:os'

/**
 * Display local and network origins for a server's address.
 * @param {net.AddressInfo|string} addr
 * @param {{ https?: boolean, host: string }} options
 * @returns {string[]}
 */
export function getServerAddresses(addr: Pick<net.AddressInfo, 'port'> | string, { host, https }: { host: string, https?:boolean }): string[] {
  if (typeof addr === 'string') {
    return [addr]
  }

  const protocol = https ? 'https:' : 'http:'
  const port = addr.port

  if (host !== '0.0.0.0') {
    // Use the explicit value the user gave us
    return [`${protocol}//${host}:${port}`]
  }

  // If the user binds to all interfaces via `0.0.0.0`, we'll
  // query network interfaces to get addresses from.

  // Get network address
  const ifaces = os.networkInterfaces()

  // Print `0.0.0.0` as `localhost` as the former isn't
  // accessible.
  const addresses = [`${protocol}//localhost:${port}`]

  for (const name in ifaces) {
    for (const iface of ifaces?.[name] ?? []) {
      const { family, address, internal } = iface
      if (family === 'IPv4' && address !== host && !internal) {
        addresses.push(`${protocol}//${address}:${port}`)
      }
    }
  }

  return addresses
}
