import { NextResponse } from 'next/server';

function middleware() {
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
