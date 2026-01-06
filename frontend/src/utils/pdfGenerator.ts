import jsPDF from 'jspdf';
import { Invoice } from '../types';

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('InvoiceFlow', margin, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Invoice #${invoice.invoice_number}`, margin, yPos);
  
  yPos += 15;

  // Client Info
  if (invoice.client) {
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', margin, yPos);
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.client.name, margin, yPos);
    yPos += 7;
    if (invoice.client.address) {
      doc.text(invoice.client.address, margin, yPos);
      yPos += 7;
    }
    if (invoice.client.city && invoice.client.state) {
      doc.text(`${invoice.client.city}, ${invoice.client.state} ${invoice.client.zip || ''}`, margin, yPos);
      yPos += 7;
    }
  }

  yPos += 10;

  // Invoice Details
  doc.setFont('helvetica', 'normal');
  doc.text(`Issue Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, pageWidth - margin - 60, margin + 10);
  doc.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, pageWidth - margin - 60, margin + 17);
  doc.text(`Payment Terms: ${invoice.payment_terms}`, pageWidth - margin - 60, margin + 24);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - margin - 60, margin + 31);

  yPos += 10;

  // Line Items Table
  const colWidths = [80, 30, 30, 30];
  const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]];

  // Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', colX[0], yPos);
  doc.text('Qty', colX[1], yPos);
  doc.text('Rate', colX[2], yPos);
  doc.text('Amount', colX[3], yPos);
  
  yPos += 7;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  invoice.line_items.forEach((item) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(item.description.substring(0, 40), colX[0], yPos);
    doc.text(Number(item.quantity).toString(), colX[1], yPos);
    doc.text(`$${Number(item.rate).toFixed(2)}`, colX[2], yPos);
    doc.text(`$${Number(item.amount).toFixed(2)}`, colX[3], yPos);
    yPos += 7;
  });

  yPos += 5;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Totals
  const totalsX = pageWidth - margin - 60;
  doc.text(`Subtotal: $${Number(invoice.subtotal).toFixed(2)}`, totalsX, yPos, { align: 'right' });
  yPos += 7;
  
  if (Number(invoice.discount_amount) > 0) {
    doc.text(`Discount: -$${Number(invoice.discount_amount).toFixed(2)}`, totalsX, yPos, { align: 'right' });
    yPos += 7;
  }
  
  doc.text(`Tax (${Number(invoice.tax_rate)}%): $${Number(invoice.tax_amount).toFixed(2)}`, totalsX, yPos, { align: 'right' });
  yPos += 7;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: $${Number(invoice.total).toFixed(2)}`, totalsX, yPos, { align: 'right' });

  // Notes
  if (invoice.notes) {
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Notes:', margin, yPos);
    yPos += 7;
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 2 * margin);
    doc.text(splitNotes, margin, yPos);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`invoice-${invoice.invoice_number}.pdf`);
};

