import AdminLayout from '@/components/layout/AdminLayout';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function Page() {
  return <h1>ss</h1>;
}
