using KuyumHesapWeb.Core.Commond.Abstract.Mapper;

namespace KuyumHesapWeb.Core.Commond.Concrete.Mapping
{
    public class Mapper : IMapper
    {
        private readonly AutoMapper.IMapper _mapper;
        public Mapper(AutoMapper.IMapper mapper) => _mapper = mapper;
        public TDest Map<TDest, TSrc>(TSrc src)
          => _mapper.Map<TSrc, TDest>(src);

        public List<TDest> Map<TDest, TSrc>(IEnumerable<TSrc> src)
            => _mapper.Map<List<TDest>>(src);

        public TDest Map<TDest>(object src)
            => _mapper.Map<TDest>(src);

        public TDest Map<TSrc, TDest>(TSrc source, TDest destination)
               => _mapper.Map(source, destination);
    }
}
