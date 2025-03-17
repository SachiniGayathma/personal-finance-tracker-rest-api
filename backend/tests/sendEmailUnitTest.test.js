jest.mock("nodemailer"); // Mock the nodemailer module

const nodemailer = require("nodemailer"); // Require it after mocking

describe("Sending Emails Unit Testing", () => {
    let sendMailMock;

    beforeAll(() => {
        sendMailMock = jest.fn().mockResolvedValue("Email sent");

        nodemailer.createTransport.mockReturnValue({
            sendMail: sendMailMock, // Mocking the sendMail function
        });
    });

    test("should send an email successfully", async () => {
        const transporter = nodemailer.createTransport();
        const result = await transporter.sendMail({
            from: "test@example.com",
            to: "user@example.com",
            subject: "Test Email",
            text: "Hello, this is a test email.",
        });

        expect(sendMailMock).toHaveBeenCalled();
        expect(result).toBe("Email sent");
    });
});
