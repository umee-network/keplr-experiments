import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { StargateClient } from "@cosmjs/stargate";
import { makeStdTx } from "@cosmjs/amino";
import * as stargate from "@cosmjs/stargate";

import "./App.css";

function App() {
  const signSimple = async (e) => {
      e.preventDefault();
      await fetch("/keplr.json")
        .then(r => r.json())
        .then(window.keplr.experimentalSuggestChain.bind(window.keplr))
        .then(() => window.keplr.enable('internal-betanet-1'))
      ;
      await window.keplr.enable("internal-betanet-1");
      const myAddr = (await window.getOfflineSigner("internal-betanet-1").getAccounts())[0].address;
      const account = await getAccount(myAddr);
      console.warn({account, myAddr});
      // sign tx
      const msg = {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: myAddr,
          to_address: "umee1x36cn57mr62qd9qwp3p207u3x6kjh3uzh5c7z6",
          amount: [
            {
              denom: "uumee",
              amount: "1",
            },
          ],
        },
      };
      const signedTx = await window.keplr.signAmino(
        "internal-betanet-1",
        myAddr,
        {
          account_number: account.account_number,
          sequence: account.sequence,
          chain_id: "internal-betanet-1",
          fee: { gas: "200000uumee" },
          msgs: [msg],
        }
      );
      const stdTx = makeStdTx(signedTx.signed, [signedTx.signature])
      console.log("std tx", stdTx);
      // FIXME send with keplr
      try {
        console.log("signed", signedTx);
        const res = await window.keplr.sendTx(
          "internal-betanet-1",
          stdTx,
          "async"
        );
        console.log("keplr res", res);
      } catch (e) {
        console.error("keplr error", e);
      }
      // try sending with startport
      const broadcaster = await StargateClient.connect(
        "https://rpc.resistability.internal-betanet-1.network.umee.cc"
      );
      const res = await broadcaster.broadcastTx(Tx.encode(stdTx).finish());
      console.log("starport res", res);
    },
    signMulti = () => {
      // sign tx
      // keplr.signAmino("umee-1", "umee1x36cn57mr62qd9qwp3p207u3x6kjh3uzh5c7z6", {
      //   chain_id: "umee-1",
      //   fee: { gas: "200000uumee" },
      //   msgs: [
      //     {
      //       type: "cosmos-sdk/MsgCreateVestingAccount",
      //       value: {
      //         from_address: "umee1t57ft8wlvwvpr85u2ps6vh0xdytdyt7zcg9wg9",
      //         to_address: "umee1x36cn57mr62qd9qwp3p207u3x6kjh3uzh5c7z6",
      //         amount: [{ denom: "uumee", amount: "100" }],
      //         end_time: "1679698063",
      //         delayed: false,
      //       },
      //     },
      //   ],
      //   memo: "",
      //   timeout_height: "0",
      //   extension_options: [],
      //   non_critical_extension_options: [],
      //   auth_info: {
      //     signer_infos: [],
      //     fee: { amount: [], gas_limit: "200000", payer: "", granter: "" },
      //   },
      //   signatures: [],
      // });
      // TODO send to startport
    };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Using `keplr` we ought to be able to sign these TXs and broadcast with
          Starport:
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={signSimple}
        >
          Simple Transaction
        </a>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onClick={signMulti}
        >
          MultiSig/Vesting Account Transaction
        </a>
      </header>
    </div>
  );
}

export default App;

async function getAccount(address) {
  let resp;
  try {
    resp = await fetch("https://api.resistability.internal-betanet-1.network.umee.cc/cosmos/auth/v1beta1/accounts/" + address);
  } catch (err) {
    window.errr = err;
    throw err
  }

  return (await resp.json()).account;
}