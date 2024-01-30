import { useCallback } from "react";

import { DataToken } from "@arcstone/arcstone-sdk/data-token";

import { useStore } from "../store";

export const useQueryDataToken = () => {
  const { connector } = useStore();

  const loadDataTokensByCreator = useCallback(
    async (address: string) => {
      const dataToken = new DataToken({
        connector,
      });
      return await dataToken.loadCreatedTokenFiles(address);
    },
    [connector],
  );

  const loadDataTokensByCollector = useCallback(
    async (address: string) => {
      const dataToken = new DataToken({
        connector,
      });
      return await dataToken.loadCollectedTokenFiles(address);
    },
    [connector],
  );

  // const isDataTokenCollectedBy = useCallback(
  //   async (params: string) => {
  //     const dataToken = new DataToken({
  //       connector,
  //     });
  //     return await dataToken.isDataTokenCollectedBy(address);
  //   },
  //   [connector],
  // );

  return {
    loadDataTokensByCreator,
    loadDataTokensByCollector,
    // isDatatokenCollectedBy,
  };
};
