import useSWR from 'swr';
import { AuthenticationChangePasswordDto } from './dto/authentication-change-password.dto';
import { AuthenticationAccessEntity } from './entities/authentication-access.entity';
import { AuthenticationProfileEntity } from './entities/authentication-profile.entity';
import { AuthenticationLoginEntity } from './entities/authentication-login.entity';
import { http } from '@/utils/http';

const url = {
  base: '/authentication',
};

const hooks = {
  useGetAccess: () => {
    const uri = `${url.base}/access`;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AuthenticationAccessEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useProfile: () => {
    const uri = `${url.base}/profile`;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AuthenticationProfileEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
};

const api = {
  login: async (data: any) => {
    const response: AuthenticationLoginEntity = await http.post(`${url.base}/login`, data, null);
    return response;
  },
  changePassword: ({ password, username }: AuthenticationChangePasswordDto) => {
    return http.post(`${url.base}/change-password`, { password, username }, null);
  },

  loginSSOURL: async (redirectUri: string) => {
    const response = await http.post(
      `${url.base}/login-sso-url`,
      {
        redirectUri,
      },
      null,
    );

    return response.data;
  },
  loginSSO: async (code: string, redirectUri: string) => {

    const response = await http.post(
      `${url.base}/login-sso`,
      {
        code,
        redirectUri,
      },
      null,
    );

    

    return response.data;
  },
};

export const AuthenticationRepository = {
  url,
  hooks,
  api,
};
