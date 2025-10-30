using App.Application.Interfaces;
using App.core.Constants;
using App.core.DTOs.Auth;
using App.Infrastructure.Identity;
using App.Infrastructure.Services;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(IJwtAuthManager jwtAuthManager, UserManager<ApplicationUser> _userManager, IRedisService _redis, IEmailService _emailService) : BaseController
    {

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { success = false, message = "Email is required." });

            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return Conflict(new { success = false, message = "This email is already registered."});
            }

            var otp = new Random().Next(100000, 999999).ToString();

            await _redis.SetValueAsync($"otp:{request.Email}", otp, TimeSpan.FromMinutes(5));

            var placeholders = new Dictionary<string, string>
            {
                { "OTP", otp }
            };

            string htmlBody = _emailService.GetEmailTemplate("OtpTemplate.html", placeholders);

            await _emailService.SendEmailAsync(request.Email, "Your OTP Code", htmlBody);


            return Ok(new
            {
                success = true,
                message = "OTP sent successfully.",
                email = request.Email
            });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            string email = request.Email;
            string userOtp = request.Otp;

            var storedOtp = await _redis.GetValueAsync($"otp:{email}");
            if (storedOtp != userOtp)
                return BadRequest(new { message = "Invalid OTP" });

            var user = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FullName = request.FullName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            
            if (!result.Succeeded)
            {
                return Ok(new AuthResponse
                {
                    IsSuccess = false,
                    Message = string.Join(",", result.Errors)
                });
            }

            return Ok(new AuthResponse
            {
                IsSuccess = true,
                Message = "Account Created Sucessfully!"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginReq login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);

            if (user is null)
            {
                return CustomUnauthorized401(message: "Invalid email or password.", errorCategory: ErrorCategory.LOGIN_401);
            }

            var result = await _userManager.CheckPasswordAsync(user, login.Password);

            if (!result)
            {
                return CustomUnauthorized401(message: "Invalid email or password.", errorCategory: ErrorCategory.LOGIN_401);
            }

            var jwtResult = await jwtAuthManager.GenerateToken(user.Id, user.UserName);

            return Ok(new LoginResp
            {
                Email = login.Email,
                //AccessToken = jwtResult.AccessToken,
                //AccessTokenExpiration = jwtResult.AccessTokenExpiration,
                //RefreshToken = jwtResult.RefreshToken
            });
        }
    }
}
