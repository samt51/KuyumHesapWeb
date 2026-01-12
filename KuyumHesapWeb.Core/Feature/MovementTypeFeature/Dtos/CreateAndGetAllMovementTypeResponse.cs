using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetAll;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Dtos
{
    public class CreateAndGetAllMovementTypeResponse
    {
        public CreateMovementTypeCommandRequest CreateMovementTypeCommandRequest { get; set; }
        public List<GetAllMovementTypeQueryResponse> getAllMovementTypeQueryResponses { get; set; }
        public UpdateMovementTypeCommandRequest UpdateMovementTypeCommandRequest { get; set; }
    }
}
