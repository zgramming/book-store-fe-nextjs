import { Stack } from '@mantine/core';
import Head from 'next/head';

export default function Page() {
  return (
    <>
      <Head>
        <title>CMS Template - Home</title>
        <meta
          name="description"
          content="CMS Template merupakan aplikasi berbasis web yang digunakan untuk mengelola konten website. Aplikasi ini memiliki fitur yang memudahkan pengguna dalam mengelola konten website seperti menambah, mengedit, menghapus konten website."
        />
        <meta property="og:title" content="CMS Tempalte" />
        <meta property="og:type" content="CMS Tempalte" />
        <meta property="og:image:url" content="https://picsum.photos/400" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:alt" content="CMS Tempalte Image" />
        <meta
          property="og:description"
          content="CMS Template merupakan aplikasi berbasis web yang digunakan untuk mengelola konten website. Aplikasi ini memiliki fitur yang memudahkan pengguna dalam mengelola konten website seperti menambah, mengedit, menghapus konten website."
        />
      </Head>
      <div className="min-h-screen">
        <Stack gap={'lg'}>
          <div className="pb-32" />
        </Stack>
      </div>
    </>
  );
}
