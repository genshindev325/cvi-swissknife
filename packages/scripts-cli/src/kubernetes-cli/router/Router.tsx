import type { PropsWithChildren } from 'react'
import React, { createContext, useState } from 'react'

type RouterType<T> = {
  pages: T
}

export type Page = {
  path: string
  name?: string
  value?: string
}

type RouterContext = {
  history: Page[]
  currentPage: Page
  addPage: (page: Page) => void
  prevPage: () => void
}

const routerDefaults = {
  history: [
    {
      path: '/',
    },
  ],
  currentPage: {
    path: '/',
  },
  addPage: () => {
    //
  },
  prevPage: () => {
    //
  },
}
export const routerContext = createContext<RouterContext>(routerDefaults)

export function Router(props: PropsWithChildren<RouterType<Page[]>>) {
  const [history, setHistory] = useState<Page[]>(routerDefaults.history)
  const [currentPage, setCurrentPage] = useState<Page>(routerDefaults.currentPage)

  const addPage = (page: Page) => {
    const matchPageQueryValue = page.path.match('/.*')
    const getPageRouteQueryValue = matchPageQueryValue ? matchPageQueryValue[0].replace(/.*\//, '') : '' // find all chars start from the last "/" char, exclude the "/" char.

    const findPage = props.pages.find(p => {
      const matchRouteQueryKey = p.path.match(':.*') // find all chars after the first ":" char, include the ":".
      const getRouteQueryKey = matchRouteQueryKey ? matchRouteQueryKey[0].replace(':', '') : ''

      if (getRouteQueryKey) {
        if (getPageRouteQueryValue) {
          return p.path.replace(`:${getRouteQueryKey}`, getPageRouteQueryValue) === page.path
        }
      }

      return p.path === page.path
    })

    if (!findPage) {
      throw new Error('Page not found')
    }

    const newPage = { ...findPage, value: getPageRouteQueryValue }

    setHistory(prev => [...prev, newPage])
    setCurrentPage(newPage)
  }

  const prevPage = () => {
    if (history.length > 1) {
      console.log('go to previous page')
      setHistory(prev => {
        const prevHistory = [...prev]
        prevHistory.pop()
        return prevHistory
      })
      setCurrentPage(history[history.length - 2])
    }
  }

  return (
    <routerContext.Provider
      value={{
        history,
        currentPage,
        addPage,
        prevPage,
      }}
    >
      {props.children}
    </routerContext.Provider>
  )
}
