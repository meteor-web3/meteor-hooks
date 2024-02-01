import { useCallback } from "react";

import { DataToken } from "@arcstone/arcstone-sdk/data-token";
import { MirrorFile, SYSTEM_CALL } from "@meteor-web3/connector";

import { useStore } from "../store";
import { useAction } from "../store";
import {
  MonetizeFileArgs,
  MonetizeFileResult,
  MutationStatus,
  RequiredByKeys,
} from "../types";
import { useMutation } from "../utils";

export const useMonetizeFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: MonetizeFileArgs) => void;
  onSuccess?: (result: MonetizeFileResult) => void;
}) => {
  const { connector, address, profileIds, actionFilesMap } = useStore();
  const {
    actionUpdateFile,
    actionUpdateAction,
    actionUpdateFoldersByFile,
    actionUpdateDataUnionsByFile,
  } = useAction();
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
  } = useMutation<MonetizeFileResult>();
  const monetizeFile = useCallback(
    async (args: MonetizeFileArgs) => {
      try {
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending(args);
        }

        const dataToken = new DataToken({
          fileId: args.fileId,
          chainId: args.chainId,
          connector,
        });

        const monetizeResult = await dataToken.monetizeFile(args);

        if (
          actionFilesMap &&
          actionFilesMap[monetizeResult.fileContent.file.fileId]
        ) {
          actionUpdateAction({
            ...monetizeResult.fileContent,
            ...monetizeResult.fileContent.file,
            content: monetizeResult.fileContent.content,
          } as RequiredByKeys<MirrorFile, "action" | "relationId">);
        }
        actionUpdateFile({
          ...monetizeResult,
          ...monetizeResult.fileContent.file,
          content: monetizeResult.fileContent.content,
        });
        actionUpdateFoldersByFile({
          ...monetizeResult.fileContent.file,
          content: monetizeResult.fileContent.content,
        });
        setStatus(MutationStatus.Succeed);
        setResult(monetizeResult);
        if (params?.onSuccess) {
          params.onSuccess(monetizeResult);
        }
        return monetizeResult;
      } catch (error) {
        setStatus(MutationStatus.Failed);
        setError(error);
        if (params?.onError) {
          params.onError(error);
        }
        throw error;
      }
    },
    [
      address,
      profileIds,
      connector,
      actionFilesMap,
      actionUpdateFile,
      actionUpdateFoldersByFile,
      actionUpdateDataUnionsByFile,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );
  return {
    monetizedFileContent: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    monetizeFile,
  };
};
