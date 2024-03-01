import { createContext, useContext } from "react";

import { METEOR_CONTEXT_PROVIDER_ERROR } from "../errors";
import { MeteorContextType } from "../types";

export const MeteorContext = createContext<MeteorContextType>(
  {} as MeteorContextType,
);

export const useStore = () => {
  const context = useContext(MeteorContext);
  if (context === undefined) {
    throw METEOR_CONTEXT_PROVIDER_ERROR;
  }

  const { connector, setBaseProvider, state } = context;

  return {
    connector,
    setBaseProvider,
    ...state,
  };
};
