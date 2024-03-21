export const baseApiURL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const baseFileURL = `${baseApiURL}/uploads`;
export const TOKEN_KEY = 'token';
export const JWT_PAYLOAD_KEY = 'jwt_payload_key';
export const availableAccessAction = ['view', 'create', 'update', 'delete', 'print', 'export', 'import', 'approve'];
export const KEY_LOCALSTORAGE_ACCESS_GROUP = 'access_group';

// This breakpoint follow tailwindcss breakpoint https://tailwindcss.com/docs/breakpoints
export const breakpoint = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
