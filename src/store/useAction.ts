import { useCallback, useContext } from "react";

import {
  Chain,
  MirrorFile,
  MirrorFileRecord,
  StructuredFolder,
  StructuredFolderRecord,
  WALLET,
} from "@meteor-web3/connector";

import { MeteorContext } from "./useStore";
import { METEOR_CONTEXT_PROVIDER_ERROR } from "../errors";
import {
  ActionType,
  DataTokenInfo,
  FileResult,
  LoadFilesByResult,
  LoadFilesResult,
  RequiredByKeys,
} from "../types";

export const useAction = () => {
  let context = useContext(MeteorContext);
  // if (context === undefined) {
  //   throw METEOR_CONTEXT_PROVIDER_ERROR;
  // }
  if (context === undefined) {
    context = {
      dispatch: () => {
        throw METEOR_CONTEXT_PROVIDER_ERROR;
      },
    } as any;
  }

  const { dispatch } = context;

  const actionConnectWallet = useCallback(
    (connectResult: { address: string; chain: Chain; wallet: WALLET }) => {
      dispatch({
        type: ActionType.ConnectWallet,
        payload: connectResult,
      });
    },
    [dispatch],
  );

  const actionCreateCapability = useCallback(
    (res: { pkh: string; appId: string }) => {
      dispatch({
        type: ActionType.CreateCapability,
        payload: res,
      });
    },
    [dispatch],
  );

  const actionCreateFile = useCallback(
    (createdFile: MirrorFile & Partial<FileResult>, modelId: string) => {
      dispatch({
        type: ActionType.CreateFile,
        payload: { createdFile, modelId },
      });
    },
    [dispatch],
  );

  const actionUpdateFile = useCallback(
    (updatedFile: MirrorFile & Partial<FileResult>) => {
      dispatch({
        type: ActionType.UpdateFile,
        payload: updatedFile,
      });
    },
    [dispatch],
  );

  const actionDeleteFiles = useCallback(
    (fileIds: string[]) => {
      dispatch({
        type: ActionType.DeleteFiles,
        payload: fileIds,
      });
    },
    [dispatch],
  );

  const actionLoadFiles = useCallback(
    (loadedFiles: LoadFilesResult | LoadFilesByResult, modelId: string) => {
      dispatch({
        type: ActionType.LoadFiles,
        payload: { loadedFiles, modelId },
      });
    },
    [dispatch],
  );

  const actionLoadCollectedDataTokenFiles = useCallback(
    (loadedFiles: MirrorFileRecord) => {
      dispatch({
        type: ActionType.LoadCollectedDataTokenFiles,
        payload: loadedFiles,
      });
    },
    [dispatch],
  );

  const actionSetFolders = useCallback(
    (folders: StructuredFolderRecord) => {
      dispatch({
        type: ActionType.SetFolders,
        payload: folders,
      });
    },
    [dispatch],
  );

  const actionLoadProfileIds = useCallback(
    (profileIds: string[]) => {
      dispatch({
        type: ActionType.LoadProfileIds,
        payload: profileIds,
      });
    },
    [dispatch],
  );

  const actionUpdateFolders = useCallback(
    (newFolders: StructuredFolder | StructuredFolderRecord) => {
      dispatch({
        type: ActionType.UpdateFolders,
        payload: newFolders,
      });
    },
    [dispatch],
  );

  const actionCreateProfile = useCallback(
    (profileId: string) => {
      dispatch({
        type: ActionType.CreateProfileId,
        payload: profileId,
      });
    },
    [dispatch],
  );

  const actionDeleteFolder = useCallback(
    (folderId: string) => {
      dispatch({
        type: ActionType.DeleteFolder,
        payload: folderId,
      });
    },
    [dispatch],
  );

  const actionUpdateFoldersByFile = useCallback(
    (file: MirrorFile) => {
      dispatch({
        type: ActionType.UpdateFoldersByFile,
        payload: file,
      });
    },
    [dispatch],
  );

  const actionUpdateDataTokenInfo = useCallback(
    (payload: { fileId: string; dataTokenInfo: DataTokenInfo }) => {
      dispatch({
        type: ActionType.UpdateDataTokenInfo,
        payload,
      });
    },
    [dispatch],
  );

  const actionUpdateDataTokenInfos = useCallback(
    (payload: { fileIds: string[]; dataTokenInfos: DataTokenInfo[] }) => {
      dispatch({
        type: ActionType.UpdateDataTokenInfos,
        payload,
      });
    },
    [dispatch],
  );

  const actionSetDataUnions = useCallback(
    (dataUnions: StructuredFolderRecord) => {
      dispatch({
        type: ActionType.SetDataUnions,
        payload: dataUnions,
      });
    },
    [dispatch],
  );

  const actionUpdateDataUnion = useCallback(
    (dataUnion: StructuredFolder) => {
      dispatch({
        type: ActionType.UpdateDataUnion,
        payload: dataUnion,
      });
    },
    [dispatch],
  );

  const actionDeleteDataUnion = useCallback(
    (dataUnionId: string) => {
      dispatch({
        type: ActionType.DeleteDataUnion,
        payload: dataUnionId,
      });
    },
    [dispatch],
  );

  const actionUpdateDataUnionsByFile = useCallback(
    (file: MirrorFile) => {
      dispatch({
        type: ActionType.UpdateDataUnionsByFile,
        payload: file,
      });
    },
    [dispatch],
  );

  const actionUpdateDataUnionsByDeleteFiles = useCallback(
    (fileIds: string[]) => {
      dispatch({
        type: ActionType.UpdateDataUnionsByDeleteFiles,
        payload: fileIds,
      });
    },
    [dispatch],
  );

  const actionSetCollectedDataUnions = useCallback(
    (dataUnions: StructuredFolderRecord) => {
      dispatch({
        type: ActionType.SetCollectedDataUnions,
        payload: dataUnions,
      });
    },
    [dispatch],
  );

  const actionLoadActions = useCallback(
    (
      actionFiles: Record<
        string,
        RequiredByKeys<MirrorFile, "action" | "relationId">
      >,
    ) => {
      dispatch({
        type: ActionType.LoadActions,
        payload: actionFiles,
      });
    },
    [dispatch],
  );

  const actionUpdateAction = useCallback(
    (actionFile: RequiredByKeys<MirrorFile, "action" | "relationId">) => {
      dispatch({
        type: ActionType.UpdateAction,
        payload: actionFile,
      });
    },
    [dispatch],
  );

  const actionDeleteActions = useCallback(
    (actionFileIds: string[]) => {
      dispatch({
        type: ActionType.DeleteActions,
        payload: actionFileIds,
      });
    },
    [dispatch],
  );

  return {
    actionConnectWallet,
    actionCreateCapability,
    actionCreateFile,
    actionUpdateFile,
    actionDeleteFiles,
    actionLoadFiles,
    actionLoadCollectedDataTokenFiles,
    actionSetFolders,
    actionUpdateFolders,
    actionDeleteFolder,
    actionUpdateFoldersByFile,
    actionLoadProfileIds,
    actionCreateProfile,
    actionUpdateDataTokenInfo,
    actionUpdateDataTokenInfos,
    actionSetDataUnions,
    actionUpdateDataUnion,
    actionDeleteDataUnion,
    actionUpdateDataUnionsByFile,
    actionUpdateDataUnionsByDeleteFiles,
    actionSetCollectedDataUnions,
    actionLoadActions,
    actionUpdateAction,
    actionDeleteActions,
  };
};
