using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration) => _configuration = configuration;

    public async Task EnviarEmailAsync(string destinatario, string assunto, string mensagem)
    {
        var remetente = _configuration["Email:From"]
            ?? throw new InvalidOperationException("Email:From não foi configurado.");
        var senha = _configuration["Email:Password"]
            ?? throw new InvalidOperationException("Email:Password não foi configurado.");

        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("CorridaHub", remetente));
        email.To.Add(MailboxAddress.Parse(destinatario));
        email.Subject = assunto;
        email.Body = new TextPart("plain") { Text = mensagem };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_configuration["Email:Host"] ?? "smtp.gmail.com", 587,
            SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(remetente, senha);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
