import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { UserProfile } from "../interfaces/userProfile";

type UserDataProviderValue = {
  userProfile: UserProfile | null;
  inputText: string;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
};

const UserDataContext = createContext<UserDataProviderValue>(
  {} as UserDataProviderValue
);

export const useUserDataProvider = () => {
  const value = useContext(UserDataContext);

  if (!value) throw new Error('Context must be wrapped in a user data provider!');

  return value;
}

export const UserDataProvider = (props: PropsWithChildren) => {
  const [inputText, setInputText] = useState<string>('')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  return <UserDataContext.Provider value={{inputText, setInputText, userProfile, setUserProfile}}>
    {props.children}
  </UserDataContext.Provider>
}