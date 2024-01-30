import { useCallback } from "react";

import { SYSTEM_CALL } from "@meteor-web3/connector";

import { DATATOKENID_NOT_EXIST } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import { DataTokenInfo, MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useLoadDataTokens = (params?: {
  onError?: (error: any) => void;
  onPending?: (fileIds: string[]) => void;
  onSuccess?: (result: DataTokenInfo[]) => void;
}) => {
  const { connector, filesMap } = useStore();
  const { actionUpdateDataTokenInfos } = useAction();

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
  } = useMutation<DataTokenInfo[]>();

  const loadDataTokens = useCallback(
    async (fileIds: string[]) => {
      // try {
      //   setStatus(MutationStatus.Pending);
      //   if (params?.onPending) {
      //     params.onPending(fileIds);
      //   }
      //   const dataTokenIds = fileIds.map(fileId => {
      //     const dataTokenId = Object.values(filesMap || {}).find(files =>
      //       Object.values(files).find(file => file.fileId === fileId),
      //     )?.[fileId].accessControl?.monetizationProvider?.dataTokenId;
      //     if (!dataTokenId) {
      //       throw DATATOKENID_NOT_EXIST;
      //     }
      //     return dataTokenId;
      //   });
      //   const dataTokenInfos = await connector.runOS({
      //     method: SYSTEM_CALL.loadDataTokens,
      //     params: dataTokenIds,
      //   });
      //   actionUpdateDataTokenInfos({
      //     fileIds,
      //     dataTokenInfos,
      //   });
      //   setStatus(MutationStatus.Succeed);
      //   setResult(dataTokenInfos);
      //   if (params?.onSuccess) {
      //     params.onSuccess(dataTokenInfos);
      //   }
      //   return dataTokenInfos;
      // } catch (error) {
      //   setStatus(MutationStatus.Failed);
      //   setError(error);
      //   if (params?.onError) {
      //     params.onError(error);
      //   }
      //   throw error;
      // }
    },
    [
      connector,
      filesMap,
      actionUpdateDataTokenInfos,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    dataTokenInfos: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    loadDataTokens,
  };
};
