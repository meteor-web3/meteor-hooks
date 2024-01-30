import { useCallback } from "react";

import { SYSTEM_CALL, FileType } from "@meteor-web3/connector";

import { useStore } from "../store";
import { useAction } from "../store";
import {
  MutationStatus,
  UpdateFileArgs,
  UpdateIndexFileResult,
} from "../types";
import { useMutation } from "../utils";

export const useUpdateIndexFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: UpdateFileArgs) => void;
  onSuccess?: (result: UpdateIndexFileResult) => void;
}) => {
  const { connector, filesMap } = useStore();
  const {
    actionUpdateFile,
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
  } = useMutation<UpdateIndexFileResult>();

  const updateIndexFile = useCallback(
    async ({ fileId, fileName, fileContent, encrypted }: UpdateFileArgs) => {
      try {
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending({
            fileId,
            fileContent,
            encrypted,
          });
        }
        // const modelStream = model.streams[model.streams.length - 1];

        const fileType = Object.values(filesMap || {}).find(files =>
          Object.values(files).find(file => file.fileId === fileId),
        )?.[fileId].fileType;
        if (
          // !modelStream.isPublicDomain &&
          fileContent &&
          encrypted &&
          fileType === FileType.PublicFileType
        ) {
          for (const key in encrypted) {
            (encrypted as any)[key] = false;
          }
        }
        const _fileContent = {
          ...fileContent,
          encrypted: JSON.stringify(encrypted),
        };

        const updateResult: UpdateIndexFileResult = await connector.runOS({
          method: SYSTEM_CALL.updateIndexFile,
          params: {
            fileId,
            fileName,
            fileContent: fileContent && _fileContent,
            syncImmediately: true,
          },
        });

        actionUpdateFile({
          ...updateResult,
          ...updateResult.fileContent.file,
          content: updateResult.fileContent.content,
        });
        actionUpdateFoldersByFile({
          ...updateResult.fileContent.file,
          content: updateResult.fileContent.content,
        });
        actionUpdateDataUnionsByFile({
          ...updateResult.fileContent.file,
          content: updateResult.fileContent.content,
        });

        setStatus(MutationStatus.Succeed);
        setResult(updateResult);
        if (params?.onSuccess) {
          params.onSuccess(updateResult);
        }

        return updateResult;
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
      connector,
      filesMap,
      actionUpdateFile,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    updatedFileContent: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    updateIndexFile,
  };
};
