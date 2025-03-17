const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const axios = require('axios');

const generateFinancialReport = async (user, transactions, reportType) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!user._id) {
                return reject(new Error("User information is required"));
            }

            const targetCurrencyType = reportType.currency;
            
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            const filePath = path.join(__dirname, `../reports/${user._id}_${reportType.startDate}_${reportType.endDate}.pdf`);
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Add Header
            doc.fontSize(20).fillColor("#0056b3").text('Financial Report', { align: 'center' }).moveDown(1);
            doc.fillColor("black");

            // User Info
            doc.fontSize(12).text(`User: ${user.userName}`, { align: 'left' });
            doc.text(`Email: ${user.email}`).moveDown(1);

            // Report Period
            doc.text(`Report Period: ${moment(reportType.startDate).format('YYYY-MM-DD')} to ${moment(reportType.endDate).format('YYYY-MM-DD')}`).moveDown(1);

            // Line Break
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(1);

            // Transactions Section
            doc.fontSize(14).fillColor("#333333").text('Transactions:', { underline: true }).fillColor("black").moveDown(1);

            if (transactions.length === 0) {
                doc.text("No transactions found for this period.", { align: 'center' }).moveDown();
            } else {
                // Draw Table Headers
                const startX = 50;
                let startY = doc.y + 10;
                
                doc.fontSize(12).font("Helvetica-Bold");
                doc.text("ID", startX, startY, { width: 60, align: 'left' });
                doc.text("Amount", startX + 80, startY, { width: 80, align: 'right' });
                doc.text("Category", startX + 180, startY, { width: 100, align: 'left' });
                doc.text("Type", startX + 290, startY, { width: 80, align: 'left' });
                doc.text("Date", startX + 390, startY, { width: 120, align: 'left' });

                doc.moveTo(startX, startY + 15).lineTo(550, startY + 15).stroke();
                
                // Draw Transactions
                startY += 25;
                doc.fontSize(10).font("Helvetica");

                let totalAmount = 0;
                let rowCounter = 0;
                let convertedAmount;
               

                for (const transaction of transactions) {
                    if (moment(transaction.date).isBetween(reportType.startDate, reportType.endDate, null, '[]') && transaction.category === reportType.category) {
                        // Alternate Row Color
                        if (rowCounter % 2 === 0) {
                            doc.fillColor("#f0f0f0").rect(startX, startY - 5, 500, 18).fill();
                            doc.fillColor("black");
                        }

                        doc.text(transaction._id.toString().slice(-6), startX, startY, { width: 60, align: 'left' });
                        doc.text(`${transaction.currency}${transaction.amount.toFixed(2)}`, startX + 80, startY, { width: 80, align: 'right' });
                        doc.text(transaction.category, startX + 180, startY, { width: 100, align: 'left' });
                        doc.text(transaction.type, startX + 290, startY, { width: 80, align: 'left' });
                        doc.text(moment(transaction.date).format("YYYY-MM-DD"), startX + 390, startY, { width: 120, align: 'left' });
                         
                        if (targetCurrencyType && transaction.currency !== targetCurrencyType) {
                            const rate = await getExchangeRate(transaction.currency, targetCurrencyType); // ⬅️ Await here
                            convertedAmount = transaction.amount * rate;
                            totalAmount += convertedAmount;
                        }else{

                            totalAmount += transaction.amount;
                        }


                        

                        rowCounter++;
                        startY += 20;
                    }
                }

                // Summary Section
                doc.moveDown(1).fontSize(12).font("Helvetica-Bold");
                doc.text("Total Transactions: " + targetCurrencyType +totalAmount.toFixed(2), 50, startY + 10);


            }

            // Footer
            doc.moveDown(2);
            doc.fontSize(10).fillColor("#888888").text(`Generated on: ${moment().format('YYYY-MM-DD HH:mm:ss')}`, { align: 'right' });

            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};


const getExchangeRate = async (baseCurrency, targetCurrency) => {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/103d44474dedc3e28d34c894/latest/${baseCurrency}`);
        if (response.data && response.data.conversion_rates) {
            return response.data.conversion_rates[targetCurrency] || 1; // Return 1 if not found
        } else {
            console.error("Invalid response from exchange rate API");
            return 1; // Fallback rate
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error.message);
        return 1; // Default fallback rate
    }
};

module.exports = generateFinancialReport;
