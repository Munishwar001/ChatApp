using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Security.Claims;

namespace Backend.Controllers
{
    public class BaseController : ControllerBase
    {
        protected string CurrentUserID => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        protected string CurrentUserEmail => User.FindFirst(ClaimTypes.Email)?.Value;
        protected IActionResult CustomUnauthorized401(string? message = null, string? errorCategory = null)
        {
            var problemDetailsFactory = HttpContext.RequestServices.GetRequiredService<ProblemDetailsFactory>();
            ProblemDetails problemDetails;

            string detailMessage = string.IsNullOrWhiteSpace(message)
                ? "Unauthorized Access."
                : message;

            problemDetails = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                statusCode: StatusCodes.Status401Unauthorized,
                detail: detailMessage
            );

            if (!string.IsNullOrWhiteSpace(errorCategory))
            {
                problemDetails.Extensions["errorCategory"] = errorCategory;
            }

            return new ObjectResult(problemDetails)
            {
                StatusCode = problemDetails.Status
            };
        }
    }
}
