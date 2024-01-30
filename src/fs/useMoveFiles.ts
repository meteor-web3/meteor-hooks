import { useCallback } from "react";

import {
  MirrorFileRecord,
  SYSTEM_CALL,
  StructuredFolderRecord,
} from "@meteor-web3/connector";

import { useStore } from "../store";
import { useAction } from "../store";
import { MutationStatus } from "../types";
import { useMutation } from "../utils";
import { deepAssignRenameKey } from "../utils/object";

export const useMoveFiles = (params?: {
  onError?: (error: unknown) => void;
  onPending?: (args: {
    sourceIndexFileIds: string[];
    targetFolderId: string;
    syncImmediately?: boolean;
  }) => void;
  onSuccess?: (result: MirrorFileRecord) => void;
}) => {
  const { connector } = useStore();
  const { actionUpdateFolders } = useAction();

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
  } = useMutation<MirrorFileRecord>();

  /**
   * move mirror from sourceFolder to targetFolder by id
   * @param sourceMirrorIds source mirrors id
   * @param targetFolderId target folder id
   * @param reRender reRender page ?
   * @param syncImmediately sync ?
   */
  const moveFiles = useCallback(
    async ({
      sourceIndexFileIds,
      targetFolderId,
      syncImmediately = false,
    }: {
      sourceIndexFileIds: string[];
      targetFolderId: string;
      reRender?: boolean;
      syncImmediately?: boolean;
    }) => {
      try {
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending({
            sourceIndexFileIds,
            targetFolderId,
            syncImmediately,
          });
        }

        const { sourceFolders, targetFolder, movedFiles } =
          await connector.runOS({
            method: SYSTEM_CALL.moveFiles,
            params: {
              targetFolderId,
              fileIds: sourceIndexFileIds,
              syncImmediately,
            },
          });

        actionUpdateFolders(
          deepAssignRenameKey(
            Object.values(sourceFolders || {}).concat(targetFolder),
            [{ mirror: "mirrorFile" }],
          ) as StructuredFolderRecord,
        );

        setResult(movedFiles);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params.onSuccess(movedFiles);
        }
        return movedFiles;
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
      actionUpdateFolders,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    movedFiles: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    moveFiles,
  };
};
