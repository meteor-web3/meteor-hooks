import React, { ReactNode, useMemo, useReducer } from "react";

import { Connector, MeteorWalletProvider } from "@meteor-web3/connector";

import { initialState, reducer } from "./state";
import { MeteorContext } from "./useStore";

export const MeteorContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const connector = useMemo(
    () => new Connector(new MeteorWalletProvider()),
    [],
  );

  return (
    <MeteorContext.Provider value={{ connector, state, dispatch }}>
      {children}
    </MeteorContext.Provider>
  );
};
