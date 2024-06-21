import { useCallback, useState } from 'react'

export function useOrderBy<T extends string[]>(keys: T, defaultKey: T[number]) {
  const [orderBy, setOrderBy] = useState<{ key: T[number]; option: 'asc' | 'desc' }>({
    key: defaultKey,
    option: 'desc',
  })

  const onOrderBy = useCallback(
    (_orderByKey: typeof keys[number]) => {
      if (orderBy.key === _orderByKey) {
        setOrderBy({
          key: _orderByKey,
          option: orderBy.option === 'asc' ? 'desc' : 'asc',
        })
      } else {
        setOrderBy({
          key: _orderByKey,
          option: 'desc',
        })
      }
    },
    [orderBy.key, orderBy.option],
  )

  return {
    orderBy,
    onOrderBy,
  }
}
