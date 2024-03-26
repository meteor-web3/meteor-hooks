import { useCallback } from "react";

import { MirrorFileRecord } from "@meteor-web3/connector";
import { DataToken } from "@pyra-marketplace/assets-sdk/data-token";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";
import { MutationStatus } from "../types";
import { useMutation } from "../utils";

export const useLoadCreatedDataTokenFiles = (params?: {
  onError?: (error: any) => void;
  onPending?: () => void;
  onSuccess?: (result?: MirrorFileRecord) => void;
}) => {
  const { connector } = useStore();

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

  const loadCreatedDataTokenFiles = useCallback(async () => {
    try {
      if (!connector) {
        throw METEOR_CONNECTOR_UNDEFINED;
      }
      setStatus(MutationStatus.Pending);
      if (params?.onPending) {
        params.onPending();
      }
      const dataToken = new DataToken({
        connector,
      });

      const res = await dataToken.loadCreatedTokenFiles(connector.address);
      const files = Object.fromEntries(
        Object.values(res).map(item => [
          item.fileContent.file?.fileId,
          { ...item.fileContent.file, content: item.fileContent.content },
        ]),
      );

      setResult(files);
      setStatus(MutationStatus.Succeed);
      if (params?.onSuccess) {
        params.onSuccess(files);
      }
      return files;
    } catch (error) {
      setError(error);
      setStatus(MutationStatus.Failed);
      if (params?.onError) {
        params.onError(error);
      }
      throw error;
    }
  }, [
    connector,
    setStatus,
    setError,
    setResult,
    params?.onPending,
    params?.onError,
    params?.onSuccess,
  ]);

  return {
    createdDataTokenFiles: result,
    error,
    status,
    isIdle,
    isPending,
    isSucceed,
    isFailed,
    setStatus,
    reset,
    loadCreatedDataTokenFiles,
  };
};
