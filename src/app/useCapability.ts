import { useCallback } from "react";

import { SYSTEM_CALL } from "@meteor-web3/connector";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import { MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useCapability = (params?: {
  onError?: (error: any) => void;
  onPending?: (appId: string) => void;
  onSuccess?: (result: string) => void;
}) => {
  const { connector } = useStore();

  const { actionCreateCapability } = useAction();

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
  } = useMutation<string>();

  const createCapability = useCallback(
    async (appId: string) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params?.onPending(appId);
        }
        const { pkh: currentPkh } = await connector.runOS({
          method: SYSTEM_CALL.createCapability,
          params: {
            appId,
          },
        });

        actionCreateCapability({ pkh: currentPkh, appId });
        setStatus(MutationStatus.Succeed);
        setResult(currentPkh);
        if (params?.onSuccess) {
          params?.onSuccess(currentPkh);
        }
        return currentPkh;
      } catch (error) {
        setError(error);
        setStatus(MutationStatus.Failed);
        if (params?.onError) {
          params?.onError(error);
        }
        throw error;
      }
    },
    [
      connector,
      actionCreateCapability,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    pkh: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    createCapability,
  };
};
