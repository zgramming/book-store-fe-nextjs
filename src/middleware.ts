import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_KEY } from './utils/constant';

const excludePathCheckingToken = (path: string) => {
  const startWithLogin = path.startsWith('/login');
  const startWithNext = path.startsWith('/_next');
  const startWithFavicon = path.startsWith('/favicon');

  return startWithLogin || startWithNext || startWithFavicon;
};

function middleware(request: NextRequest) {
  // const url = request.nextUrl.pathname;
  // const accessToken = request.cookies.get(TOKEN_KEY);

  // const startWithLogin = url.startsWith('/login');
  // const isHaveToken = accessToken !== undefined;

  // // Aktifkan jika ingin menggunakan auth
  // if (isHaveToken) {
  //   if (startWithLogin) {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // } else {
  //   const isAccessingProtectedPage = !excludePathCheckingToken(url);

  //   if (isAccessingProtectedPage) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  // }

  return NextResponse.next();
}

// eslint-disable-next-line import/prefer-default-export
export { middleware };
