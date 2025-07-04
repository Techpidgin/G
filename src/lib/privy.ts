import { PrivyClient } from "@privy-io/server-auth";

declare global {
  var privy: PrivyClient | undefined;
}

const privy =
  global.privy ||
  new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    process.env.PRIVY_APP_SECRET!
  );

export default privy;
