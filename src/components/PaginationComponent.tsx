import React from 'react';
import { Flex, SegmentedControl, Pagination } from '@mantine/core';

export type PaginationSize = '10' | '25' | '50' | '100';

interface PaginationComponentProps {
  activePagination: number;
  // eslint-disable-next-line no-unused-vars
  onChangePagination: (page: number) => void;
  paginationSize: PaginationSize;
  // eslint-disable-next-line no-unused-vars
  onChangePaginationSize: (size: PaginationSize) => void;
  total: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  activePagination,
  onChangePagination,
  paginationSize,
  onChangePaginationSize,
  total,
}) => {
  const paginationTotal = Math.ceil(total / parseInt(paginationSize));
  return (
    <Flex direction={'row'} justify={'space-between'} align={'center'}>
      <SegmentedControl
        value={paginationSize}
        onChange={(val) => {
          onChangePaginationSize(val as PaginationSize);
        }}
        data={[
          { label: '10', value: '10' },
          { label: '25', value: '25' },
          { label: '50', value: '50' },
          { label: '100', value: '100' },
        ]}
      />
      <div className="text-sm">{generateStringPagination(activePagination, Number(paginationSize), total)}</div>
      <Pagination value={activePagination} onChange={onChangePagination} total={paginationTotal} />
    </Flex>
  );
};

const generateStringPagination = (currentPage: number, PageSize: number, totalData: number) => {
  const startData = PageSize * 0 + 1;
  let endData = Number(PageSize) * currentPage;

  if (totalData < endData) {
    endData = totalData;
  }

  return 'Menampilkan ' + startData + '-' + endData + ' dari ' + totalData + ' data';
};

export default PaginationComponent;
