import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import useInversify from '../hooks/use-inversify'
import Terminal, { ColorMode, LineType } from 'react-terminal-ui'
import { Cli } from '../cli'
import type { InverifyContext } from '../context/inversify-context'
import type { HardhatCommandsInversifyService, HardhatAdvanceTimeInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO } from '@coti-cvi/lw-sdk'
import './styles.css'

type Props = {}

export const Main: FC<Props> = () => {
  const inverisfyContext = useInversify()

  const [cli, setCli] = useState<Cli>()

  const [terminalLineData, setTerminalLineData] = useState<{ type: LineType; value: string }[]>([])

  const nofityUseInputRef = useRef<(useInput: string) => void>()

  useEffect(() => {
    if (
      terminalLineData.length > 0 &&
      terminalLineData[terminalLineData.length - 1].type === LineType.Input &&
      nofityUseInputRef.current
    ) {
      nofityUseInputRef.current(terminalLineData[terminalLineData.length - 1].value)
    }
  }, [terminalLineData])

  const waitForUserInput = useCallback(async (): Promise<string> => {
    return new Promise(resolve => {
      nofityUseInputRef.current = resolve
    })
  }, [])

  const writeOutput = useCallback(
    (value: string, options?: { overrideLineNumberFromEnd?: number }) =>
      setTerminalLineData(prev => {
        if (options?.overrideLineNumberFromEnd === undefined) {
          return [...prev, { type: LineType.Output, value }]
        }
        const lineIndex = prev.length - 1 - options.overrideLineNumberFromEnd
        return prev.map((line, index) => (index === lineIndex ? { type: LineType.Output, value } : line))
      }),
    [],
  )

  const clearOutput = useCallback(
    (options?: { lines?: number }) =>
      setTerminalLineData(prev => (options?.lines === undefined ? [] : prev.slice(0, prev.length - options.lines))),
    [],
  )

  const askQuestion = useCallback(
    async (question: string) => {
      writeOutput(question)
      return waitForUserInput()
    },
    [waitForUserInput, writeOutput],
  )

  const [requiredInversify, setRequiredInversify] = useState<Required<InverifyContext>>()

  useEffect(() => {
    const {
      chainId,
      setChainId,
      useCVIChainId,
      useILChainId,
      useTVChainId,
      useVestingChainId,
      useEthChainId,
      useHardhatChainId,
      useWagmiClient,
      setSigner,
      inversifyContainer,
      providerInversifyService,
      hardhatCommandsInversifyService,
      HardhatAdvanceTimeInversifyService,
      ethersJsonRpcBatchProvider,
      globalEventsInversifyService,
      latestBlockInfoInversifyService,
      signerInversifyService,
      overridesInversifyService,
      getContractInversifyService,
      uniswapInversifyService,
      genericContractInteractionInversifyService,
    } = inverisfyContext

    if (
      chainId &&
      setChainId &&
      useCVIChainId &&
      useILChainId &&
      useTVChainId &&
      useVestingChainId &&
      useEthChainId &&
      useHardhatChainId &&
      useWagmiClient &&
      setSigner &&
      inversifyContainer &&
      providerInversifyService &&
      // hardhatCommandsInversifyService &&
      // HardhatAdvanceTimeInversifyService &&
      ethersJsonRpcBatchProvider &&
      globalEventsInversifyService &&
      latestBlockInfoInversifyService &&
      signerInversifyService &&
      overridesInversifyService &&
      getContractInversifyService &&
      uniswapInversifyService &&
      genericContractInteractionInversifyService
    ) {
      setRequiredInversify({
        chainId,
        setChainId,
        useCVIChainId,
        useILChainId,
        useTVChainId,
        useVestingChainId,
        useEthChainId,
        useHardhatChainId,
        useWagmiClient,
        setSigner,
        inversifyContainer,
        providerInversifyService,
        hardhatCommandsInversifyService: hardhatCommandsInversifyService as HardhatCommandsInversifyService, // FIXME:
        HardhatAdvanceTimeInversifyService: HardhatAdvanceTimeInversifyService as HardhatAdvanceTimeInversifyService, // FIXME:
        ethersJsonRpcBatchProvider,
        globalEventsInversifyService,
        latestBlockInfoInversifyService,
        signerInversifyService,
        overridesInversifyService,
        getContractInversifyService,
        uniswapInversifyService,
        genericContractInteractionInversifyService,
      })
    }
  }, [inverisfyContext])

  useEffect(() => {
    const id = setInterval(() => {
      if (!requiredInversify) {
        setTerminalLineData(prev => {
          const initialMsg = 'Connecting Node...'

          if (
            prev.length === 0 ||
            prev[prev.length - 1].type !== LineType.Output ||
            !prev[prev.length - 1].value.includes(initialMsg)
          ) {
            return [...prev, { type: LineType.Output, value: initialMsg }]
          }

          const newMsg = prev[prev.length - 1].value.length > 60 ? initialMsg : `${prev[prev.length - 1].value}.`

          return [...prev.slice(0, prev.length - 1), { type: LineType.Output, value: newMsg }]
        })
      }
    }, 50)

    return () => clearInterval(id)
  }, [requiredInversify])

  useEffect(() => {
    if (!requiredInversify) {
      return
    }
    setTerminalLineData(prev => [
      ...prev,
      { type: LineType.Output, value: `Connected!` },
      { type: LineType.Output, value: `Please Choose:` },
    ])
    let isClosed = false
    const cli = new Cli(requiredInversify, () => isClosed, writeOutput, askQuestion, clearOutput)
    setCli(cli)

    return () => {
      isClosed = true
    }
  }, [askQuestion, clearOutput, requiredInversify, writeOutput])

  useEffect(() => {
    async function init() {
      if (cli) {
        await cli.runMainMenu()
      }
    }
    init()
  }, [cli, waitForUserInput, writeOutput])

  return (
    <div className="container">
      <Terminal
        name={`${CHAIN_IDS_INFO[inverisfyContext.chainId].hardhatConfigNetworkName} Imperament Loss Protection Cli ${
          inverisfyContext.signerInversifyService?.address
        }`}
        colorMode={ColorMode.Dark}
        lineData={terminalLineData}
        onInput={value => setTerminalLineData(prev => [...prev, { type: LineType.Input, value }])}
      />
    </div>
  )
}
