import { useCallback } from "react";

import { SYSTEM_CALL } from "@meteor-web3/connector";
import { DataToken } from "@pyra-marketplace/assets-sdk/data-token";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { useAction } from "../store";
import {
  CreateTokenFileArgs,
  MonetizeFileResult,
  MutationStatus,
} from "../types";
import { useMutation } from "../utils";

export const useCreateTokenFile = (params?: {
  onError?: (error: any) => void;
  onPending?: (args: CreateTokenFileArgs) => void;
  onSuccess?: (result: MonetizeFileResult) => void;
}) => {
  const { connector } = useStore();
  const { actionCreateFile } = useAction();

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

  const createTokenFile = useCallback(
    async (args: CreateTokenFileArgs) => {
      try {
        if (!connector) {
          throw METEOR_CONNECTOR_UNDEFINED;
        }
        setStatus(MutationStatus.Pending);
        if (params?.onPending) {
          params?.onPending(args);
        }

        const dataToken = new DataToken({
          chainId: args.chainId,
          connector,
        });

        const encrypted: { [k: string]: boolean } = {};
        if (args.fileContent && Object.keys(args.fileContent).length > 0) {
          Object.keys(args.fileContent).forEach(key => {
            encrypted[key] = false;
          });
        }

        const inputFileContent = {
          encrypted,
          ...args.fileContent,
        };

        const createdTokenFile: MonetizeFileResult =
          await dataToken.createTokenFile({
            modelId: args.modelId,
            fileName: args.fileName,
            fileContent: {
              ...inputFileContent,
              encrypted:
                typeof inputFileContent.encrypted === "string"
                  ? inputFileContent.encrypted
                  : JSON.stringify(inputFileContent.encrypted),
            },
            actionsConfig: args.actionsConfig,
          });

        actionCreateFile(
          {
            ...createdTokenFile,
            ...createdTokenFile.fileContent.file,
            content: createdTokenFile.fileContent.content,
          },
          args.modelId,
        );

        setResult(createdTokenFile);
        setStatus(MutationStatus.Succeed);
        if (params?.onSuccess) {
          params?.onSuccess(createdTokenFile);
        }
        return createdTokenFile;
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
      actionCreateFile,
      setStatus,
      setError,
      setResult,
      params?.onPending,
      params?.onError,
      params?.onSuccess,
    ],
  );

  return {
    createdTokenFile: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    createTokenFile,
  };
};
