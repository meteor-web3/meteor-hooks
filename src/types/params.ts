import { Model } from "@dataverse/dapp-table";
import {
  Chain,
  ReturnType,
  SYSTEM_CALL,
  WALLET,
  RequestType,
  Action,
  MirrorFile,
  FileContent,
} from "@meteor-web3/connector";
import { BigNumber, BigNumberish } from "ethers";

export enum FileType {
  Public = "Public",
  Encrypted = "Encrypted",
  Payable = "Payable",
}

export type CreateIndexFileArgs = RequestType[SYSTEM_CALL.createIndexFile];

export type CreateTokenFileArgs = CreateIndexFileArgs & {
  chainId: number;
  actionsConfig: {
    collectAction?: {
      currency: string;
      amount: BigNumberish;
      totalSupply?: BigNumberish;
    };
  };
};

export type ConnectWalletResult = {
  address: string;
  chain: Chain;
  wallet: WALLET;
};

export type ConnectResult = {
  address: string;
  chain: Chain;
  wallet: WALLET;
  pkh: string;
};

export type LoadFilesResult = Awaited<ReturnType[SYSTEM_CALL.loadFilesBy]>;

export type LoadFilesByArgs = {
  pkh: string;
  model: Model;
};

export type LoadFilesByResult = LoadFilesResult;

export type CreateIndexFileResult = Awaited<
  ReturnType[SYSTEM_CALL.createIndexFile]
>;

export type MonetizeFileArgs = {
  chainId: number;
  fileId: string;
  actionsConfig: {
    collectAction?: {
      currency: string;
      amount: BigNumberish;
      totalSupply?: BigNumberish;
    };
    shareAction?: {
      shareName: string;
      shareSymbol: string;
      currency: string;
      ownerFeePoint: BigNumberish;
      initialSupply?: BigNumberish;
      accessibleShareAmount: BigNumberish;
    };
  };
  withSig?: boolean;
};

export type MonetizeFileResult = Awaited<ReturnType[SYSTEM_CALL.monetizeFile]>;

export type CollectFileArgs = {
  fileId: string;
  withSig?: boolean;
};

export type CollectFileResult = BigNumber;

export type DataTokenInfo = Partial<{
  address: string;
  collect_info: {
    collect_nft_address: string;
    sold_list: {
      owner: string;
      token_id: string;
    }[];
    price: {
      amount: string;
      currency: string;
      currency_addr: string;
    };
    sold_num: string;
    total: string;
  };
  content_uri: string;
  owner: string;
  source: string;
}>;

export type UnlockFileResult = Awaited<ReturnType[SYSTEM_CALL.unlockFile]>;

export type UpdateFileArgs = {
  fileId: string;
  fileName?: string;
  fileContent?: object;
  encrypted?: object;
};

export type UpdateIndexFileResult = Awaited<
  ReturnType[SYSTEM_CALL.updateIndexFile]
>;

export type CreateActionFileArgs = {
  folderId?: string;
  action: Action;
  relationId: string;
  fileName?: string;
};

export type CreateActionFileResult = MirrorFile;

export type UpdateActionFileArgs = {
  fileId: string;
  fileName?: string | undefined;
  isRelationIdEncrypted?: boolean | undefined;
  isCommentEncrypted?: boolean | undefined;
};

export type UpdateActionFileResult = MirrorFile;

export type CreateBareFileArgs = RequestType[SYSTEM_CALL.createBareFile];

export type UpdateBareFileArgs = RequestType[SYSTEM_CALL.updateBareFile];
