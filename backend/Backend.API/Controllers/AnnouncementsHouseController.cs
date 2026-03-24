using System.Security.Claims;
using AutoMapper;
using Backend.API.DTO;
using Backend.API.Services;
using Backend.DataAccess.DTO.Responses;
using Backend.DataAccess.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("[controller]")]
public class AnnouncementsHouseController(
    HouseAnnouncementsService houseAnnouncementsService,
    IValidator<AnnouncementFlatRequest> announcementValidator,
    IValidator<UpdateAnnouncementRequest> updateAnnouncementHouseValidator,
    ILogger<AnnouncementsHouseController> logger,
    IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AnnouncementResponse>>> GetAll()
    {
        try
        {
            var announcements = await houseAnnouncementsService.GetAll();

            var announcementResponse = mapper.Map<List<AnnouncementResponse>>(announcements);

            return Ok(announcementResponse);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<HouseAnnouncementEntity>> GetById(Guid id)
    {
        try
        {
            var searchedAnnouncement = await houseAnnouncementsService.GetById(id);

            if (searchedAnnouncement == null) return NotFound();

            var announcementResponse = mapper.Map<AnnouncementResponse>(searchedAnnouncement);

            return Ok(announcementResponse);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [HttpGet("city/{city}")]
    public async Task<ActionResult<List<AnnouncementResponse>>> GetByCity(string city)
    {
        try
        {
            var announcements = await houseAnnouncementsService.GetByCity(city);

            var announcementResponse = mapper.Map<List<AnnouncementResponse>>(announcements);

            return Ok(announcementResponse);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> Add([FromBody] AnnouncementFlatRequest announcementFlat)
    {
        try
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != announcementFlat.CreatedUserId.ToString()) return Unauthorized();

            var validateResult = await announcementValidator.ValidateAsync(announcementFlat);

            if (!validateResult.IsValid)
                return BadRequest(validateResult.Errors[0].ErrorMessage);

            var id = await houseAnnouncementsService.Create(announcementFlat);

            if (id == null) return BadRequest("Превышенно количество создаваемых объявлений!");

            return Ok(id.ToString());
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [Authorize]
    [HttpPatch]
    public async Task<ActionResult> Update(
        [FromBody] UpdateAnnouncementRequest announcement)
    {
        try
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != announcement.CreatedUserId.ToString()) return Unauthorized();

            var validateAnnouncement = await updateAnnouncementHouseValidator.ValidateAsync(announcement);

            if (!validateAnnouncement.IsValid)
                return BadRequest(validateAnnouncement.Errors[0].ErrorMessage);

            var id = await houseAnnouncementsService.Update(announcement);

            if (id == null) return NotFound();

            return Ok(new ResponseServer(200, "Success"));
        }
        catch (Exception ex)
        {
            logger.LogError("Error, {Error}", ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<Guid>> Delete(Guid id)
    {
        try
        {
            var announcement = await houseAnnouncementsService.GetById(id);

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != announcement?.CreatedUserId.ToString()) return Unauthorized();

            var deletedId = await houseAnnouncementsService.DeleteById(id);

            if (deletedId == null) return NotFound();

            return Ok(deletedId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<List<AnnouncementResponse>>> GetByUserId(Guid userId)
    {
        try
        {
            var announcements = await houseAnnouncementsService.GetByUserId(userId);

            var announcementsResponse = mapper.Map<List<AnnouncementResponse>>(announcements);

            return Ok(announcementsResponse);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return StatusCode(500, "Server error");
        }
    }
}