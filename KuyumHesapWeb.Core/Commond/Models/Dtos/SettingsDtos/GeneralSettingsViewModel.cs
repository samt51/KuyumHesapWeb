using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;

namespace KuyumHesapWeb.Core.Commond.Models.Dtos.SettingsDtos
{
    public class GeneralSettingsViewModel
    {
        // Mevcut ayarlar (DB'den gelen ham liste)
        public List<GetAllSettingsQueryResponse> Settings { get; set; } = new();

        // Dropdown verileri
        public List<GetAllAccountTypeQueryResponse> AccountTypes { get; set; } = new();
        public List<GetAllCurrencyQueryResponse> Currencies { get; set; } = new();
        public List<GetAllAccountQueryResponse> Accounts { get; set; } = new();

        // Yardımcı: Belirli key için değer döner
        public string? GetValue(string key) =>
            Settings.FirstOrDefault(s => s.Key == key)?.Value;

        public int? GetIntValue(string key) =>
            int.TryParse(GetValue(key), out var v) ? v : null;
    }
}
