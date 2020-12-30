import React, { useCallback, useEffect, useMemo, useState } from 'react'
import T from 'prop-types'
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@material-ui/core'
import debounce from 'lodash.debounce'

const Search = ({ search, onChange }) => (
  <TextField
    label="Search"
    variant="outlined"
    size="small"
    value={search}
    onChange={e => onChange(e.target.value)}
    InputProps={{
      endAdornment: search && (
        <InputAdornment position="end">
          <IconButton onClick={() => onChange('')}>
            <Typography>
              <span role="img" aria-label="clear">
                ❌
              </span>
            </Typography>
          </IconButton>
        </InputAdornment>
      )
    }}
  />
)

Search.propTypes = {
  search: T.string,
  onChange: T.func.isRequired
}

export default function useSearch(minLength = 3) {
  const [search, setSearch] = useState({ immediate: '', debounced: '' })
  const debouncedSetSearch = useMemo(() => debounce(setSearch, 500), [
    setSearch
  ])

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch])

  const handleSearchChange = useCallback(
    search => {
      setSearch(s => ({ ...s, immediate: search }))

      if (search.length >= minLength)
        debouncedSetSearch(s => ({ ...s, debounced: search }))
    },
    [debouncedSetSearch, minLength]
  )

  return {
    Search: <Search search={search.immediate} onChange={handleSearchChange} />,
    search: search.debounced
  }
}
