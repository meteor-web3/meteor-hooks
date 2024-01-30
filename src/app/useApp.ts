import { useCallback, useEffect } from "react";

import { AuthType, SYSTEM_CALL, WALLET } from "@meteor-web3/connector";

import { useCapability } from "./useCapability";
import { useWallet } from "./useWallet";
import { useAction, useStore } from "../store";
import { ConnectResult, MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useApp = ({
  appId,
  autoConnect = false,
  onError,
  onPending,
  onSuccess,
}: {
  appId: string;
  autoConnect?: boolean;
  onError?: (error: any) => void;
  onPending?: (args?: { wallet?: WALLET; provider?: any }) => void;
  onSuccess?: (result: ConnectResult) => void;
}) => {
  const { connector, address, pkh } = useStore();

  const { actionConnectWallet, actionCreateCapability } = useAction();

  const { connectWallet } = useWallet();

  const { createCapability } = useCapability();

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
  } = useMutation<ConnectResult>();

  useEffect(() => {
    if (autoConnect) {
      autoConnectApp();
    }
  }, [autoConnect]);

  const autoConnectApp = useCallback(async () => {
    if (!address && !pkh) {
      const hasCapability = await connector.runOS({
        method: SYSTEM_CALL.checkCapability,
        params: {
          appId,
        },
      });

      if (hasCapability) {
        const connectResult = await connector.getCurrentWallet();
        if (connectResult) {
          actionConnectWallet(connectResult);
          await connector.connectWallet({
            wallet: connectResult.wallet,
          });
          const currentPkh = connector.getCurrentPkh();
          actionCreateCapability({ pkh: currentPkh, appId });
        }
      }
    }
  }, [connector, address, pkh, actionConnectWallet, actionCreateCapability]);

  const connectApp = useCallback(
    async (args?: {
      wallet?: WALLET;
      preferredAuthType?: AuthType;
      provider?: any;
    }) => {
      try {
        setStatus(MutationStatus.Pending);
        if (onPending) {
          onPending(args);
        }
        const connectWalletResult = await connectWallet({
          wallet: args?.wallet,
          preferredAuthType: args?.preferredAuthType,
          provider: args?.provider,
        });
        const pkh = await createCapability(appId);
        const connectResult = {
          ...connectWalletResult,
          pkh,
        };

        setResult(connectResult);
        setStatus(MutationStatus.Succeed);
        if (onSuccess) {
          onSuccess(connectResult);
        }

        return connectResult;
      } catch (error) {
        setError(error);
        setStatus(MutationStatus.Failed);
        if (onError) {
          onError(error);
        }
        throw error;
      }
    },
    [
      connector,
      connectWallet,
      createCapability,
      setStatus,
      setError,
      setResult,
      onPending,
      onError,
      onSuccess,
    ],
  );

  return {
    connectInfo: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    connectApp,
  };
};
