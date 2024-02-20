import { useCallback } from "react";

import { Model } from "@dataverse/dapp-table";
import { MirrorFile, ModelName, SYSTEM_CALL } from "@meteor-web3/connector";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import { LoadFilesResult, MutationStatus, RequiredByKeys } from "../types";
import { useMutation } from "../utils";

export const useFeeds = (params: {
  model: Model;
  onError?: (error: any) => void;
  onPending?: (model: Model) => void;
  onSuccess?: (result: LoadFilesResult) => void;
}) => {
  const { connector } = useStore();
  const { actionLoadFiles, actionLoadActions } = useAction();

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
  } = useMutation<LoadFilesResult>();

  const loadFeeds = useCallback(async () => {
    try {
      if (!connector) {
        throw METEOR_CONNECTOR_UNDEFINED;
      }
      setStatus(MutationStatus.Pending);
      if (params?.onPending) {
        params.onPending(params.model);
      }

      const modelId =
        params.model.streams[params.model.streams.length - 1].modelId;

      const files: LoadFilesResult = await connector.runOS({
        method: SYSTEM_CALL.loadFilesBy,
        params: {
          modelId,
        },
      });

      if (params.model.modelName !== ModelName.indexFile) {
        if (params.model.modelName === ModelName.actionFile) {
          const filesMap = Object.fromEntries<
            RequiredByKeys<MirrorFile, "action" | "relationId">
          >(
            Object.entries(files as any).map(([fileId, file]) => [
              fileId,
              {
                fileId,
                controller: (file as any).pkh,
                ...(file as any).fileContent.file,
                content: (file as any).fileContent.content,
              },
            ]),
          );
          actionLoadActions(filesMap);
        } else {
          actionLoadFiles(files, modelId);
        }
      }

      setStatus(MutationStatus.Succeed);
      setResult(files);
      if (params?.onSuccess) {
        params.onSuccess(files);
      }
      return files;
    } catch (error) {
      setStatus(MutationStatus.Failed);
      setError(error);
      if (params?.onError) {
        params.onError(error);
      }
      throw error;
    }
  }, [
    connector,
    actionLoadFiles,
    setStatus,
    setError,
    setResult,
    params.model,
    params.onPending,
    params.onError,
    params.onSuccess,
  ]);

  return {
    feeds: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    loadFeeds,
  };
};
