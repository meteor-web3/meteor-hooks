import { useCallback } from "react";

import { SYSTEM_CALL } from "@meteor-web3/connector";
import { DataAssetParser } from "@pyra-marketplace/assets-sdk/data-asset";
import { DataToken } from "@pyra-marketplace/assets-sdk/data-token";

import { METEOR_CONNECTOR_UNDEFINED } from "../errors";
import { useStore } from "../store";

export const useQueryDataToken = () => {
  const { connector } = useStore();

  const loadDataTokensByCreator = useCallback(
    async (address: string) => {
      if (!connector) {
        throw METEOR_CONNECTOR_UNDEFINED;
      }
      const dataToken = new DataToken({
        connector,
      });
      return await dataToken.loadCreatedTokenFiles(address);
    },
    [connector],
  );

  const loadDataTokensByCollector = useCallback(
    async (address: string) => {
      if (!connector) {
        throw METEOR_CONNECTOR_UNDEFINED;
      }
      const dataToken = new DataToken({
        connector,
      });
      return await dataToken.loadCollectedTokenFiles(address);
    },
    [connector],
  );

  const loadDataTokensById = useCallback(async (dataTokenIds: string[]) => {
    return await DataToken.loadDataTokens(dataTokenIds);
  }, []);

  const loadDataTokenCollectors = useCallback(async (dataTokenId: string) => {
    return await DataToken.loadDataTokenCollectors(dataTokenId);
  }, []);

  const isFileCollected = useCallback(
    async (fileId: string, address?: string) => {
      if (!connector) {
        throw METEOR_CONNECTOR_UNDEFINED;
      }
      const dataAssetParser = new DataAssetParser(connector);
      const dataAsset = await dataAssetParser.parse(fileId);

      const dataToken = new DataToken({
        chainId: dataAsset.chainId,
        fileId: dataAsset.fileOrFolderId,
        assetId: dataAsset.assetId,
        connector,
      });

      return (await dataToken!.isCollected(
        address || connector.address,
      )) as boolean;
    },
    [connector],
  );

  const isFileUnlocked = useCallback(
    async (fileId: string) => {
      if (!connector) {
        throw METEOR_CONNECTOR_UNDEFINED;
      }
      return await connector.runOS({
        method: SYSTEM_CALL.isFileUnlocked,
        params: fileId,
      });
    },
    [connector],
  );

  return {
    loadDataTokensByCreator,
    loadDataTokensByCollector,
    loadDataTokensById,
    loadDataTokenCollectors,
    isFileCollected,
    isFileUnlocked,
  };
};
