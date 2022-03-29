import logo from "./logo.svg";
import "./App.css";

function App() {
  const signSimple = async (e) => {
      e.preventDefault();
      // sign tx
      const msg = {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: "umee1t57ft8wlvwvpr85u2ps6vh0xdytdyt7zcg9wg9",
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
        "umee-1",
        "umee1x36cn57mr62qd9qwp3p207u3x6kjh3uzh5c7z6",
        {
          chain_id: "umee-1",
          fee: { gas: "200000uumee" },
          msgs: [msg],
        }
      );
      // FIXME send with keplr
      console.log("signed", signedTx);
      const res = await window.keplr.sendTx(
        "umee-1",
        makeStdTx(signedTx),
        "async"
      );
      console.log("res", res);
      // TODO try sending with startport
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

function makeStdTx(content, signatures) {
  return {
    msg: content.msgs,
    fee: content.fee,
    memo: content.memo,
    signatures: Array.isArray(signatures) ? signatures : [signatures],
  };
}

export default App;