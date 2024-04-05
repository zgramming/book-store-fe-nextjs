import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
require('dayjs/locale/id');

type IsSideMenuActiveProps = {
  currentPath: string;
  link: string;
};

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const convertRoutePathToArray = (pathname: string): string[] => {
  return pathname
    .split('/')
    .filter((route) => route.length !== 0)
    .map((route) => {
      const split = route.split('_');

      /// Route => user_group become User Group
      if (split.length > 1) {
        const capitalizeName = split.map((val) => (val[0]?.toUpperCase() ?? 'default') + val.slice(1));

        return capitalizeName.join(' ');
      }

      return route;
    });
};

const convertObjectIntoQueryParams = (queryParam: any) => {
  if (!queryParam) return '';

  const params =
    '?' +
    Object.keys(queryParam)
      .map((key) => key + '=' + queryParam[key])
      .join('&');

  return params;
};

const isSideMenuActive = ({ currentPath, link }: IsSideMenuActiveProps) => {
  if (link === '/' || link === '' || link.length === 0) return false;

  const arrCurrentPath = currentPath.split('/').filter((item) => item !== '');
  const arrLink = link.split('/').filter((item) => item !== '');

  const lenArrLink = arrLink.length;

  let isEqual = false;
  let counterPathEqual = 0;

  for (let i = 0; i < lenArrLink; i++) {
    const isSamePath = arrLink[i] === arrCurrentPath[i];
    if (isSamePath) counterPathEqual += 1;
  }

  if (counterPathEqual === lenArrLink) isEqual = true;

  return isEqual;
};

const readableDate = (date: string | Date | undefined, format = 'DD MMMM YYYY') => {
  if (!date) return '';
  const dateObj = new Date(date);
  const result = dayjs(dateObj, { locale: 'id-ID' }).format(format);
  return result;
};

const numberInputParser = (value: string) => {
  return value.replace(/\$\s?|(,*)/g, '');
};

const numberInputFormatter = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const getErrorMessageAxios = (error: any) => {
  // Check if axios error
  const message = 'Terjadi kesalahan pada server';
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) return message;

    const response = axiosError.response;
    const data = response.data as any;

    const { message: errorMessage } = data;

    if (Array.isArray(errorMessage)) {
      return errorMessage.map((item, index) => `${index + 1}. ${item}`).join('\n');
    }

    return errorMessage;
  } else if (error instanceof Error) {
    return error.message;
  }

  return message;
};

const isNumber = (value: any) => {
  return !isNaN(value);
};

export {
  sleep,
  convertRoutePathToArray,
  convertObjectIntoQueryParams,
  isSideMenuActive,
  readableDate,
  getErrorMessageAxios,
  numberInputParser,
  numberInputFormatter,
  isNumber,
};
