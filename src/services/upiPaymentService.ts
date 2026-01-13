// UPI Payment Service - Direct GPay and PhonePe Integration
// No third-party gateway needed - opens UPI apps directly

export interface UPIPaymentOptions {
    amount: number;
    orderId: string;
    customerName: string;
    note: string;
}

export interface UPIPaymentResult {
    success: boolean;
    method: 'gpay' | 'phonepe' | 'upi';
    transactionId?: string;
    error?: string;
}

class UPIPaymentService {
    private static instance: UPIPaymentService;

    // Default UPI ID - can be updated via Business Settings
    private upiId: string = '';
    private businessName: string = 'Akshata Beauty Parlour';

    private constructor() {
        this.loadSettings();
    }

    static getInstance(): UPIPaymentService {
        if (!UPIPaymentService.instance) {
            UPIPaymentService.instance = new UPIPaymentService();
        }
        return UPIPaymentService.instance;
    }

    private loadSettings(): void {
        try {
            const settings = localStorage.getItem('parlor_business_settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.upiId = parsed.upiId || '';
                this.businessName = parsed.parlorName || 'Akshata Beauty Parlour';
            }
        } catch (e) {
            console.error('Failed to load UPI settings:', e);
        }
    }

    // Update UPI ID
    setUPIId(upiId: string): void {
        this.upiId = upiId;
    }

    // Get current UPI ID
    getUPIId(): string {
        this.loadSettings();
        return this.upiId;
    }

    // Check if UPI is configured
    isConfigured(): boolean {
        return !!this.getUPIId();
    }

    // Generate UPI payment URL
    generateUPIUrl(options: UPIPaymentOptions): string {
        const { amount, orderId, note } = options;

        if (!this.upiId) {
            throw new Error('UPI ID not configured. Please set it in Business Settings.');
        }

        // UPI Deep Link format
        const params = new URLSearchParams({
            pa: this.upiId,                    // Payee VPA (UPI ID)
            pn: encodeURIComponent(this.businessName), // Payee Name
            am: amount.toFixed(2),             // Amount
            cu: 'INR',                         // Currency
            tn: encodeURIComponent(note || `Payment for Order ${orderId}`), // Transaction note
            tr: orderId,                       // Transaction reference
        });

        return `upi://pay?${params.toString()}`;
    }

    // Generate Google Pay specific URL
    generateGPayUrl(options: UPIPaymentOptions): string {
        const baseUrl = this.generateUPIUrl(options);
        // GPay uses the standard UPI intent
        return baseUrl;
    }

    // Generate PhonePe specific URL
    generatePhonePeUrl(options: UPIPaymentOptions): string {
        const { amount, orderId, note } = options;

        if (!this.upiId) {
            throw new Error('UPI ID not configured.');
        }

        // PhonePe specific deep link
        const params = new URLSearchParams({
            pa: this.upiId,
            pn: encodeURIComponent(this.businessName),
            am: amount.toFixed(2),
            cu: 'INR',
            tn: encodeURIComponent(note || `Payment for Order ${orderId}`),
            tr: orderId,
        });

        // PhonePe intent URL
        return `phonepe://pay?${params.toString()}`;
    }

    // Open GPay for payment
    async payWithGPay(options: UPIPaymentOptions): Promise<UPIPaymentResult> {
        try {
            const url = this.generateGPayUrl(options);

            // Try to open GPay
            const opened = this.openPaymentApp(url, 'gpay');

            if (!opened) {
                // Fallback to generic UPI intent
                this.openPaymentApp(this.generateUPIUrl(options), 'upi');
            }

            return {
                success: true,
                method: 'gpay',
                transactionId: options.orderId
            };
        } catch (error) {
            return {
                success: false,
                method: 'gpay',
                error: error instanceof Error ? error.message : 'Payment failed'
            };
        }
    }

    // Open PhonePe for payment
    async payWithPhonePe(options: UPIPaymentOptions): Promise<UPIPaymentResult> {
        try {
            const url = this.generatePhonePeUrl(options);

            // Try to open PhonePe
            const opened = this.openPaymentApp(url, 'phonepe');

            if (!opened) {
                // Fallback to generic UPI intent
                this.openPaymentApp(this.generateUPIUrl(options), 'upi');
            }

            return {
                success: true,
                method: 'phonepe',
                transactionId: options.orderId
            };
        } catch (error) {
            return {
                success: false,
                method: 'phonepe',
                error: error instanceof Error ? error.message : 'Payment failed'
            };
        }
    }

    // Open any UPI app
    async payWithUPI(options: UPIPaymentOptions): Promise<UPIPaymentResult> {
        try {
            const url = this.generateUPIUrl(options);
            this.openPaymentApp(url, 'upi');

            return {
                success: true,
                method: 'upi',
                transactionId: options.orderId
            };
        } catch (error) {
            return {
                success: false,
                method: 'upi',
                error: error instanceof Error ? error.message : 'Payment failed'
            };
        }
    }

    // Helper to open payment app
    private openPaymentApp(url: string, app: string): boolean {
        try {
            // Create hidden iframe for intent (works better on mobile)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            // Also try window.location for better compatibility
            setTimeout(() => {
                window.location.href = url;
            }, 100);

            // Clean up iframe
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 2000);

            console.log(`Opening ${app} with URL:`, url);
            return true;
        } catch (e) {
            console.error(`Failed to open ${app}:`, e);
            return false;
        }
    }

    // Check if running on mobile
    isMobileDevice(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Generate QR code data for desktop users
    generateQRCodeData(options: UPIPaymentOptions): string {
        return this.generateUPIUrl(options);
    }
}

export default UPIPaymentService;
