import { CustomError, formatDate, getChatgptServerWrapperClient } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { actions, APP_SESSION_ID, useAppDispatch, useAppSelector } from '../redux'
import DisplayNumber from '../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'

type Props = {}

const DEFAULT_QUERY = 'Summarise the following text in short'
const DEFAULT_LONG_TEXT = ''

export const TextSummary: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const chatGptBackendEnvironment = useAppSelector(state => state.chatGptWrapperBackendEnvironment)
  const selectedQueryId = useAppSelector(state => state.selectedQueryId)
  const gptQueries = useAppSelector(state => state.gptQueries)
  const { id, request, appSessionId, response } =
    useMemo(() => gptQueries.find(q => q.id === selectedQueryId), [gptQueries, selectedQueryId]) ?? {}

  const isQueryFromCurrentSession = appSessionId === APP_SESSION_ID

  const [query, setQuery] = useState<string>(DEFAULT_QUERY)
  const [longText, setLongText] = useState<string>(DEFAULT_LONG_TEXT)
  const [showResponseChunks, setShowResponseChunks] = useState(false)

  const value = response?.status === 'resolved' ? response.value : undefined

  useEffect(() => {
    if (!request) {
      return
    }

    setQuery(request.query)
    setLongText(request.longText)
  }, [request])

  useEffect(() => {
    const cleanups: (() => void)[] = []

    if (!id || !request || !appSessionId || !isQueryFromCurrentSession) {
      return
    }

    const promise = getChatgptServerWrapperClient({
      backendEnvironment: chatGptBackendEnvironment,
    }).chatgptQuery.wrapperControllerQueryChatGpt({
      requestBody: {
        query: request.query,
        longText: request.longText,
      },
    })

    cleanups.push(() => promise.cancel())

    promise
      .then(result => {
        dispatch(
          actions.updateGptQueryResult({
            queryId: id,
            result: {
              status: 'resolved',
              value: result,
            },
          }),
        )
      })
      .catch(error => {
        if (error.name !== 'CancelError') {
          CustomError.printErrorToConsole(error)
          dispatch(
            actions.updateGptQueryResult({
              queryId: id,
              result: {
                status: 'failed',
              },
            }),
          )
        }
      })

    return () => {
      cleanups.forEach(f => f())
    }
  }, [appSessionId, chatGptBackendEnvironment, dispatch, id, isQueryFromCurrentSession, request])

  const historyDesc = gptQueries.slice().sort((a, b) => b.dateMs - a.dateMs)

  return (
    <div className="p-6 text-black flex gap-4 h-full">
      <div className="border lg:w-2/12 hidden lg:flex flex-col rounded gap-1">
        <span>Queries History</span>
        <hr className="border-1" />
        {historyDesc.map(query => (
          <div
            key={query.id}
            className={classNames({
              'rounded border': true,
              'border-cyan-900': query.id === selectedQueryId,
            })}
            onClick={() => dispatch(actions.setSelectedQueryId(query.id))}
          >
            <div>{formatDate(new Date(query.dateMs))}</div>
            {query.request.query}
          </div>
        ))}
      </div>
      <div className="w-full lg:w-10/12">
        <div className="flex flex-col  gap-4">
          <input
            type="text"
            className="w-full outline outline-1 outline-blue-600 rounded pl-2"
            placeholder="Specify query..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <textarea
            className=" w-full h-28 outline outline-1 outline-blue-600 rounded pl-2"
            value={longText}
            placeholder="Specify text"
            onChange={e => setLongText(e.target.value)}
          />
          <span className="flex gap-2">
            <button
              className="outline outline-1 outline-blue-700   text-blue-700 font-bold py-[0.1rem] px-2 rounded"
              onClick={() => {
                const newId = Date.now()
                dispatch(
                  actions.createNewGptQuery({
                    newId,
                    query,
                    textToSummariesValue: longText,
                  }),
                )
              }}
            >
              <span className="flex">
                <span>Query</span>&nbsp;(
                <span className="flex gap-1">
                  <DisplayNumber state={query.length + longText.length} />
                  <span>Characters</span>
                </span>
                )
              </span>
            </button>
            <button
              className=" outline outline-1 outline-blue-700 font-bold py-[0.1rem] px-2 rounded"
              onClick={() => {
                setQuery(DEFAULT_QUERY)
                setLongText(DEFAULT_LONG_TEXT)
                dispatch(actions.clearGptQueriesHistory())
              }}
            >
              Clear History
            </button>
            examples and/or ideas:
            <a href="https://github.com/f/awesome-chatgpt-prompts/#prompts" target="_blank" rel="noreferrer">
              awesome-chatgpt-prompts
            </a>
            <span>
              {response?.status === 'pending' ? (
                <span className="flex gap-1">
                  <span className="pl-2">Pending...</span>
                </span>
              ) : response?.status === 'failed' ? (
                <span>Failed</span>
              ) : (
                <></>
              )}
            </span>
          </span>
        </div>
        {value && <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />}

        <div
          className={classNames({
            'outline outline-1': value,
            'rounded  outline-gray-400': true,
          })}
        >
          {response?.status === 'resolved' && (
            <div>
              <button className="border-4" onClick={() => setShowResponseChunks(prev => !prev)}>
                {showResponseChunks ? 'Hide' : 'Show'} {response.value.debug.chunks.length} Chunks
              </button>
              {showResponseChunks && (
                <div>
                  <div>
                    <span className="border-4 border-green-400">Request</span>
                    <span>/</span>
                    <span className="border-4 border-red-600">Response</span>
                    <span>:</span>
                  </div>
                  {response.value.debug.chunks.map((chunk, i) => (
                    <div key={i} className="border-4 border-black">
                      <div className="border-4 border-green-400 flex gap-1">
                        <span>({i + 1})</span>
                        <span>
                          {chunk.request.split('\n').map((line, j) => (
                            <div key={j}>{line}</div>
                          ))}
                        </span>
                      </div>
                      <div className="border-4 border-red-600">
                        <div>
                          <div className="flex gap-1">
                            <span>Chunk Request Length:</span>
                            <DisplayNumber state={chunk.textReducedInfoDto.requestLength} />
                            <span>|</span>
                            <span>Chunk Response Length:</span>
                            <DisplayNumber state={chunk.textReducedInfoDto.responseLength} />
                            <span>|</span>
                            <span>Chunk Reduced By:</span>
                            <DisplayNumber state={100 - chunk.textReducedInfoDto.textReducedPercentage} percentage />
                          </div>
                          <br />
                        </div>
                        <div className="flex gap-1">
                          <span>({i + 1})</span>
                          <span>
                            {chunk.response.split('\n').map((line, j) => (
                              <div key={j}>{line}</div>
                            ))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <br />
            </div>
          )}
          {value && (
            <div>
              <div className="flex gap-1">
                <span>Total Request Length:</span>
                <DisplayNumber state={value.debug.textReducedInfoDto.requestLength} />
                <span>|</span>
                <span>Total Response Length:</span>
                <DisplayNumber state={value.debug.textReducedInfoDto.responseLength} />
                <span>|</span>
                <span>Total Reduced By:</span>
                <DisplayNumber state={100 - value.debug.textReducedInfoDto.textReducedPercentage} percentage />
              </div>
              <br />
            </div>
          )}
          {value && (
            <div className="pl-2">
              {value.result.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
