export const userStatusChangeTemplate = (name: string, status: string) => {
  const readableStatus =
    status === 'active'
      ? 'Active'
      : status === 'blocked'
        ? 'Blocked'
        : status;

  const message =
    status === 'active'
      ? `Your account has been successfully reactivated. You now have full access to your account and services.`
      : `Your account has been restricted due to policy or security reasons. Please contact support if you believe this is a mistake.`;

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Account Status Update</h2>
      <p>Dear ${name},</p>

      <p>${message}</p>

      <p><strong>Current Status:</strong> ${readableStatus}</p>

      <p>If you need any assistance or have questions, feel free to reach out to our support team.</p>

      <p>Warm regards,<br/>Customer Support Team</p>

      <hr/>
      <p style="font-size: 12px; color: #777;">This is an automated notification. Please do not reply.</p>
    </div>
  `;
};
