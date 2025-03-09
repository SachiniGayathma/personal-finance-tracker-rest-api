const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateFinancialReport = async (user, reportType) => {
    return new Promise((resolve, reject) => {
        try {
            if (!user._id) {
                return reject(new Error("User information is required"));
            }

            const doc = new PDFDocument();
            const filePath = path.join(__dirname, `../reports/${user._id}_${reportType}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Title
            doc.fontSize(18).text('Financial Report', { align: 'center' }).moveDown();

            // User Info
            const displayName = user.userName;
            doc.fontSize(12).text(`User: ${displayName}`, { align: 'left' });
            doc.text(`Email: ${user.email}`).moveDown();

      

            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generateFinancialReport;
