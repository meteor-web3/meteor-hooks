import React, {
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import {
  BaseProvider,
  Connector,
  MeteorWalletProvider,
} from "@meteor-web3/connector";

import { initialState, reducer } from "./state";
import { MeteorContext } from "./useStore";

export const MeteorContextProvider = ({
  children,
  baseProvider,
  autoInit = true,
}: {
  children: ReactNode;
  baseProvider?: BaseProvider;
  /**
   * Decide whether you need to automatically initialize the connector. By default, MeteorWalletProvider is used for initialization.
   * Attention: This parameter does not support dynamic value passing (that is, it is one-time)
   * @default true
   */
  autoInit?: boolean;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const connector = useMemo<Connector>(
    () =>
      autoInit
        ? new Connector(new MeteorWalletProvider())
        : new Connector(baseProvider, true),
    [autoInit],
  );

  const handleChangeProvider = (newProvider: BaseProvider) => {
    connector.setProvider(newProvider);
  };

  useEffect(() => {
    baseProvider && connector.setProvider(baseProvider);
  }, [baseProvider]);

  return (
    <MeteorContext.Provider
      value={{
        connector,
        setBaseProvider: handleChangeProvider,
        state,
        dispatch,
      }}
    >
      {children}
    </MeteorContext.Provider>
  );
};
