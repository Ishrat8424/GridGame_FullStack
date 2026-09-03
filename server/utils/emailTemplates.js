const verificationEmailTemplate = ({
  username,
  verificationUrl,
}) => {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        background: #fde047;
        padding: 40px 20px;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: auto;
          background: white;
          border: 3px solid #0f172a;
          border-radius: 18px;
          padding: 30px;
        "
      >
        <h1
          style="
            color: #0f172a;
            text-align: center;
          "
        >
          🎮 GameGrid
        </h1>

        <h2
          style="
            text-align: center;
            color: #ec4899;
          "
        >
          Verify Your Email
        </h2>

        <p>
          Hey <strong>${username}</strong> 👋
        </p>

        <p>
          Welcome to GameGrid!
        </p>

        <p>
          Click the button below to verify
          your email address.
        </p>

        <div
          style="
            text-align: center;
            margin: 30px 0;
          "
        >
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              background: #ec4899;
              color: white;
              padding: 14px 24px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 10px;
              border: 2px solid #0f172a;
            "
          >
            VERIFY EMAIL
          </a>
        </div>

        <p
          style="
            color: #64748b;
            font-size: 14px;
          "
        >
          This verification link will expire.
        </p>

        <p
          style="
            color: #64748b;
            font-size: 14px;
          "
        >
          If you didn't create a GameGrid
          account, you can ignore this email.
        </p>
      </div>
    </div>
  `;
};

const resetPasswordEmailTemplate = ({
  username,
  resetUrl,
}) => {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        background: #67e8f9;
        padding: 40px 20px;
      "
    >
      <div
        style="
          max-width: 600px;
          margin: auto;
          background: white;
          border: 3px solid #0f172a;
          border-radius: 18px;
          padding: 30px;
        "
      >
        <h1
          style="
            color: #0f172a;
            text-align: center;
          "
        >
          🎮 GameGrid
        </h1>

        <h2
          style="
            text-align: center;
            color: #ec4899;
          "
        >
          Reset Your Password
        </h2>

        <p>
          Hey <strong>${username}</strong> 👋
        </p>

        <p>
          We received a request to reset
          your GameGrid password.
        </p>

        <div
          style="
            text-align: center;
            margin: 30px 0;
          "
        >
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              background: #ec4899;
              color: white;
              padding: 14px 24px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 10px;
              border: 2px solid #0f172a;
            "
          >
            RESET PASSWORD
          </a>
        </div>

        <p
          style="
            color: #64748b;
            font-size: 14px;
          "
        >
          This reset link will expire shortly.
        </p>

        <p
          style="
            color: #64748b;
            font-size: 14px;
          "
        >
          If you didn't request this,
          you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
};

module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};