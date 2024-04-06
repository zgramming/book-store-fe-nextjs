import PaginationComponent, { PaginationSize } from '@/components/PaginationComponent';
import AdminLayout from '@/components/layout/AdminLayout';
import { HistoryTransactionRepository } from '@/features/history-transaction/history-transaction.repository';
import { readableDate } from '@/utils/function';
import {
  Alert,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { IconCalendar, IconFilter, IconInfoCircle, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

interface FilterQuery {
  duration_loan_days?: number;
  date_loan?: string;
  date_return?: string;
}
interface ModalFilterProps {
  defaultValues?: FilterQuery;
  onClose: () => void;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: FilterQuery) => void;
}

const ModalFilter = ({ onClose, onSubmit, open, defaultValues }: ModalFilterProps) => {
  const form = useForm({
    initialValues: defaultValues,
  });

  const onSubmitForm = (values: FilterQuery) => {
    onSubmit(values);
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Filter"
      size={'md'}
      scrollAreaComponent={ScrollArea.Autosize}
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <form onSubmit={form.onSubmit(onSubmitForm)}>
        <Stack gap={'sm'}>
          <NumberInput
            label="Duration Loan (Days)"
            placeholder="Duration Loan (Days)"
            {...form.getInputProps('duration_loan_days')}
          />
          <Group gap={'md'} grow>
            <DatePickerInput
              leftSection={<IconCalendar />}
              clearable
              label="Date Loan"
              valueFormat="YYYY-MM-DD"
              placeholder="Date Loan"
              {...form.getInputProps('date_loan')}
            />

            <DatePickerInput
              leftSection={<IconCalendar />}
              clearable
              label="Date Return"
              valueFormat="YYYY-MM-DD"
              placeholder="Date Return"
              {...form.getInputProps('date_return')}
            />
          </Group>
          <Group justify="right">
            <Button onClick={onClose} variant="default">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

Page.getLayout = function getLayout(page: any) {
  return <AdminLayout title="History Transaction">{page}</AdminLayout>;
};

export default function Page() {
  const [activePagination, setPagination] = useState(1);
  const [sizePagination, setSizePagination] = useState<PaginationSize>('10');
  const [searchQuery, setSearchQuery] = useDebouncedState<string | undefined>(undefined, 500);
  const [filterQuery, setFilterQuery] = useState<FilterQuery | undefined>();
  const [isModalFilterOpen, { open: openModalFilter, close: closeModalFilter }] = useDisclosure(false);
  const {
    data: transactionData,
    isLoading,
    total,
  } = HistoryTransactionRepository.hooks.useList({
    limit: parseInt(sizePagination),
    page: activePagination,
    date_loan: filterQuery?.date_loan,
    date_return: filterQuery?.date_return,
    long_loan_in_days: filterQuery?.duration_loan_days,
    book_id: searchQuery,
    book_title: searchQuery,
    name_student: searchQuery,
    nim: searchQuery,
  });

  const onCloseModalFilter = () => {
    closeModalFilter();
  };
  const onOpenModalFilter = () => {
    openModalFilter();
  };
  const onSubmitFilter = (values: FilterQuery) => {
    setFilterQuery(values);
    closeModalFilter();
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value.length === 0 || value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  return (
    <>
      <Card withBorder>
        <Stack gap={'md'}>
          <Grid gutter={'lg'}>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Group justify="left">
                <TextInput
                  placeholder="Search NIM, Student Name, Book ID, Book Name"
                  rightSection={<IconSearch />}
                  defaultValue={searchQuery}
                  onChange={onChangeSearch}
                />
                <Button leftSection={<IconFilter size="1rem" />} variant="outline" onClick={onOpenModalFilter}>
                  Filter
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col
              span={{
                xs: 12,
                sm: 12,
                md: 12,
                lg: 6,
                xl: 6,
              }}
            >
              <Flex direction={'row'} justify={'end'} gap={'md'}></Flex>
            </Grid.Col>
          </Grid>
          <Stack gap={'md'} id="table">
            <LoadingOverlay visible={isLoading} />
            <Alert variant="light" color="blue" withCloseButton title="Information" icon={<IconInfoCircle />}>
              History transaction only be show when student already return the book
            </Alert>
            <Table.ScrollContainer minWidth={500}>
              <Table verticalSpacing={'md'}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>NO</Table.Th>
                    <Table.Th>NIM</Table.Th>
                    <Table.Th>STUDENT NAME</Table.Th>
                    <Table.Th>BOOK ID</Table.Th>
                    <Table.Th>BOOK NAME</Table.Th>
                    <Table.Th>DATE LOAN</Table.Th>
                    <Table.Th>DATE RETURN</Table.Th>
                    <Table.Th>LOAN DURATION (DAYS)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {transactionData.map((item, index) => {
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{index + 1}</Table.Td>
                        <Table.Td>{item.student.nim}</Table.Td>
                        <Table.Td>{item.student.name}</Table.Td>
                        <Table.Td>{item.book.id}</Table.Td>
                        <Table.Td>{item.book.title}</Table.Td>
                        <Table.Td>{readableDate(item.transaction.date_loan)}</Table.Td>
                        <Table.Td>{readableDate(item.transaction.date_return)}</Table.Td>
                        <Table.Td>{item.duration_loan_days}</Table.Td>
                      </Table.Tr>
                    );
                  })}
                </tbody>
              </Table>
            </Table.ScrollContainer>
            <PaginationComponent
              activePagination={activePagination}
              paginationSize={sizePagination}
              total={total}
              onChangePagination={setPagination}
              onChangePaginationSize={setSizePagination}
            />
          </Stack>
        </Stack>
      </Card>
      {isModalFilterOpen && (
        <ModalFilter
          defaultValues={filterQuery}
          onClose={onCloseModalFilter}
          open={isModalFilterOpen}
          onSubmit={onSubmitFilter}
        />
      )}
    </>
  );
}
