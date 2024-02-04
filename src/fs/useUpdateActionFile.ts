import { useCallback } from "react";

import {
  MirrorFile,
  SYSTEM_CALL,
  StructuredFolder,
} from "@meteor-web3/connector";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import {
  UpdateActionFileArgs,
  UpdateActionFileResult,
  MutationStatus,
  RequiredByKeys,
} from "../types";
import { useMutation } from "../utils";
import { deepAssignRenameKey } from "../utils/object";

export const useUpdateActionFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: UpdateActionFileArgs) => void;
  onSuccess?: (result: UpdateActionFileResult) => void;
}) => {
  const { connector } = useStore();
  const { actionUpdateFolders, actionUpdateFile, actionUpdateAction } =
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
  } = useMutation<UpdateActionFileResult>();

  const updateActionFile = useCallback(
    async (args: UpdateActionFileArgs) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params?.onPending(args);
        }

        const { currentFile, currentFolder } = await connector.runOS({
          method: SYSTEM_CALL.updateActionFile,
          params: { ...args },
        });

        actionUpdateFile(currentFile);
        actionUpdateAction(
          currentFile as RequiredByKeys<MirrorFile, "action" | "relationId">,
        );
        actionUpdateFolders(
          deepAssignRenameKey(currentFolder, [
            { mirror: "mirrorFile" },
          ]) as StructuredFolder,
        );

        setResult(currentFile);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params?.onSuccess(currentFile);
        }
        return currentFile;
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
      actionUpdateFile,
      actionUpdateAction,
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
    updatedActionFile: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    updateActionFile,
  };
};
