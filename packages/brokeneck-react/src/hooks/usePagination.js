import React, { useCallback } from 'react'
import { TablePagination } from '@material-ui/core'
import useTokenPagination from 'token-pagination-hooks'

export default function usePagination({ pageSizeOptions = [5, 10, 20] }) {
  const [defaultPageSize] = pageSizeOptions

  const {
    pageNumber,
    pageSize,
    changePageNumber,
    changePageSize,
    useUpdateToken,
    currentToken
  } = useTokenPagination({
    defaultPageNumber: 1,
    defaultPageSize
  })

  const handleChangePageNumber = useCallback(
    (_, zeroBasedPageNumber) => changePageNumber(zeroBasedPageNumber + 1),
    [changePageNumber]
  )

  const handleChangePageSize = useCallback(
    ({ target: { value: pageSize } }) => changePageSize(pageSize),
    [changePageSize]
  )

  const useTablePagination = useCallback(
    function useTablePagination(data) {
      return (
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          onChangePage={handleChangePageNumber}
          onChangeRowsPerPage={handleChangePageSize}
          component="div"
          count={-1}
          rowsPerPage={pageSize}
          page={pageNumber - 1}
          nextIconButtonProps={{
            disabled: !data?.nextPage
          }}
          labelDisplayedRows={({ from, to }) => {
            const total = data?.data.length + pageSize * (pageNumber - 1) || '-'
            return `${from}-${total} of ${
              data?.nextPage ? `more than ${to}` : total
            }`
          }}
        />
      )
    },
    [
      handleChangePageNumber,
      handleChangePageSize,
      pageNumber,
      pageSize,
      pageSizeOptions
    ]
  )

  return {
    pageSize,
    currentToken,
    useUpdateToken,
    useTablePagination
  }
}
