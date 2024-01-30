import { MirrorFile } from "@meteor-web3/connector";

import { ACTION_TYPE_NOT_EXSITS } from "../errors";
import {
  ActionType,
  CreateIndexFileResult,
  FileResult,
  LoadFilesByResult,
  LoadFilesResult,
  RequiredByKeys,
  StateType,
} from "../types";

export const initialState: StateType = {
  appId: undefined,
  address: undefined,
  wallet: undefined,
  chain: undefined,
  pkh: undefined,
  profileIds: undefined,
  filesMap: undefined,
  collectedDataTokenFilesMap: undefined,
  foldersMap: undefined,
  dataUnionsMap: undefined,
  collectedUnionsMap: undefined,
  actionsMap: undefined,
};

export const reducer = (
  state: StateType,
  action: {
    type: ActionType;
    payload: any;
  },
) => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.ConnectWallet: {
      const { address, chain, wallet } = payload;

      return {
        ...state,
        address,
        chain,
        wallet,
      };
    }

    case ActionType.CreateCapability: {
      return {
        ...state,
        pkh: payload.pkh,
        appId: payload.appId,
      };
    }

    case ActionType.CreateFile: {
      const { createdFile, modelId } = payload as {
        createdFile: MirrorFile & Partial<FileResult>;
        modelId: string;
      };

      return {
        ...state,
        filesMap: {
          ...state.filesMap,
          [modelId]: {
            ...state.filesMap?.[modelId],
            [createdFile.fileId]: {
              ...createdFile,
            },
          },
        },
      };
    }

    case ActionType.UpdateFile: {
      const updatedFile = payload as MirrorFile & Partial<FileResult>;
      const fileId = updatedFile.fileId;

      if (!state.filesMap) {
        return state;
      }

      let stateChanged = false;
      const _filesMap = { ...state.filesMap };
      Object.keys(_filesMap).forEach(modelId => {
        const files = { ..._filesMap[modelId] };
        if (files[fileId]) {
          files[fileId] = {
            ...files[fileId],
            ...updatedFile,
          };
          stateChanged = true;
        }
        _filesMap[modelId] = files;
      });

      return {
        ...state,
        filesMap: stateChanged ? _filesMap : state.filesMap,
      };
    }

    case ActionType.DeleteFiles: {
      const fileIds = payload as string[];

      if (!state.filesMap) {
        return state;
      }

      let stateChanged = false;
      const _filesMap = { ...state.filesMap };
      Object.keys(_filesMap).forEach(modelId => {
        const files = { ..._filesMap[modelId] };
        fileIds.forEach(fileId => {
          if (files[fileId]) {
            delete files[fileId];
            stateChanged = true;
          }
        });
        _filesMap[modelId] = files;
      });

      return {
        ...state,
        filesMap: stateChanged ? _filesMap : state.filesMap,
      };
    }

    case ActionType.LoadFiles: {
      const { loadedFiles, modelId } = payload as {
        loadedFiles: LoadFilesResult | LoadFilesByResult;
        modelId: string;
      };

      const files: {
        [fileId: string]: MirrorFile & Partial<CreateIndexFileResult>;
      } = {};
      Object.entries(loadedFiles).forEach(([fileId, file]) => {
        (files as any)[fileId] = {
          ...file,
          ...file.fileContent.file,
          content: file.fileContent.content,
        };
      });

      return {
        ...state,
        filesMap: {
          ...state.filesMap,
          [modelId]: {
            ...files,
          },
        },
      };
    }

    case ActionType.LoadCollectedDataTokenFiles: {
      return {
        ...state,
        collectedDataTokenFilesMap: payload,
      };
    }

    case ActionType.LoadProfileIds: {
      return {
        ...state,
        profileIds: payload,
      };
    }

    case ActionType.CreateProfileId: {
      return {
        ...state,
        profileIds: state.profileIds
          ? [...state.profileIds, payload]
          : [payload],
      };
    }

    case ActionType.UpdateDataTokenInfo: {
      const { fileId, dataTokenInfo } = payload;

      if (!state.filesMap) {
        throw state;
      }

      let stateChanged = false;
      const _filesMap = { ...state.filesMap };
      Object.keys(_filesMap).forEach(modelId => {
        const files = { ..._filesMap[modelId] };
        if (files[fileId]) {
          files[fileId] = {
            ...files[fileId],
            dataTokenInfo,
          };
          stateChanged = true;
        }
        _filesMap[modelId] = files;
      });

      return {
        ...state,
        filesMap: stateChanged ? _filesMap : state.filesMap,
      };
    }

    case ActionType.UpdateDataTokenInfos: {
      const { fileIds, dataTokenInfos } = payload;

      if (!state.filesMap) {
        throw state;
      }

      let stateChanged = false;
      const _filesMap = { ...state.filesMap };
      fileIds.forEach((fileId: string, index: number) => {
        Object.keys(_filesMap).forEach(modelId => {
          const files = { ..._filesMap[modelId] };
          if (files[fileId]) {
            files[fileId] = {
              ...files[fileId],
              dataTokenInfo: dataTokenInfos[index],
            };
            stateChanged = true;
          }
          _filesMap[modelId] = files;
        });
      });

      return {
        ...state,
        filesMap: stateChanged ? _filesMap : state.filesMap,
      };
    }

    case ActionType.SetFolders: {
      return {
        ...state,
        foldersMap: payload,
      };
    }

    case ActionType.UpdateFolders: {
      const folders = payload instanceof Array ? payload : [payload];

      if (!state.foldersMap) {
        return state;
      }

      return {
        ...state,
        foldersMap: {
          ...state.foldersMap,
          ...Object.assign(
            {},
            ...folders.map(folder => {
              return {
                [folder.folderId]: folder,
              };
            }),
          ),
        },
      };
    }

    case ActionType.DeleteFolder: {
      if (!state.foldersMap) {
        return state;
      }
      const foldersMap = { ...state.foldersMap };
      delete foldersMap[payload];
      return {
        ...state,
        foldersMap,
      };
    }

    case ActionType.UpdateFoldersByFile: {
      if (!state.foldersMap) {
        return state;
      }
      const foldersMap = { ...state.foldersMap };
      Object.keys(foldersMap).forEach(folderId => {
        const folder = foldersMap![folderId];
        Object.keys(folder.mirrorRecord).forEach(mirrorId => {
          const mirror = folder.mirrorRecord[mirrorId];
          if (mirror.mirrorFile.fileId === payload.fileId) {
            foldersMap![folderId].mirrorRecord[mirrorId].mirrorFile = payload;
          }
        });
      });

      return {
        ...state,
        foldersMap,
      };
    }

    case ActionType.SetDataUnions: {
      return {
        ...state,
        dataUnionsMap: payload,
      };
    }

    case ActionType.UpdateDataUnion: {
      return {
        ...state,
        dataUnionsMap: {
          ...state.dataUnionsMap,
          [payload.folderId]: payload,
        },
      };
    }

    case ActionType.DeleteDataUnion: {
      if (!state.dataUnionsMap) {
        return state;
      }
      const dataUnionsMap = { ...state.dataUnionsMap };
      delete dataUnionsMap[payload];
      return {
        ...state,
        dataUnionsMap,
      };
    }

    case ActionType.UpdateDataUnionsByFile: {
      if (!state.dataUnionsMap) {
        return state;
      }
      const dataUnionsMap = { ...state.dataUnionsMap };
      Object.keys(dataUnionsMap).forEach(folderId => {
        const dataUnion = dataUnionsMap![folderId];
        Object.keys(dataUnion.mirrorRecord).forEach(mirrorId => {
          const mirror = dataUnion.mirrorRecord[mirrorId];
          if (mirror.mirrorFile.fileId === payload.fileId) {
            dataUnionsMap![folderId].mirrorRecord[mirrorId].mirrorFile =
              payload;
          }
        });
      });

      return {
        ...state,
        dataUnionsMap,
      };
    }

    case ActionType.UpdateDataUnionsByDeleteFiles: {
      if (!state.dataUnionsMap) {
        return state;
      }
      const dataUnionsMap = { ...state.dataUnionsMap };
      Object.keys(dataUnionsMap).forEach(folderId => {
        const dataUnion = dataUnionsMap![folderId];
        Object.keys(dataUnion.mirrorRecord).forEach(mirrorId => {
          const mirror = dataUnion.mirrorRecord[mirrorId];
          if ((payload as string[]).includes(mirror.mirrorId)) {
            delete dataUnionsMap![folderId].mirrorRecord[mirrorId];
          }
        });
      });

      return {
        ...state,
        dataUnionsMap,
      };
    }

    case ActionType.LoadActions: {
      const actionFilesMap: Record<
        string,
        RequiredByKeys<MirrorFile, "action" | "relationId">
      > = payload;
      const actionsMap: Record<
        string,
        Record<string, RequiredByKeys<MirrorFile, "action" | "relationId">>
      > = {};

      Object.keys(actionFilesMap).forEach(fileId => {
        const file = actionFilesMap[fileId];
        if (file.action && file.relationId) {
          actionsMap[file.relationId] = actionsMap[file.relationId] || {};
          actionsMap[file.relationId][fileId] = file;
        }
      });

      return {
        ...state,
        actionFilesMap,
        actionsMap,
      };
    }

    case ActionType.UpdateAction: {
      const actionFile: RequiredByKeys<MirrorFile, "action" | "relationId"> =
        payload;

      if (!state.actionsMap) {
        state.actionsMap = {};
      }

      const actionsMap = { ...state.actionsMap };
      if (actionFile.action && actionFile.relationId) {
        actionsMap[actionFile.relationId] = {
          ...actionsMap[actionFile.relationId],
          [actionFile.fileId]: actionFile,
        };
      }

      return {
        ...state,
        actionFilesMap: {
          ...state.actionFilesMap,
          [actionFile.fileId]: actionFile,
        },
        actionsMap,
      };
    }

    case ActionType.DeleteActions: {
      const actionFileIds = payload as string[];

      if (!state.actionsMap) {
        return state;
      }

      const _actionsMap = { ...state.actionsMap };
      Object.keys(_actionsMap).forEach(relationId => {
        const actionFiles = _actionsMap[relationId];
        actionFileIds.forEach(fileId => {
          if (actionFiles[fileId]) {
            delete _actionsMap[relationId][fileId];
          }
        });
      });
      const _actionFilesMap = { ...state.actionFilesMap };
      Object.keys(_actionFilesMap).forEach(fileId => {
        if (actionFileIds.includes(fileId)) {
          delete _actionFilesMap[fileId];
        }
      });

      return {
        ...state,
        actionFilesMap: _actionFilesMap,
        actionsMap: _actionsMap,
      };
    }

    case ActionType.SetCollectedDataUnions: {
      return {
        ...state,
        collectedUnionsMap: payload,
      };
    }

    default: {
      throw ACTION_TYPE_NOT_EXSITS;
    }
  }
};
