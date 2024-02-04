import { useCallback } from "react";

import { MirrorFile, ModelName, SYSTEM_CALL } from "@meteor-web3/connector";
import { Model } from "@meteor-web3/model-parser";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import {
  LoadFilesByArgs,
  LoadFilesByResult,
  MutationStatus,
  RequiredByKeys,
} from "../types";
import { useMutation } from "../utils";

export const useFeedsByAddress = (params: {
  model: Model;
  onError?: (error: any) => void;
  onPending?: (args: LoadFilesByArgs) => void;
  onSuccess?: (result: LoadFilesByResult) => void;
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
  } = useMutation<LoadFilesByResult>();

  const loadFeedsByAddress = useCallback(
    async (pkh: string) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params.onPending({ pkh, model: params.model });
        }

        const modelId =
          params.model.streams[params.model.streams.length - 1].modelId;

        const files: LoadFilesByResult = await connector.runOS({
          method: SYSTEM_CALL.loadFilesBy,
          params: {
            modelId,
            pkh,
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
    },
    [
      connector,
      actionLoadFiles,
      actionLoadActions,
      setStatus,
      setError,
      setResult,
      params.model,
      params.onPending,
      params.onError,
      params.onSuccess,
    ],
  );

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
    loadFeedsByAddress,
  };
};
