import AdminLayout from '@/components/layout/AdminLayout';
import { dummyRole } from '@/utils/dummy_data';
import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Input,
  Modal,
  NumberInput,
  Radio,
  ScrollArea,
  Space,
  Stack,
  Table,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFileExport, IconFileImport, IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default function Page() {
  const [isOpenModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { query } = useRouter();
  const { code: codeMasterData } = query;

  const onSubmit = (values: any) => {
    console.log(values);
    console.log(codeMasterData);
  };

  const form = useForm({
    initialValues: {
      code: '',
      name: '',
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
            <Input leftSection={<IconSearch />} placeholder="Cari sesuatu..." />
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
                  <Table.Th>Nama</Table.Th>
                  <Table.Th>Urutan</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Aksi</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <tbody>
                {dummyRole.map((item, index) => {
                  return (
                    <Table.Tr key={item.id}>
                      <Table.Td>{item.id}</Table.Td>
                      <Table.Td>{item.code}</Table.Td>
                      <Table.Td>{item.code}</Table.Td>
                      <Table.Td>{item.code}</Table.Td>
                      <Table.Td>{index + 1}</Table.Td>
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
      {/* Form Modal Master Data */}
      {isOpenModal && (
        <Modal
          opened={isOpenModal}
          onClose={closeModal}
          title="Form Master Data"
          size={'lg'}
          scrollAreaComponent={ScrollArea.Autosize}
          overlayProps={{
            opacity: 0.55,
            blur: 3,
          }}
        >
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Stack gap={'md'}>
              <TextInput
                placeholder="Your code"
                label="Code"
                withAsterisk
                readOnly
                variant="filled"
                {...form.getInputProps('code')}
              />
              <TextInput placeholder="Your name" label="Name" withAsterisk {...form.getInputProps('name')} />
              <Textarea
                placeholder="Your Description"
                label="Description"
                withAsterisk
                {...form.getInputProps('description')}
              />
              <NumberInput placeholder="Masukkan Urutan" label="Urutan" name="order" {...form.getInputProps('order')} />
              <Radio.Group name="status" label="Status" withAsterisk {...form.getInputProps('status')}>
                <Group>
                  <Radio value="aktif" label="Aktif" />
                  <Radio value="tidak_aktif" label="Tidak Aktif" />
                </Group>
              </Radio.Group>
              <Divider />
              <Stack gap={'md'}>
                <div className="font-semibold text-2xl">Parameter</div>
                {Array.from({ length: 3 })
                  .fill(0)
                  .map((_, index) => {
                    return (
                      <Group key={index} gap={'xs'} grow>
                        <TextInput
                          placeholder={`Key ${index + 1}`}
                          label={`Key ${index + 1}`}
                          {...form.getInputProps(`key_${index + 1}`)}
                        />
                        <TextInput
                          placeholder={`Value ${index + 1}`}
                          label={`Value ${index + 1}`}
                          {...form.getInputProps(`value_${index + 1}`)}
                        />
                      </Group>
                    );
                  })}
              </Stack>
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
