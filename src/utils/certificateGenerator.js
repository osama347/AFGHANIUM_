import jsPDF from 'jspdf';

export const generateCertificate = (donation) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    // Background color
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setLineWidth(2);
    doc.setDrawColor(58, 157, 88); // Primary Green
    doc.rect(10, 10, 277, 190);

    // Inner Border
    doc.setLineWidth(0.5);
    doc.setDrawColor(244, 178, 35); // Accent Gold
    doc.rect(15, 15, 267, 180);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.setTextColor(58, 157, 88);
    doc.text('CERTIFICATE OF DONATION', 148.5, 50, { align: 'center' });

    // Subheader
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('This certificate is proudly presented to', 148.5, 70, { align: 'center' });

    // Donor Name
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(36);
    doc.setTextColor(0, 0, 0);
    doc.text(donation.full_name, 148.5, 95, { align: 'center' });

    // Line under name
    doc.setLineWidth(0.5);
    doc.setDrawColor(100, 100, 100);
    doc.line(70, 100, 227, 100);

    // Amount Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(80, 80, 80);
    doc.text(`For the generous contribution of $${donation.amount.toLocaleString()}`, 148.5, 120, { align: 'center' });

    // Department
    if (donation.department) {
        doc.text(`towards ${donation.department.replace('-', ' ').toUpperCase()}`, 148.5, 130, { align: 'center' });
    }

    // Date
    const date = new Date(donation.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    doc.setFontSize(14);
    doc.text(`Given on this day, ${date}`, 148.5, 150, { align: 'center' });

    // Signature Area
    doc.setFont('times', 'italic');
    doc.setFontSize(20);
    doc.text('Afghanium Team', 148.5, 180, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('AFGHANIUM CHARITY ORGANIZATION', 148.5, 186, { align: 'center' });

    // Footer ID
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificate ID: ${donation.donation_id}`, 20, 200);
    doc.text('www.afghanium.org', 277, 200, { align: 'right' });

    // Save
    doc.save(`Afghanium-Certificate-${donation.donation_id}.pdf`);
};
