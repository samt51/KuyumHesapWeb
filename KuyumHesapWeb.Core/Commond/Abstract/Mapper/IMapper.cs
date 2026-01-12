namespace KuyumHesapWeb.Core.Commond.Abstract.Mapper
{
    public interface IMapper
    {
        TDest Map<TDest, TSrc>(TSrc src);
        List<TDest> Map<TDest, TSrc>(IEnumerable<TSrc> src);
        TDest Map<TDest>(object src);
        public TDest Map<TSrc, TDest>(TSrc source, TDest destination);
    }
}
