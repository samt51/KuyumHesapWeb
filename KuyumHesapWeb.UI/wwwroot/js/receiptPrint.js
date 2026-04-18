document.addEventListener('DOMContentLoaded', () => {
    const printBtn = document.getElementById('main-print-button');
    if (!printBtn) return;

    // "Sil" butonu görünüyorsa Yazdır'ı da göster, silinmiyorsa gizle
    const deleteBtn = document.getElementById('main-delete-button');
    if (deleteBtn) {
        const observer = new MutationObserver(() => {
            if (deleteBtn.classList.contains('hidden')) {
                printBtn.classList.add('hidden');
            } else {
                printBtn.classList.remove('hidden');
            }
        });
        observer.observe(deleteBtn, { attributes: true, attributeFilter: ['class'] });
    }

    printBtn.addEventListener('click', () => {
        const title = document.getElementById('receipt-title')?.innerText || 'Satış Fişi';
        const dateVal = document.getElementById('fis-tarihi')?.value || new Date().toLocaleString();
        const logHtml = document.getElementById('receipt-log')?.innerHTML || '';
        const totalsHtml = document.getElementById('satis-totals')?.innerHTML || '';

        if (!logHtml || logHtml.trim() === '') {
            alert('Yazdırılacak fiş detayı bulunamadı.');
            return;
        }

        const printWindow = window.open('', 'PRINT', 'height=600,width=400');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Fiş</title>
                <meta charset="utf-8">
                <style>
                    @media print {
                        @page { margin: 0; size: 80mm auto; }
                        body { margin: 0; padding: 2mm; }
                    }
                    body {
                        font-family: 'Courier New', Courier, monospace, sans-serif;
                        font-size: 12px;
                        color: #000;
                        background: #fff;
                        width: 76mm; /* Thermal max width (Margin payı harici) */
                        margin: 0 auto;
                    }
                    .text-center { text-align: center; }
                    .font-bold { font-weight: bold; }
                    .font-medium { font-weight: bold; }
                    .font-semibold { font-weight: bold; }
                    .flex { display: flex; }
                    .justify-between { justify-content: space-between; }
                    .items-center { align-items: center; }
                    .text-xs { font-size: 10px; }
                    .text-sm { font-size: 12px; }
                    .text-lg { font-size: 14px; }
                    .border-b { border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 4px; }
                    .mt-1 { margin-top: 4px; }
                    .mt-2 { margin-top: 8px; }
                    .p-2 { padding: 4px; }
                    /* Renkli yazilari Siyah ve Beyaza Zorla (Pos makinasi icin) */
                    .text-green-600, .text-red-600, .text-blue-700, .text-gray-500, .text-gray-600, .text-gray-800 { color: #000 !important; }
                    .bg-white, .bg-gray-50, .bg-green-50, .bg-red-50 { background: transparent !important; }
                    /* Gereksiz icon ve interaktif simgeleri gizle */
                    .fas, .far, .fa, svg, button { display: none !important; }
                    .receipt-item { border-bottom: 1px dotted #ccc; padding: 4px 0; }
                    hr { border: none; border-bottom: 1px dashed #000; margin: 4px 0; }
                    
                    /* Fiyat Hizalamalari vb. termal daraltmaya uydur */
                    div { white-space: normal; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <div class="text-center border-b mb-2">
                    <h4 class="font-bold" style="margin:0; font-size:16px;">${title}</h4>
                    <div style="font-size: 10px; margin-top:4px;">Tarih: ${dateVal.replace('T', ' ')}</div>
                </div>
                
                <div id="print-items">
                    ${logHtml}
                </div>
                
                <div class="border-b mt-2"></div>
                
                <div class="receipt-totals font-bold mt-2">
                    ${totalsHtml}
                </div>
                
                <div class="text-center mt-2" style="font-size: 10px; margin-top:15px; border-top:1px dashed #000; padding-top:10px;">
                    Bizi tercih ettiğiniz için teşekkürler!<br>
                    * Mali değeri yoktur *
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // 300ms gecikme: Renderin termal yazıcı formatına işlemesi için gerekli tolerans!
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    });
});
