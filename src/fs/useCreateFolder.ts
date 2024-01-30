import { useCallback } from "react";

import { SYSTEM_CALL, StructuredFolder } from "@meteor-web3/connector";

import { useStore } from "../store";
import { useAction } from "../store";
import { MutationStatus } from "../types";
import { useMutation } from "../utils";
import { deepAssignRenameKey } from "../utils/object";

export const useCreateFolder = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: {
    folderName: string;
    folderDescription?: string;
  }) => void;
  onSuccess?: (result?: StructuredFolder) => void;
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
  } = useMutation<StructuredFolder>();

  /**
   * create Folder
   * @param folderType Folder type
   * @param folderName Folder name
   * @param folderDescription Folder description
   * @param reRender reRender page ?
   */
  const createFolder = useCallback(
    async ({
      folderName,
      folderDescription,
    }: {
      folderName: string;
      folderDescription?: string;
    }) => {
      try {
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending({
            folderName,
            folderDescription,
            // reRender,
          });
        }

        const { newFolder } = await connector.runOS({
          method: SYSTEM_CALL.createFolder,
          params: {
            folderName,
            folderDescription,
          },
        });

        actionUpdateFolders(
          deepAssignRenameKey(newFolder, [
            { mirror: "mirrorFile" },
          ]) as StructuredFolder,
        );

        setResult(newFolder);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params.onSuccess(newFolder);
        }
        return newFolder;
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
    createdFolder: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    createFolder,
  };
};
