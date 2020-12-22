import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TablePagination } from '@material-ui/core'

const INITIAL_PAGE_NUMBER = 1

export default function useSurrogatePagination({
  pageSizeOptions = [5, 10, 20]
}) {
  const [defaultPageSize] = pageSizeOptions

  const [{ pageNumber, pageSize, ...mapping }, setPageMapping] = useState({
    pageNumber: INITIAL_PAGE_NUMBER,
    pageSize: defaultPageSize,
    [defaultPageSize]: {
      [INITIAL_PAGE_NUMBER]: ''
    }
  })

  const changePageNumber = useCallback((e, zeroBasedPageNumber) => {
    setPageMapping(m => ({
      ...m,
      pageNumber: zeroBasedPageNumber + 1
    }))
  }, [])

  const changePageSize = useCallback(({ target: { value: pageSize } }) => {
    setPageMapping(m => ({
      ...m,
      pageNumber: INITIAL_PAGE_NUMBER,
      pageSize,
      [pageSize]: {
        [INITIAL_PAGE_NUMBER]: ''
      }
    }))
  }, [])

  const useUpdateSurrogatePageNumber = useMemo(
    () =>
      function useUpdateSurrogatePageNumber(nextPage = '') {
        useEffect(() => {
          setPageMapping(m => ({
            ...m,
            [pageSize]: {
              ...m[pageSize],
              [pageNumber + 1]: nextPage
            }
          }))
        }, [nextPage])
      },
    [pageNumber, pageSize]
  )

  const useTablePagination = useMemo(
    () =>
      function useTablePagination(data) {
        return (
          <TablePagination
            rowsPerPageOptions={pageSizeOptions}
            onChangePage={changePageNumber}
            onChangeRowsPerPage={changePageSize}
            component="div"
            count={-1}
            rowsPerPage={pageSize}
            page={pageNumber - 1}
            nextIconButtonProps={{
              disabled: !data?.nextPage
            }}
            labelDisplayedRows={({ from, to }) => {
              const total =
                data?.data.length + pageSize * (pageNumber - 1) || '-'
              return `${from}-${total} of ${
                data?.nextPage ? `more than ${to}` : total
              }`
            }}
          />
        )
      },
    [changePageNumber, changePageSize, pageNumber, pageSize, pageSizeOptions]
  )

  return {
    pageSize,
    surrogatePageNumber: mapping[pageSize][pageNumber],
    useUpdateSurrogatePageNumber,
    useTablePagination
  }
}
