using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetById;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class ProductTypeController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public ProductTypeController(IMediator mediator, IMapper mapper)
            : base(mediator, mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<ResponseDto<List<GetAllProductTypeQueryResponse>>> GetAll()
        {
            return await _mediator.Send(new GetAllProductTypeQueryRequest());
        }
        [HttpGet]
        public async Task<ResponseDto<GetByIdProductTypeQueryResponse>> GetById(int id)
        {
            return await _mediator.Send(new GetByIdProductTypeQueryRequest(id));
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<ResponseDto<CreateProductTypeCommandResponse>> Create([FromBody] CreateProductTypeCommandRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPost]
        public async Task<ResponseDto<UpdateProductTypeCommandResponse>> Update([FromBody] UpdateProductTypeCommandRequest request)
        {
            return await _mediator.Send(request);
        }
    }
}
