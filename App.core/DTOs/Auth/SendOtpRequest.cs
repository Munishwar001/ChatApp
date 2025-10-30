namespace App.core.DTOs.Auth
{
    public class SendOtpRequest
    {
        public string Email { get; set; } = null!;
    }
    public class VerifyOtpRequest
    {
        public string Email { get; set; }  = null!;
        public string Otp { get; set; } = null!;

        public string FullName { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
