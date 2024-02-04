import { useCallback } from "react";

import { SYSTEM_CALL, StructuredFolder } from "@meteor-web3/connector";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import { MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useDeleteFolder = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: {
    folderId: string;
    reRender?: boolean;
    syncImmediately?: boolean;
  }) => void;
  onSuccess?: (result: StructuredFolder) => void;
}) => {
  const { connector } = useStore();
  const { actionDeleteFolder, actionUpdateDataUnionsByDeleteFiles } =
    useAction();

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
  } = useMutation<StructuredFolder>();

  /**
   * delete folder by streamId
   * @param folderId
   * @param reRender reRender page
   */
  const deleteFolder = useCallback(
    async ({
      folderId,
      syncImmediately,
    }: {
      folderId: string;
      syncImmediately?: boolean;
    }) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending({
            folderId,
            syncImmediately,
          });
        }

        const { currentFolder } = await connector.runOS({
          method: SYSTEM_CALL.deleteFolder,
          params: {
            folderId,
            syncImmediately,
          },
        });

        actionDeleteFolder(currentFolder.folderId);
        actionUpdateDataUnionsByDeleteFiles(
          Object.keys(currentFolder.mirrorRecord),
        );

        setResult(currentFolder);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params.onSuccess(currentFolder);
        }
        return currentFolder;
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
      actionDeleteFolder,
      actionUpdateDataUnionsByDeleteFiles,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    deletedFolder: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    deleteFolder,
  };
};
