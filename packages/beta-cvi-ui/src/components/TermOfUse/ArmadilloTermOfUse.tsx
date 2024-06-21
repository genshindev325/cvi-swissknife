import React, { useEffect } from 'react'

import armadiloStyles from './ArmadilloTermOfUse.module.scss'

const ArmadillloTermOfUse = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="m-auto px-6 pt-6">
      <span className="flex flex-col gap-3 bg-dark-600 lg:max-w-[1200px] text-white p-12 rounded-2xl">
        <h1 className={`${armadiloStyles.title} font-sans`}>Terms of Use</h1>
        <ol id={armadiloStyles.l1}>
          <li data-list-text="1.">
            <h2 className="mb-4">General</h2>
            <ol id={armadiloStyles.l2}>
              <li data-list-text="1.1.">
                <p className="text-md">
                  Welcome to the Armadillo (the “Company” and/or “Our” and/or ”We” and/or “Us”), and to the website
                  available at{' '}
                  <a href="http://www.armadillo.is/" className={armadiloStyles.a} target="_blank" rel="noreferrer">
                    www.armadillo.is
                  </a>{' '}
                  (the “Website” or the “Platform”). The Company is a non-custodial provider of software services.
                  meaning the Company does not have custody of, control or manage user funds in any manner whatsoever.
                  The Services (as defined in section 3) are deployed in a public environment wherein users can
                  autonomously and directly access the Service without any involvement or actions taken by the Company.
                </p>
              </li>
              <li data-list-text="1.2.">
                <p className="text-md">
                  These terms of use (the “Terms”) govern your (“You”, “Your”, “Yours”, “ User” or “Users”) use of the
                  Platform and/or the Services (as the term “Services” is defined in section 3 below). These Terms
                  should be read carefully by You in their entirety prior to Your use of the Services. Please note that
                  these Terms constitute a legally binding agreement between You and Us, and that if You do not agree
                  with any provision of these Terms, You shall immediately cease using the Platform and/or Services. By
                  using the Platform and/or Services, You agree to the Terms, as amended from time to time
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="2." className="flex flex-col">
            <h2>Eligibility</h2>
            <p className="text-md mb-4">
              You are only entitled to use the Services, if You comply with all of the following:
            </p>

            <ol id={armadiloStyles.l3}>
              <li data-list-text="2.1.">
                <p className="text-md">You are at least 18 years old;</p>
              </li>
              <li data-list-text="2.2.">
                <p className="text-md">
                  You have the right, authority and capacity to enter into these Terms and to abide by all the terms and
                  conditions of these Terms;
                </p>
              </li>
              <li data-list-text="2.3.">
                <p className="text-md">
                  If You are using the Services on behalf of a corporation, governmental organization or other legal
                  entity, You have the right, power and authority to enter into the Terms on behalf of such corporation,
                  governmental organization or other legal entity and bind them to these Terms; and
                </p>
              </li>
              <li data-list-text="2.4.">
                <p className="text-md">
                  You are not prohibited from using the Services pursuant to the laws of the country in which You reside
                  or are located while using the Services.
                </p>
              </li>
              <li data-list-text="2.5.">
                <p className="text-md">
                  You are not a citizen, resident (tax or otherwise), green card holder, or located and/or Forbidden
                  Person of any Forbidden Territory (as defined below). “Forbidden Territory” means and includes:
                </p>
                <ol id={armadiloStyles.l4}>
                  <li data-list-text="(i)">
                    <p className="text-md">
                      the jurisdictions specified by the Financial Action Task Force, as Jurisdictions under Increased
                      Monitoring and/or High-Risk Jurisdictions, as they may change from time to time;{' '}
                      <span className={armadiloStyles.lowerRoman}>(ii)</span> the United States of America (and its
                      territories, including Puerto Rico), British Virgin Islands, Canada, Gibraltar, Israel, Iran,
                      North Korea, Sudan, Syria, Lebanon, Russia and the Crimea, Donetsk or Luhansk regions of Ukraine;
                      and <span className={armadiloStyles.lowerRoman}>(ii)</span>any other jurisdiction which prohibits
                      or requires any supervision oversight licensing regulatory compliance legal compliance and/or
                      prior approval from any regulatory (or similar) authority or body or form any monetary or
                      securities body. “Forbidden Persons” refers to any individual, natural person, firm, company,
                      partnership, trust, corporation, entity, government, state or agency of a state or any other
                      incorporated or unincorporated body or association, association or partnership (whether or not
                      having separate legal personality) that is <span className={armadiloStyles.lowerRoman}>(i)</span>{' '}
                      established and/or lawfully existing under the laws of a Forbidden Territory;{' '}
                      <span className={armadiloStyles.lowerRoman}>(ii)</span> citizen, resident (tax or otherwise),
                      green card holder, or located of other jurisdictions that are included from time to time in
                      international lists of countries at risk of money laundering;{' '}
                      <span className={armadiloStyles.lowerRoman}>(iii)</span> listed under any sanction list
                      administered by the United States of America, the United Nations Security Council, the European
                      Union, the United Kingdom, Israel or the respective governmental institutions of any of the
                      foregoing; <span className={armadiloStyles.lowerRoman}>(iv)</span> politicly exposed person.
                    </p>
                  </li>
                </ol>
              </li>
              <li data-list-text="2.6.">
                <p className="text-md">
                  You are not using a VPN or any other software to hide or modify your IP address.
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="3.">
            <h2 className="mb-4 ">The Services</h2>
            <ol id={armadiloStyles.l5}>
              <li data-list-text="3.1.">
                <p className="text-md">
                  As part of the Website (and as may change from time to time), You are allowed to review and use the
                  impermanent loss protection system (“ILP”) and perform other ancillary activities, and receive other
                  services to be updated from time to time (together, the “Services”). For detailed and updated
                  information on the Services and the Platform, please carefully read and review the Website (including
                  the documents in it and the whitepapers).
                </p>
              </li>
              <li data-list-text="3.2.">
                <p className="text-md">
                  In the event of a conflict between the Terms and the Website’s whitepapers and documents with respect
                  to the Services, the terms of the Website’s whitepapers and documents will prevail.
                </p>
              </li>
              <li data-list-text="3.3.">
                <p className="text-md">
                  It is clarified that the Services are available to Users as a tool that they can choose to use while
                  using the Platform, and nothing more. The Services are based on a mathematical formula, assumptions,
                  and data that are available to users in the whitepaper and other documents that appear on the Website.
                  Users should examine for themselves its quality, accuracy, and suitability for their needs, and based
                  upon it decide whether they should use and/or rely on the Services and any of the Website’s
                  information.
                </p>
              </li>
              <li data-list-text="3.4.">
                <p className="text-md">
                  Nothing contained in the Website, and specifically the Services, shall constitute or shall be deemed
                  to constitute a financial, legal, tax or other advice of any kind, or a solicitation to purchase, sell
                  or invest in any financial products or to engage in any financial strategy. The Company or any of its
                  affiliates (a) does not guarantee the adequacy, accuracy, merchantability, timeliness, completeness,
                  evolution and/or movements of any data included therein or any other data contained in the Website;
                  (b) shall not bear any responsibility for damages, costs or expenses that will be caused due to
                  reliance thereof; and (c) makes no warranty, express or implied, as to results to be obtained by
                  owners of any securities, or by any other person or entity from the use of the Services or any other
                  information contained in the Website.
                </p>
              </li>
              <li data-list-text="3.5.">
                <p className="text-md">
                  The Platform includes limitations and constraints that are designed to maintain the Platform’s
                  stability. As a result of such limitations and constraints, the Platform may not allow the Services to
                  be used when requested. Therefore, in any case where the User requests to use the Services and the
                  Platform does not allow it, whether due to matters within the control of the Company or due to events
                  beyond its control, the Company will not bear any responsibility and the User undertakes not to make
                  any claim against the Company because of that.
                </p>
                <p className={armadiloStyles.s2}>Your Wallet</p>
              </li>
              <li data-list-text="3.6.">
                <p className="text-md">
                  The Services may require you to link your wallet with the Platform. The Platform is a purely on-chain
                  non-custodial application, meaning you are solely responsible for the custody of the cryptographic
                  private keys to the digital asset wallets you hold. This Term is not intended to, and does not, create
                  or impose any fiduciary duties on Us. We draw to your attention that the wallet (as MetaMask) is a
                  third party and advise you to read its terms of use.
                </p>
              </li>
              <li data-list-text="3.7.">
                <p className="text-md">
                  You understand and agree that We are not a wallet provider, exchange, broker, financial institution,
                  bank, insurance company, licensed entity, or creditor.
                </p>
              </li>
              <li data-list-text="3.8.">
                <p className="text-md">
                  We do not store Your private keys, backup phrases or passwords (the “Private Information”). It is very
                  important that You back up such Private Information. If You lose Your Private Information, then it
                  will not be possible for Us to recover it for You and You may lose access to Your cryptocurrency.
                </p>
                <p className={armadiloStyles.s2}>General</p>
              </li>
              <li data-list-text="3.9.">
                <p className="text-md">
                  The Forbidden Territory is subject to review by the Company and may be amended from time to time at
                  its sole discretion with or without prior notice.
                </p>
              </li>
              <li data-list-text="3.10.">
                <p className="text-md">
                  We reserve the right to limit the scope of the Services to Users at Our sole discretion, including in
                  cases where We suspect that they violate these Terms.
                </p>
                <p className={armadiloStyles.s2}>CVI Governance</p>
              </li>
              <li data-list-text="3.11.">
                <p className="text-md">
                  Without derogating from the generality of the above, if You breach the Terms, or any other event as We
                  may deem necessary, including, without limitation, (a) maintenance work; (b) inability of Our service
                  providers to provide You with the Services; (c) market disruption; (d) Your inability to conform to
                  Our requirements; (e) pending litigation, investigation, or government proceeding related to You or
                  Your Wallet; and/or (f) in case We perceive a heightened risk of legal or regulatory non-compliance
                  associated with Your Wallet's activity, We may, at Our sole discretion and without liability to You,
                  with or without prior notice:
                </p>
                <ol id={armadiloStyles.l6}>
                  <ol id={armadiloStyles.l7}>
                    <ol id={armadiloStyles.l8}>
                      <li data-list-text="1.1.1.">
                        <p className="text-md">suspend Your access to all or a portion of the Services; or</p>
                      </li>
                      <li data-list-text="1.1.2.">
                        <p className="text-md">
                          terminate Your access to the Services, and delete or deactivate Your connection to the
                          Platform with Your Wallet.
                        </p>
                      </li>
                    </ol>
                  </ol>
                </ol>
              </li>
            </ol>
          </li>
          <li data-list-text="4.">
            <h2 className="mb-4">Fees</h2>
            <ol id={armadiloStyles.l9}>
              <li data-list-text="4.1.">
                <p className="text-md">
                  In consideration for the Services provided by Us, You shall pay to Us the fees as set forth in our
                  fees tariff as published on the Website (including its documents and whitepaper), as amended and
                  updated from time to time.
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="5.">
            <h2>Your Representations</h2>
            <p className="mb-4 text-md">
              By using the Services, You hereby represent, warrant, acknowledge and undertake that:
            </p>
            <ol id={armadiloStyles.l10}>
              <li data-list-text="5.1.">
                <p className="text-md">
                  You are aware and understand that the Company is not a custodian, exchange, financial institution or
                  insurance company.
                </p>
              </li>
              <li data-list-text="5.2.">
                <p className="text-md">
                  You have full right and authority to use the Services and to be bound by the Terms and You agree that
                  Your use of the Services is subject to all applicable local, state, national and international laws
                  and regulations.
                </p>
              </li>
              <li data-list-text="5.3.">
                <p className="text-md">
                  You have carefully considered the risks involved in purchasing and holding virtual currencies in
                  general, using the Platform and the usage of any digital currency that appears on the Website.
                </p>
              </li>
              <li data-list-text="5.4.">
                <p className="text-md">
                  You are aware that crypto assets are not insured by any public or private insurer, including against
                  cyber theft or theft by other means, and that cryptocurrency activity is not regulated activity in
                  many states. Accordingly, You acknowledge that the value of crypto assets can be extremely volatile
                  and unpredictable, which can result in significant losses in a short time, including possibly a loss
                  of total value and that the price and liquidity of crypto assets has been subject to large
                  fluctuations in the past and may be subject to large fluctuations in the future.
                </p>
              </li>
              <li data-list-text="5.5.">
                <p className="text-md">
                  You are aware and understand the uncertain nature of virtual currencies and that the Services, the
                  Platform and ILP are not regulated by any central bank or other government authority, does not have
                  any permit or licenses (not insurance licenses), and does not constitute investment, insurance,
                  securities or financial instrument/product.
                </p>
              </li>
              <li data-list-text="5.6.">
                <p className="text-md">
                  You are using the Services only for Your personal use and You shall not use the Services by or for any
                  third party.
                </p>
              </li>
              <li data-list-text="5.7.">
                <p className="text-md">Your use of any of the Services is solely at Your own responsibility. </p>
              </li>
              <li data-list-text="5.8.">
                <p className="text-md">
                  You have verified and determined that Your use of the Services does not violate any laws or
                  regulations of any jurisdiction that applies to You.
                </p>
              </li>
              <li data-list-text="5.9.">
                <p className="text-md">
                  You are responsible for determining and incurring any and all taxes assessed, incurred, or required to
                  be collected, paid, or withheld for any reason in connection with Your use of the Services (the
                  “Taxes”). You are also solely responsible for collecting, withholding, reporting, and remitting
                  correct Taxes to the appropriate tax authority. We are not obligated to, nor will We, determine
                  whether Taxes apply, or calculate, collect, report, or remit any Taxes to any tax authority arising
                  from any transaction.
                </p>
              </li>
              <li data-list-text="5.10.">
                <p className="text-md">
                  You will use the Services in good faith towards the Company and others using the Services.
                </p>
              </li>
              <li data-list-text="5.11.">
                <p className="text-md">
                  The Company may, at its sole discretion, decide whether to make the Services (or a part thereof)
                  available to You or not (provided that existing contractual obligations are honored).
                </p>
              </li>
              <li data-list-text="5.12.">
                <p className="text-md">
                  You shall be solely responsible for maintaining the confidentiality of Your Wallet’s private key (the
                  “Wallet Private Key”), and for any and all actions and transactions taken by You by using the Services
                  by anyone who enters Your Wallet while using Your Wallet Private Key, and all such actions and
                  transactions shall be deemed as actions and transactions taken by You.
                </p>
              </li>
              <li data-list-text="5.13.">
                <p className="text-md">
                  You are aware of the risks associated with utilizing any crypto assets blockchain network, including,
                  but not limited to, the risk of unknown vulnerabilities in or unanticipated changes to any network
                  protocol.
                </p>
              </li>
              <li data-list-text="5.14.">
                <p className="text-md">
                  You shall indemnify Us and hold Us harmless from and against all claims, liabilities, damages, losses,
                  costs and expenses, including legal fees, arising out of or in connection with any breach of these
                  Terms by You, and any other liabilities arising out of Your use of the Services or any unauthorized
                  use of the Services by any third party using Your Wallet Private Key.
                </p>
                <p className="text-md">
                  <br />
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="6.">
            <h2 className="mb-4">Risks</h2>
            <ol id={armadiloStyles.l11}>
              <li data-list-text="6.1.">
                <p className="text-md">
                  There are risks associated with utilizing services involving virtual currencies and the transfer of
                  funds and/or assets, including, but not limited to, the risk of failure of hardware, software and
                  internet connections, malicious software introduction; the risk that third parties may obtain
                  unauthorized access to information, including, but not limited to, public and private keys; and the
                  risk of unknown vulnerabilities in or unanticipated changes to the network protocol. You acknowledge
                  and accept that We have no control over the network and will not be responsible for any harm occurring
                  as a result of such risks, including, but not limited to, the inability to reverse a transaction, and
                  any losses in connection therewith due to erroneous or fraudulent actions. You agree and understand
                  that We will not be responsible for any communication failures, disruptions, errors, distortions or
                  delays You may experience when using the Services, however caused.
                </p>
              </li>
              <li data-list-text="6.2.">
                <p className="text-md">
                  The risk of loss in using services involving virtual currencies may be substantial and losses may
                  occur over a short period of time. In addition, price and liquidity are subject to significant
                  fluctuations that may be unpredictable, and the Company shall bear no liability for any losses
                  resulting from such risks.
                </p>
              </li>
              <li data-list-text="6.3.">
                <p className="text-md">
                  Virtual currencies in general, and ILP in particular, are not legal tender and are not backed by any
                  sovereign government. In addition, the legislative and regulatory landscape around virtual currencies
                  is constantly changing and may affect Your ability to use, transfer, or exchange virtual currencies.
                </p>
              </li>
              <li data-list-text="6.4.">
                <p className="text-md">You assume any and all risks associated with the use of the Services.</p>
                <p className="text-md">
                  <br />
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="7.">
            <h2>Prohibited Activities</h2>
            <p className="mb-4 text-md">
              You undertake to use the Services in a respectful manner, and You undertake not to:
            </p>
            <ol id={armadiloStyles.l12}>
              <li data-list-text="7.1.">
                <p className="text-md">
                  link to the Services and/or use the Services for the purpose of uploading, downloading, distributing,
                  publishing or transmitting (a) information or other material in a manner that violates any rights,
                  including intellectual property rights, protection of privacy rights or any other right; (b)
                  information or other material that is prohibited for publication or use because it constitutes threat,
                  harm, insult, slander, defamation, racism or inappropriate content; (c) information or other material
                  that includes a virus or other software that may damage the computer systems of the Company or any
                  third parties or in a manner that may restrict or prevent others from using the Services; (d)
                  information or other material that violates any law; or (e) information or other material that
                  includes an advertisement of any kind without the prior written permission of the Company;
                </p>
              </li>
              <li data-list-text="7.2.">
                <p className="text-md">
                  attempt to circumvent any content filtering techniques We employ, or attempt to access any service or
                  area of our Services that You are not authorized to access;
                </p>
              </li>
              <li data-list-text="7.3.">
                <p className="text-md">
                  introduce to the Services any virus, Trojan, worms, logic bombs or other harmful material;
                </p>
              </li>
              <li data-list-text="7.4.">
                <p className="text-md">
                  develop any third-party applications that interact with the Services without Our prior written
                  consent;
                </p>
              </li>
              <li data-list-text="7.5.">
                <p className="text-md">provide false, inaccurate, or misleading information;</p>
              </li>
              <li data-list-text="7.6.">
                <p className="text-md">use the Services using any interface other than the Platform;</p>
              </li>
              <li data-list-text="7.7.">
                <p className="text-md">interfere with other Users&#39; use of the Services;</p>
              </li>
              <li data-list-text="7.8.">
                <p className="text-md">use bots or other automated methods to access or use the Services;</p>
              </li>
              <li data-list-text="7.9.">
                <p className="text-md">
                  upload or transmit (or attempt to upload or to transmit), without the Company’s express permission,
                  any material that acts as a passive or active information collection or transmission mechanism,
                  including, without limitation, web bugs, cookies or other similar spyware devices;
                </p>
              </li>
              <li data-list-text="7.10.">
                <p className="text-md">
                  engage in “framing,” “mirroring,” or otherwise simulating the appearance or function of the Services;{' '}
                </p>
              </li>
              <li data-list-text="7.11.">
                <p className="text-md">
                  violate any applicable laws or regulations, encourage or promote any illegal activity, including, but
                  not limited to, copyright infringement, trademark infringement, defamation, invasion of privacy,
                  identity theft, hacking, cracking or distribution of counterfeit software;
                </p>
              </li>
              <li data-list-text="7.12.">
                <p className="text-md">
                  make any changes and/or interfere in any way in the source code of the Services and upload any
                  software and/or application that may harm or cause damage to the Company, the Services or any other
                  third party;
                </p>
              </li>
              <li data-list-text="7.13.">
                <p className="text-md">
                  disassemble, decompile or otherwise reverse engineer any software or other technology included in the
                  Services or used to provide the Services;
                </p>
              </li>
              <li data-list-text="7.14.">
                <p className="text-md">
                  use the Services to pay for, support or otherwise engage in any illegal activities, including, but not
                  limited to, illegal gambling, fraud, money laundering, or terrorist activities; and
                </p>
              </li>
              <li data-list-text="7.15.">
                <p className="text-md">
                  encourage or induce any other person to engage in any of the activities prohibited under this section.
                </p>
              </li>
              <li data-list-text="7.16.">
                <p className="text-md">
                  You acknowledge that without prejudice to any other right of the Company, if the Company is concerned
                  that Your use of the Services does not comply with the provisions of these Terms or any applicable
                  law, the Company may track Your use of the Services, prevent You from accessing the Services, transfer
                  Your behavior patterns on the Services to third parties, and perform any other action the Company may
                  deem appropriate to protect its property and/or rights and/or rights of third parties.
                </p>
                <p className="text-md">
                  <br />
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="8.">
            <h2 className="mb-4">Disclaimer</h2>
            <ol id={armadiloStyles.l13}>
              <li data-list-text="8.1.">
                <p className="text-md">
                  THE CONTENT AND MATERIALS AVAILABLE ON THE PLATFORM ARE FOR INFORMATIONAL PURPOSES ONLY AND ARE NOT
                  INTENDED TO ADDRESS YOUR PARTICULAR REQUIREMENTS OR NEEDS. IN PARTICULAR, THE CONTENT AND MATERIALS
                  AVAILABLE ON THE PLATFORM DO NOT CONSTITUTE ANY FORM OF ADVICE, REFERRAL OR RECOMMENDATION BY US;
                  SHOULD NOT BE REGARDED AS AN OFFER, SOLICITATION, INVITATION OR RECOMMENDATION TO BUY OR SELL TOKENS
                  OR ANY OTHER FINANCIAL SERVICES; AND ARE NOT INTENDED TO BE RELIED UPON BY YOU IN MAKING ANY SPECIFIC
                  DECISION TO BUY OR SELL A TOKEN. WE RECOMMEND THAT YOU SEEK INDEPENDENT ADVICE FROM FINANCIAL, LEGAL
                  AND TAX ADVISORS BEFORE MAKING ANY SUCH DECISION PARTICULARLY IN LIGHT OF THE RISKS ASSOCIATED WITH
                  DIGITAL ASSETS.
                </p>
              </li>
              <li data-list-text="8.2.">
                <p className="text-md">
                  NOTHING INCLUDED IN THE PLATFORM CONSTITUTES AN OFFER OR SOLICITATION TO SELL OR DISTRIBUTE
                  INVESTMENTS AND RELATED SERVICES TO ANYONE IN ANY JURISDICTION.
                </p>
              </li>
              <li data-list-text="8.3.">
                <p className="text-md">
                  THE PRICE OF DIGITAL ASSETS CAN BE HIGHLY UNPREDICTABLE AND VOLATILE WHEN COMPARED TO OTHER ASSETS.
                  YOU SHOULD NOT USE THE PLATFORM UNLESS YOU UNDERSTAND ITS NATURE AND THE EXTENT OF YOUR EXPOSURE TO
                  RISK. ANY SPREADS OR OTHER FEES ASSOCIATED WITH THE CONTRACTS MAY MAKE THEM MORE VOLATILE.
                </p>
              </li>
              <li data-list-text="8.4.">
                <p className="text-md">
                  THE REGULATORY ENVIRONMENT CONCERNING CRYPTOCURRENCIES AND OTHER DIGITAL ASSETS CONTINUES TO DEVELOP.
                  THE APPLICATION AND INTERPRETATION OF EXISTING LAWS AND REGULATIONS ARE OFTEN LARGELY UNTESTED AND
                  THERE IS A LACK OF CERTAINTY AS TO HOW THEY WILL BE APPLIED. NEW LAWS AND REGULATIONS WILL BE
                  PROMULGATED IN THE FUTURE THAT APPLY TO BLOCKCHAIN TECHNOLOGY AND DIGITAL ASSETS, AND RELATED SERVICE
                  PROVIDERS, AND NO ASSURANCE CAN BE GIVEN THAT ANY SUCH CHANGES WILL NOT ADVERSELY AFFECT DIGITAL
                  ASSETS GENERALLY OR THE SERVICES. IT IS NOT POSSIBLE TO PREDICT HOW SUCH CHANGES WOULD AFFECT THE
                  PRICE AND LIQUIDITY OF DIGITAL ASSETS GENERALLY, OR THE SERVICES.
                </p>
              </li>
              <li data-list-text="8.5.">
                <p className="text-md">
                  REGULATORY ACTIONS COULD NEGATIVELY IMPACT CRYPTOCURRENCIES AND OTHER DIGITAL ASSETS IN VARIOUS WAYS,
                  INCLUDING, FOR PURPOSES OF ILLUSTRATION ONLY, THROUGH A DETERMINATION (WITH RETROSPECTIVE OR
                  PROSPECTIVE EFFECT) THAT DIGITAL ASSETS ARE REGULATED FINANCIAL INSTRUMENTS REQUIRING REGISTRATION OR
                  LICENSING IN CERTAIN JURISDICTIONS. THE COMPANY MAY HAVE TO LIMIT THE AVAILABILITY OF CERTAIN
                  CONTRACTS OR DISALLOW USERS BASED ON THEIR CITIZENSHIP, RESIDENCE OR LOCATION FROM ENGAGING IN THE
                  PLATFORM IF DOING SO BECOMES COMMERCIALLY UNSUSTAINABLE OR LEGALLY PROHIBITED.
                </p>
              </li>
              <li data-list-text="8.6.">
                <p className="text-md">
                  THE TOKENS OF THE PLATFORM ARE NOT INTENDED TO CONSTITUTE SECURITIES AND/OR COLLECTIVE INVESTMENT
                  UNITS IN THE PLATFORM OR COMPANY. THE TOKEN HOLDER DOES NOT RECEIVE ANY FORM OF DIVIDEND OR OTHER
                  REVENUE RIGHTS, NOR DOES IT REPRESENT ANY PARTICIPATION IN A PROFIT-SHARING SCHEME.
                </p>
              </li>
              <li data-list-text="8.7.">
                <p className="text-md">
                  THE COMPANY, ITS DIRECTORS, OFFICERS, SHAREHOLDERS, AFFILIATES AND EMPLOYEES, WILL NOT BE RESPONSIBLE
                  OR LIABLE TO YOU FOR ANY LOSSES YOU INCUR AS THE RESULT OF YOUR USE OF THE ETHEREUM NETWORK OR ANY
                  OTHER BLOCKCHAIN NETWORK, OR THE METAMASK OR ANY OTHER ELECTRONIC WALLET, INCLUDING, BUT NOT LIMITED
                  TO, ANY LOSSES, DAMAGES OR CLAIMS ARISING FROM: (A) USER ERROR, SUCH AS FORGOTTEN PASSWORDS OR
                  INCORRECTLY CONSTRUED SMART CONTRACTS OR OTHER TRANSACTIONS; (B) SERVER FAILURE OR DATA LOSS; (C)
                  CORRUPTED WALLET FILES; (D) INTELLECTUAL PROPERTY INFRINGEMENT BY THE USERS; AND (E) UNAUTHORIZED
                  ACCESS OR ACTIVITIES BY THIRD PARTIES, INCLUDING, BUT NOT LIMITED TO, THE USE OF VIRUSES, PHISHING,
                  BRUTEFORCING OR OTHER MEANS OF ATTACK AGAINST THE TOOLS, ETHEREUM NETWORK, OR ANY OTHER BLOCKCHAIN
                  NETWORK, OR THE METAMASK OR ANY OTHER ELECTRONIC WALLET.
                </p>
              </li>
              <li data-list-text="8.8.">
                <p className="text-md">
                  THE COMPANY IS NOT RESPONSIBLE FOR LOSSES DUE TO BLOCKCHAIN OR ANY OTHER FEATURES OF THE ETHEREUM
                  NETWORK, OR ANY OTHER BLOCKCHAIN NETWORK, OR THE METAMASK OR ANY OTHER ELECTRONIC WALLET, INCLUDING,
                  BUT NOT LIMITED TO, LATE REPORT BY DEVELOPERS OR REPRESENTATIVES (OR NO REPORT AT ALL) OF ANY ISSUES
                  WITH THE BLOCKCHAIN SUPPORTING THE ETHEREUM NETWORK OR THE POLYGON NETWORK, INCLUDING FORKS, TECHNICAL
                  NODE ISSUES, OR ANY OTHER ISSUES CAUSING FUND LOSSES AS A RESULT.
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="9.">
            <h2 className="mb-4">Limitation of Liability</h2>
            <ol id={armadiloStyles.l14}>
              <li data-list-text="9.1.">
                <p className="text-md">
                  You agree that Your use of the Website and the Services shall be at Your own risk. To the fullest
                  extent permitted by law, the Company disclaims all warranties, explicit or implied, in connection with
                  the Services and Your use thereof, including implied warranties of merchantability, title, fitness for
                  a particular purpose or non-infringement, usefulness, authority, accuracy, completeness, and
                  timeliness. Accordingly, the Services, including all content and functions made available on or
                  accessed through or sent from the Services, are provided “as is,” “as available,” and on a “with all
                  faults&quot; basis.
                </p>
              </li>
              <li data-list-text="9.2.">
                <p className="text-md">
                  Without derogating from the generality of the foregoing, the Company assumes no liability or
                  responsibility for any (a) errors, mistakes, or inaccuracies of any content included in the Services;
                </p>
                <ol id={armadiloStyles.l15}>
                  <li data-list-text="(b)">
                    <p className="text-md">
                      any interruption or cessation of transmission to or from the Platform or via the Services; and
                    </p>
                  </li>
                  <li data-list-text="(c)">
                    <p className="text-md">
                      any bugs, viruses, Trojan horses, or the like that may be transmitted to or through the Services
                      by any third party.
                    </p>
                  </li>
                </ol>
              </li>
              <li data-list-text="9.3.">
                <p className="text-md">
                  You agree to hold the Company harmless for any losses caused, directly or indirectly, to You and/or to
                  any other third party, with respect to the Platform and/or the Services, and You shall bear sole
                  responsibility for any of Your decisions made relying on the content of the Services.
                </p>
              </li>
              <li data-list-text="9.4.">
                <p className="text-md">
                  In no event will the Company, its affiliates and service providers, or any of their respective
                  officers, directors, agents, employees or representatives, be liable to You or any third party for any
                  special, direct, indirect, incidental, punitive, or consequential damages whatsoever, including any
                  lost profits or lost data arising from Your authorized or unauthorized use of the Services, whether
                  based on warranty, contract, tort, or any other legal theory, and whether or not the Company has been
                  advised of the possibility of these damages, and in cases where a judicial authority finds the Company
                  liable, its liability shall not exceed zero or the minimum applicable
                </p>
                <p className="text-md">
                  by law, according to the lower. The foregoing limitation of liability shall apply to the fullest
                  extent permitted by law in the applicable jurisdiction.
                </p>
              </li>
              <li data-list-text="9.5.">
                <p className="text-md">
                  The Company is not responsible for any problems or technical malfunction of any telephone or network
                  lines, computer online systems, servers or providers, hardware, software, failure due to technical
                  problems or traffic congestion on the internet (or inaccessibility of the internet) or incompatibility
                  between the Platform or the Services and Your browser and/or other equipment and/or the systems. The
                  Company does not assume any responsibility or risk for Your use of the internet.
                </p>
              </li>
              <li data-list-text="9.6.">
                <p className="text-md">
                  Under no circumstances will the Company be required to deliver to You any virtual currency as damages,
                  specific performance or any other remedy. If You base Your calculations of damages in any way on the
                  value of a virtual currency, You and the Company agree that the calculation will be based on the
                  lowest value of the virtual currency during the period between the accrual of the claim and the award
                  of damages.
                </p>
              </li>
              <li data-list-text="9.7.">
                <p className="text-md">
                  The Company will not be responsible or liable to You for any loss and takes no responsibility for
                  damages or claims arising in whole or in part, directly or indirectly from: (a) User error such as
                  forgotten Private Information, incorrectly constructed transactions, or mistyped wallet addresses;
                </p>
                <p className="text-md">
                  (b) server failure or data loss; (c) corrupted or otherwise non-performing address or wallet; (d)
                  unauthorized access to applications; and (e) any unauthorized activities, including, without
                  limitation, the use of hacking, viruses, phishing, brute forcing or other means of attack against the
                  Services.
                </p>
              </li>
              <li data-list-text="9.8.">
                <p className="text-md">
                  Please note that despite the rules and guidelines in the Terms, it is possible that others might
                  access or use the Services in ways that are deceptive, fraudulent, defamatory, harmful, unlawful,
                  offensive or otherwise objectionable. The Company makes no representation or warranty whatsoever with
                  regard to the conduct of any Users or other third parties on or in connection with the Services,
                  whether online or offline, whether in connection with any transaction, User content or otherwise.
                </p>
              </li>
              <li data-list-text="9.9.">
                <p className="text-md">
                  The Company may make improvements and/or changes to the Services at any time. The Company does not
                  represent that the Services are appropriate for use in all locations and persons who have access to
                  the Services do so on their own initiative and are responsible for compliance with local laws, of and
                  to the extent applicable.
                </p>
              </li>
              <li data-list-text="9.10.">
                <p className="text-md">
                  The Company reserves the right to fully cooperate with any law enforcement authorities or court order
                  requesting or directing it to disclose the identity of anyone taking any actions and/or omissions that
                  are believed to violate the Terms.
                </p>
              </li>
              <li data-list-text="9.11.">
                <p className="text-md">
                  Due to the nature of the Services provided by the Company, certain data may be susceptible to hacking
                  attacks despite the measures taken by the Company. The Company shall not be responsible for any theft,
                  loss, disappearance or destruction of cryptocurrencies while being transferred in the course of
                  providing the Services.
                </p>
              </li>
              <li data-list-text="9.12.">
                <p className="text-md">
                  You agree to indemnify and hold harmless the Company, its affiliates, subsidiaries, directors,
                  managers, members, officers, and employees from any and all claims, demands, actions, damages, losses,
                  costs or expenses, including, without limitation, reasonable legal fees arising out of or relating to
                  its or any other person’s use of its Private Information in connection with:
                </p>
                <p className="text-md">
                  (a) use of the Services; (b) breach of these Terms or any other binding instrument between the Company
                  and You; (c) feedback or submissions You provide; or (d) violation of any rights of
                </p>
                <p className="text-md">
                  any other person or entity. This indemnity shall apply to Your successors and assigns and will survive
                  any termination or cancellation of these Terms.
                </p>
              </li>
              <li data-list-text="9.13.">
                <p className="text-md">
                  You acknowledge and agree to waive and to hold the Company harmless for any losses caused, directly or
                  indirectly, to You and/or by You and/or to any other third party with respect to the Services, and You
                  shall bear sole responsibility for any of Your decisions made relying on the content of the Services
                  and/or information provided by the Company and/or by anyone on Our behalf.
                </p>
              </li>
              <li data-list-text="9.14.">
                <p className="text-md">
                  Any and all of the Company&#39;s indemnities, warranties, and limitations of liability (whether
                  express or implied) are hereby excluded to the fullest extent permitted under law except as set forth
                  herein.
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="10.">
            <h2 className="mb-4">Intellectual Property Rights</h2>
            <ol id={armadiloStyles.l16}>
              <li data-list-text="10.1.">
                <p className="text-md">
                  The Platform, the Services and their content, including the video materials, text, photos, logos,
                  designs, music, sound, figures, trademarks, graphs, sheets, statistics, currency exchange quotations
                  and any other content embodied in the Services are protected by intellectual property rights of the
                  Company or of third parties.
                </p>
              </li>
              <li data-list-text="10.2.">
                <p className="text-md">
                  All intellectual property rights and any content provided in connection with the Services are the
                  property of the Company or its licensors or suppliers and are protected by applicable intellectual
                  property laws. We do not give any obscure license for the use of the contents of the Services.
                </p>
              </li>
              <li data-list-text="10.3.">
                <p className="text-md">
                  As between the Company and You, the Company retains all right, title and interest in and to the
                  Platform and the Services. Your use of the Platform and/or the Services does not confer on You any of
                  the intellectual property rights embodied in the Platform and/or the Services, other than the right to
                  use the Platform and/or the Services in accordance with the terms of these Terms.
                </p>
              </li>
              <li data-list-text="10.4.">
                <p className="text-md">
                  You may only use the Platform and/or the Services for personal, lawful and non-commercial use.
                </p>
              </li>
              <li data-list-text="10.5.">
                <p className="text-md">
                  Any other use of content of the Services is strictly prohibited and You agree not to infringe or
                  enable others to infringe Our intellectual property rights. You agree to retain all copyrighted and
                  other proprietary notices contained in the material provided via Our Services on any copy You make of
                  the material, but failing to do so shall not prejudice Our intellectual property rights therein.
                </p>
              </li>
              <li data-list-text="10.6.">
                <p className="text-md">
                  You may not sell or modify materials derived or created from the Services or reproduce, display,
                  publicly perform, distribute or otherwise use the materials in any way for any public or commercial
                  purpose. Your use of the materials on any other website or on a file-sharing or similar service for
                  any purpose is strictly prohibited. You may not copy any material or content derived or created from
                  the Services without Our express, written permission.
                </p>
              </li>
              <li data-list-text="10.7.">
                <p className="text-md">
                  Any rights not expressly granted herein to use the materials contained on or through the Services are
                  reserved by Us in full.
                </p>
              </li>
              <li data-list-text="10.8.">
                <p className="text-md">
                  You shall not, nor shall You allow any other party to, modify, decompile, disassemble, reverse
                  engineer, copy, transfer, create derivative works from, rent, sub-license, distribute, reproduce
                  framed, republish, scrape, download, display, transmit, post, lease or sell in any form or by any
                  means, in whole or in part, use for any purpose other than for using the Platform or the Services
                  pursuant to the Terms, or otherwise exploit any of the contents of the Platform without the Company’s
                  explicit, prior written permission.
                </p>
                <p className="text-md">
                  <br />
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="11.">
            <h2 className="mb-4">Third Party Services or Content </h2>
            <ol id={armadiloStyles.l17}>
              <li data-list-text="11.1.">
                <p className="text-md">
                  While using the Services, You may view content or services provided by third parties, including
                  currency exchange quotations, financial information, content, and any other materials of other
                  websites or sources that are controlled or offered by third parties (“Third Party Content&quot;).
                </p>
              </li>
              <li data-list-text="11.2.">
                <p className="text-md">
                  We have not reviewed any or all of such Third Party Content and are not responsible for any Third
                  Party Content. We do not control, endorse or adopt such content or services. When using or relying on
                  Third Party Content, You must consider that it may not be accurate or current. We are not responsible
                  for Third Party Content, including, without limitation, material that may be misleading, incomplete,
                  erroneous, offensive, indecent or otherwise objectionable in Your jurisdiction. In addition, Your
                  dealings or correspondence with the third parties that provided the Third Party Content are solely
                  between You and such third parties.
                </p>
              </li>
              <li data-list-text="11.3.">
                <p className="text-md">
                  The Third Party Content is provided solely for Your convenience, and You agree that under no
                  circumstances will You hold Us liable for any loss or damage caused by use of or reliance on any
                  content, goods or services available on other websites.
                </p>
              </li>
              <li data-list-text="11.4.">
                <p className="text-md">
                  Accordingly, We recommend that you independently verify all information before relying on it, and any
                  decisions or actions taken based upon Third Party Content is at Your sole responsibility.
                </p>
                <p className="text-md">
                  <br />
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="12.">
            <h2 className="mb-4">Links</h2>
            <ol id={armadiloStyles.l18}>
              <li data-list-text="12.1.">
                <p className="text-md">
                  The Platform and the Services may contain links, content, advertisements, promotions, logos and other
                  materials to other websites that are controlled or offered by third parties (the “Links”). We caution
                  You to ensure that You understand the risks involved in using such websites or materials before
                  retrieving, using, relying upon or purchasing anything via these websites or based on such materials.
                  Such Links are provided solely for Your convenience, and You agree that under no circumstances will
                  You hold Us liable for any loss or damage caused by use of or reliance on any content, goods or
                  services available on other websites and services.
                </p>
              </li>
              <li data-list-text="12.2.">
                <p className="text-md">
                  The inclusion of Links in the Services is not an endorsement, authorization, sponsorship, affiliation
                  or any other connection between the Company or those websites or their operators.
                </p>
              </li>
              <li data-list-text="12.3.">
                <p className="text-md">
                  We have not reviewed any or all of such Links and are not responsible for any of the content of the
                  websites referred thereby. We caution You to ensure that You understand the risks involved in using
                  such websites before retrieving, using, relying upon or purchasing anything via these websites. Under
                  no circumstances will You hold Us liable for any loss or damage caused by use of or reliance on any
                  content, goods or services available on other websites.
                </p>
                <p className="text-md">
                  <br />
                </p>
              </li>
            </ol>
          </li>
          <li data-list-text="13.">
            <h2 className="mb-4">Miscellaneous</h2>
            <ol id={armadiloStyles.l19}>
              <li data-list-text="13.1.">
                <p className="text-md">
                  We may modify these Terms from time to time. When We do, We will provide notice to You by publishing
                  the most current version and revising the date at the top of this page and any modifications shall be
                  effective immediately upon such publication. By continuing to use the Services after any changes come
                  into effect, You are deemed to agree to the revised Terms.
                </p>
              </li>
              <li data-list-text="13.2.">
                <p className="text-md">
                  The User agrees that transmission of information to or from the Services does not create between him
                  and the Company any relationship that deviates from that specified in these Terms.
                </p>
              </li>
              <li data-list-text="13.3.">
                <p className="text-md">
                  These Terms, as amended from time to time, constitute the only valid agreements between You and the
                  Company, and no representation, promise, consent or undertaking, whether written or oral, that is not
                  included in the Terms will be binding upon the parties.
                </p>
              </li>
              <li data-list-text="13.4.">
                <p className="text-md">
                  These Terms and the relationship between You and Us shall be governed by, and construed and
                  interpreted in accordance with, the laws of the British Virgin Islands, and You irrevocably submit to
                  the exclusive jurisdiction of the competent courts of British Virgin Islands with respect to any
                  dispute regarding the validity, breach, interpretation, performance or otherwise arising out of or in
                  connection with these Terms and the relationship between You and Us.
                </p>
              </li>
              <li data-list-text="13.5.">
                <p className="text-md">
                  No failure or delay on Our part in exercising any right, power or remedy thereunder shall operate as a
                  waiver thereof, nor shall any single or partial exercise of any such right, power or remedy preclude
                  any other or further exercise thereof or the exercise of any other right, power or remedy.
                </p>
              </li>
              <li data-list-text="13.6.">
                <p className="text-md">
                  If any provision of these Terms is held by a court of competent jurisdiction to be unenforceable under
                  applicable law, then such provision shall be excluded from these Terms and the remainder of these
                  Terms shall be interpreted as if such provision was so excluded and shall be enforceable in accordance
                  with its terms, provided, however, that in such event, these Terms shall be interpreted so as to give
                  effect, to the greatest extent consistent with and permitted by applicable law, to the meaning and
                  intention of the excluded provision as determined by such court of competent jurisdiction.
                </p>
              </li>
              <li data-list-text="13.7.">
                <p className="text-md">
                  We may transfer or assign any and all of Our rights and obligations hereunder to any third party.
                  Without derogating from the above, the Platform and/or any of the Services may be operated by third
                  parties. You may not transfer, assign or pledge in any manner whatsoever any of Your rights or
                  obligations under these Terms.
                </p>
              </li>
              <li data-list-text="13.8.">
                <p className="text-md">
                  The terms and provisions of these Terms are binding upon Your heirs, successors, assigns, and other
                  representatives.
                </p>
              </li>
              <li data-list-text="13.9.">
                <p className="text-md">
                  You assume any and all risks associated with the use of the Platform and the Services.
                </p>
              </li>
              <li data-list-text="13.10.">
                <p className="text-md">
                  You agree to accept communications from Us in an electronic format, and agree that all terms,
                  conditions, agreements, notices, disclosures or other communications that We provide to You
                  electronically will be considered to be “in writing”.
                </p>
              </li>
              <li data-list-text="13.11.">
                <p className="text-md">
                  Any heading, caption or section title contained herein is inserted only as a matter of convenience,
                  and in no way defines or explains any section or provision hereof.
                </p>
              </li>
            </ol>
          </li>
        </ol>
        <p className={armadiloStyles.s2}>LEGAL CONSIDERATIONS, RISKS, AND DISCLAIMERS</p>
        <p className="text-md">
          These Legal Considerations, Risks, And Disclaimers incorporate by reference and supplement the Terms and other
          documents, information, and policies available on the Website. Capitalized terms used but not defined herein
          shall have the meanings given to them in the Terms.
        </p>
        <p className="text-md">
          You must read this “Legal Considerations, Risks and Disclaimers” paper in full before:{' '}
          <span className={armadiloStyles.lowerRoman}>(i)</span> using the Services and any and all information
          available on the Website (all the information available on the Website, the whitepapers and the documents,
          hereinafter referred to as the “Available Information”); and{' '}
          <span className={armadiloStyles.lowerRoman}>(ii)</span> using the Services. The contents of this “Legal
          Considerations, Risks and Disclaimers” paper outlines the terms and conditions applicable to you in connection
          with <span className={armadiloStyles.lowerRoman}>(i)</span> your use of any and all Available Information on
          the Website; and <span className={armadiloStyles.lowerRoman}>(ii)</span> using the Services, in each case in
          addition to any other terms and conditions that we may publish from time to time relating to Services at the
          Available Information and over the Website (such terms hereinafter referred to as the “Terms”). This “Legal
          Considerations, Risks and Disclaimers” paper may be updated from time to time and will be published on the
          Website. You shall be obliged to read in full the latest available version of this paper as well as of the
          Available Information and all other information available on the Website prior to using the Services.
        </p>
        <p className="text-md">
          The information set forth in this “Legal Considerations, Risks and Disclaimers” paper may not be exhaustive
          and does not imply any elements of a contractual relationship. While we make every reasonable effort to ensure
          that all Available Information and the Website is accurate and up to date, such material in no way constitutes
          professional advice. Individuals or entities intending using the Services must seek independent professional
          advice prior to acting on any of the Available Information.
        </p>
        <p className="text-md">
          All capitalized terms otherwise not defined herein shall have the meaning afforded thereto in the Terms of
          Use.
        </p>
        <p className="text-md">
          <br />
        </p>
        <p className={armadiloStyles.s2}>LEGAL CONSIDERATIONS</p>
        <p className="text-md">
          Given the legal uncertain of distributed ledger technologies, businesses and activities as well as
          cryptocurrencies and cryptocurrency-related businesses and activities in a number of jurisdictions, the
          Company has spent time and resources to consider its business approach and where it proposes to operate now
          and in the future. It is possible that the tokens described in the Available Information and the Website and
          which are the subject of the Services, and the digital currencies (such as GOVI and CVI) related to the
          Website and the services (together, the “Tokens”) may comprise a security in your jurisdiction or the offer of
          the Tokens in your jurisdiction may be a regulated or prohibited activity. The Company accepts no
          responsibility or liability to you in these or any other circumstances. You are strongly advised to take
          independent legal advice in respect of the legality in your jurisdiction of your usage of the Services.
        </p>
        <p className="text-md">
          <br />
        </p>
        <p className={armadiloStyles.s2}>REGIONAL RESTRICTIONS</p>
        <p className="text-md">
          The Services and the Tokens are not intended to constitute, and shall not constitute, financial product,
          insurance product, equities or securities (of any nature whatsoever) in any jurisdiction. The Available
          Information does not constitute a prospectus or offer document of any sort and the Available Information is
          not intended to constitute an offer of financial product, securities or a solicitation for investment (in any
          form, way or instrument) in any jurisdiction. The Company does not provide any opinion nor advice to purchase,
          sell, hold, stake, deposit, store, or otherwise usage of the Services or transact with Tokens and the
          presentation, publication or communication of all or any part of the Available Information shall not form the
          basis of, or be relied upon in connection with, any contract or investment decision.
        </p>
        <p className="text-md">
          <br />
        </p>
        <p className={armadiloStyles.s2}>NO ADVICE</p>
        <p className="text-md">
          No part of the Available Information should be considered to be business, technology, legal, financial or tax
          advice regarding the Company, the Tokens, the Services or any of the matters to which all or any part of the
          Available Information relates. You should consult your own legal, financial, tax or other professional advisor
          regarding the Available Information. You should be aware that you may be required to bear the financial risk
          of any purchase of Tokens for an indefinite period of time.
        </p>
        <p className="text-md">
          <br />
        </p>
        <p className={armadiloStyles.s2}>CAUTIONARY NOTE ON FORWARD-LOOKING STATEMENTS</p>
        <p className="text-md">
          All statements contained in the Available Information, statements made in any press releases or in any place
          accessible by the public and oral statements that may be made by the Company or the Company Representatives
          (as the case may be), that are not statements of historical fact, constitute “forward looking statements”.
          Some of these statements can be identified by forward-looking terms such as “aim”, “target”, “anticipate”,
          “believe”, “could”, “estimate”, “expect”, “if”, “intend”, “may”, “plan”, “possible”, “probable”, “project”,
          “should”, “would”, “will” or other similar terms. However, these terms are not the exclusive means of
          identifying forward-looking statements. All statements regarding the Company’s financial position, business
          strategies, plans and prospects and the future prospects of the industry which the Company is in are
          forward-looking statements. These forward-looking statements, including but not limited to statements as to
          the Company’s revenue profitability and growth, expected revenue profitability and growth, prospects, future
          plans, other expected industry trends and other matters discussed in the Available Information regarding the
          Company are matters that are not historic facts, but only estimations and predictions. The Company makes no
          representation or warranty on having made any predictions or estimates or expectations on the basis of any
          formula, any mathematical or scientific modelling or forecast, or having made any due and proper enquiries or
          having undertaken any independent research or studies or otherwise. These forward-looking statements involve
          known and unknown risks, uncertainties and other factors that may cause the actual future results, performance
          or achievements of the Company to be materially different from any future results, performance or achievements
          expected, expressed or implied by such forward-looking statements.
        </p>
        <p className="text-md">
          All forward-looking statements made by or attributable to the Company are expressly qualified in their
          entirety by such factors. Given that risks and uncertainties that may cause the actual future results,
          performance or achievements of the Company to be materially different from that expected, expressed or implied
          by the forward-looking statements in the Available Information, undue reliance must not be placed on these
          statements.
        </p>
        <p className="text-md">
          These forward-looking statements are applicable only as of the later of the date of publication of the
          Available Information and the latest date that the Website has been updated. Neither the Company nor any other
          person represents, warrants and/or undertakes that the actual future results, performance or achievements of
          the Company will be as discussed in those forward-looking statements. The actual results, performance or
          achievements of the Company may differ materially from those anticipated in these forward-looking statements.
        </p>
        <p className="text-md">
          Nothing contained in the Available Information is or may be relied upon as a promise, representation or
          undertaking as to the future performance or policies of the Company. Further, the Company disclaims any
          responsibility to update any of those forward-looking statements or publicly announce any revisions to those
          forward-looking statements to reflect future developments, events or circumstances, even if new information
          becomes available or other events occur in the future.
        </p>
        <p className="text-md">
          <br />
        </p>
        <p className={armadiloStyles.s2}>RISK FACTORS</p>
        <p className="text-md">
          You should carefully consider and evaluate each of the following risk factors and all other information
          contained in the Terms before deciding to use any of the Services, the Website or the Platform. To the best of
          the Company’s knowledge and belief, all risk factors which are material to you in making an informed judgment
          to use the Services have been set out below. If any of the following considerations, uncertainties or material
          risks develops into actual events, the business, financial position and/or results of operations of the
          Website and the maintenance and level of usage of the Tokens could be materially
        </p>
        <p className="text-md">
          and adversely affected. In such cases, the trading price of Tokens (in the case where they are listed on an
          exchange or market (regulated, unregulated, primary, secondary or otherwise)) could decline due to any of
          these considerations, uncertainties or material risks, and you may lose all or part of your Tokens or the
          economic value thereof.
        </p>
        <p className="text-md">
          There is no assurance that the Tokens will ever list for trading on a cryptocurrency exchange or market.
          Furthermore, even if the Tokens will ever list for trading on a cryptocurrency exchange or market, there is no
          assurance that an active or liquid trading market for the Tokens will develop, or if developed, will be
          sustained after the Tokens have been made available for trading on such market. There is also no assurance
          that the market price of the Tokens will not decline below the original or issue purchase price (the “Purchase
          Price”). The Purchase Price may not be indicative of the market price of the Tokens after they have been made
          available for trading on a market.
        </p>
        <p className="text-md">
          A Token and the Services are not issued or endorsed by any central bank or national, supra-national or
          quasi-national organization, nor is it backed by any hard assets or other credit nor is it a commodity in the
          traditional sense of that word. The Company is not responsible for, nor does it pursue, the circulation and
          trading of Tokens on any market. No one is obliged to purchase any Token or to use the Services.
        </p>
        <p className="text-md">
          There is no assurance that there will be sufficient engagement in the Company’s business platform that is yet
          to be developed such that you will be able to achieve your anticipated goals in connection with the Tokens
          and\or the Platform.
        </p>
        <p className="text-md">
          There is no assurance that there will be no theft of the cryptocurrencies as a result of hacks, sophisticated
          cyber-attacks, distributed denials of service or errors, vulnerabilities or defects on the Website, in the
          smart contract(s) on which the Services relies, or otherwise.
        </p>
        <p className="text-md">
          The Company is not able to anticipate when there would be occurrences of hacks, cyber-attacks, distributed
          denials of service or errors, vulnerabilities or defects in: the Website and the Platform, and in the smart
          contracts its relies. Such events may include, for example, flaws in programming or source code leading to
          exploitation or abuse thereof. The Company may not be able to detect such hacks, cyber-attacks, distributed
          denials of service errors vulnerabilities or defects in a timely manner, and may not have sufficient resources
          to efficiently cope with multiple service incidents happening simultaneously or in rapid succession.
        </p>
        <p className="text-md">
          Distributed ledger technologies, businesses and activities as well as cryptocurrencies and
          cryptocurrency-related businesses and activities are generally unregulated worldwide, but numerous regulatory
          authorities across jurisdictions have been outspoken about considering the implementation of regulatory
          regimes which govern distributed ledger technologies, businesses and activities as well as cryptocurrencies
          and cryptocurrency-related businesses and activities. The Services or the Tokens may be affected by newly
          implemented regulations relating to distributed ledger technologies, businesses and activities as well as
          cryptocurrencies and cryptocurrency-related businesses and activities, including having to take measures to
          comply with such regulations, or having to deal with queries, notices, requests or enforcement actions by
          regulatory authorities, which may come at a substantial cost and may also require substantial modifications to
          the Website, the Platform or the Services that is yet to be developed and/or the anticipated. This may impact
          the appeal or practicality or functionality of the Website, the Platform or the Services that is yet to be
          developed and/or the anticipated.
        </p>
        <p className="text-md">
          The Website, the Platform or the Services may also have to cease operations in a jurisdiction that makes it
          illegal to operate in such jurisdiction, or make it commercially unviable or undesirable to obtain the
          necessary regulatory approval(s) to operate in such jurisdiction.
        </p>
        <p className="text-md">
          Cryptographic tokens and the Services are a relatively new and dynamic technology. In addition to the risks
          included in the above discussion of risk factors, there are other risks associated with your purchase,
          holding, and use of the Tokens and Services, including those that cannot be anticipated. Such risks may
          further appear as unanticipated variations or combinations of the risks discussed above.
        </p>
        <p className="text-md">
          <br />
        </p>
        <p className={armadiloStyles.s2}>DISCLAIMER</p>
        <p className="text-md">
          The Available Information is solely for informational purposes. Anyone interested in using the Services should
          consider the various risks prior to making any kind of decision. The Available Information does not comprise
          any advice by the Company, or any recommendation to any recipient of the Available Information, by the virtue
          of any use of the Services or otherwise. The Available Information does not necessarily identify, or claim to
          identify, all the risk factors connected with the Website, the Platform or the Services or the Available
          Information. All the users must make their own independent evaluation, after making such investigations as
          they consider essential, of the merits of using the Services and after taking their own independent
          professional advice. Any user who aim to use the Services should check with and rely upon their own
          investment, accounting, legal and tax representatives and consultants in respect of such matters concerning
          the Website, the Platform, Tokens, the Services and the Available Information and to assess separately the
          financial risks, consequences and appropriateness, or if in any doubt about the facts set out in the Available
          Information. If you are not prepared to accept any or all of these Terms or the risks set out in these terms
          then you are urged not to use the Services. No guarantee or assurance is given by the Company that the
          Website, Platform or Website proposals, objectives and/or outcomes set out in the Available Information will
          be achieved in whole or in part. You are urged to consider whether the usage of the Services is suitable for
          you having regard to your personal and financial circumstances and your financial resources.
        </p>
      </span>
    </div>
  )
}

export default ArmadillloTermOfUse
