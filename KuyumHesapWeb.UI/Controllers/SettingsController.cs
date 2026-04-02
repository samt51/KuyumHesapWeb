using KuyumHesapWeb.Core.Commond.Models.Dtos.SettingsDtos;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.CheckTable;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace KuyumHesapWeb.UI.Controllers
{
    public class SettingsController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMemoryCache _memoryCache;
        private const string SettingCacheKey = "settingCachKey";
        // Zorunlu ayar anahtarları ve açıklamaları
        private static readonly Dictionary<string, string> RequiredSettings = new()
        {
            { "CashAccountTypeId",        "Nakit tahsilat/ödeme işlemlerinde kullanılacak kasa hesabının AccountType ID'si" },
            { "PosAccountTypeId",         "POS cihazı üzerinden yapılan tahsilat/ödeme hesabının AccountType ID'si" },
            { "BankAccountTypeId",        "Banka havalesi/EFT işlemlerinde kullanılacak hesabın AccountType ID'si" },
            { "CashierAccountTypeId",     "Satış ekranında tezgahtar seçiminde listelenen hesapların AccountType ID'si" },
            { "CustomerAccountTypeId",    "Satış ekranında müşteri listesinde gösterilecek hesapların AccountType ID'si" },
            { "SalesCurrencyId",          "Satış işlemlerinde varsayılan olarak seçilecek para biriminin Currency ID'si" },
            { "DefaultCustomerAccountId", "Satış ekranı açıldığında varsayılan olarak seçili gelecek müşteri Account ID'si" },
            { "DefaultCashAccountId",     "Nakit işlemlerinde varsayılan olarak seçilecek kasa hesabının Account ID'si" },
            { "DefaultDiscountAccountId", "İskonto işlemlerinde varsayılan olarak kullanılacak hesap ID'si" }
        };

        public SettingsController(IMediator mediator, IMemoryCache memoryCache)
        {
            _mediator = mediator;
            _memoryCache = memoryCache;

        }

        [HttpGet]
        public async Task<IActionResult> General(CancellationToken token)
        {

            var settingsTask = _mediator.Send(new GetAllSettingsQueryRequest(), token);
            var accountTypesTask = _mediator.Send(new GetAllAccountTypeQueryRequest(), token);
            var currenciesTask = _mediator.Send(new GetAllCurrencyQueryRequest(), token);
            var accountsTask = _mediator.Send(new GetAllAccountQueryRequest { AccountTypeName = string.Empty }, token);

            await Task.WhenAll(settingsTask, accountTypesTask, currenciesTask, accountsTask);

            var settings = settingsTask.Result?.data ?? new List<GetAllSettingsQueryResponse>();

            // Eksik anahtarları local placeholder olarak ekle (combo inputlar HER ZAMAN görünsün)
            foreach (var kvp in RequiredSettings)
            {
                if (!settings.Any(s => s.Key == kvp.Key))
                {
                    settings.Add(new GetAllSettingsQueryResponse
                    {
                        Id = 0,
                        Key = kvp.Key,
                        Value = null,
                        Description = kvp.Value
                    });
                }
            }

            var vm = new GeneralSettingsViewModel
            {
                Settings = settings,
                AccountTypes = accountTypesTask.Result?.data ?? new List<GetAllAccountTypeQueryResponse>(),
                Currencies = currenciesTask.Result?.data ?? new List<GetAllCurrencyQueryResponse>(),
                Accounts = accountsTask.Result?.data ?? new List<GetAllAccountQueryResponse>()
            };

            return View(vm);
        }

        [HttpPost]
        public async Task<IActionResult> General(GeneralSettingsViewModel vm, CancellationToken token)
        {
            if (vm?.Settings == null || vm.Settings.Count == 0)
            {
                return RedirectToAction(nameof(General));
            }

            var tasks = new List<Task>();

            // Var olan kayıtları toplu olarak güncelle
            var existingSettings = vm.Settings
                .Where(s => s.Id > 0)
                .Select(s => new SettingUpdateItemDto { Id = s.Id, Value = s.Value })
                .ToList();

            if (existingSettings.Count > 0)
            {
                tasks.Add(_mediator.Send(new UpdateSettingCommandRequest
                {
                    Settings = existingSettings
                }, token));

                _memoryCache.Remove(SettingCacheKey);
            }


            // Yeni kayıtları tek tek oluştur (Eğer Id=0 gelmişse ve Key doluysa)
            var newSettings = vm.Settings
                .Where(s => s.Id == 0 && !string.IsNullOrWhiteSpace(s.Key))
                .ToList();

            foreach (var setting in newSettings)
            {
                tasks.Add(_mediator.Send(new CreateSettingCommandRequest
                {
                    Key = setting.Key,
                    Value = setting.Value,
                    Description = setting.Description
                }, token));
            }

            if (tasks.Count > 0)
            {
                try
                {
                    await Task.WhenAll(tasks);
                    TempData["SuccessMessage"] = "Ayarlar başarıyla kaydedildi.";
                }
                catch (Exception)
                {
                    // Hata durumunda da kullanıcıyı yönlendir, ancak mesaj farklı olabilir
                    // Gerçek bir senaryoda hata loglanır
                    TempData["ErrorMessage"] = "Bazı ayarlar kaydedilirken bir hata oluştu.";
                }
            }

            return RedirectToAction(nameof(General));
        }
    }
}
