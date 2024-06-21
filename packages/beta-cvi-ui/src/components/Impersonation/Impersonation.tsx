import { useState } from 'react'
import { useImpersonation } from '../../hooks/useImpersonation'

const Impersonation = ({
  setShowImpersonationModal,
}: {
  setShowImpersonationModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { impersonationRequestStatus, onImpersonation, onExitImpersonation, impersolatedAddress, address } =
    useImpersonation(() => {
      setShowImpersonationModal(false)
    })

  const [addressInput, setInputAddress] = useState('')

  return (
    <div className="flex flex-col items-start justify-center text-white max-w-full w-[500px] mt-4">
      <span>
        <b>{impersolatedAddress ? 'Impersonated' : 'Connected'} Wallet Address:</b> {address}
      </span>
      <span className="w-full mt-4">Override wallet address:</span>
      <input
        type="text"
        className="w-full bg-dark-700 p-4 rounded-lg mt-2"
        placeholder="Please enter address"
        value={addressInput}
        onChange={e => setInputAddress(e.target.value)}
      />
      <button
        disabled={address === addressInput || impersonationRequestStatus === 'pending' || !addressInput}
        type="button"
        className="text-white bg-common-blue w-full rounded-lg p-4 mt-4"
        onClick={() => onImpersonation(addressInput)}
      >
        SET
      </button>

      {impersolatedAddress && (
        <button
          type="button"
          className="text-white bg-emerald-600 w-full rounded-lg p-4 mt-4"
          onClick={onExitImpersonation}
        >
          EXIT IMPERSONATION MODE
        </button>
      )}
    </div>
  )
}

export default Impersonation
