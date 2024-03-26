import { useCallback } from "react";

import { DataAssetParser } from "@pyra-marketplace/assets-sdk/data-asset";
import { DataToken } from "@pyra-marketplace/assets-sdk/data-token";
import { BigNumber } from "ethers";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { CollectFileArgs, MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useCollectFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: CollectFileArgs) => void;
  onSuccess?: (result: BigNumber) => void;
}) => {
  const { connector } = useStore();
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
  } = useMutation<BigNumber>();
  const collectFile = useCallback(
    async (args: CollectFileArgs) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending(args);
        }

        const dataAssetParser = new DataAssetParser(connector);
        const dataAsset = await dataAssetParser.parse(args.fileId);

        const dataToken = new DataToken({
          fileId: dataAsset.fileOrFolderId,
          assetId: dataAsset.assetId,
          chainId: dataAsset.chainId,
          connector,
        });

        const collectResult = await dataToken!.collect(args.withSig);

        setResult(collectResult);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params.onSuccess(collectResult);
        }
        return collectResult;
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
    collectedFileContent: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    collectFile,
  };
};
