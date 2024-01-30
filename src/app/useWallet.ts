import { useCallback } from "react";

import { AuthType, WALLET } from "@meteor-web3/connector";

import { useStore } from "../store";
import { useAction } from "../store";
import { ConnectWalletResult, MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useWallet = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: { wallet?: WALLET; provider?: any }) => void;
  onSuccess?: (result: ConnectWalletResult) => void;
}) => {
  const { connector } = useStore();

  const { actionConnectWallet } = useAction();

  const {
    result,
    setResult,
    error,
    setError,
    status,
    setStatus,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    reset,
  } = useMutation<ConnectWalletResult>();

  const connectWallet = useCallback(
    async ({
      wallet,
      preferredAuthType,
      provider,
    }: {
      wallet?: WALLET;
      preferredAuthType?: AuthType;
      provider?: any;
    }) => {
      try {
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending({ wallet, provider });
        }
        const connectResult = await connector.connectWallet({
          wallet,
          preferredAuthType,
          provider,
        });

        actionConnectWallet(connectResult);
        setStatus(MutationStatus.Succeed);
        setResult(connectResult);
        if (params?.onSuccess) {
          params.onSuccess(connectResult);
        }

        return connectResult;
      } catch (error) {
        setError(error);
        setStatus(MutationStatus.Failed);
        if (params?.onError) {
          params.onError(error);
        }
        throw error;
      }
    },
    [
      connector,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    walletInfo: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    connectWallet,
  };
};
