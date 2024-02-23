import React, { ReactNode, useMemo, useReducer, useState } from "react";

import { Connector, MeteorWalletProvider } from "@meteor-web3/connector";

import { initialState, reducer } from "./state";
import { MeteorContext } from "./useStore";

export const MeteorContextProvider = ({
  children,
  meteorConnector,
  autoInit = true,
}: {
  children: ReactNode;
  meteorConnector?: Connector;
  /**
   * Decide whether you need to automatically initialize the connector. By default, MeteorWalletProvider is used for initialization.
   * Attention: This parameter does not support dynamic value passing (that is, it is one-time)
   * @default true
   */
  autoInit?: boolean;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [connector, setConnector] = useState<Connector>(
    autoInit ? new Connector(new MeteorWalletProvider()) : new Connector(),
  );

  const handleChangeConnector = async (newConnector: Connector) => {
    if (newConnector !== connector) {
      connector?.destroy?.();
      setConnector(newConnector);
    }
  };

  return (
    <MeteorContext.Provider
      value={{
        connector,
        setConnector: handleChangeConnector,
        state,
        dispatch,
      }}
    >
      {children}
    </MeteorContext.Provider>
  );
};
