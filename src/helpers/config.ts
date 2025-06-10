import { PrivyClientConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
    showWalletUIs: false,
  },

  loginMethods: [
    "email",
    "google",
    "twitter",
    "wallet",
    "farcaster",
    "discord",
    "instagram",
  ],

  appearance: {
    theme: "light",
    showWalletLoginFirst: true,
    // landingHeader: "Your custom header text",
    // loginMessage: "Your custom header text",
  },
  //   walletConnectCloudProjectId: projectId,
};
