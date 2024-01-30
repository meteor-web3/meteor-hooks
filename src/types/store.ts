import {
  Chain,
  Connector,
  WALLET,
  StructuredFolderRecord,
  MirrorFile,
} from "@meteor-web3/connector";
import {
  FileContent,
  MirrorFileRecord,
} from "@meteor-web3/connector/dist/esm/types/fs";

import { DataTokenInfo } from "./params";

export enum ActionType {
  ConnectWallet,
  CreateCapability,
  CreateFile,
  UpdateFile,
  DeleteFiles,
  LoadFiles,
  LoadCollectedDataTokenFiles,
  SetFolders,
  UpdateFolders,
  DeleteFolder,
  UpdateFoldersByFile,
  LoadProfileIds,
  CreateProfileId,
  UpdateDataTokenInfo,
  UpdateDataTokenInfos,
  SetDataUnions,
  UpdateDataUnion,
  DeleteDataUnion,
  UpdateDataUnionsByFile,
  UpdateDataUnionsByDeleteFiles,
  SetCollectedDataUnions,
  LoadActions,
  UpdateAction,
  DeleteActions,
}

export type RequiredByKeys<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Pick<T, Exclude<keyof T, K>>;

export type FileResult = {
  appId: string;
  modelId: string;
  pkh: string;
  fileContent: {
    file?: Omit<MirrorFile, "fileKey" | "content" | "external">;
    content?: string | FileContent;
  } & FileContent;
};

export type MeteorContextType = {
  connector: Connector;
  state: {
    appId?: string;
    address?: string;
    chain?: Chain;
    wallet?: WALLET;
    pkh?: string;
    profileIds?: string[];
    filesMap?: {
      [modelId: string]: {
        [fileId: string]: MirrorFile &
          Partial<FileResult> & { dataTokenInfo?: DataTokenInfo };
      };
    };
    actionFilesMap?: Record<
      string,
      RequiredByKeys<MirrorFile, "action" | "relationId">
    >;
    collectedDataTokenFilesMap?: MirrorFileRecord;
    foldersMap?: StructuredFolderRecord;
    dataUnionsMap?: StructuredFolderRecord;
    collectedUnionsMap?: StructuredFolderRecord;
    actionsMap?: {
      [relationId: string]: {
        [actionFileId: string]: RequiredByKeys<
          MirrorFile,
          "action" | "relationId"
        >;
      };
    };
  };
  dispatch: React.Dispatch<any>;
};

export interface StreamObject {
  streamId: string;
  streamContent: Record<string, any>;
}

export type StateType = MeteorContextType["state"];
