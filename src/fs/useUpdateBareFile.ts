import { useCallback } from "react";

import {
  MirrorFile,
  SYSTEM_CALL,
  StructuredFolder,
} from "@meteor-web3/connector";

import { useStore } from "../store";
import { useAction } from "../store";
import { MutationStatus, UpdateBareFileArgs } from "../types";
import { useMutation } from "../utils";
import { deepAssignRenameKey } from "../utils/object";

export const useUpdateBareFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: UpdateBareFileArgs) => void;
  onSuccess?: (result: MirrorFile) => void;
}) => {
  const { connector } = useStore();
  const {
    actionUpdateFolders,
    actionUpdateDataUnionsByFile,
    actionUpdateFile,
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
  } = useMutation<MirrorFile>();

  /**
   * add mirror to folder by folderId
   * @param folderId folder id
   * @param newMirrorsInfo
   * @param reRender reRender page ?
   * @param syncImmediately sync ?
   */
  const updateBareFile = useCallback(
    async (args: UpdateBareFileArgs) => {
      try {
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending(args);
        }

        const { currentFolder, currentFile } = await connector.runOS({
          method: SYSTEM_CALL.updateBareFile,
          params: { ...args },
        });

        actionUpdateFile(currentFile);
        actionUpdateFolders(
          deepAssignRenameKey(currentFolder, [
            { mirror: "mirrorFile" },
          ]) as StructuredFolder,
        );
        actionUpdateDataUnionsByFile(currentFile);

        setResult(currentFile);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params.onSuccess(currentFile);
        }
        return currentFile;
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
      actionUpdateFile,
      actionUpdateFolders,
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
    updatedBareFile: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    updateBareFile,
  };
};
