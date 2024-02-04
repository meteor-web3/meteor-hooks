import { useCallback } from "react";

import {
  MirrorFile,
  SYSTEM_CALL,
  StructuredFolder,
} from "@meteor-web3/connector";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import { CreateBareFileArgs, MutationStatus } from "../types";
import { useMutation } from "../utils";
import { deepAssignRenameKey } from "../utils/object";

export const useCreateBareFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: CreateBareFileArgs) => void;
  onSuccess?: (result: MirrorFile) => void;
}) => {
  const { connector } = useStore();
  const {
    actionUpdateFolders,
    actionUpdateDataUnionsByFile,
    actionCreateFile,
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
  const createBareFile = useCallback(
    async (args: CreateBareFileArgs) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending(args);
        }

        const { currentFolder, newFile } = await connector.runOS({
          method: SYSTEM_CALL.createBareFile,
          params: args,
        });

        actionUpdateFolders(
          deepAssignRenameKey(currentFolder, [
            { mirror: "mirrorFile" },
          ]) as StructuredFolder,
        );
        // if (args.dataUnionId) {
        //   actionUpdateDataUnionsByFile(newFile);
        // }

        setResult(newFile);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params.onSuccess(newFile);
        }
        return newFile;
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
      actionCreateFile,
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
    createdBareFile: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    createBareFile,
  };
};
