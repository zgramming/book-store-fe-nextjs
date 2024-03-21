import AdminLayout from '@/components/layout/AdminLayout';
import { dummyModul } from '@/utils/dummy_data';
import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Input,
  Modal,
  NumberInput,
  Radio,
  ScrollArea,
  Select,
  Space,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFileExport, IconFileImport, IconPlus, IconSearch } from '@tabler/icons-react';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function Page() {
  const [isOpenModal, { open: openModal, close: closeModal }] = useDisclosure(false);

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const form = useForm({
    initialValues: {
      code: '',
      name: '',
      route: '',
      modul: '',
      menu_utama: '',
      order: 0,
      status: 'aktif',
    },
    validate: {
      code: (value) => {
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
      name: (value) => {
        if (value.trim().length < 3) {
          return 'Minimal 3 karakter';
        }
        if (value.trim().length > 10) {
          return 'Maksimal 10 karakter';
        }
        return null;
      },
    },
  });

  return (
    <>
      <Stack>
        <Card withBorder>
          <Flex direction={'row'} align={'center'} justify={'space-between'}>
            <Group gap={'xs'}>
              <Input leftSection={<IconSearch />} placeholder="Cari sesuatu..." />
              <Select
                placeholder="Pilih Modul"
                data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
              />
            </Group>{' '}
            <Space w={'lg'} />
            <Group gap={'xs'}>
              <Button leftSection={<IconFileImport />} variant="outline" size="xs">
                Import
              </Button>
              <Button leftSection={<IconFileExport />} variant="outline" size="xs">
                Export
              </Button>
              <Button leftSection={<IconPlus />} variant="filled" size="xs" onClick={openModal}>
                Tambah
              </Button>
            </Group>
          </Flex>
        </Card>
        <Card withBorder>
          <Table.ScrollContainer minWidth={500}>
            <Table verticalSpacing={'md'} highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>No</Table.Th>
                  <Table.Th>Induk</Table.Th>
                  <Table.Th>Kode</Table.Th>
                  <Table.Th>Modul</Table.Th>
                  <Table.Th>Nama</Table.Th>
                  <Table.Th>Route</Table.Th>
                  <Table.Th>Urutan</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Aksi</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <tbody>
                {dummyModul.map((item) => {
                  return (
                    <Table.Tr key={item.id}>
                      <Table.Td>{item.id}</Table.Td>
                      <Table.Td>Induk</Table.Td>
                      <Table.Td>Kode</Table.Td>
                      <Table.Td>Modul</Table.Td>
                      <Table.Td>Nama Menu</Table.Td>
                      <Table.Td>Route</Table.Td>
                      <Table.Td>Urutan</Table.Td>
                      <Table.Td>
                        {item.status ? <Badge color="green">Aktif</Badge> : <Badge color="red">Tidak Aktif</Badge>}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={'xs'}>
                          <Button variant="outline" size="xs" color="blue" onClick={openModal}>
                            Edit
                          </Button>
                          <Button variant="outline" size="xs" color="red">
                            Hapus
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Stack>
      {/* Form Modal Menu */}
      {isOpenModal && (
        <Modal
          opened={isOpenModal}
          onClose={closeModal}
          title="Form Menu"
          size={'md'}
          scrollAreaComponent={ScrollArea.Autosize}
          overlayProps={{
            opacity: 0.55,
            blur: 3,
          }}
        >
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap={'md'}>
              <Select
                label="Modul"
                placeholder="Pilih Modul"
                data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                {...form.getInputProps('modul')}
              />
              <Select
                label="Menu Utama"
                placeholder="Pilih Menu Utama"
                data={dummyModul.map((item) => ({ value: `${item.id}`, label: item.name }))}
                {...form.getInputProps('menu_utama')}
              />
              <TextInput
                placeholder="Your code"
                label="Code"
                name="code"
                withAsterisk
                {...form.getInputProps('code')}
              />
              <TextInput
                placeholder="Your name"
                label="Name"
                name="name"
                withAsterisk
                {...form.getInputProps('name')}
              />
              <TextInput
                placeholder="Your route"
                label="Route"
                name="route"
                withAsterisk
                {...form.getInputProps('route')}
              />
              <NumberInput placeholder="Masukkan Urutan" label="Urutan" name="order" {...form.getInputProps('order')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="aktif" label="Aktif" />
                  <Radio value="tidak_aktif" label="Tidak Aktif" />
                </Group>
              </Radio.Group>
              <Group justify="right">
                <Button onClick={closeModal} variant="default">
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      )}
    </>
  );
}
