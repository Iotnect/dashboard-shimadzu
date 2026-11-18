import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { inspectionResults, resultLabels, type InspectionItem, type InspectionResult } from '@/demo-data';

type ReportDetails = {
    items: InspectionItem[];
    operator: string;
    logoUrl: string;
    sessionStatus: string;
    generatedAt: Date;
};

const statusColors: Record<InspectionResult, [number, number, number]> = {
    ok: [24, 99, 70],
    review: [129, 87, 8],
    error: [174, 36, 55],
};

export async function downloadInspectionReport({
    items, operator, logoUrl, sessionStatus, generatedAt,
}: ReportDetails) {
    const logo = new Image();
    logo.src = logoUrl;
    await logo.decode();

    const document = new jsPDF({ format: 'a4', compress: true });
    document.setProperties({ title: 'Shimadzu inspection report', author: operator });
    document.addImage(logo, 'PNG', 13, 12, 58, 16.7);
    document.setDrawColor(199, 25, 45).setLineWidth(1).line(18, 34, 192, 34);
    document.setFont('helvetica', 'bold').setFontSize(20).setTextColor(29, 29, 36);
    document.text('Inspection report', 18, 48);
    document.setFont('helvetica', 'normal').setFontSize(10).setTextColor(80, 80, 92);
    const timestamp = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).format(generatedAt);
    document.text(`Generated ${timestamp} MYT`, 18, 58);
    document.text(`Operator  ${operator}`, 18, 65);
    document.text('Camera  Camera 01', 18, 72);
    document.text(`Session  ${sessionStatus}`, 18, 79);

    autoTable(document, {
        startY: 88,
        margin: { left: 18, right: 18, bottom: 20 },
        head: [inspectionResults.map((result) => resultLabels[result])],
        body: [inspectionResults.map((result) => String(items.filter((item) => item.result === result).length))],
        theme: 'grid',
        styles: { fontSize: 11, cellPadding: 3.5, halign: 'center', lineColor: [222, 222, 228] },
        headStyles: { fillColor: [245, 245, 247], textColor: [29, 29, 36] },
        didParseCell: (data) => {
            data.cell.styles.textColor = statusColors[inspectionResults[data.column.index]];
        },
    });
    autoTable(document, {
        startY: 118,
        margin: { left: 18, right: 18, bottom: 20 },
        head: [['Component', 'Status', 'Observation']],
        body: items.map((item) => [item.label, resultLabels[item.result], item.description]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 4, textColor: [29, 29, 36], overflow: 'linebreak' },
        headStyles: { fillColor: [177, 23, 41], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [246, 246, 248] },
        columnStyles: { 0: { cellWidth: 52 }, 1: { cellWidth: 35 }, 2: { cellWidth: 87 } },
        rowPageBreak: 'avoid',
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) {
                data.cell.styles.textColor = statusColors[items[data.row.index].result];
                data.cell.styles.fontStyle = 'bold';
            }
        },
    });
    const pages = document.getNumberOfPages();
    for (let page = 1; page <= pages; page++) {
        document.setPage(page);
        document.setFont('helvetica', 'normal').setFontSize(9).setTextColor(98, 99, 110);
        document.text('Shimadzu | Inspection station', 18, 285);
        document.text(`Page ${page} of ${pages}`, 192, 285, { align: 'right' });
    }
    await document.save(`shimadzu-inspection-${generatedAt.toISOString().replace(/[:.]/g, '-')}.pdf`, { returnPromise: true });
}
