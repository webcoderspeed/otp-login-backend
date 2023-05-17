export const  getOTPTemplate = ({otp, validity}) => {
  return `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .otp {
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 5px;
      padding: 20px;
    }

    .footer {
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>One-Time Password (OTP) for Account Verification</h2>
    </div>
    <div class="otp">
      <p>Dear User</p>
      <p>We are delighted to have you as a valued member of our platform! In order to ensure the security of your account, we have implemented a One-Time Password (OTP) verification process.</p>
      <p>Your OTP for account verification is: <strong>${otp}</strong></p>
      <p>Please use the above OTP within <strong>${validity}</strong> minutes to complete the verification process. Do not share this OTP with anyone, as it is unique to your account and should be kept confidential.</p>
    </div>
    <div class="footer">
      <p>Thank you for your cooperation. We appreciate your commitment to maintaining a secure environment for all our users.</p>
      <p>Best regards,</p>
      <p><strong>@webcoderspeed</strong></p>
    </div>
  </div>
</body>
</html>
  `;
}