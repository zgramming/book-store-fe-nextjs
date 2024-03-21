import { IJWTPayload } from '@/interface/jwt_payload.interface';
import { JWT_PAYLOAD_KEY, KEY_LOCALSTORAGE_ACCESS_GROUP, TOKEN_KEY } from '@/utils/constant';
import { instance } from '@/utils/http';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { createContext, useCallback, useEffect, useState } from 'react';

type ContextProps = {
  token?: string;
  jwtPayload?: IJWTPayload;

  // eslint-disable-next-line no-unused-vars
  setToken: (token: string) => void;
  removeToken: () => void;
};

const defaultValue: ContextProps = {
  token: undefined,
  setToken: () => {},
  removeToken: () => {},
};

export const AuthenticationContext = createContext<ContextProps>(defaultValue);

function AuthProvider({ children }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [val, setVal] = useState<string | undefined>();
  const [jwtPayload, setJWTPayload] = useState<IJWTPayload | undefined>();

  const onSetJWTPayload = (token?: string) => {
    if (!token) {
      return;
    }

    const decodeJWT: IJWTPayload = jwtDecode(token);
    Cookies.set(JWT_PAYLOAD_KEY, JSON.stringify(decodeJWT));

    setJWTPayload(decodeJWT);
  };

  const onSetToken = useCallback((token: string) => {
    Cookies.set(TOKEN_KEY, token);

    setVal(token);

    onSetJWTPayload(token);

    // Set Headers Authorization for Axios
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  const onRemoveToken = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(JWT_PAYLOAD_KEY);

    // Remove local storage access group
    localStorage.removeItem(KEY_LOCALSTORAGE_ACCESS_GROUP);

    setVal(undefined);
    setJWTPayload(undefined);

    // Remove Headers Authorization for Axios
    delete instance.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const init = async () => {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        onSetToken(token);
      }
      setIsLoading(false);
    };

    init();
    return () => {};
  }, [onSetToken]);

  if (isLoading) {
    return;
  }

  return (
    <AuthenticationContext.Provider
      value={{
        jwtPayload,
        token: val,
        setToken: onSetToken,
        removeToken: onRemoveToken,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthProvider;
