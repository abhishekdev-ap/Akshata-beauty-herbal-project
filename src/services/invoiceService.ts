import jsPDF from 'jspdf';
import { Appointment, Service } from '../types';

export interface InvoiceData {
    invoiceNumber: string;
    invoiceDate: string;
    appointment: Appointment;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessEmail: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerAddress?: string;
    services: Service[];
    subtotal: number;
    homeServiceCharge?: number;
    discount?: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentId?: string;
}

class InvoiceService {
    private static instance: InvoiceService;

    private constructor() { }

    static getInstance(): InvoiceService {
        if (!InvoiceService.instance) {
            InvoiceService.instance = new InvoiceService();
        }
        return InvoiceService.instance;
    }

    generateInvoiceNumber(): string {
        const prefix = 'INV';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    async generatePDF(data: InvoiceData): Promise<jsPDF> {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = 20;

        // Colors
        const primaryColor: [number, number, number] = [236, 72, 153]; // Pink
        const secondaryColor: [number, number, number] = [147, 51, 234]; // Purple
        const darkColor: [number, number, number] = [31, 41, 55];
        const grayColor: [number, number, number] = [107, 114, 128];
        const lightGray: [number, number, number] = [243, 244, 246];

        // Header Background
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 50, 'F');

        // Gradient effect (simple approximation)
        doc.setFillColor(...secondaryColor);
        doc.rect(pageWidth / 2, 0, pageWidth / 2, 50, 'F');

        // Business Name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(data.businessName.toUpperCase(), margin, 25);

        // Invoice Title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('TAX INVOICE', margin, 35);

        // Invoice Number & Date (Right side)
        doc.setFontSize(10);
        doc.text(`Invoice #: ${data.invoiceNumber}`, pageWidth - margin, 25, { align: 'right' });
        doc.text(`Date: ${data.invoiceDate}`, pageWidth - margin, 32, { align: 'right' });
        doc.text(`Status: ${data.paymentStatus.toUpperCase()}`, pageWidth - margin, 39, { align: 'right' });

        yPos = 65;

        // Two Column Layout for Business & Customer Info
        const colWidth = (pageWidth - margin * 3) / 2;

        // Business Info Box
        doc.setFillColor(...lightGray);
        doc.roundedRect(margin, yPos - 5, colWidth, 40, 3, 3, 'F');

        doc.setTextColor(...darkColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('FROM', margin + 5, yPos + 3);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.text(data.businessName, margin + 5, yPos + 11);
        doc.text(data.businessAddress, margin + 5, yPos + 17, { maxWidth: colWidth - 10 });
        doc.text(`Phone: ${data.businessPhone}`, margin + 5, yPos + 29);

        // Customer Info Box
        const col2X = margin * 2 + colWidth;
        doc.setFillColor(...lightGray);
        doc.roundedRect(col2X, yPos - 5, colWidth, 40, 3, 3, 'F');

        doc.setTextColor(...darkColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO', col2X + 5, yPos + 3);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.text(data.customerName, col2X + 5, yPos + 11);
        doc.text(data.customerEmail, col2X + 5, yPos + 17);
        if (data.customerPhone) {
            doc.text(`Phone: ${data.customerPhone}`, col2X + 5, yPos + 23);
        }
        if (data.customerAddress) {
            doc.text(data.customerAddress, col2X + 5, yPos + 29, { maxWidth: colWidth - 10 });
        }

        yPos = 115;

        // Appointment Details
        doc.setTextColor(...darkColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('APPOINTMENT DETAILS', margin, yPos);

        yPos += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.text(`Date: ${this.formatDate(data.appointment.date)}`, margin, yPos);
        doc.text(`Time: ${data.appointment.time}`, margin + 60, yPos);
        doc.text(`Location: ${data.appointment.serviceLocation === 'home' ? 'Home Service' : 'At Parlor'}`, margin + 110, yPos);

        yPos += 15;

        // Services Table Header
        doc.setFillColor(...primaryColor);
        doc.rect(margin, yPos - 5, pageWidth - margin * 2, 10, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICE', margin + 5, yPos + 1);
        doc.text('DURATION', pageWidth - margin - 70, yPos + 1);
        doc.text('AMOUNT', pageWidth - margin - 5, yPos + 1, { align: 'right' });

        yPos += 10;

        // Services List
        doc.setTextColor(...darkColor);
        doc.setFont('helvetica', 'normal');

        data.services.forEach((service, index) => {
            const bgColor = index % 2 === 0 ? [255, 255, 255] : lightGray;
            doc.setFillColor(...(bgColor as [number, number, number]));
            doc.rect(margin, yPos - 4, pageWidth - margin * 2, 10, 'F');

            doc.setFontSize(9);
            doc.text(service.name, margin + 5, yPos + 2);
            doc.text(`${service.duration} mins`, pageWidth - margin - 70, yPos + 2);
            doc.text(this.formatCurrency(service.price), pageWidth - margin - 5, yPos + 2, { align: 'right' });

            yPos += 10;
        });

        yPos += 10;

        // Totals Section
        const totalsX = pageWidth - margin - 80;

        // Subtotal
        doc.setTextColor(...grayColor);
        doc.setFontSize(9);
        doc.text('Subtotal:', totalsX, yPos);
        doc.text(this.formatCurrency(data.subtotal), pageWidth - margin - 5, yPos, { align: 'right' });

        yPos += 7;

        // Home Service Charge (if applicable)
        if (data.homeServiceCharge && data.homeServiceCharge > 0) {
            doc.text('Home Service Charge:', totalsX, yPos);
            doc.text(this.formatCurrency(data.homeServiceCharge), pageWidth - margin - 5, yPos, { align: 'right' });
            yPos += 7;
        }

        // Discount (if applicable)
        if (data.discount && data.discount > 0) {
            doc.setTextColor(34, 197, 94); // Green
            doc.text('Discount:', totalsX, yPos);
            doc.text(`-${this.formatCurrency(data.discount)}`, pageWidth - margin - 5, yPos, { align: 'right' });
            yPos += 7;
        }

        // Total Line
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(totalsX, yPos, pageWidth - margin, yPos);
        yPos += 7;

        // Grand Total
        doc.setFillColor(...primaryColor);
        doc.roundedRect(totalsX - 5, yPos - 5, pageWidth - margin - totalsX + 10, 12, 2, 2, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL:', totalsX, yPos + 3);
        doc.text(this.formatCurrency(data.totalAmount), pageWidth - margin - 5, yPos + 3, { align: 'right' });

        yPos += 25;

        // Payment Information
        doc.setTextColor(...darkColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PAYMENT INFORMATION', margin, yPos);

        yPos += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.text(`Payment Method: ${data.paymentMethod.toUpperCase()}`, margin, yPos);
        doc.text(`Payment Status: ${data.paymentStatus.toUpperCase()}`, margin + 70, yPos);
        if (data.paymentId) {
            yPos += 6;
            doc.text(`Transaction ID: ${data.paymentId}`, margin, yPos);
        }

        // Footer
        const footerY = doc.internal.pageSize.getHeight() - 25;

        doc.setDrawColor(...lightGray);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        doc.setTextColor(...grayColor);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for choosing us! We look forward to serving you again.', pageWidth / 2, footerY, { align: 'center' });
        doc.text(`${data.businessName} | ${data.businessPhone} | ${data.businessEmail}`, pageWidth / 2, footerY + 5, { align: 'center' });
        doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 10, { align: 'center' });

        return doc;
    }

    async downloadInvoice(data: InvoiceData): Promise<void> {
        const doc = await this.generatePDF(data);
        const fileName = `Invoice_${data.invoiceNumber}_${data.customerName.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
    }

    async getInvoiceBlob(data: InvoiceData): Promise<Blob> {
        const doc = await this.generatePDF(data);
        return doc.output('blob');
    }

    // Generate invoice data from appointment
    createInvoiceData(
        appointment: Appointment,
        businessSettings: {
            name: string;
            address: string;
            phone: string;
            email: string;
        },
        homeServiceCharge: number = 0
    ): InvoiceData {
        const subtotal = appointment.services.reduce((sum, s) => sum + s.price, 0);
        const totalAmount = subtotal + homeServiceCharge;

        return {
            invoiceNumber: this.generateInvoiceNumber(),
            invoiceDate: this.formatDate(new Date().toISOString()),
            appointment,
            businessName: businessSettings.name,
            businessAddress: businessSettings.address,
            businessPhone: businessSettings.phone,
            businessEmail: businessSettings.email,
            customerName: appointment.customerName || 'Customer',
            customerEmail: appointment.customerEmail || '',
            customerPhone: appointment.customerPhone,
            customerAddress: appointment.customerAddress,
            services: appointment.services,
            subtotal,
            homeServiceCharge: appointment.serviceLocation === 'home' ? homeServiceCharge : 0,
            totalAmount: appointment.totalPrice || totalAmount,
            paymentMethod: appointment.paymentMethod || 'N/A',
            paymentStatus: appointment.paymentStatus || 'pending',
            paymentId: appointment.paymentId
        };
    }
}

export default InvoiceService;
