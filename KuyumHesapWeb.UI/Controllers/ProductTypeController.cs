using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
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
            var data = await _mediator.Send(new GetAllProductTypeQueryRequest());
            return View(data.data);
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateProductTypeCommandRequest request)
        {
            await _mediator.Send(request);

            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdProductTypeQueryRequest(id));

            var map = _mapper.Map<UpdateProductTypeCommandRequest, GetByIdProductTypeQueryResponse>(data.data);
            return View(map);
        }
        [HttpPut]
        public async Task<IActionResult> Update(UpdateProductTypeCommandRequest request)
        {
            await _mediator.Send(request);

            return RedirectToAction("Index");
        }
    }
}
