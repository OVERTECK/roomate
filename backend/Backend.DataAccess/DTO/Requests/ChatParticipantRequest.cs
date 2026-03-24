namespace Backend.API.DTO;

public record ChatParticipantRequest(
    Guid UserId,
    Guid ReceiveUserId
    );