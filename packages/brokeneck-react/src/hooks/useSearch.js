import React, { useCallback, useEffect, useMemo, useState } from 'react'
import T from 'prop-types'
import {
  IconButton,
  InputAdornment,
  makeStyles,
  TextField
} from '@material-ui/core'
import debounce from 'lodash.debounce'

import IconCross from '../icons/cross'

const useStyles = makeStyles(theme => ({
  clearButton: {
    padding: 0,
    '& svg': {
      fill: theme.palette.bodyText.main
    }
  },
  clearIcon: {
    width: 14
  }
}))

const Search = ({ search, onChange }) => {
  const classes = useStyles()

  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      value={search}
      onChange={e => onChange(e.target.value)}
      InputProps={{
        endAdornment: search && (
          <InputAdornment position="end">
            <IconButton
              onClick={() => onChange('')}
              className={classes.clearButton}
            >
              <IconCross className={classes.clearIcon} />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

Search.propTypes = {
  search: T.string,
  onChange: T.func.isRequired
}

export default function useSearch(minLength = 3) {
  const [search, setSearch] = useState({ immediate: '', debounced: '' })
  const debouncedSetSearch = useMemo(
    () => debounce(setSearch, 500),
    [setSearch]
  )

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch])

  const handleSearchChange = useCallback(
    search => {
      setSearch(s => ({ ...s, immediate: search }))

      if (search.length === 0 || search.length >= minLength)
        debouncedSetSearch(s => ({ ...s, debounced: search }))
    },
    [debouncedSetSearch, minLength]
  )

  return {
    Search: <Search search={search.immediate} onChange={handleSearchChange} />,
    search: search.debounced
  }
}
